from django.urls import path
from .views import (
    DocumentProcessView,
    UserDocumentsListView,
    DocumentDeleteView,
    QuizGenerationView,
    DocumentQuizzesListView,
    UserTokenUsageView,
    QuizSubmissionView,
    QuizHistoryListView,
    QuizHistoryDetailView,
    FlashcardGenerationView,
    DocumentFlashcardsListView,
    FlashcardReviewView,
    MnemonicGenerationView,
    DocumentMnemonicsListView,
    MnemonicDocumentsListView,
    ReviewDocumentsTodayView,
    ReviewDocumentsByDateView,
    ReviewDocumentsDateRangeView,
    ReviewCalendarView,
    # Study Planner Views
    StudyPlanListCreateView,
    StudyPlanDetailView,
    StudyPlanGenerateView,
    StudyPlanStepUpdateView,
    StudyPlanProgressView,
    StudyPlanStepsView,
)

urlpatterns = [

    # User endpoints
    path("token-usage/", UserTokenUsageView.as_view(), name="token-usage"),
    
    # Document endpoints
    path("documents/process/", DocumentProcessView.as_view(), name="process-document"),
    path("documents/", UserDocumentsListView.as_view(), name="get-documents"),
    path("documents/delete/<int:id>/", DocumentDeleteView.as_view(),name="delete-document"),

    # Quiz endpoints
    path("generate-quiz/", QuizGenerationView.as_view(), name="generate-quiz"),
    path("quizzes/<int:document_id>/", DocumentQuizzesListView.as_view(),name="get-quizzes"),
    path("quiz/submit/", QuizSubmissionView.as_view(), name="quiz-submit"),

    # Quiz history endpoints
    path("quiz/history/", QuizHistoryListView.as_view(), name="quiz-history-list"),
    path("quiz/history/<int:session_id>/", QuizHistoryDetailView.as_view(), name="quiz-history-detail"),
    
    # Flashcard endpoints
    path("generate-flashcards/", FlashcardGenerationView.as_view(), name="generate-flashcards"),
    path("flashcards/<int:document_id>/", DocumentFlashcardsListView.as_view(), name="get-flashcards"),
    path("flashcards/submit-review/", FlashcardReviewView.as_view(), name="flashcard-review-submit"),

    # Mnemonic endpoints
    path("generate-mnemonic/", MnemonicGenerationView.as_view(), name="generate-mnemonic"),
    path("get-mnemonics/<int:document_id>/", DocumentMnemonicsListView.as_view(), name="get-mnemonics"),
    path("mnemonic-documents/", MnemonicDocumentsListView.as_view(), name="mnemonic-documents"),

    # Review endpoints
    path("review/today/", ReviewDocumentsTodayView.as_view(), name="review-today"),
    path("review/date/", ReviewDocumentsByDateView.as_view(), name="review-by-date"),
    path("review/date-range/", ReviewDocumentsDateRangeView.as_view(), name="review-date-range"),
    path("review/calendar/", ReviewCalendarView.as_view(), name="review-calendar"),

    # Study Planner endpoints
    path("study-plans/", StudyPlanListCreateView.as_view(), name="study-plans"),
    path("study-plans/<int:pk>/", StudyPlanDetailView.as_view(), name="study-plan-detail"),
    path("study-plans/generate/", StudyPlanGenerateView.as_view(), name="study-plan-generate"),
    path("study-plans/<int:pk>/progress/", StudyPlanProgressView.as_view(), name="study-plan-progress"),
    path("study-plans/<int:pk>/steps/", StudyPlanStepsView.as_view(), name="study-plan-steps"),
    path("study-plan-steps/<int:pk>/update/", StudyPlanStepUpdateView.as_view(), name="study-plan-step-update"),
]
