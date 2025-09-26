import os
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from datetime import timedelta

class Document(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    filename = models.CharField(max_length=255)
    size = models.FloatField()
    file_type = models.CharField(max_length=10)
    upload_date = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField()
    summary = models.TextField(blank=True, null=True, help_text="AI-generated summary of the document content for quick overview")
    
    # Spaced repetition fields
    next_review_date = models.DateTimeField(null=True, blank=True)
    review_interval_days = models.IntegerField(default=1)
    document_mastery_score = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    class Meta:
        db_table = 'documents'

    def __str__(self):
        name_part = self.filename if self.filename else "Unnamed Document"
        return f"{name_part} uploaded by {self.user.username} on {self.upload_date.strftime('%Y-%m-%d %H:%M')}"


class Quiz(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'easy', _('Easy')
        MEDIUM = 'medium', _('Medium')
        HARD = 'hard', _('Hard')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='quizzes')
    question = models.TextField()
    option1 = models.CharField(max_length=500)
    option2 = models.CharField(max_length=500)
    option3 = models.CharField(max_length=500)
    option4 = models.CharField(max_length=500)
    correct_option_index = models.IntegerField() # Index 0-3 corresponding to options 1-4
    hint = models.TextField(blank=True)
    explanation = models.TextField(blank=True)
    keywords = models.JSONField(default=list) # Store keywords as a JSON list
    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Spaced repetition field
    mastery_score = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)

    class Meta:
        db_table = 'quizzes'
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return f"Quiz question for '{self.document.filename}' (User: {self.user.username})"
    

class UserTokenUsage(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='token_usage')
    tokens_used = models.IntegerField(default=0)
    last_reset = models.DateTimeField(default=timezone.now)
    max_tokens = models.IntegerField(default=25000)  # Default token limit per 24 hours 

    class Meta:
        db_table = 'user_token_usage'

    def __str__(self):
        return f"Token usage for {self.user.username}: {self.tokens_used}/{self.max_tokens}"
    
    def reset_if_needed(self):
        """Reset token count if 24 hours have passed since last reset"""
        now = timezone.now()
        if now - self.last_reset > timedelta(hours=24):
            self.tokens_used = 0
            self.last_reset = now
            self.save()
            return True
        return False
    
    def add_tokens(self, token_count):
        """Add tokens to the usage count and check if limit is exceeded"""
        self.reset_if_needed()
        self.tokens_used += token_count
        self.save()
        return self.tokens_used <= self.max_tokens
    
    def remaining_tokens(self):
        """Get remaining token count"""
        self.reset_if_needed()
        return max(0, self.max_tokens - self.tokens_used)
    
    def has_tokens_available(self, required_tokens=0):
        """Check if user has enough tokens available"""
        self.reset_if_needed()
        return (self.tokens_used + required_tokens) <= self.max_tokens




class QuizSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_sessions')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='quiz_sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.FloatField(null=True, blank=True)
    correct_answers = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)

    class Meta:
        db_table = 'quiz_sessions'

    def __str__(self):
        return f"Quiz Session for {self.document.filename} by {self.user.username} started at {self.started_at}"

class QuizAnswer(models.Model):
    quiz_session = models.ForeignKey(QuizSession, on_delete=models.CASCADE, related_name='answers')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    selected_option_index = models.IntegerField()
    is_correct = models.BooleanField()
    time_taken = models.FloatField(help_text="Time taken to answer in seconds")

    class Meta:
        db_table = 'quiz_answers'

    def __str__(self):
        return f"Answer to {self.quiz.question} in session {self.quiz_session.id}"


class Flashcard(models.Model):
    class Difficulty(models.TextChoices):
        EASY = 'easy', _('Easy')
        MEDIUM = 'medium', _('Medium')
        HARD = 'hard', _('Hard')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcards')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='flashcards')
    front = models.TextField()  # Question or concept
    back = models.TextField()   # Answer or explanation
    hint = models.TextField(blank=True, null=True)
    keywords = models.JSONField(default=list)  # Store keywords as a JSON list
    difficulty = models.CharField(
        max_length=10,
        choices=Difficulty.choices,
        default=Difficulty.MEDIUM,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'flashcards'

    def __str__(self):
        return f"Flashcard for '{self.document.filename}' (User: {self.user.username})"


class FlashcardSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcard_sessions')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='flashcard_sessions')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'flashcard_sessions'

    def __str__(self):
        return f"Flashcard Session for {self.document.filename} by {self.user.username} started at {self.started_at}"


class FlashcardReview(models.Model):
    class Confidence(models.TextChoices):
        LOW = 'low', _('Low')
        MEDIUM = 'medium', _('Medium')
        HIGH = 'high', _('High')
        
    flashcard_session = models.ForeignKey(FlashcardSession, on_delete=models.CASCADE, related_name='reviews')
    flashcard = models.ForeignKey(Flashcard, on_delete=models.CASCADE)
    confidence_level = models.CharField(
        max_length=10,
        choices=Confidence.choices,
        default=Confidence.MEDIUM,
    )
    reviewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'flashcard_reviews'
        
    def __str__(self):
        return f"Review of flashcard {self.flashcard.id} in session {self.flashcard_session.id}"


class Mnemonic(models.Model):
    class MnemonicType(models.TextChoices):
        ACRONYM = 'acronym', _('Acronym')
        ACROSTIC = 'acrostic', _('Acrostic')
        RHYME = 'rhyme', _('Rhyme')
        ASSOCIATION = 'association', _('Association')
        VISUALIZATION = 'visualization', _('Visualization')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mnemonics')
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='mnemonics')
    mnemonic = models.TextField()  # The actual mnemonic phrase
    mnemonic_type = models.CharField(
        max_length=20,
        choices=MnemonicType.choices,
        default=MnemonicType.ACRONYM,
    )
    mnemonic_explanation = models.TextField()  # How the mnemonic helps remember the content
    topic = models.CharField(max_length=255)  # The topic/concept this mnemonic covers
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'mnemonics'
        
    def __str__(self):
        return f"Mnemonic for '{self.topic}' in document '{self.document.filename}' (User: {self.user.username})"


class StudyPlan(models.Model):
    class ExamType(models.TextChoices):
        MULTIPLE_CHOICE = 'multiple_choice', _('Multiple Choice')
        ESSAY = 'essay', _('Essay')
        SHORT_ANSWER = 'short_answer', _('Short Answer')
        PRACTICAL = 'practical', _('Practical')
        MIXED = 'mixed', _('Mixed')
    
    class Status(models.TextChoices):
        ACTIVE = 'active', _('Active')
        COMPLETED = 'completed', _('Completed')
        PAUSED = 'paused', _('Paused')
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_plans')
    documents = models.ManyToManyField(Document, related_name='study_plans')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    # User inputs
    daily_study_hours = models.FloatField()  # Hours per day
    days_until_exam = models.IntegerField()
    exam_type = models.CharField(
        max_length=20,
        choices=ExamType.choices,
        default=ExamType.MIXED,
    )
    additional_context = models.TextField(blank=True, null=True)  # Any additional exam info
    
    # Plan metadata
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    total_study_hours = models.FloatField()  # Calculated total hours
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    exam_date = models.DateField()  # Calculated from days_until_exam
    
    class Meta:
        db_table = 'study_plans'
    
    def save(self, *args, **kwargs):
        if not self.exam_date:
            self.exam_date = timezone.now().date() + timedelta(days=self.days_until_exam)
        if not self.total_study_hours:
            self.total_study_hours = self.daily_study_hours * self.days_until_exam
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Study Plan: {self.title} for {self.user.username}"


class StudyPlanStep(models.Model):
    class StepType(models.TextChoices):
        READING = 'reading', _('Reading')
        VIDEO = 'video', _('Video')
        QUIZ = 'quiz', _('Quiz')
        FLASHCARDS = 'flashcards', _('Flashcards')
        MNEMONICS = 'mnemonics', _('Mnemonics')
        REVIEW = 'review', _('Review')
        PRACTICE = 'practice', _('Practice')
    
    class Priority(models.TextChoices):
        HIGH = 'high', _('High Priority')
        MEDIUM = 'medium', _('Medium Priority')
        LOW = 'low', _('Low Priority')
    
    study_plan = models.ForeignKey(StudyPlan, on_delete=models.CASCADE, related_name='steps')
    day_number = models.IntegerField()  # Day 1, 2, 3, etc.
    step_order = models.IntegerField()  # Order within the day
    
    step_type = models.CharField(
        max_length=15,
        choices=StepType.choices,
        default=StepType.READING,
    )
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    topic = models.CharField(max_length=255)
    estimated_duration = models.FloatField()  # Hours
    
    # Completion tracking
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    # Related objects
    related_document = models.ForeignKey(Document, on_delete=models.CASCADE, null=True, blank=True)
    quiz_url = models.URLField(blank=True, null=True)  # Link to quiz page
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'study_plan_steps'
        ordering = ['day_number', 'step_order']
        unique_together = ['study_plan', 'day_number', 'step_order']
    
    def __str__(self):
        return f"Day {self.day_number} - Step {self.step_order}: {self.title}"


class StudyPlanResource(models.Model):
    class ResourceType(models.TextChoices):
        YOUTUBE = 'youtube', _('YouTube Video')
        ARTICLE = 'article', _('Article')
        BLOG = 'blog', _('Blog Post')
        WEBSITE = 'website', _('Website')
        PDF = 'pdf', _('PDF Document')
        OTHER = 'other', _('Other')
    
    study_plan_step = models.ForeignKey(StudyPlanStep, on_delete=models.CASCADE, related_name='resources')
    resource_type = models.CharField(
        max_length=10,
        choices=ResourceType.choices,
        default=ResourceType.ARTICLE,
    )
    
    title = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField(blank=True, null=True)
    estimated_duration = models.FloatField(null=True, blank=True)  # Hours or minutes
    
    # Additional metadata
    author = models.CharField(max_length=255, blank=True, null=True)
    publication_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'study_plan_resources'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.resource_type.title()}: {self.title}"