import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaArrowLeft, 
  FaArrowRight, 
  FaRedo, 
  FaLightbulb 
} from 'react-icons/fa';
import { PrimaryButton, SecondaryButton } from '../components/shared/Button';

// Demo quiz data
const demoQuizData = {
  id: 'demo-quiz',
  title: 'Demo Quiz: Technology & Innovation',
  timeLimit: 300, // 5 minutes for 5 questions
  questions: [
    {
      id: 'q1',
      question: 'Which company introduced the concept of "ChatGPT" that revolutionized conversational AI?',
      options: ['Google', 'OpenAI', 'Microsoft', 'Meta'],
      correctAnswer: '1', // Index of 'OpenAI'
      hint: 'This company was founded by Sam Altman and Elon Musk (initially).',
      explanation: 'OpenAI developed ChatGPT, which became one of the most influential AI chatbots, demonstrating advanced natural language processing capabilities.'
    },
    {
      id: 'q2',
      question: 'What does "API" stand for in software development?',
      options: ['Application Programming Interface', 'Automated Programming Integration', 'Advanced Protocol Implementation', 'Application Process Integration'],
      correctAnswer: '0', // Index of 'Application Programming Interface'
      hint: 'It\'s how different software applications communicate with each other.',
      explanation: 'API stands for Application Programming Interface, which defines how software components should interact and communicate with each other.'
    },
    {
      id: 'q3',
      question: 'Which programming language is primarily used for iOS app development?',
      options: ['Java', 'Swift', 'Python', 'JavaScript'],
      correctAnswer: '1', // Index of 'Swift'
      hint: 'This language was introduced by Apple in 2014 to replace Objective-C.',
      explanation: 'Swift is Apple\'s modern programming language designed specifically for iOS, macOS, watchOS, and tvOS development.'
    },
    {
      id: 'q4',
      question: 'What does "SaaS" stand for in cloud computing?',
      options: ['Software as a Service', 'System as a Service', 'Security as a Service', 'Storage as a Service'],
      correctAnswer: '0', // Index of 'Software as a Service'
      hint: 'Think of applications like Gmail, Dropbox, or Slack that you access through a web browser.',
      explanation: 'SaaS (Software as a Service) is a cloud computing model where software applications are provided over the internet on a subscription basis.'
    },
    {
      id: 'q5',
      question: 'Which technology is primarily used to create cryptocurrencies like Bitcoin?',
      options: ['Artificial Intelligence', 'Blockchain', 'Quantum Computing', 'Cloud Computing'],
      correctAnswer: '1', // Index of 'Blockchain'
      hint: 'This technology creates a distributed ledger that\'s virtually tamper-proof.',
      explanation: 'Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are secured using cryptography.'
    }
  ]
};

// CSS variables for dark mode theme
const cssVariables = {
  '--bg-primary': '#1e293b',
  '--bg-card': '#111827',
  '--text-primary': '#f1f5f9',
  '--text-secondary': '#cbd5e1',
  '--primary-color': '#6366f1',
  '--primary-hover': '#4f46e5',
  '--primary-rgb': '99, 102, 241',
  '--success-color': '#10b981',
  '--success-rgb': '16, 185, 129',
  '--error-color': '#ef4444',
  '--error-rgb': '239, 68, 68',
  '--border-color': '#334155',
  '--border-focus': '#6366f1',
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  '--rounded-sm': '0.25rem',
  '--rounded-md': '0.375rem',
  '--rounded-lg': '0.5rem',
  '--rounded-xl': '0.75rem',
  '--rounded-full': '9999px'
};

const DemoQuizPage = () => {
  const navigate = useNavigate();
  
  const [quiz] = useState(demoQuizData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(demoQuizData.timeLimit);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  // Timer
  useEffect(() => {
    if (quizSubmitted || timeLeft <= 0) return;
    
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
  }, [quizSubmitted, timeLeft]);
  
  const handleAnswerSelect = (questionId, optionId) => {
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
    
    quiz.questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correctAnswer;
      const isCorrect = userAnswer !== undefined && userAnswer === correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }
      
      questionResults[question.id] = {
        userAnswer,
        correctAnswer,
        isCorrect
      };
    });
    
    const totalQuestions = quiz.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    return {
      score,
      correctCount,
      totalQuestions,
      questionResults,
      timeTaken: quiz.timeLimit - timeLeft
    };
  };
  
  const handleSubmitQuiz = () => {
    if (quizSubmitted) return;
    
    const quizResults = calculateResults();
    setResults(quizResults);
    setQuizSubmitted(true);
  };
  
  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(demoQuizData.timeLimit);
    setQuizSubmitted(false);
    setResults(null);
    setShowHint(false);
  };
  
  const handleFinishQuiz = () => {
    navigate('/');
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const quizProgress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <Container>
      {!quizSubmitted ? (
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
                <p>{currentQuestion.hint || "No hint available for this question."}</p>
              </HintContent>
            )}
            
            <OptionsForm>
              {currentQuestion.options.map((optionText, index) => (
                <OptionItem 
                  key={`option-${currentQuestion.id}-${index}`}
                  isSelected={selectedAnswers[currentQuestion.id] === index.toString()}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index.toString())}
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
              <span className="demo-indicator">Demo Mode - No progress saved</span>
            </div>
            
            <div className="right-buttons">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <PrimaryButton 
                  onClick={handleNextQuestion}
                >
                  Next <FaArrowRight />
                </PrimaryButton>
              ) : (
                <PrimaryButton 
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz <FaCheckCircle />
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
            <p>You've completed the demo quiz!</p>
          </ResultsHeader>
          
          <ResultsSummary>
            <ScoreCard>
              <div className="score-circle">
                <div className="score-number">{results.score}%</div>
              </div>
              <div className="score-details">
                <p><strong>Score:</strong> {results.score}%</p>
                <p><strong>Correct Answers:</strong> {results.correctCount} out of {results.totalQuestions}</p>
                <p><strong>Time Taken:</strong> {formatTime(results.timeTaken)}</p>
              </div>
            </ScoreCard>
            
            <LoginPrompt>
              <h3>🎯 Want to create quizzes from your own materials?</h3>
              <p>This is just a sample! Login to upload your documents and generate personalized quizzes from your study materials.</p>
              <PrimaryButton onClick={() => navigate('/login')}>
                Login to Generate Your Own Questions
              </PrimaryButton>
            </LoginPrompt>
            
            <ResultsActions>
              <SecondaryButton onClick={handleRetakeQuiz}>
                <FaRedo /> Retake Demo
              </SecondaryButton>
              <SecondaryButton onClick={handleFinishQuiz}>
                <FaArrowLeft /> Back to Home
              </SecondaryButton>
            </ResultsActions>
          </ResultsSummary>
          
          <QuestionReview>
            <h2>Question Review</h2>
            
            {quiz.questions.map((question, index) => {
              const questionResult = results.questionResults[question.id];
              const isCorrect = questionResult.isCorrect;
              
              return (
                <ReviewCard key={question.id} correct={isCorrect}>
                  <div className="review-header">
                    <span className="question-number">Question {index + 1}</span>
                    {isCorrect ? (
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
                          key={`review-option-${question.id}-${optionIndex}`}
                          className={`
                            option-review 
                            ${questionResult.userAnswer === optionIndex.toString() ? 'user-selected' : ''} 
                            ${question.correctAnswer === optionIndex.toString() ? 'correct-answer' : ''}
                          `}
                        >
                          <div className="option-indicator">
                            {questionResult.userAnswer === optionIndex.toString() && (
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
                      <h4>Explanation:</h4>
                      <p>{question.explanation}</p>
                    </div>
                  </div>
                </ReviewCard>
              );
            })}
          </QuestionReview>
          
          <div className="back-to-dashboard">
            <SecondaryButton onClick={handleFinishQuiz}>
              <FaArrowLeft /> Back to Home
            </SecondaryButton>
          </div>
        </ResultsContainer>
      )}
    </Container>
  );
};

// Styled components with enhanced mobile responsiveness
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--bg-primary);
  min-height: calc(100vh - 80px);
  color: white !important;
  
  ${Object.entries(cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n')}
  
  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: white !important;
    
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(var(--primary-rgb), 0.2);
      border-top: 5px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  .error-message {
    text-align: center;
    padding: 2rem;
    background: rgba(var(--error-rgb), 0.1);
    border-radius: var(--rounded-lg);
    color: var(--error-color);
    
    svg {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    h2 {
      margin-bottom: 1rem;
      color: white !important;
    }
    
    button {
      margin-top: 1.5rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const QuizContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto auto 1fr auto;
  grid-template-areas:
    "header header"
    "progress progress"
    "question navigation"
    "footer footer";
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "progress"
      "question"
      "navigation"
      "footer";
    gap: 1.2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const QuizHeader = styled.div`
  grid-area: header;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  
  .quiz-info {
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
    padding: 1rem;
    
    .quiz-info h1 {
      font-size: 1.25rem;
    }
    
    .quiz-timer {
      align-self: flex-start;
      padding: 0.6rem 0.8rem;
      
      span {
        font-size: 1rem;
      }
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    
    .quiz-info h1 {
      font-size: 1.125rem;
    }
    
    .quiz-timer {
      padding: 0.5rem 0.75rem;
      
      span {
        font-size: 0.95rem;
      }
    }
  }
`;

const QuizProgress = styled.div`
  grid-area: progress;
  margin-bottom: 0.5rem;
  
  .progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    color: white !important;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: var(--rounded-full);
    overflow: hidden;
  
    .progress-fill {
      height: 100%;
      background: var(--primary-color);
      border-radius: var(--rounded-full);
      transition: width 0.3s ease;
    }
  }
  
  @media (max-width: 480px) {
    .progress-text {
      font-size: 0.8rem;
    }
    
    .progress-bar {
      height: 6px;
    }
  }
`;

const QuestionCard = styled.div`
  grid-area: question;
  background: var(--bg-card);
  border-radius: var(--rounded-xl);
  box-shadow: var(--shadow-lg);
  padding: 2.5rem;
  width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  
  @media (max-width: 768px) {
    padding: 1.75rem;
    border-radius: var(--rounded-lg);
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    border-radius: var(--rounded-md);
    box-shadow: var(--shadow-md);
  }
`;

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
  
  @media (max-width: 480px) {
    align-self: flex-start;
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    
    svg {
      font-size: 0.9rem;
    }
  }
`;

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
    
    p {
      font-size: 0.85rem;
    }
  }
`;

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
      : 'var(--border-color)'
  };
  border-radius: var(--rounded-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  user-select: none;
  box-shadow: ${props => 
    props.isSelected ? 'var(--shadow-md)' : 'none'};
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
    transform: translateY(-2px);
    background-color: rgba(var(--primary-rgb), 0.1);
  }
  
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
    
    &:hover {
      transform: none; /* Disable hover transform on mobile */
    }
    
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

const NavigationFooter = styled.div`
  grid-area: footer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-card);
  padding: 1.25rem;
  border-radius: var(--rounded-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  
  .center {
    flex: 1;
    text-align: center;
    
    .demo-indicator {
      font-size: 0.875rem;
      color: white !important;
      font-weight: 500;
    }
  }
  
  .right-buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    
    > div {
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
    
    .right-buttons {
      justify-content: center;
      width: 100%;
    }
  }
`;

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
    
    h3 {
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
  }
`;

const QuestionBubbles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const QuestionBubble = styled.div`
  width: 36px;
  height: 36px;
  ${props => {
    let background;
    if (props.active) {
      background = 'var(--primary-color)';
    } else if (props.answered) {
      background = 'rgba(var(--primary-rgb), 0.15)';
    } else {
      background = 'var(--bg-card)';
    }
    return `background: ${background};`;
  }}
  color: ${props => 
    props.active 
      ? 'var(--text-primary)' 
      : 'var(--text-secondary)'
  };
  border: 2px solid ${props => 
    props.active 
      ? 'var(--primary-color)' 
      : props.answered 
        ? 'var(--primary-color)' 
        : 'var(--border-color)'
  };
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
  
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
    
    &:hover {
      transform: none; /* Disable hover effects on mobile */
    }
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--bg-card);
  border-radius: var(--rounded-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  
  .back-to-dashboard {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1.25rem;
  }
`;

const ResultsHeader = styled.div`
  text-align: center;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: white !important;
  }
  
  p {
    color: white !important;
    font-size: 1.125rem;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 1.75rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.5rem;
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
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const ScoreCard = styled.div`
  background: var(--bg-card);
  border-radius: var(--rounded-lg);
  border: 1px solid var(--border-color);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: 2rem;
  
  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: rgba(var(--primary-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid var(--primary-color);
    flex-shrink: 0;
    
    .score-number {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
    }
  }
  
  .score-details {
    flex: 1;
    
    p {
      margin-bottom: 0.75rem;
      font-size: 1.125rem;
      color: white !important;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      strong {
        font-weight: 600;
        color: white !important;
        margin-right: 0.5rem;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
    
    .score-circle {
      width: 100px;
      height: 100px;
      
      .score-number {
        font-size: 1.75rem;
      }
    }
    
    .score-details p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    gap: 1.25rem;
    
    .score-circle {
      width: 90px;
      height: 90px;
      border-width: 3px;
      
      .score-number {
        font-size: 1.5rem;
      }
    }
    
    .score-details p {
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
    }
  }
`;

const LoginPrompt = styled.div`
  background: rgba(var(--primary-rgb), 0.05);
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  border-radius: var(--rounded-lg);
  padding: 2rem;
  text-align: center;
  width: 100%;
  max-width: 600px;
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: white !important;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: white !important;
    line-height: 1.5;
  }
  
  button {
    width: 100%;
    max-width: 300px;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    h3 {
      font-size: 1.125rem;
    }
    
    p {
      font-size: 0.95rem;
      margin-bottom: 1.25rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    
    h3 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
    
    p {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    button {
      max-width: none;
      width: 100%;
    }
  }
`;

const ResultsActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    
    button {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const QuestionReview = styled.div`
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: white !important;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
  }
  
  @media (max-width: 480px) {
    h2 {
      font-size: 1.125rem;
      margin-bottom: 1rem;
    }
  }
`;

const ReviewCard = styled.div`
  background: var(--bg-card);
  border-radius: var(--rounded-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  margin-bottom: 1.5rem;
  overflow: hidden;
  
  .review-header {
    background: ${props => props.correct ? 'rgba(var(--success-rgb), 0.1)' : 'rgba(var(--error-rgb), 0.1)'};
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${props => props.correct ? 'rgba(var(--success-rgb), 0.2)' : 'rgba(var(--error-rgb), 0.2)'};
    
    .question-number {
      font-weight: 600;
      color: white !important;
    }
    
    .result-badge {
      display: flex;
      align-items: center;
      font-weight: 600;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: var(--rounded-full);
      font-size: 0.875rem;
      
      &.correct {
        color: var(--success-color);
        background: rgba(var(--success-rgb), 0.1);
      }
      
      &.incorrect {
        color: var(--error-color);
        background: rgba(var(--error-rgb), 0.1);
      }
    }
  }
  
  .question-content {
    padding: 1.5rem;
    
    .question-text {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
      color: white !important;
      line-height: 1.5;
    }
    
    .options-review {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
      
      .option-review {
        padding: 1rem 1.25rem;
        border-radius: var(--rounded-md);
        border: 1px solid var(--border-color);
        position: relative;
        color: white !important;
        
        &.user-selected {
          background: rgba(var(--error-rgb), 0.05);
          border-color: var(--error-color);
        }
        
        &.correct-answer {
          background: rgba(var(--success-rgb), 0.05);
          border-color: var(--success-color);
        }
        
        &.user-selected.correct-answer {
          background: rgba(var(--success-rgb), 0.1);
          border-color: var(--success-color);
        }
        
        .option-indicator {
          position: absolute;
          top: -8px;
          right: 10px;
          display: flex;
          gap: 0.5rem;
          
          span {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: var(--rounded-sm);
            font-weight: 600;
          }
          
          .user-indicator {
            background: rgba(var(--error-rgb), 0.1);
            color: var(--error-color);
          }
          
          .correct-indicator {
            background: rgba(var(--success-rgb), 0.1);
            color: var(--success-color);
          }
        }
      }
    }
    
    .explanation {
      background: rgba(var(--primary-rgb), 0.05);
      padding: 1.25rem;
      border-radius: var(--rounded-md);
      border-left: 3px solid var(--primary-color);
      
      h4 {
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: white !important;
      }
      
      p {
        color: white !important;
        line-height: 1.5;
      }
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
    
    .review-header {
      padding: 0.75rem 1rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      
      .result-badge {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
      }
    }
    
    .question-content {
      padding: 1.25rem;
      
      .question-text {
        font-size: 1rem;
        margin-bottom: 1.25rem;
      }
      
      .options-review {
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        
        .option-review {
          padding: 0.75rem 1rem;
          
          .option-indicator {
            top: -6px;
            right: 8px;
            
            span {
              font-size: 0.7rem;
              padding: 0.2rem 0.4rem;
            }
          }
        }
      }
      
      .explanation {
        padding: 1rem;
        
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
    margin-bottom: 1rem;
    
    .review-header {
      padding: 0.75rem;
      
      .question-number {
        font-size: 0.9rem;
      }
      
      .result-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        gap: 0.25rem;
      }
    }
    
    .question-content {
      padding: 1rem;
      
      .question-text {
        font-size: 0.95rem;
        margin-bottom: 1rem;
      }
      
      .options-review {
        gap: 0.6rem;
        margin-bottom: 1rem;
        
        .option-review {
          padding: 0.6rem 0.8rem;
          
          p {
            font-size: 0.9rem;
            margin: 0;
          }
          
          .option-indicator {
            top: -5px;
            right: 6px;
            flex-direction: column;
            gap: 0.25rem;
            
            span {
              font-size: 0.65rem;
              padding: 0.15rem 0.3rem;
            }
          }
        }
      }
      
      .explanation {
        padding: 0.875rem;
        
        h4 {
          font-size: 0.9rem;
          margin-bottom: 0.4rem;
        }
        
        p {
          font-size: 0.85rem;
        }
      }
    }
  }
`;

export default DemoQuizPage;
