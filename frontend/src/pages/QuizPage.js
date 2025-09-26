import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaArrowLeft, 
  FaArrowRight, 
  FaSave, 
  FaRedo, 
  FaInfoCircle,
  FaPaperPlane,
  FaLightbulb 
} from 'react-icons/fa';
import apiService from '../utils/apiService';
import { PrimaryButton, SecondaryButton } from '../components/shared/Button';
import Typography from '../components/shared/Typography';

// Update the CSS variables to dark mode theme
const cssVariables = {
  '--bg-primary': '#1e293b', // Dark blue background
  '--bg-card': '#111827', // Darker card background
  '--text-primary': '#f1f5f9', // Light text
  '--text-secondary': '#cbd5e1', // Secondary text
  '--primary-color': '#6366f1', // Indigo
  '--primary-hover': '#4f46e5', // Darker indigo
  '--primary-rgb': '99, 102, 241',
  '--success-color': '#10b981', // Green
  '--success-rgb': '16, 185, 129',
  '--error-color': '#ef4444', // Red
  '--error-rgb': '239, 68, 68',
  '--border-color': '#334155', // Dark border
  '--border-focus': '#6366f1', // Indigo focus
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  '--rounded-sm': '0.25rem',
  '--rounded-md': '0.375rem',
  '--rounded-lg': '0.5rem',
  '--rounded-xl': '0.75rem',
  '--rounded-full': '9999px'
};

const QuizPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  
  // Time tracking for individual questions
  const [questionStartTimes, setQuestionStartTimes] = useState({});
  const [questionTimeTaken, setQuestionTimeTaken] = useState({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Animate the analyzing progress
  useEffect(() => {
    if (!showAnalyzing) return;
    
    const progressSteps = [
      { step: 0, delay: 0 },
      { step: 1, delay: 3000 },
      { step: 2, delay: 5000 },
      { step: 3, delay: 7000 }
    ];
    
    progressSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        if (showAnalyzing) {
          setAnalysisProgress(step);
        }
      }, delay);
    });
  }, [showAnalyzing]);
  
  // Load quiz data with optimizations
  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Extract document ID from the URL
        // const quizId = new URLSearchParams(window.location.search).get('quizId');
        
        // Ensure documentId is a number if it's stored as a string
        const docId = parseInt(documentId, 10) || documentId;
        
        // Use the getDocumentQuizzes API with document ID
        const response = (await apiService.getDocumentQuizzes(docId)).data;
        
        if (!response || !Array.isArray(response)) {
          console.error('Invalid quiz data format:', response);
          setError('The quiz data is not in the expected format. Please try again.');
          setLoading(false);
          return;
        }
        
        // OPTIMIZATION: Batch process questions instead of all at once
        // Process questions in batches to improve rendering performance
        const formattedQuestions = [];
        const batchSize = 5; // Process 5 questions at a time
        
        for (let i = 0; i < response.length; i += batchSize) {
          const batch = response.slice(i, i + batchSize);
          
          // Format each question in the batch
          const formattedBatch = batch.map(question => ({
            id: question.id || Math.random().toString(36).substr(2, 9),
            question: question.question, // Using question instead of text to match API response
            options: Array.isArray(question.options) ? question.options : [],
            correctAnswer: question.correct_option_index !== undefined ? 
              question.correct_option_index.toString() : 
              String(question.correct_option_index),
            hint: question.hint || question.hint_text || '', // Accept hint or hint_text field
            explanation: question.explanation || question.explanation_text || '' // Accept explanation or explanation_text field
          }));
          
          // Add the formatted batch to the questions array
          formattedQuestions.push(...formattedBatch);
          
          // If this is the first batch, set an initial quiz state to show something to the user quickly
          if (i === 0) {
            setQuiz(prevQuiz => {
              if (!prevQuiz) {
                return {
                  id:docId,
                  documentId: docId,
                  title: `Quiz for Document #${docId}`,
                  questions: formattedBatch,
                  timeLimit: 1200,
                  isPartiallyLoaded: true
                };
              }
              return prevQuiz;
            });
            
            // Show user we're loading more questions
            setLoading(prevLoading => ({
              ...prevLoading,
              isPartiallyLoaded: true,
              loadedCount: formattedBatch.length,
              totalCount: response.length
            }));
          }
          
          // Small delay to prevent UI freezing during large quiz processing
          if (response.length > 20) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        if (formattedQuestions.length === 0) {
          setError('No questions were found for this quiz.');
          setLoading(false);
          return;
        }
        
        console.log('Successfully loaded quiz with', formattedQuestions.length, 'questions');
        
        // Set up the complete quiz with all formatted questions
        setQuiz({
          id: docId,
          documentId: docId,
          title: `Quiz for Document #${docId}`,
          questions: formattedQuestions,
          timeLimit: 1200, // Default 20 minutes in seconds
          isPartiallyLoaded: false
        });
        
        // Initialize timeLeft with the quiz time limit
        setTimeLeft(1200);
        
        // Try to load any saved progress - this code remains mostly the same
        try {
          const savedProgress = localStorage.getItem(`quiz_progress_${docId}`);
          if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            
            if (progress.selectedAnswers) {
              setSelectedAnswers(progress.selectedAnswers);
            }
            
            if (progress.currentQuestionIndex !== undefined) {
              setCurrentQuestionIndex(progress.currentQuestionIndex);
            }
            
            if (progress.timeLeft && !progress.quizSubmitted) {
              setTimeLeft(progress.timeLeft);
            }
            
            console.log('Loaded saved quiz progress:', progress);
          }
        } catch (progressError) {
          console.error('Error loading saved progress:', progressError);
          // Non-critical error, continue without saved progress
        }
        
      } catch (err) {
        console.error('Error loading quiz:', err);
        
        // Handle different error cases appropriately
        if (err.response && err.response.status === 404) {
          setError('Quiz not found. The document might not have any quizzes generated yet.');
        } else if (err.response && err.response.status === 403) {
          setError('You do not have permission to access this quiz.');
        } else if (err.message && err.message.includes('Network Error')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError('An error occurred while loading the quiz: ' + (err.message || 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (documentId) {
      loadQuiz();
    }
  }, [documentId]);
  
  // Timer
  useEffect(() => {
    if (!quiz || quizSubmitted || loading) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quiz, quizSubmitted, loading]);
  
  // Track timing for each question
  useEffect(() => {
    if (!quiz || quizSubmitted || loading) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Start timing for current question if not already started
    if (!questionStartTimes[currentQuestion.id]) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [currentQuestion.id]: Date.now()
      }));
    }
    
  }, [quiz, currentQuestionIndex, quizSubmitted, loading, questionStartTimes]);
  
  // Save local progress to localStorage
  useEffect(() => {
    if (!quiz || quizSubmitted || loading) return;
    
    // Save current state to localStorage
    const saveLocalProgress = () => {
      try {
        setSaving(true); // Show saving indicator
        localStorage.setItem(`quiz_progress_${documentId}`, JSON.stringify({
          selectedAnswers,
          currentQuestionIndex,
          timeLeft,
          quizSubmitted
        }));
        // Hide saving indicator after a short delay
        setTimeout(() => setSaving(false), 1000);
      } catch (error) {
        console.error('Failed to save local progress:', error);
        setSaving(false);
      }
    };
    
    // Save every 10 seconds
    const saveTimer = setInterval(saveLocalProgress, 10000);
    
    // Also save when answers change
    const answerChangeTimer = setTimeout(saveLocalProgress, 1500);
    
    return () => {
      clearInterval(saveTimer);
      clearTimeout(answerChangeTimer);
    };
  }, [quiz, selectedAnswers, currentQuestionIndex, timeLeft, quizSubmitted, loading, documentId]);
  
  const handleAnswerSelect = (questionId, optionId) => {
    // Calculate time taken for this question
    const startTime = questionStartTimes[questionId];
    if (startTime && !questionTimeTaken[questionId]) {
      const timeTaken = Math.round((Date.now() - startTime) / 1000); // Convert to seconds
      setQuestionTimeTaken(prev => ({
        ...prev,
        [questionId]: timeTaken
      }));
    }
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const calculateResults = () => {
    let correctCount = 0;
    const questionResults = {};
    
    // Log all answers for debugging
    console.log('Selected answers:', selectedAnswers);
    console.log('Quiz questions:', quiz.questions);
    
    quiz.questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correctAnswer;
      
      // Log each question's evaluation
      console.log(`Question ID: ${question.id}, User answer: ${userAnswer}, Correct answer: ${correctAnswer}`);
      
      // Count as correct only if user answered and the answer matches the correct answer
      const isCorrect = userAnswer !== undefined && userAnswer === correctAnswer;
      
      if (isCorrect) {
        correctCount++;
        console.log(`✓ Question ${question.id} answered correctly`);
      } else {
        console.log(`✗ Question ${question.id} answered incorrectly or not answered`);
      }
      
      questionResults[question.id] = {
        userAnswer,
        correctAnswer,
        isCorrect
      };
    });
    
    const totalQuestions = quiz.questions.length;
    // Calculate actual score percentage based on correct answers
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    console.log(`SCORE CALCULATION: ${correctCount} correct out of ${totalQuestions}, score: ${score}%`);
    
    // Return the results object with calculated score
    return {
      score,
      correctCount,
      totalQuestions,
      questionResults,
      timeTaken: quiz.timeLimit - timeLeft
    };
  };
  
  const handleSubmitQuiz = async () => {
    if (quizSubmitted || submitting) return;
    
    setSubmitting(true);
    setShowAnalyzing(true);

    try {
      // Show analyzing screen for 12-15 seconds (fake AI analysis)
      const analyzingDelay = 12000 + Math.random() * 3000; // 12-15 seconds
      
      // Calculate results locally while showing analyzing screen
      const quizResults = calculateResults();
      
      // Wait for the analyzing animation to complete
      setTimeout(async () => {
        try {
          setResults(quizResults);
          setQuizSubmitted(true);
          setShowAnalyzing(false);

          // Format the quiz answers according to the API documentation, including time_taken
          const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, answerIndex]) => {
            const timeTaken = questionTimeTaken[questionId] || 0; // Default to 0 if no time recorded
            return {
              quiz_id: parseInt(questionId, 10) || questionId,
              selected_option_index: parseInt(answerIndex, 10),
              time_taken: timeTaken
            };
          });
          
          // Submit quiz answers to get validation and official results
          try {
            console.log('Submitting quiz answers:', {
              document_id: documentId,
              answers: formattedAnswers
            });
            console.log('Selected answers object:', selectedAnswers);
            console.log('Question time taken object:', questionTimeTaken);
            
            const submitResponse = await apiService.submitQuizAnswers(
              documentId,
              formattedAnswers
            );
            
            console.log('Quiz submission response:', submitResponse);
            
            // FIXED: ALWAYS use our locally calculated score since the server score is incorrect
            console.log('Using locally calculated score:', quizResults.score);
            
            // Now save the attempt to quiz history
            const attemptData = {
              document_id: parseInt(documentId, 10),
              quiz_id: quiz.id,
              quiz_title: quiz.title || `Quiz for Document #${documentId}`,
              // Use our locally calculated score (divided by 100 to convert to 0-1 range)
              score: Math.min(Math.max(quizResults.score / 100, 0), 1),
              correct_answers: quizResults.correctCount,
              total_questions: quizResults.totalQuestions,
              // Ensure time_spent is a reasonable value (limit to the quiz time limit)
              time_spent: Math.min(quizResults.timeTaken, quiz.timeLimit || 3600),
              date: new Date().toISOString(),
              answers: formattedAnswers
            };
            
            console.log('Saving quiz attempt:', attemptData);
            const saveResponse = await apiService.saveQuizAttempt(attemptData);
            if (saveResponse) {
              console.log('Quiz attempt saved successfully:', saveResponse);
            } else {
              console.log('Quiz attempt could not be saved, but will continue showing results');
            }
            
          } catch (error) {
            console.error('Error submitting quiz:', error);
            
            // Even if submission fails, try to save the attempt
            const fallbackAttemptData = {
              document_id: parseInt(documentId, 10),
              quiz_id: parseInt(quiz.id, 10) || quiz.id,
              quiz_title: quiz.title || `Quiz for Document #${documentId}`,
              // Ensure score is between 0-1
              score: Math.min(Math.max(quizResults.score / 100, 0), 1),
              correct_answers: quizResults.correctCount,
              total_questions: quizResults.totalQuestions,
              // Limit time spent to quiz time limit
              time_spent: Math.min(quizResults.timeTaken, quiz.timeLimit || 3600),
              date: new Date().toISOString()
            };
            
            try {
              console.log('Saving fallback quiz attempt:', fallbackAttemptData);
              await apiService.saveQuizAttempt(fallbackAttemptData);
            } catch (saveError) {
              console.error('Error saving quiz attempt:', saveError);
            }
          }
          
        } catch (error) {
          console.error('Error in quiz submission process:', error);
          setShowAnalyzing(false);
          setSubmitting(false);
        } finally {
          setSubmitting(false);
        }
      }, analyzingDelay);
        
    } catch (error) {
      console.error('Error handling quiz completion:', error);
      setShowAnalyzing(false);
      setSubmitting(false);
    } finally {
      // Clear saved progress from localStorage
      localStorage.removeItem(`quiz_progress_${documentId}`);
    }
  };
  
  const handleRetakeQuiz = () => {
    // Store quiz performance data in localStorage
    const retakeData = {
      quizId: quiz.id,
      title: quiz.title,
      previousScore: results.score,
      originalQuestions: quiz.questions, // Pass the original questions
      previousAnswers: Object.keys(results.questionResults).map(questionId => {
        const result = results.questionResults[questionId];
        return {
          questionId,
          correct: result.isCorrect,
          userAnswer: result.userAnswer,
        };
      }),
      timestamp: Date.now()
    };
    
    localStorage.setItem('activeRecallRetake', JSON.stringify(retakeData));
    
    // Navigate to Active Recall page which will detect the retake data
    navigate('/active-recall');
  };
  
  const handleFinishQuiz = () => {
    navigate('/quiz-history');
  };
  
  const getPersonalizedExplanation = (question, userAnswer) => {
    // Handle case where user didn't answer the question
    if (userAnswer === undefined || userAnswer === null || userAnswer === '') {
      return 'You did not answer this question. The correct answer and explanation are provided above for your reference.';
    }
    
    try {
      // Parse the explanation as JSON
      const explanations = typeof question.explanation === 'string' 
        ? JSON.parse(question.explanation) 
        : question.explanation;
      
      if (typeof explanations === 'object' && explanations !== null) {
        // Convert userAnswer index to option letter (0 -> A, 1 -> B, etc.)
        const optionLetter = String.fromCharCode(65 + parseInt(userAnswer));
        
        // Try to get explanation by option letter first, then by index
        const personalizedExplanation = explanations[optionLetter] || 
                                      explanations[userAnswer] || 
                                      explanations[parseInt(userAnswer)];
        
        if (personalizedExplanation) {
          return personalizedExplanation;
        }
      }
    } catch (error) {
      console.warn('Failed to parse explanation as JSON, using fallback:', error);
    }
    
    // Fallback to original explanation if parsing fails or no personalized explanation found
    if (question.explanation && typeof question.explanation === 'string' && question.explanation.trim()) {
      return question.explanation;
    }
    
    // Ultimate fallback
    return 'Explanation not available for this question.';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (loading) {
    return (
      <Container>
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading quiz questions...</p>
        </div>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <div className="error-message">
          <FaTimesCircle />
          <h2>Error Loading Quiz</h2>
          <p>{error}</p>
          <SecondaryButton secondary onClick={() => navigate('/file-upload')}>
            Go Back to Upload
          </SecondaryButton>
        </div>
      </Container>
    );
  }
  
  if (!quiz) return null;
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const quizProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <Container className="quiz-container">
      {showAnalyzing ? (
        <AnalyzingContainer>
          <AnalyzingAnimation>
            <div className="spinner-container">
              <div className="analyzing-spinner"></div>
              <div className="analyzing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="analyzing-text">
              <h2>Analyzing Your Answers...</h2>
              <p>Our AI is carefully reviewing each of your responses to provide personalized feedback tailored to your specific choices</p>
              <div className="progress-indicators">
                <div className={`indicator ${analysisProgress >= 1 ? 'active' : ''}`}>📊 Processing your responses</div>
                <div className={`indicator ${analysisProgress >= 2 ? 'active' : ''}`}>🧠 Analyzing answer patterns</div>
                <div className={`indicator ${analysisProgress >= 3 ? 'active' : ''}`}>💡 Crafting personalized feedback</div>
              </div>
            </div>
          </AnalyzingAnimation>
        </AnalyzingContainer>
      ) : !quizSubmitted ? (
        <QuizContainer>
          <QuizHeader>
            <div className="quiz-info">
              <h1>{quiz.title}</h1>
            </div>
            
            <div className="quiz-timer">
              <FaClock />
              <span className={timeLeft < 60 ? 'time-warning' : ''}>{formatTime(timeLeft)}</span>
            </div>
          </QuizHeader>
          
          <QuizProgress>
            <div className="progress-text">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${quizProgress}%` }}
              ></div>
            </div>
          </QuizProgress>
          
          <QuestionCard>
            <QuestionText>
              <span className="question-number">Q{currentQuestionIndex + 1}.</span>
              <span className="question-content">{currentQuestion.question}</span>
            </QuestionText>
            
            <HintButton onClick={() => setShowHint(!showHint)}>
              <FaLightbulb />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </HintButton>
            
            {showHint && (
              <HintContent>
                <FaLightbulb />
                <p>{currentQuestion.hint || "No hint available for this question. Try thinking about related concepts covered in your materials."}</p>
              </HintContent>
            )}
            
            <OptionsForm>
              {currentQuestion.options.map((optionText, index) => (
                <OptionItem 
                  key={index}
                  isSelected={selectedAnswers[currentQuestion.id] === index.toString()}
                  isCorrect={quizSubmitted && currentQuestion.correctAnswer === index.toString()}
                  isWrong={quizSubmitted && selectedAnswers[currentQuestion.id] === index.toString() && selectedAnswers[currentQuestion.id] !== currentQuestion.correctAnswer}
                  isDisabled={quizSubmitted}
                  onClick={() => !quizSubmitted && handleAnswerSelect(currentQuestion.id, index.toString())}
                >
                  <div className="option-selector">
                    {selectedAnswers[currentQuestion.id] === index.toString() ? 
                      <div className="selected-dot"></div> : null}
                  </div>
                  <div className="option-text">{optionText}</div>
                </OptionItem>
              ))}
            </OptionsForm>
          </QuestionCard>
          
          <NavigationFooter>
            <div>
              <SecondaryButton 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <FaArrowLeft /> Previous
              </SecondaryButton>
            </div>
            
            <div className="center">
              {saving && <span className="saving-indicator"><FaInfoCircle /> Saving progress...</span>}
            </div>
            
            <div className="right-buttons">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <PrimaryButton 
                  onClick={handleNextQuestion}
                  iconRight
                >
                  Next <FaArrowRight />
                </PrimaryButton>
              ) : (
                <PrimaryButton 
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  iconRight
                >
                  {submitting ? 'Submitting...' : 'Submit Quiz'} <FaCheckCircle />
                </PrimaryButton>
              )}
            </div>
          </NavigationFooter>
          
          <QuizNavigation>
            <h3>Question Navigation</h3>
            <QuestionBubbles>
              {quiz.questions.map((q, index) => (
                <QuestionBubble 
                  key={q.id}
                  active={index === currentQuestionIndex}
                  answered={selectedAnswers[q.id] !== undefined}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </QuestionBubble>
              ))}
            </QuestionBubbles>
          </QuizNavigation>
        </QuizContainer>
      ) : (
        <ResultsContainer>
          <ResultsHeader>
            <h1>Quiz Results</h1>
            <p>You've completed the quiz!</p>
          </ResultsHeader>
          
          <ResultsSummary>
            <ScoreCard>
              <div className="score-circle">
                <div className="score-number">{results.score}%</div>
              </div>
              <div className="score-details">
                <p><strong>Score:</strong> {results.score}%</p>
                <p><strong>Correct Answers:</strong> {results.correctCount} out of {results.totalQuestions}</p>
                <p><strong>Questions Answered:</strong> {Object.keys(selectedAnswers).length} out of {quiz.questions.length}</p>
                {Object.keys(selectedAnswers).length < quiz.questions.length && (
                  <p><strong>Questions Skipped:</strong> {quiz.questions.length - Object.keys(selectedAnswers).length}</p>
                )}
                <p><strong>Time Taken:</strong> {formatTime(results.timeTaken)}</p>
              </div>
            </ScoreCard>
            
            <ResultsActions>
              <SecondaryButton onClick={handleRetakeQuiz}>
                <FaRedo /> Retake Quiz
              </SecondaryButton>
              <PrimaryButton onClick={handleFinishQuiz}>
                <FaSave /> Finish & View History
              </PrimaryButton>
            </ResultsActions>
          </ResultsSummary>
          
          <QuestionReview>
            <h2>Question Review</h2>
            
            {quiz.questions.map((question, index) => {
              const questionResult = results.questionResults[question.id];
              const isAnswered = questionResult && questionResult.userAnswer !== undefined;
              const isCorrect = questionResult && questionResult.isCorrect;
              const isSkipped = !isAnswered;
              
              return (
                <ReviewCard key={question.id} correct={isCorrect} skipped={isSkipped}>
                  <div className="review-header">
                    <span className="question-number">Question {index + 1}</span>
                    {isSkipped ? (
                      <span className="result-badge skipped">
                        <FaInfoCircle /> Skipped
                      </span>
                    ) : isCorrect ? (
                      <span className="result-badge correct">
                        <FaCheckCircle /> Correct
                      </span>
                    ) : (
                      <span className="result-badge incorrect">
                        <FaTimesCircle /> Incorrect
                      </span>
                    )}
                  </div>
                  
                  <div className="question-content">
                    <p className="question-text">{question.question}</p>
                    
                    <div className="options-review">
                      {question.options.map((optionText, optionIndex) => (
                        <div 
                          key={optionIndex} 
                          className={`
                            option-review 
                            ${questionResult && questionResult.userAnswer === optionIndex.toString() ? 'user-selected' : ''} 
                            ${question.correctAnswer === optionIndex.toString() ? 'correct-answer' : ''}
                          `}
                        >
                          <div className="option-indicator">
                            {questionResult && questionResult.userAnswer === optionIndex.toString() && (
                              <span className="user-indicator">Your Answer</span>
                            )}
                            {question.correctAnswer === optionIndex.toString() && (
                              <span className="correct-indicator">Correct Answer</span>
                            )}
                          </div>
                          <p>{optionText}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="explanation">
                      <h4>Personalized Feedback:</h4>
                      <p>{getPersonalizedExplanation(question, questionResult ? questionResult.userAnswer : undefined)}</p>
                    </div>
                  </div>
                </ReviewCard>
              );
            })}
          </QuestionReview>
          
          <div className="back-to-dashboard">
            <SecondaryButton onClick={() => navigate('/dashboard')}>
              <FaArrowLeft /> Back to Dashboard
            </SecondaryButton>
          </div>
        </ResultsContainer>
      )}
    </Container>
  );
};

// Enhanced Container component - Full Screen
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(30, 41, 59, 0.98) 100%);
  color: white !important;
  position: relative;
  overflow-x: hidden;
  
  /* Apply CSS variables */
  ${Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n')}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: white !important;
    
    .spinner {
      width: 80px;
      height: 80px;
      border: 8px solid rgba(var(--primary-rgb), 0.2);
      border-top: 8px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 2rem;
      box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.4);
    }
    
    p {
      font-size: 1.25rem;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  .error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    padding: 3rem;
    background: linear-gradient(145deg, rgba(var(--error-rgb), 0.15) 0%, rgba(var(--error-rgb), 0.08) 100%);
    border-radius: 20px;
    color: var(--error-color);
    border: 1px solid rgba(var(--error-rgb), 0.2);
    box-shadow: 0 8px 32px rgba(var(--error-rgb), 0.2);
    backdrop-filter: blur(10px);
    margin: 2rem;
    
    svg {
      font-size: 5rem;
      margin-bottom: 2rem;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }
    
    h2 {
      margin-bottom: 1.5rem;
      color: white !important;
      font-size: 2rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
      max-width: 600px;
    }
    
    button {
      margin-top: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    .error-message {
      margin: 1rem;
      padding: 2rem;
      
      svg {
        font-size: 4rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
      
      p {
        font-size: 1.125rem;
      }
    }
  }
  
  @media (max-width: 480px) {
    .loader {
      .spinner {
        width: 60px;
        height: 60px;
        border-width: 6px;
      }
      
      p {
        font-size: 1.125rem;
      }
    }
    
    .error-message {
      padding: 1.5rem;
      
      svg {
        font-size: 3rem;
      }
      
      h2 {
        font-size: 1.25rem;
      }
      
      p {
        font-size: 1rem;
      }
    }
  }
`;

// Enhanced QuizContainer for full screen
const QuizContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "header header"
    "progress progress"
    "question navigation"
    "footer footer";
  gap: 2rem;
  height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 250px;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "progress"
      "question"
      "navigation"
      "footer";
    gap: 1.2rem;
    padding: 1rem;
    height: auto;
    min-height: 100vh;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    padding: 0.75rem;
  }
`;

// Update QuizHeader for dark mode
const QuizHeader = styled.div`
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);    .quiz-info {
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: white !important;
      }
    }
  
  .quiz-timer {
    display: flex;
    align-items: center;
    background: rgba(var(--primary-rgb), 0.1);
    padding: 0.75rem 1rem;
    border-radius: var(--rounded-md);
    border: 1px solid rgba(var(--primary-rgb), 0.2);
    
    svg {
      margin-right: 0.5rem;
      color: var(--primary-color);
    }
    
    span {
      font-size: 1.125rem;
      font-weight: 600;
      color: white !important;
      
      &.time-warning {
        color: var(--error-color);
        animation: pulse 1s infinite;
      }
      
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    .quiz-timer {
      align-self: flex-start;
    }
  }
`;

// Enhanced QuestionCard component
const QuestionCard = styled.div`
  grid-area: question;
  background: linear-gradient(145deg, var(--bg-card) 0%, rgba(17, 24, 39, 0.95) 100%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 2.5rem;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
    border-radius: 20px;
    pointer-events: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// Enhanced QuizProgress component
const QuizProgress = styled.div`
  grid-area: progress;
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: white !important;
    margin-bottom: 0.75rem;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .progress-bar {
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--rounded-full);
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-color) 0%, #8B5CF6 100%);
      border-radius: var(--rounded-full);
      transition: width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        from { transform: translateX(-100%); }
        to { transform: translateX(100%); }
      }
    }
  }
`;

// Replace the QuestionText component
const QuestionText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  color: white !important;
  
  .question-number {
    font-weight: 700;
    margin-right: 12px;
    color: var(--primary-color);
  }
  
  .question-content {
    display: inline;
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
`;

// Replace the HintButton component
const HintButton = styled.button`
  align-self: flex-end;
  background: rgba(var(--primary-rgb), 0.1);
  border: none;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--rounded-full);
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  
  &:hover {
    background: rgba(var(--primary-rgb), 0.15);
  }
  
  svg {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    
    svg {
      font-size: 1rem;
    }
  }
`;

// Update HintContent for dark mode
const HintContent = styled.div`
  background: rgba(var(--primary-rgb), 0.12);
  border-left: 3px solid var(--primary-color);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border-radius: var(--rounded-md);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  svg {
    color: var(--primary-color);
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    color: white !important;
    line-height: 1.5;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
    
    svg {
      font-size: 1.125rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.6rem;
    
    svg {
      font-size: 1rem;
    }
  }
`;

// Replace the OptionsForm component
const OptionsForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 0.875rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

// Update OptionItem for better contrast in dark mode
const OptionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: ${props => 
    props.isSelected 
      ? 'rgba(var(--primary-rgb), 0.15)'
      : 'var(--bg-card)'
  };
  border: 2px solid ${props => 
    props.isSelected 
      ? 'var(--primary-color)' 
      : props.isCorrect && props.isDisabled
        ? 'var(--success-color)' 
        : props.isWrong && props.isDisabled
          ? 'var(--error-color)' 
          : 'var(--border-color)'
  };
  border-radius: var(--rounded-lg);
  cursor: ${props => props.isDisabled ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
  box-shadow: ${props => 
    props.isSelected ? 'var(--shadow-md)' : 'none'};
  
  ${props => props.isDisabled && `
    opacity: ${props.isSelected || props.isCorrect ? 1 : 0.7};
  `}
  
  &:hover {
    ${props => !props.isDisabled && `
      border-color: var(--primary-color);
      box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
      transform: translateY(-2px);
      background-color: rgba(var(--primary-rgb), 0.1);
    `}
  }
  
  ${props => props.isCorrect && props.isDisabled && `
    background: rgba(var(--success-rgb), 0.15);
  `}
  
  ${props => props.isWrong && props.isDisabled && `
    background: rgba(var(--error-rgb), 0.15);
  `}
  
  .option-selector {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid ${props => props.isSelected ? 'var(--primary-color)' : 'var(--border-color)'};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    background-color: ${props => props.isSelected ? 'rgba(var(--primary-rgb), 0.2)' : 'transparent'};
    
    .selected-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--primary-color);
    }
  }
  
  .option-text {
    flex: 1;
    font-size: 1rem;
    line-height: 1.5;
    color: white !important;
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.125rem;
    gap: 0.8rem;
    
    .option-selector {
      width: 22px;
      height: 22px;
      
      .selected-dot {
        width: 10px;
        height: 10px;
      }
    }
    
    .option-text {
      font-size: 0.95rem;
      line-height: 1.4;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    gap: 0.6rem;
    border-radius: var(--rounded-md);
    
    .option-selector {
      width: 20px;
      height: 20px;
      margin-top: 1px;
      
      .selected-dot {
        width: 9px;
        height: 9px;
      }
    }
    
    .option-text {
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
`;

// Update NavigationFooter for dark mode
const NavigationFooter = styled.div`
  grid-area: footer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  background: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  
  .center {
    color: white !important;
    font-size: 0.9rem;
  }
  
  .saving-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: var(--primary-color);
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    
    div {
      width: 100%;
    }
    
    button {
      width: 100%;
      justify-content: center;
    }
    
    .center {
      order: -1;
      text-align: center;
      margin-bottom: 0.5rem;
    }
  }
`;

// Update QuizNavigation for dark mode
const QuizNavigation = styled.div`
  grid-area: navigation;
  background: var(--bg-card);
  border-radius: var(--rounded-lg);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  
  h3 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: white !important;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// Update QuestionBubble for dark mode
const QuestionBubble = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background: ${props => 
    props.active 
      ? 'var(--primary-color)' 
      : props.answered 
        ? 'rgba(var(--primary-rgb), 0.15)' 
        : 'rgba(255, 255, 255, 0.05)'};
  
  color: ${props => 
    props.active 
      ? 'white' 
      : props.answered 
        ? 'var(--primary-color)' 
        : 'white !important'};
  
  border: 2px solid ${props => 
    props.active 
      ? 'var(--primary-color)' 
      : props.answered 
        ? 'var(--primary-color)' 
        : 'var(--border-color)'};
  
  &:hover {
    transform: ${props => props.active ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.active ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
    background: ${props => 
      props.active 
        ? 'var(--primary-color)' 
        : 'rgba(var(--primary-rgb), 0.2)'};
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  height: 100vh;
  padding: 3rem;
  box-sizing: border-box;
  overflow-y: auto;
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(17, 24, 39, 0.95) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  .back-to-dashboard {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    padding-bottom: 2rem;
  }
  
  @media (max-width: 1200px) {
    padding: 2.5rem;
    gap: 2.5rem;
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    gap: 2rem;
    height: auto;
    min-height: 100vh;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

const ResultsHeader = styled.div`
  text-align: center;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  padding: 3rem 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
    border-radius: 20px;
    pointer-events: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: white !important;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: white !important;
    font-size: 1.25rem;
    opacity: 0.9;
    font-weight: 500;
  }
  
  @media (max-width: 1200px) {
    padding: 2.5rem 1.5rem;
    
    h1 {
      font-size: 2.5rem;
    }
    
    p {
      font-size: 1.125rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    
    h1 {
      font-size: 1.75rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
`;

const ResultsSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const ScoreCard = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem 2rem;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 3rem;
  backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
    border-radius: 20px;
    pointer-events: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  .score-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(var(--primary-rgb), 0.2) 0%, rgba(var(--primary-rgb), 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 6px solid var(--primary-color);
    box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.3);
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, var(--primary-color), #8B5CF6);
      border-radius: 50%;
      z-index: -1;
      opacity: 0.3;
    }
    
    .score-number {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary-color) 0%, #8B5CF6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
  
  .score-details {
    flex: 1;
    
    p {
      margin-bottom: 1rem;
      font-size: 1.25rem;
      color: white !important;
      font-weight: 500;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      strong {
        font-weight: 700;
        color: white !important;
        margin-right: 0.75rem;
        background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
  
  @media (max-width: 1200px) {
    padding: 2.5rem 1.5rem;
    gap: 2rem;
    
    .score-circle {
      width: 130px;
      height: 130px;
      
      .score-number {
        font-size: 2.25rem;
      }
    }
    
    .score-details p {
      font-size: 1.125rem;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem 1.5rem;
    
    .score-circle {
      width: 120px;
      height: 120px;
      
      .score-number {
        font-size: 2rem;
      }
    }
    
    .score-details p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    gap: 1.5rem;
    
    .score-circle {
      width: 100px;
      height: 100px;
      
      .score-number {
        font-size: 1.75rem;
      }
    }
    
    .score-details p {
      font-size: 0.95rem;
    }
  }
`;

const ResultsActions = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
  
  button {
    min-width: 200px;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 600;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    
    button {
      width: 100%;
      min-width: unset;
    }
  }
  
  @media (max-width: 480px) {
    button {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }
  }
`;

const QuestionReview = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at bottom left, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
    border-radius: 20px;
    pointer-events: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: white !important;
    font-weight: 700;
    text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 1200px) {
    padding: 2rem;
    
    h2 {
      font-size: 1.75rem;
      margin-bottom: 1.75rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    
    h2 {
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
  }
`;

const ReviewCard = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  overflow: hidden;
  backdrop-filter: blur(10px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.correct 
      ? 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
      : 'radial-gradient(circle at top right, rgba(239, 68, 68, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
  }
  
  & > * {
    position: relative;
    z-index: 1;
  }
  
  .review-header {
    background: ${props => props.correct 
      ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)' 
      : 'linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'};
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${props => props.correct ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
    
    .question-number {
      font-weight: 700;
      color: white !important;
      font-size: 1.125rem;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .result-badge {
      display: flex;
      align-items: center;
      font-weight: 700;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      font-size: 0.95rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      
      &.correct {
        color: #10b981;
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }
      
      &.incorrect {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      
      &.skipped {
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.2);
        border: 1px solid rgba(245, 158, 11, 0.3);
      }
    }
  }
  
  .question-content {
    padding: 2rem;
    
    .question-text {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      color: white !important;
      line-height: 1.6;
      font-weight: 500;
    }
    
    .options-review {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2rem;
      
      .option-review {
        padding: 1.25rem 1.5rem;
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        position: relative;
        color: white !important;
        background: rgba(255, 255, 255, 0.03);
        transition: all 0.3s ease;
        
        &.user-selected {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.2);
        }
        
        &.correct-answer {
          background: rgba(16, 185, 129, 0.1);
          border-color: #10b981;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        }
        
        &.user-selected.correct-answer {
          background: rgba(16, 185, 129, 0.15);
          border-color: #10b981;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }
        
        .option-indicator {
          position: absolute;
          top: -10px;
          right: 15px;
          display: flex;
          gap: 0.75rem;
          
          span {
            font-size: 0.8rem;
            padding: 0.375rem 0.75rem;
            border-radius: 8px;
            font-weight: 700;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .user-indicator {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
          }
          
          .correct-indicator {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
        }
        
        p {
          font-size: 1.1rem;
          line-height: 1.5;
          font-weight: 500;
        }
      }
    }
    
    .explanation {
      background: linear-gradient(145deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%);
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid var(--primary-color);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
      
      h4 {
        margin-bottom: 0.75rem;
        font-weight: 700;
        color: white !important;
        font-size: 1.125rem;
        background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        color: white !important;
        line-height: 1.6;
        font-size: 1rem;
        font-weight: 500;
      }
    }
  }
  
  @media (max-width: 1200px) {
    .review-header {
      padding: 1.25rem 1.5rem;
    }
    
    .question-content {
      padding: 1.75rem;
      
      .question-text {
        font-size: 1.125rem;
        margin-bottom: 1.75rem;
      }
      
      .options-review {
        gap: 1rem;
        margin-bottom: 1.75rem;
        
        .option-review {
          padding: 1rem 1.25rem;
          
          p {
            font-size: 1rem;
          }
        }
      }
      
      .explanation {
        padding: 1.25rem;
        
        h4 {
          font-size: 1rem;
        }
        
        p {
          font-size: 0.95rem;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .review-header {
      padding: 1rem 1.25rem;
      
      .question-number {
        font-size: 1rem;
      }
      
      .result-badge {
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        gap: 0.5rem;
      }
    }
    
    .question-content {
      padding: 1.5rem;
      
      .question-text {
        font-size: 1rem;
        margin-bottom: 1.5rem;
      }
      
      .options-review {
        gap: 0.875rem;
        margin-bottom: 1.5rem;
        
        .option-review {
          padding: 0.875rem 1.125rem;
          
          p {
            font-size: 0.95rem;
          }
        }
      }
      
      .explanation {
        padding: 1.125rem;
        
        h4 {
          font-size: 0.95rem;
        }
        
        p {
          font-size: 0.9rem;
        }
      }
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    
    .review-header {
      padding: 0.875rem 1rem;
      
      .question-number {
        font-size: 0.95rem;
      }
      
      .result-badge {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        gap: 0.375rem;
      }
    }
    
    .question-content {
      padding: 1.25rem;
      
      .question-text {
        font-size: 0.95rem;
        margin-bottom: 1.25rem;
      }
      
      .options-review {
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        
        .option-review {
          padding: 0.75rem 1rem;
          
          p {
            font-size: 0.9rem;
          }
        }
      }
      
      .explanation {
        padding: 1rem;
        
        h4 {
          font-size: 0.9rem;
        }
        
        p {
          font-size: 0.85rem;
        }
      }
    }
  }
`;

// Question bubbles component for navigation
const QuestionBubbles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

// Analyzing screen components
const AnalyzingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, rgba(30, 41, 59, 0.98) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
`;

const AnalyzingAnimation = styled.div`
  text-align: center;
  max-width: 500px;
  padding: 2rem;
  
  .spinner-container {
    position: relative;
    margin-bottom: 2rem;
    
    .analyzing-spinner {
      width: 80px;
      height: 80px;
      border: 4px solid rgba(99, 102, 241, 0.3);
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1.5s linear infinite;
      margin: 0 auto 1rem;
    }
    
    .analyzing-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      
      span {
        width: 8px;
        height: 8px;
        background: var(--primary-color);
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
        
        &:nth-child(1) { animation-delay: 0s; }
        &:nth-child(2) { animation-delay: 0.3s; }
        &:nth-child(3) { animation-delay: 0.6s; }
      }
    }
  }
  
  .analyzing-text {
    h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, var(--primary-color), #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    
    .progress-indicators {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      
      .indicator {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border-left: 4px solid rgba(99, 102, 241, 0.3);
        font-size: 0.95rem;
        opacity: 0.5;
        transition: all 0.3s ease;
        
        &.active {
          opacity: 1;
          border-left-color: var(--primary-color);
          background: rgba(99, 102, 241, 0.1);
        }
      }
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 20%, 50%, 80%, 100% {
      transform: scale(1);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;

export default QuizPage;
