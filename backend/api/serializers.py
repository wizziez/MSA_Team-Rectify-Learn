from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Document, Quiz, UserTokenUsage, QuizAnswer, Flashcard, FlashcardReview, 
    QuizSession, Mnemonic, StudyPlan, StudyPlanStep, StudyPlanResource
)
from django.shortcuts import get_object_or_404


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    
    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user


class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True, required=True)
    filename = serializers.CharField(read_only=True)
    size = serializers.FloatField(read_only=True)
    upload_date = serializers.DateTimeField(read_only=True)
    summary = serializers.CharField(read_only=True)
    document_mastery_score = serializers.DecimalField(max_digits=3, decimal_places=2, read_only=True)
    next_review_date = serializers.DateTimeField(read_only=True)
    review_interval_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = Document
        fields = ["id", "filename", "size", "upload_date", "file_type", "file", 
                 "summary", "document_mastery_score", "next_review_date", "review_interval_days"]
        read_only_fields = ["id", "user", "filename", "size", "upload_date", "extracted_text", "summary", "file_type",
                           "document_mastery_score", "next_review_date", "review_interval_days"]

    def create(self, validated_data):
        validated_data.pop('file', None)
        instance = Document.objects.create(**validated_data)
        return instance


class QuizSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 
            'question', 
            'options', 
            'correct_option_index',
            'hint', 
            'explanation'
        ]
        read_only_fields = ['id']

    def get_options(self, obj):
        return [obj.option1, obj.option2, obj.option3, obj.option4]


class QuizGenerationRequestSerializer(serializers.Serializer):
    """
    Serializer for validating the request body for quiz generation.
    """
    document_id = serializers.IntegerField(required=True)
    difficulty = serializers.ChoiceField(choices=Quiz.Difficulty.choices, required=True)
    number_of_quizzes = serializers.IntegerField(required=True, min_value=1, max_value=30) # Max 30 quizzes per request


class QuizItemSerializer(serializers.Serializer):
    """
    Serializer for validating individual quiz items received from the AI.
    Used internally by the QuizGenerationView.
    """
    question = serializers.CharField(required=True)
    options = serializers.ListField(
        child=serializers.CharField(max_length=500),
        min_length=4,
        max_length=4,
        required=True
    )
    correct_option_index = serializers.IntegerField(min_value=0, max_value=3, required=True)
    hint = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    explanation = serializers.JSONField(required=False, allow_null=True)
    keywords = serializers.ListField(
        child=serializers.CharField(),
        required=False, # Make keywords optional at this stage
        default=list
    )

class UserTokenUsageSerializer(serializers.ModelSerializer):
    remaining_tokens = serializers.SerializerMethodField()
    last_reset = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = UserTokenUsage
        fields = [
            'tokens_used', 
            'max_tokens',
            'remaining_tokens',
            'last_reset'
        ]
        read_only_fields = fields

    def get_remaining_tokens(self, obj):
        return obj.remaining_tokens()


class AnswerSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    selected_option_index = serializers.IntegerField(min_value=0, max_value=3)
    time_taken = serializers.FloatField(min_value=0, help_text="Time taken to answer in seconds")

class QuizSubmissionSerializer(serializers.Serializer):
    document_id = serializers.IntegerField()
    answers = AnswerSerializer(many=True)

    def validate(self, data):
        document_id = data['document_id']
        answers = data['answers']
        user = self.context['request'].user

        # Verify document exists and belongs to the user
        document = get_object_or_404(Document, pk=document_id, user=user)
        
        # Get all quizzes for this document and user
        quizzes = Quiz.objects.filter(document=document, user=user)
        quiz_ids = set(quiz.id for quiz in quizzes)
        provided_quiz_ids = set(answer['quiz_id'] for answer in answers)

        # Validate that provided quiz IDs exist and belong to this document
        invalid_quiz_ids = provided_quiz_ids - quiz_ids
        if invalid_quiz_ids:
            raise serializers.ValidationError(f"Invalid quiz IDs: {list(invalid_quiz_ids)}. These quizzes don't exist or don't belong to this document.")

        # Check for duplicate quiz IDs in submission
        provided_quiz_ids_list = [answer['quiz_id'] for answer in answers]
        if len(provided_quiz_ids_list) != len(set(provided_quiz_ids_list)):
            duplicate_ids = [quiz_id for quiz_id in provided_quiz_ids_list if provided_quiz_ids_list.count(quiz_id) > 1]
            raise serializers.ValidationError(f"Duplicate quiz IDs found: {list(set(duplicate_ids))}. Each quiz can only be answered once per submission.")

        # Allow partial submissions (skipping questions is now supported)
        # No longer requiring all quizzes to be answered

        return data

class QuizAnswerSerializer(serializers.ModelSerializer):
    quiz_id = serializers.IntegerField(source='quiz.id')
    question = serializers.CharField(source='quiz.question')
    options = serializers.SerializerMethodField()
    correct_option_index = serializers.IntegerField(source='quiz.correct_option_index')
    explanation = serializers.CharField(source='quiz.explanation')

    class Meta:
        model = QuizAnswer
        fields = ['quiz_id', 'question', 'options', 'selected_option_index', 'is_correct', 'correct_option_index', 'explanation', 'time_taken']

    def get_options(self, obj):
        return [obj.quiz.option1, obj.quiz.option2, obj.quiz.option3, obj.quiz.option4]


class FlashcardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flashcard
        fields = [
            'id',
            'front',
            'back',
            'hint',
            'keywords',
            'difficulty',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class FlashcardGenerationRequestSerializer(serializers.Serializer):
    """
    Serializer for validating the request body for flashcard generation.
    """
    document_id = serializers.IntegerField(required=True)
    difficulty = serializers.ChoiceField(choices=Flashcard.Difficulty.choices, required=True)
    number_of_flashcards = serializers.IntegerField(required=True, min_value=1, max_value=20) # Max 20 flashcards per request


class FlashcardItemSerializer(serializers.Serializer):
    """
    Serializer for validating individual flashcard items received from the AI.
    Used internally by the FlashcardGenerationView.
    """
    front = serializers.CharField(required=True)
    back = serializers.CharField(required=True)
    hint = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    keywords = serializers.ListField(
        child=serializers.CharField(),
        required=False, # Make keywords optional
        default=list
    )


class FlashcardReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashcardReview
        fields = ['id', 'flashcard', 'confidence_level', 'reviewed_at']
        read_only_fields = ['id', 'reviewed_at']


class FlashcardReviewRequestSerializer(serializers.Serializer):
    """
    Serializer for submitting flashcard reviews in a session
    """
    document_id = serializers.IntegerField(required=True)
    reviews = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=False
        ),
        required=True
    )

    def validate_reviews(self, reviews):
        for review in reviews:
            if 'flashcard_id' not in review:
                raise serializers.ValidationError("Each review must contain a flashcard_id")
            if 'confidence_level' not in review:
                raise serializers.ValidationError("Each review must contain a confidence_level")
            
            # Validate confidence level
            if review['confidence_level'] not in [choice[0] for choice in FlashcardReview.Confidence.choices]:
                raise serializers.ValidationError(f"Invalid confidence level: {review['confidence_level']}")
        
        return reviews

    def validate(self, data):
        document_id = data['document_id']
        reviews = data['reviews']
        user = self.context['request'].user

        # Verify document exists and belongs to the user
        document = get_object_or_404(Document, pk=document_id, user=user)
        
        # Get flashcard IDs in this document
        flashcards = Flashcard.objects.filter(document=document, user=user)
        flashcard_ids = set(flashcard.id for flashcard in flashcards)
        
        # Check if all flashcard IDs in reviews exist in the document
        for review in reviews:
            flashcard_id = int(review['flashcard_id'])
            if flashcard_id not in flashcard_ids:
                raise serializers.ValidationError(f"Flashcard with ID {flashcard_id} does not exist in this document")
        
        return data


class QuizSessionHistorySerializer(serializers.ModelSerializer):
    quiz_id = serializers.IntegerField(source='document.id')
    quiz_title = serializers.CharField(source='document.filename')
    time_spent = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source='completed_at')
    file_type = serializers.CharField(source='document.file_type')

    class Meta:
        model = QuizSession
        fields = ['id', 'quiz_id', 'quiz_title', 'score', 'correct_answers', 'total_questions', 'time_spent', 'date', 'file_type']
        read_only_fields = fields

    def get_time_spent(self, obj):
        if obj.completed_at and obj.started_at:
            return (obj.completed_at - obj.started_at).total_seconds()
        return None


class QuizSessionDetailSerializer(QuizSessionHistorySerializer):
    answers = QuizAnswerSerializer(many=True)

    class Meta(QuizSessionHistorySerializer.Meta):
        fields = QuizSessionHistorySerializer.Meta.fields + ['answers']


class MnemonicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mnemonic
        fields = [
            'id',
            'mnemonic',
            'mnemonic_type',
            'mnemonic_explanation',
            'topic',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class MnemonicGenerationRequestSerializer(serializers.Serializer):
    """
    Serializer for validating the request body for mnemonic generation.
    """
    document_id = serializers.IntegerField(required=True)
    mnemonic_types = serializers.ListField(
        child=serializers.ChoiceField(choices=Mnemonic.MnemonicType.choices),
        required=False,
        allow_empty=True
    )
    topics = serializers.ListField(
        child=serializers.CharField(max_length=255),
        required=False,
        allow_empty=True
    )
    instructions = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class MnemonicItemSerializer(serializers.Serializer):
    """
    Serializer for validating individual mnemonic items received from the AI.
    Used internally by the MnemonicGenerationView.
    """
    mnemonic = serializers.CharField(required=True)
    mnemonic_type = serializers.ChoiceField(choices=Mnemonic.MnemonicType.choices, required=True)
    mnemonic_explanation = serializers.CharField(required=True)
    topic = serializers.CharField(max_length=255, required=True)


class DocumentWithMnemonicsStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for returning documents with their mnemonic generation status.
    """
    has_mnemonics = serializers.SerializerMethodField()
    mnemonics_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id',
            'filename',
            'size',
            'file_type',
            'upload_date',
            'summary',
            'has_mnemonics',
            'mnemonics_count'
        ]
        read_only_fields = fields
    
    def get_has_mnemonics(self, obj):
        return obj.mnemonics.filter(user=self.context['request'].user).exists()
    
    def get_mnemonics_count(self, obj):
        return obj.mnemonics.filter(user=self.context['request'].user).count()


# Study Planner Serializers

class StudyPlanResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyPlanResource
        fields = [
            'id', 'resource_type', 'title', 'url', 'description', 
            'estimated_duration', 'author', 'publication_date', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class StudyPlanStepSerializer(serializers.ModelSerializer):
    resources = StudyPlanResourceSerializer(many=True, read_only=True)
    
    class Meta:
        model = StudyPlanStep
        fields = [
            'id', 'day_number', 'step_order', 'step_type', 'priority',
            'title', 'description', 'topic', 'estimated_duration',
            'is_completed', 'completed_at', 'related_document', 
            'quiz_url', 'resources', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class StudyPlanSerializer(serializers.ModelSerializer):
    steps = StudyPlanStepSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    document_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        help_text="List of document IDs to include in the study plan"
    )
    
    class Meta:
        model = StudyPlan
        fields = [
            'id', 'title', 'description', 'daily_study_hours', 'days_until_exam',
            'exam_type', 'additional_context', 'status', 'total_study_hours',
            'exam_date', 'created_at', 'updated_at', 'documents', 'document_ids', 'steps'
        ]
        read_only_fields = ['id', 'total_study_hours', 'exam_date', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        document_ids = validated_data.pop('document_ids', [])
        study_plan = StudyPlan.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        # Add documents to the study plan
        if document_ids:
            documents = Document.objects.filter(
                id__in=document_ids,
                user=self.context['request'].user
            )
            study_plan.documents.set(documents)
        
        return study_plan


class StudyPlanGenerationRequestSerializer(serializers.Serializer):
    """Serializer for study plan generation requests"""
    document_ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="List of document IDs to include in the study plan"
    )
    title = serializers.CharField(
        max_length=255,
        help_text="Title for the study plan"
    )
    description = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Optional description for the study plan"
    )
    daily_study_hours = serializers.FloatField(
        min_value=0.5,
        max_value=16,
        help_text="Hours available for study per day (0.5 to 16)"
    )
    days_until_exam = serializers.IntegerField(
        min_value=1,
        max_value=7,
        help_text="Number of days until the exam (1 to 7 days)"
    )
    exam_type = serializers.ChoiceField(
        choices=StudyPlan.ExamType.choices,
        help_text="Type of exam"
    )
    additional_context = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="Additional context about the exam or study requirements"
    )
    
    def validate_document_ids(self, value):
        if not value:
            raise serializers.ValidationError("At least one document must be selected")
        
        # Check if all documents exist and belong to the user
        user = self.context['request'].user
        existing_docs = Document.objects.filter(
            id__in=value,
            user=user
        ).values_list('id', flat=True)
        
        missing_docs = set(value) - set(existing_docs)
        if missing_docs:
            raise serializers.ValidationError(
                f"Documents with IDs {list(missing_docs)} do not exist or don't belong to you"
            )
        
        return value
    
    def validate(self, data):
        # No validation - allow any study plan configuration
        return data


class StudyPlanUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating study plans"""
    class Meta:
        model = StudyPlan
        fields = ['title', 'description', 'status']
    
    def validate_status(self, value):
        # Add any status transition validation logic here
        return value


class StudyPlanStepUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating study plan steps"""
    class Meta:
        model = StudyPlanStep
        fields = ['is_completed']
    
    def update(self, instance, validated_data):
        if validated_data.get('is_completed') and not instance.is_completed:
            from django.utils import timezone
            instance.completed_at = timezone.now()
        elif not validated_data.get('is_completed', True) and instance.is_completed:
            instance.completed_at = None
        
        return super().update(instance, validated_data)
