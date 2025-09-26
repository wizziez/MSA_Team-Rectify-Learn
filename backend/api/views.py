import os
import json
import uuid
import logging
from datetime import datetime, date, timedelta
from typing import Dict, Any
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q

from rest_framework import generics, status 
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound

from .serializers import (
    UserSerializer, DocumentSerializer, QuizSerializer, UserTokenUsageSerializer,
    QuizGenerationRequestSerializer, QuizItemSerializer, QuizSubmissionSerializer,
    QuizAnswerSerializer, FlashcardSerializer, FlashcardGenerationRequestSerializer,
    FlashcardItemSerializer, FlashcardReviewRequestSerializer, FlashcardReviewSerializer,
    QuizSessionHistorySerializer, QuizSessionDetailSerializer, MnemonicSerializer,
    MnemonicGenerationRequestSerializer, MnemonicItemSerializer, DocumentWithMnemonicsStatusSerializer,
    StudyPlanSerializer, StudyPlanGenerationRequestSerializer, StudyPlanUpdateSerializer, 
    StudyPlanStepUpdateSerializer, StudyPlanStepSerializer
)

from utils.doc_processor import extract_and_preprocess_text
from utils.quiz_generator import generate_quizzes_from_text, QuizGenerationError, DEFAULT_QUIZ_GENERATION_RETRIES
from utils.adaptive_quiz_generator import (
    generate_adaptive_quizzes, 
    save_adaptive_quizzes, 
)
from utils.flashcard_generator import generate_flashcards_from_text, FlashcardGenerationError, DEFAULT_FLASHCARD_GENERATION_RETRIES
from utils.mnemonic_generator import generate_mnemonics_from_text, MnemonicGenerationError, DEFAULT_MNEMONIC_GENERATION_RETRIES
from utils.mastery_calculator import calculate_quiz_mastery_score, calculate_document_mastery_score, needs_more_questions, update_review_schedule
from utils.study_planner import generate_study_plan, validate_study_plan_data, StudyPlannerError
from .models import Document, Quiz, UserTokenUsage, QuizSession, QuizAnswer, Flashcard, FlashcardSession, FlashcardReview, Mnemonic, StudyPlan, StudyPlanStep, StudyPlanResource


logger = logging.getLogger(__name__)


class UserDocumentsListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class DocumentDeleteView(generics.DestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

class DocumentProcessView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'id': serializer.instance.id}, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        """
        Handles document upload, extraction, and saving the Document instance.
        Called by CreateAPIView after serializer validation.
        """
        uploaded_file = self.request.FILES.get('file')
        if not uploaded_file:
            logger.warning(f"File not found in request for user {self.request.user.id}")
            raise ValidationError({"file": ["No file was submitted."]})

        original_filename = uploaded_file.name
        file_content_bytes = uploaded_file.read()
        file_size_bytes = uploaded_file.size
        filename_without_ext, file_extension = os.path.splitext(original_filename)
        file_extension = file_extension.lstrip('.')

        if not file_content_bytes:
            logger.warning(f"Uploaded file '{original_filename}' is empty for user {self.request.user.id}")
            raise ValidationError({"file": ["Uploaded file is empty."]})

        try:
            result = extract_and_preprocess_text(file_content_bytes, self.request.user) # Updated function call with user

            if result.get('error'):
                logger.error(f"Document processing failed for '{original_filename}' user {self.request.user.id}: {result['error']}")
                if "client not initialized" in result['error']:
                    raise ValidationError({"detail": "Document processing service configuration error."})
                else:
                    raise ValidationError({"detail": "Failed to process document content."})

            extracted_text = result.get('text', '')
            summary = result.get('summary', '')

            serializer.save(
                user=self.request.user,
                filename=filename_without_ext,
                size=file_size_bytes,
                file_type=file_extension,
                extracted_text=extracted_text,
                summary=summary
            )
            logger.info(f"Successfully processed and saved document '{filename_without_ext}' for user {self.request.user.id}")

        except ValidationError:
            raise
        except Exception as e:
            logger.exception(f"Unexpected error during document processing for '{original_filename}' user {self.request.user.id}: {e}")
            raise ValidationError({"detail": "An unexpected error occurred during document processing."})

class QuizGenerationView(generics.GenericAPIView):
    """
    Generates quizzes for a specific document using Azure OpenAI Models.
    Requires document ID in the URL and difficulty level as a query parameter.
    Generates quizzes for a specific document using Azure OpenAI Models via a POST request.
    Requires document_id, difficulty, and number_of_quizzes in the request body.
    Tracks token usage and enforces user limits.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = QuizGenerationRequestSerializer # Use the new serializer for input validation

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        document_id = validated_data['document_id']
        difficulty = validated_data['difficulty']
        number_of_quizzes = validated_data['number_of_quizzes']

        # Get the document and verify ownership
        try:
            document = get_object_or_404(Document, pk=document_id, user=request.user)
        except Document.DoesNotExist: # Although get_object_or_404 raises Http404, catch explicitly for clarity
             raise NotFound(detail="Document not found or you do not have permission.")

        if not document.extracted_text:
            logger.warning(f"Document ID {document_id} has no extracted text for quiz generation.")
            return Response(
                {"error": "Document content is empty or not processed."},
                status=status.HTTP_400_BAD_REQUEST
            )
          
        try:
            # Pass the user and number_of_quizzes to track token usage and control generation
            quiz_data = generate_quizzes_from_text(
                text_content=document.extracted_text,
                difficulty=difficulty,
                number_of_quizzes=number_of_quizzes, # Pass the requested number
                user=request.user,  # Pass user for token tracking
                retries=DEFAULT_QUIZ_GENERATION_RETRIES
            )
        except PermissionDenied as e:
            # Handle token limit exceeded exception from token_tracking utility
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except QuizGenerationError as e:
            logger.error(f"Quiz generation failed for doc {document_id}: {e}")
            return Response({"error": str(e)}, status=e.status_code)
        except Exception as e:
            logger.exception(f"Unexpected error calling quiz generation utility for doc {document_id}: {e}")
            return Response(
                {"error": "An unexpected error occurred during quiz generation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Process the generated quiz data
        generated_quizzes = quiz_data.get("quizzes", [])
        saved_count = 0
        # TODO: Remove this uuid later
        overall_quiz_id = str(uuid.uuid4())  
        errors = []
        # Limit saving to the number requested, even if the AI returned more
        quizzes_to_save = generated_quizzes[:number_of_quizzes] # Limit to requested number

        successfully_saved_quizzes = []
        for item in quizzes_to_save:
            item_serializer = QuizItemSerializer(data=item)
            if item_serializer.is_valid():
                validated_item_data = item_serializer.validated_data
                try:
                    # Handle explanation field - convert JSON to string if needed
                    explanation_data = validated_item_data.get("explanation")
                    explanation_str = explanation_data
                    if isinstance(explanation_data, dict):
                        # Convert JSON object to string for storage in TextField
                        explanation_str = json.dumps(explanation_data)
                    
                    quiz_instance = Quiz.objects.create(
                        user=request.user,
                        document=document,
                        question=validated_item_data["question"],
                        option1=validated_item_data["options"][0],
                        option2=validated_item_data["options"][1],
                        option3=validated_item_data["options"][2],
                        option4=validated_item_data["options"][3],
                        correct_option_index=validated_item_data["correct_option_index"],
                        hint=validated_item_data.get("hint"),
                        explanation=explanation_str,
                        keywords=validated_item_data.get("keywords", []),
                        difficulty=difficulty # Use difficulty from original request
                    )
                    successfully_saved_quizzes.append(quiz_instance)
                    saved_count += 1
                except Exception as e:
                    # Log error during DB save
                    logger.error(f"Failed to save validated quiz item for doc {document_id}: {validated_item_data.get('question', 'N/A')}. Error: {e}")
                    errors.append(f"Error saving quiz: {validated_item_data.get('question', 'N/A')}")
            else:
                # Log validation error from QuizItemSerializer
                error_detail = json.dumps(item_serializer.errors)
                logger.warning(f"Invalid quiz item structure received from AI for doc {document_id}. Errors: {error_detail}. Item: {str(item)[:200]}...")
                errors.append(f"Invalid quiz data received: {error_detail}")

        logger.info(f"Requested {number_of_quizzes} quizzes for document {document_id}. Attempted to save {len(quizzes_to_save)}. Successfully saved {saved_count}. Encountered {len(errors)} issues during validation or saving.")

        # Use QuizSerializer to format the successfully saved quizzes for the response
        # response_quiz_serializer = QuizSerializer(successfully_saved_quizzes, many=True) # No longer needed for response

        response_data = {
            "message": f"Quiz generation process completed for document {document_id}. {saved_count} of {number_of_quizzes} requested quizzes were successfully saved.",
            "quiz_session_id": overall_quiz_id,
            "document_id": document_id,
            "difficulty": difficulty,
            "requested_count": number_of_quizzes,
            # "generated_quizzes": response_quiz_serializer.data, # Removed as per feedback
        }
        if errors:
            response_data["errors"] = errors # Still include validation/saving errors

        return Response(response_data, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS) # Use 207 if there were errors


class DocumentQuizzesListView(generics.ListAPIView):
    """
    Lists all quizzes associated with a specific document owned by the authenticated user.
    """
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        document = get_object_or_404(Document, pk=document_id, user=self.request.user)
        return Quiz.objects.filter(
            document=document, 
            mastery_score__lt=0.8
        ).order_by('created_at')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Document.DoesNotExist: # Should be caught by get_object_or_404 in get_queryset
             return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied:
            return Response({"error": "You do not have permission to access quizzes for this document."}, status=status.HTTP_403_FORBIDDEN)


class UserTokenUsageView(generics.RetrieveAPIView):
    """
    Get current user's token usage details
    """
    serializer_class = UserTokenUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Get or create token usage record for current user
        obj, created = UserTokenUsage.objects.get_or_create(user=self.request.user)
        return obj


class QuizSubmissionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSubmissionSerializer

    def post(self, request, *args, **kwargs):
        # Validate input data
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            logger.error(f"Quiz submission validation errors: {serializer.errors}")
            return Response({
                "error": "Invalid data format",
                "validation_errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data

        user = request.user
        document_id = data['document_id']
        answers_data = data['answers']

        # Get document and quizzes (already validated by serializer)
        document = get_object_or_404(Document, pk=document_id, user=user)


        '''comment  out  the code below when we want only 1 submission per document'''


        # if QuizSession.objects.filter(user=user, document=document).exists():
        #     return Response({"error": "Quiz already submitted for this document"}, status=status.HTTP_400_BAD_REQUEST)

        quizzes = Quiz.objects.filter(document=document, user=user)

        # Calculate total questions available vs questions answered
        total_questions_available = quizzes.count()
        questions_answered = len(answers_data)
        
        # Create a new quiz session with questions_answered (not all questions)
        quiz_session = QuizSession.objects.create(
            user=user, 
            document=document,
            total_questions=questions_answered  # Only count answered questions for this session
        )

        # Process each answer
        correct_count = 0

        for answer_data in answers_data:
            quiz_id = answer_data['quiz_id']
            selected_option_index = answer_data['selected_option_index']
            time_taken = answer_data['time_taken']
            quiz = quizzes.get(id=quiz_id)
            is_correct = (selected_option_index == quiz.correct_option_index)
            QuizAnswer.objects.create(
                quiz_session=quiz_session,
                quiz=quiz,
                selected_option_index=selected_option_index,
                is_correct=is_correct,
                time_taken=time_taken
            )
            if is_correct:
                correct_count += 1

        # Calculate score based on answered questions only
        score = (correct_count / questions_answered) * 100 if questions_answered > 0 else 0
        quiz_session.completed_at = timezone.now()
        quiz_session.score = score
        quiz_session.correct_answers = correct_count
        quiz_session.save()

        # Module 1: Calculate mastery scores after quiz submission
        try:
            # Update mastery scores for all quizzes that were answered
            updated_quiz_scores = {}
            for answer_data in answers_data:
                quiz_id = answer_data['quiz_id']
                mastery_score = calculate_quiz_mastery_score(quiz_id, user.id)
                updated_quiz_scores[quiz_id] = mastery_score
            
            # Calculate and update document-level mastery score
            document_mastery = calculate_document_mastery_score(document_id, user.id)
            
            # Module 2: Update review schedule based on performance
            performance_factor = score / 100.0  # Convert percentage to 0-1 factor
            schedule_update = update_review_schedule(document_id, user.id, performance_factor)
            
            logger.info(f"Updated mastery scores and review schedule for user {user.id}, document {document_id}. Document mastery: {document_mastery:.2f}, Next review: {schedule_update.get('next_review_date') if schedule_update else 'N/A'}")
            
        except Exception as e:
            logger.error(f"Error updating mastery scores and review schedule after quiz submission: {e}")
            # Don't fail the entire request if mastery calculation fails

        # Module 3: Adaptive Quiz Generation - Trigger every 3rd quiz submission
        total_sessions = QuizSession.objects.filter(
            user=user,
            document=document,
            completed_at__isnull=False
        ).count()

        # Trigger adaptive quiz generation if divisible by 3
        if total_sessions % 3 == 0:
            quiz_data = generate_adaptive_quizzes(user=user, document_id=document_id)
            save_adaptive_quizzes(user=user, document_id=document_id, quiz_data=quiz_data)

        # Prepare response
        answers = quiz_session.answers.all()
        answer_serializer = QuizAnswerSerializer(answers, many=True)
        response_data = {
            "quiz_session_id": quiz_session.id,
            "score": score,
            "correct_count": correct_count,
            "questions_answered": questions_answered,
            "questions_skipped": total_questions_available - questions_answered,
            "total_questions_available": total_questions_available,
            "answers": answer_serializer.data,
            "document_mastery_score": float(document.document_mastery_score) if 'document_mastery' in locals() else None
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class FlashcardGenerationView(generics.GenericAPIView):
    """
    Generates flashcards for a specific document using Azure OpenAI Models via a POST request.
    Requires document_id, difficulty, and number_of_flashcards in the request body.
    Tracks token usage and enforces user limits.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FlashcardGenerationRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        document_id = validated_data['document_id']
        difficulty = validated_data['difficulty']
        number_of_flashcards = validated_data['number_of_flashcards']

        # Get the document and verify ownership
        try:
            document = get_object_or_404(Document, pk=document_id, user=request.user)
        except Document.DoesNotExist:
             raise NotFound(detail="Document not found or you do not have permission.")

        if not document.extracted_text:
            logger.warning(f"Document ID {document_id} has no extracted text for flashcard generation.")
            return Response(
                {"error": "Document content is empty or not processed."},
                status=status.HTTP_400_BAD_REQUEST
            )
          
        try:
            # Pass the user and number_of_flashcards to track token usage and control generation
            flashcard_data = generate_flashcards_from_text(
                text_content=document.extracted_text,
                difficulty=difficulty,
                number_of_flashcards=number_of_flashcards,
                user=request.user,
                retries=DEFAULT_FLASHCARD_GENERATION_RETRIES
            )
        except PermissionDenied as e:
            # Handle token limit exceeded exception from token_tracking utility
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except FlashcardGenerationError as e:
            logger.error(f"Flashcard generation failed for doc {document_id}: {e}")
            return Response({"error": str(e)}, status=e.status_code)
        except Exception as e:
            logger.exception(f"Unexpected error calling flashcard generation utility for doc {document_id}: {e}")
            return Response(
                {"error": "An unexpected error occurred during flashcard generation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Process the generated flashcard data
        generated_flashcards = flashcard_data.get("flashcards", [])
        saved_count = 0
        session_id = str(uuid.uuid4())
        errors = []
        
        # Limit saving to the number requested, even if the AI returned more
        flashcards_to_save = generated_flashcards[:number_of_flashcards]

        successfully_saved_flashcards = []
        for item in flashcards_to_save:
            item_serializer = FlashcardItemSerializer(data=item)
            if item_serializer.is_valid():
                validated_item_data = item_serializer.validated_data
                try:
                    flashcard_instance = Flashcard.objects.create(
                        user=request.user,
                        document=document,
                        front=validated_item_data["front"],
                        back=validated_item_data["back"],
                        hint=validated_item_data.get("hint"),
                        keywords=validated_item_data.get("keywords", []),
                        difficulty=difficulty
                    )
                    successfully_saved_flashcards.append(flashcard_instance)
                    saved_count += 1
                except Exception as e:
                    logger.error(f"Failed to save validated flashcard item for doc {document_id}: {validated_item_data.get('front', 'N/A')[:50]}... Error: {e}")
                    errors.append(f"Error saving flashcard: {validated_item_data.get('front', 'N/A')[:50]}...")
            else:
                error_detail = json.dumps(item_serializer.errors)
                logger.warning(f"Invalid flashcard item structure received from AI for doc {document_id}. Errors: {error_detail}. Item: {str(item)[:200]}...")
                errors.append(f"Invalid flashcard data received: {error_detail}")

        logger.info(f"Requested {number_of_flashcards} flashcards for document {document_id}. Attempted to save {len(flashcards_to_save)}. Successfully saved {saved_count}. Encountered {len(errors)} issues during validation or saving.")

        response_data = {
            "message": f"Flashcard generation process completed for document {document_id}. {saved_count} of {number_of_flashcards} requested flashcards were successfully saved.",
            "session_id": session_id,
            "document_id": document_id,
            "difficulty": difficulty,
            "requested_count": number_of_flashcards,
        }
        
        if errors:
            response_data["errors"] = errors

        return Response(response_data, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS)


class DocumentFlashcardsListView(generics.ListAPIView):
    """
    Lists all flashcards associated with a specific document owned by the authenticated user.
    """
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        document = get_object_or_404(Document, pk=document_id, user=self.request.user)
        return Flashcard.objects.filter(document=document).order_by('created_at')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied:
            return Response({"error": "You do not have permission to access flashcards for this document."}, status=status.HTTP_403_FORBIDDEN)


class FlashcardReviewView(generics.GenericAPIView):
    """
    Handles submission of flashcard reviews for a study session.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FlashcardReviewRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user
        document_id = data['document_id']
        reviews_data = data['reviews']

        # Get document and verify ownership
        document = get_object_or_404(Document, pk=document_id, user=user)
        
        # Create a new flashcard session
        flashcard_session = FlashcardSession.objects.create(user=user, document=document)
        
        # Process each review
        created_reviews = []
        for review_data in reviews_data:
            flashcard_id = int(review_data['flashcard_id'])
            confidence_level = review_data['confidence_level']
            
            flashcard = get_object_or_404(Flashcard, id=flashcard_id, document=document, user=user)
            
            review = FlashcardReview.objects.create(
                flashcard_session=flashcard_session,
                flashcard=flashcard,
                confidence_level=confidence_level
            )
            created_reviews.append(review)
        
        # Mark session as completed
        flashcard_session.completed_at = timezone.now()
        flashcard_session.save()
        
        # Prepare response
        response_data = {
            "session_id": flashcard_session.id,
            "document_id": document_id,
            "completed_at": flashcard_session.completed_at,
            "review_count": len(created_reviews)
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class HealthCheckView(generics.RetrieveAPIView):
    """
    Simple health check endpoint to verify API is operational.
    """
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        # No serializer needed for health check
        return None
    
    def retrieve(self, request, *args, **kwargs):
        return Response(
            {"status": "healthy", "message": "API is operational"}, 
            status=status.HTTP_200_OK
        )




class QuizHistoryListView(generics.ListAPIView):
    serializer_class = QuizSessionHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return QuizSession.objects.filter(user=self.request.user).order_by('-started_at')


class QuizHistoryDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSessionDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'session_id'

    def get_queryset(self):
        return QuizSession.objects.filter(user=self.request.user)


class MnemonicGenerationView(generics.GenericAPIView):
    """
    Generates mnemonics for a specific document using Azure OpenAI Models via a POST request.
    Accepts optional mnemonic types, topics, and additional instructions.
    Tracks token usage and enforces user limits.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MnemonicGenerationRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        document_id = validated_data['document_id']
        mnemonic_types = validated_data.get('mnemonic_types', [])
        topics = validated_data.get('topics', [])
        instructions = validated_data.get('instructions', '')

        # Get the document and verify ownership
        try:
            document = get_object_or_404(Document, pk=document_id, user=request.user)
        except Document.DoesNotExist:
             raise NotFound(detail="Document not found or you do not have permission.")

        if not document.extracted_text:
            logger.warning(f"Document ID {document_id} has no extracted text for mnemonic generation.")
            return Response(
                {"error": "Document content is empty or not processed."},
                status=status.HTTP_400_BAD_REQUEST
            )
          
        try:
            # Generate mnemonics using the utility function
            mnemonic_data = generate_mnemonics_from_text(
                text_content=document.extracted_text,
                mnemonic_types=mnemonic_types if mnemonic_types else None,
                topics=topics if topics else None,
                instructions=instructions if instructions else None,
                user=request.user,
                retries=DEFAULT_MNEMONIC_GENERATION_RETRIES
            )
        except PermissionDenied as e:
            # Handle token limit exceeded exception from token_tracking utility
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except MnemonicGenerationError as e:
            logger.error(f"Mnemonic generation failed for doc {document_id}: {e}")
            return Response({"error": str(e)}, status=e.status_code)
        except Exception as e:
            logger.exception(f"Unexpected error calling mnemonic generation utility for doc {document_id}: {e}")
            return Response(
                {"error": "An unexpected error occurred during mnemonic generation."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Process the generated mnemonic data
        generated_mnemonics = mnemonic_data.get("mnemonics", [])
        uncovered_topics = mnemonic_data.get("uncovered_topics", [])
        saved_count = 0
        errors = []

        successfully_saved_mnemonics = []
        for item in generated_mnemonics:
            item_serializer = MnemonicItemSerializer(data=item)
            if item_serializer.is_valid():
                validated_item_data = item_serializer.validated_data
                try:
                    mnemonic_instance = Mnemonic.objects.create(
                        user=request.user,
                        document=document,
                        mnemonic=validated_item_data["mnemonic"],
                        mnemonic_type=validated_item_data["mnemonic_type"],
                        mnemonic_explanation=validated_item_data["mnemonic_explanation"],
                        topic=validated_item_data["topic"]
                    )
                    successfully_saved_mnemonics.append(mnemonic_instance)
                    saved_count += 1
                except Exception as e:
                    logger.error(f"Failed to save validated mnemonic item for doc {document_id}: {validated_item_data.get('topic', 'N/A')}. Error: {e}")
                    errors.append(f"Error saving mnemonic: {validated_item_data.get('topic', 'N/A')}")
            else:
                error_detail = json.dumps(item_serializer.errors)
                logger.warning(f"Invalid mnemonic item structure received from AI for doc {document_id}. Errors: {error_detail}. Item: {str(item)[:200]}...")
                errors.append(f"Invalid mnemonic data received: {error_detail}")

        logger.info(f"Generated {len(generated_mnemonics)} mnemonics for document {document_id}. Successfully saved {saved_count}. Encountered {len(errors)} issues during validation or saving.")

        response_data = {
            "message": f"Mnemonic generation process completed for document {document_id}. {saved_count} mnemonics were successfully saved.",
            "document_id": document_id,
            "saved_count": saved_count,
            "generated_count": len(generated_mnemonics),
            "uncovered_topics": uncovered_topics
        }
        
        if errors:
            response_data["errors"] = errors

        return Response(response_data, status=status.HTTP_200_OK if not errors else status.HTTP_207_MULTI_STATUS)


class DocumentMnemonicsListView(generics.ListAPIView):
    """
    Lists all mnemonics associated with a specific document owned by the authenticated user.
    """
    serializer_class = MnemonicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        document = get_object_or_404(Document, pk=document_id, user=self.request.user)
        return Mnemonic.objects.filter(document=document).order_by('created_at')

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Document.DoesNotExist:
            return Response({"error": "Document not found."}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied:
            return Response({"error": "You do not have permission to access mnemonics for this document."}, status=status.HTTP_403_FORBIDDEN)


class MnemonicDocumentsListView(generics.ListAPIView):
    """
    Lists all documents for the authenticated user with their mnemonic generation status.
    """
    serializer_class = DocumentWithMnemonicsStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user).order_by('-upload_date')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)


class ReviewDocumentsTodayView(generics.ListAPIView):
    """
    Lists documents scheduled for review today.
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = timezone.now().date()
        return Document.objects.filter(
            user=self.request.user,
            next_review_date__date=today
        ).order_by('next_review_date')


class ReviewDocumentsByDateView(generics.ListAPIView):
    """
    Lists documents scheduled for review on a specific date.
    Expected URL parameter: date (YYYY-MM-DD format)
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        date_param = self.request.query_params.get('date')
        if not date_param:
            return Document.objects.none()
        
        try:
            target_date = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Document.objects.none()
            
        # Filter by date only, ignoring time component
        return Document.objects.filter(
            user=self.request.user,
            next_review_date__date=target_date
        ).order_by('next_review_date')


class ReviewDocumentsDateRangeView(generics.ListAPIView):
    """
    Lists documents scheduled for review within a date range.
    Expected URL parameters: start_date and end_date (YYYY-MM-DD format)
    """
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        start_date_param = self.request.query_params.get('start_date')
        end_date_param = self.request.query_params.get('end_date')
        
        if not start_date_param or not end_date_param:
            return Document.objects.none()
        
        try:
            start_date = datetime.strptime(start_date_param, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date_param, '%Y-%m-%d').date()
        except ValueError:
            return Document.objects.none()
            
        return Document.objects.filter(
            user=self.request.user,
            next_review_date__date__range=[start_date, end_date]
        ).order_by('next_review_date')


class ReviewCalendarView(generics.GenericAPIView):
    """
    Returns calendar data for review scheduling.
    Expected URL parameters: year and month
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        
        if not year or not month:
            return Response({
                'error': 'Both year and month parameters are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            year = int(year)
            month = int(month)
        except ValueError:
            return Response({
                'error': 'Year and month must be integers'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get first and last day of the month
        first_day = date(year, month, 1)
        if month == 12:
            last_day = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            last_day = date(year, month + 1, 1) - timedelta(days=1)
        
        # Get documents scheduled for review in this month
        documents = Document.objects.filter(
            user=request.user,
            next_review_date__date__range=[first_day, last_day]
        ).order_by('next_review_date')
        
        # Group documents by date
        calendar_data = {}
        for doc in documents:
            if doc.next_review_date:
                # Convert to local date to avoid timezone issues
                local_date = doc.next_review_date.date()
                date_key = local_date.isoformat()
                if date_key not in calendar_data:
                    calendar_data[date_key] = []
                calendar_data[date_key].append({
                    'id': doc.id,
                    'filename': doc.filename,
                    'mastery_score': float(doc.document_mastery_score),
                    'review_interval_days': doc.review_interval_days
                })
        
        return Response({
            'year': year,
            'month': month,
            'calendar_data': calendar_data
        })


# Study Planner Views

class StudyPlanListCreateView(generics.ListCreateAPIView):
    """
    List all study plans for the authenticated user or create a new one
    """
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyPlan.objects.filter(user=self.request.user).prefetch_related(
            'documents', 'steps__resources'
        ).order_by('-created_at')


class StudyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific study plan
    """
    serializer_class = StudyPlanSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyPlan.objects.filter(user=self.request.user).prefetch_related(
            'documents', 'steps__resources'
        )
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return StudyPlanUpdateSerializer
        return StudyPlanSerializer


class StudyPlanGenerateView(generics.CreateAPIView):
    """
    Generate a new AI-powered study plan using Perplexity API
    """
    serializer_class = StudyPlanGenerationRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            # Get validated data
            data = serializer.validated_data
            document_ids = data['document_ids']
            
            # Fetch documents and their summaries
            documents = Document.objects.filter(
                id__in=document_ids,
                user=request.user
            )
            
            document_summaries = []
            for doc in documents:
                if doc.summary:
                    document_summaries.append({
                        'filename': doc.filename,
                        'summary': doc.summary
                    })
                else:
                    # If no summary, use a portion of extracted text
                    text_preview = doc.extracted_text[:1000] if doc.extracted_text else "No content available"
                    document_summaries.append({
                        'filename': doc.filename,
                        'summary': f"Document content preview: {text_preview}"
                    })
            
            if not document_summaries:
                raise ValidationError({
                    'document_ids': 'Selected documents have no content to generate study plan from.'
                })
            
            # Generate study plan using Perplexity API
            logger.info(f"Generating study plan for user {request.user.username} with {len(document_summaries)} documents")
            
            study_plan_data = generate_study_plan(
                document_summaries=document_summaries,
                daily_study_hours=data['daily_study_hours'],
                days_until_exam=data['days_until_exam'],
                exam_type=data['exam_type'],
                additional_context=data.get('additional_context')
            )
            
            # Skip validation - allow any generated study plan structure
            # if not validate_study_plan_data(study_plan_data):
            #     raise StudyPlannerError("Generated study plan has invalid structure")
            
            # Create the study plan in database
            study_plan = StudyPlan.objects.create(
                user=request.user,
                title=data['title'],
                description=data.get('description', ''),
                daily_study_hours=data['daily_study_hours'],
                days_until_exam=data['days_until_exam'],
                exam_type=data['exam_type'],
                additional_context=data.get('additional_context', '')
            )
            
            # Add documents to the study plan
            study_plan.documents.set(documents)
            
            # Create study plan steps from the generated plan
            self._create_study_plan_steps(study_plan, study_plan_data)
            
            # Update resources with URLs (already enhanced by generate_study_plan)
            try:
                self._update_study_plan_resources(study_plan, study_plan_data)
                logger.info(f"Successfully updated study plan {study_plan.id} resources")
            except Exception as e:
                logger.warning(f"Failed to update study plan resources: {e}")
                # Continue without resource updates if it fails
            
            # Return the created study plan
            study_plan.refresh_from_db()
            response_serializer = StudyPlanSerializer(study_plan, context={'request': request})
            
            return Response({
                'study_plan': response_serializer.data,
                'generation_metadata': {
                    'generated_at': study_plan_data.get('generated_at'),
                    'api_usage': study_plan_data.get('api_usage', {}),
                    'total_steps_created': study_plan.steps.count()
                }
            }, status=status.HTTP_201_CREATED)
            
        except StudyPlannerError as e:
            logger.error(f"Study planner error for user {request.user.username}: {e}")
            return Response({
                'error': 'Study Plan Generation Failed',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.exception(f"Unexpected error during study plan generation for user {request.user.username}: {e}")
            return Response({
                'error': 'Internal Server Error',
                'detail': 'An unexpected error occurred while generating the study plan.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _create_study_plan_steps(self, study_plan: StudyPlan, plan_data: Dict):
        """Create study plan steps from the generated plan data"""
        daily_schedule = plan_data.get('daily_schedule', [])
        
        # Handle case where daily_schedule might be None
        if daily_schedule is None:
            daily_schedule = []
        
        for day_data in daily_schedule:
            # Handle case where day_data might be None or not a dict
            if day_data is None or not isinstance(day_data, dict):
                continue
                
            day_number = day_data.get('day', 1)
            
            # Process each session (morning, afternoon, evening)
            sessions = ['morning_session', 'afternoon_session', 'evening_session']
            step_order = 1
            
            for session_name in sessions:
                session_data = day_data.get(session_name, {})
                # Handle case where session_data might be None
                if session_data is None:
                    session_data = {}
                activities = session_data.get('activities', [])
                # Handle case where activities might be None
                if activities is None:
                    activities = []
                
                for activity in activities:
                    # Handle case where activity might be None or not a dict
                    if activity is None or not isinstance(activity, dict):
                        continue
                        
                    # Map activity type to valid model choice
                    activity_type = self._map_activity_type(activity.get('type', 'reading'))
                    activity_priority = self._map_priority(activity.get('priority', 'medium'))
                    
                    # Create the study plan step
                    step = StudyPlanStep.objects.create(
                        study_plan=study_plan,
                        day_number=day_number,
                        step_order=step_order,
                        step_type=activity_type,
                        priority=activity_priority,
                        title=activity.get('title', '')[:255],  # Truncate if too long
                        description=activity.get('description', ''),
                        topic=activity.get('topic', '')[:255],  # Truncate if too long
                        estimated_duration=activity.get('duration_minutes', activity.get('duration', 60)) / 60.0,  # Convert to hours
                        related_document=self._find_related_document(
                            study_plan, activity.get('topic', '')
                        )
                    )
                    
                    # Create resources for this step
                    resources = activity.get('resources', [])
                    for resource in resources:
                        # Safely get resource values and truncate if necessary
                        resource_type = self._map_resource_type(resource.get('type', 'article'))
                        resource_title = str(resource.get('title', ''))[:255]  # Truncate title
                        resource_url = resource.get('url', resource.get('url_suggestion', '#'))
                        resource_desc = str(resource.get('description', ''))
                        
                        StudyPlanResource.objects.create(
                            study_plan_step=step,
                            resource_type=resource_type,
                            title=resource_title,
                            url=resource_url,
                            description=resource_desc
                        )
                    
                    step_order += 1
    
    def _map_activity_type(self, activity_type: str) -> str:
        """Map activity type from study planner to valid model choice"""
        type_mapping = {
            'learning': 'reading',
            'study': 'reading',
            'watch': 'video',
            'viewing': 'video',
            'testing': 'quiz',
            'test': 'quiz',
            'cards': 'flashcards',
            'memory': 'mnemonics',
            'mnemonic': 'mnemonics',
            'revision': 'review',
            'exercises': 'practice',
            'practice': 'practice',
        }
        
        # Clean and normalize the type
        clean_type = str(activity_type).lower().strip()
        
        # Direct match first
        if clean_type in ['reading', 'video', 'quiz', 'flashcards', 'mnemonics', 'review', 'practice']:
            return clean_type
            
        # Try mapping
        mapped_type = type_mapping.get(clean_type, 'reading')
        
        # Ensure it's not longer than 15 characters
        return mapped_type[:15]
    
    def _map_priority(self, priority: str) -> str:
        """Map priority from study planner to valid model choice"""
        clean_priority = str(priority).lower().strip()
        
        if clean_priority in ['high', 'medium', 'low']:
            return clean_priority
        elif clean_priority in ['critical', 'important', 'urgent']:
            return 'high'
        elif clean_priority in ['normal', 'standard', 'moderate']:
            return 'medium'
        else:
            return 'medium'  # Default fallback
    
    def _map_resource_type(self, resource_type: str) -> str:
        """Map resource type from study planner to valid model choice"""
        clean_type = str(resource_type).lower().strip()
        
        # Direct match first
        valid_types = ['youtube', 'article', 'blog', 'website', 'pdf', 'other']
        if clean_type in valid_types:
            return clean_type
            
        # Try mapping common variations
        type_mapping = {
            'video': 'youtube',
            'vid': 'youtube',
            'yt': 'youtube',
            'web': 'website',
            'site': 'website',
            'link': 'website',
            'post': 'blog',
            'document': 'pdf',
            'doc': 'pdf',
        }
        
        mapped_type = type_mapping.get(clean_type, 'other')
        return mapped_type[:10]  # Ensure max 10 chars
    
    def _find_related_document(self, study_plan: StudyPlan, topic: str):
        """Find the most relevant document for a given topic"""
        if not topic:
            return None
        
        # Simple keyword matching - can be enhanced with more sophisticated matching
        documents = study_plan.documents.all()
        for doc in documents:
            if topic.lower() in doc.summary.lower() or topic.lower() in doc.filename.lower():
                return doc
        
        # Return the first document if no specific match
        return documents.first() if documents.exists() else None
    
    def _update_study_plan_resources(self, study_plan: StudyPlan, enhanced_plan_data: Dict):
        """Update study plan resources with enhanced search results"""
        # This would update resources with actual URLs from enhanced search
        # Implementation depends on the enhanced_plan_data structure
        pass


class StudyPlanStepUpdateView(generics.UpdateAPIView):
    """
    Update a specific study plan step (mainly for marking as completed)
    """
    serializer_class = StudyPlanStepUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return StudyPlanStep.objects.filter(
            study_plan__user=self.request.user
        )


class StudyPlanProgressView(generics.RetrieveAPIView):
    """
    Get progress statistics for a study plan
    """
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        study_plan_id = self.kwargs.get('pk')
        return get_object_or_404(
            StudyPlan,
            id=study_plan_id,
            user=self.request.user
        )
    
    def retrieve(self, request, *args, **kwargs):
        study_plan = self.get_object()
        
        # Calculate progress statistics
        total_steps = study_plan.steps.count()
        completed_steps = study_plan.steps.filter(is_completed=True).count()
        progress_percentage = (completed_steps / total_steps * 100) if total_steps > 0 else 0
        
        # Get current day progress
        today = timezone.now().date()
        days_since_start = (today - study_plan.created_at.date()).days + 1
        current_day = min(days_since_start, study_plan.days_until_exam)
        
        # Get today's steps
        today_steps = study_plan.steps.filter(day_number=current_day)
        today_completed = today_steps.filter(is_completed=True).count()
        today_total = today_steps.count()
        today_progress = (today_completed / today_total * 100) if today_total > 0 else 0
        
        # Calculate time statistics  
        total_study_hours = study_plan.total_study_hours
        completed_hours = sum(
            step.estimated_duration for step in study_plan.steps.filter(is_completed=True)
        )
        
        return Response({
            'study_plan_id': study_plan.id,
            'title': study_plan.title,
            'status': study_plan.status,
            'progress': {
                'overall_percentage': round(progress_percentage, 1),
                'completed_steps': completed_steps,
                'total_steps': total_steps,
                'completed_hours': round(completed_hours, 1),
                'total_study_hours': round(total_study_hours, 1)
            },
            'current_day': {
                'day_number': current_day,
                'progress_percentage': round(today_progress, 1),
                'completed_steps': today_completed,
                'total_steps': today_total
            },
            'timeline': {
                'days_since_start': days_since_start,
                'days_until_exam': study_plan.days_until_exam,
                'exam_date': study_plan.exam_date.isoformat(),
                'created_at': study_plan.created_at.isoformat()
            }
        })


class StudyPlanStepsView(generics.ListAPIView):
    """
    Get study plan steps for a specific day or all steps
    """
    serializer_class = StudyPlanStepSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        study_plan_id = self.kwargs.get('pk')
        day_number = self.request.query_params.get('day')
        
        queryset = StudyPlanStep.objects.filter(
            study_plan_id=study_plan_id,
            study_plan__user=self.request.user
        ).prefetch_related('resources').order_by('day_number', 'step_order')
        
        if day_number:
            try:
                day_number = int(day_number)
                queryset = queryset.filter(day_number=day_number)
            except (ValueError, TypeError):
                pass
        
        return queryset