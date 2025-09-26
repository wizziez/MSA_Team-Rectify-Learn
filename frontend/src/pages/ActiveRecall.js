import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaBrain, 
  FaLightbulb, 
  FaChartLine, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaArrowRight,
  FaRedo,
  FaHistory,
  FaBook,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../utils/apiService';

// Discord-inspired colors
const colors = {
  blurple: '#5865F2',
  green: '#57F287',
  yellow: '#FEE75C',
  fuchsia: '#EB459E',
  red: '#ED4245',
  white: '#FFFFFF',
  black: '#23272A',
  darkButNotBlack: '#2C2F33',
  notQuiteBlack: '#23272A',
  greyple: '#99AAB5',
  dark: '#36393F',
  channelHover: '#3C3F45',
  channelSelected: '#42464D'
};

const PageContainer = styled.div`
  min-height: calc(100vh - 70px);
  background-color: ${colors.dark};
  color: ${colors.white};
  padding: 2rem 0;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${colors.blurple};
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  color: ${colors.greyple};
  transition: color 0.2s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: ${colors.white};
  }
`;

const SessionStats = styled.div`
  display: flex;
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const StatItem = styled.div`
  flex: 1;
  padding: 1.25rem;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-right: none;
  }
  
  h3 {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.greyple};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.highlight || colors.white};
  }
  
  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
    
    h3 {
      font-size: 0.75rem;
      flex-direction: column;
      
      svg {
        margin-right: 0;
        margin-bottom: 0.25rem;
      }
    }
    
    .value {
      font-size: 1.25rem;
    }
  }
`;

const QuizLabel = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .quiz-source {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${colors.white};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: ${colors.blurple};
    }
  }
  
  .previous-score {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: ${props => {
      if (props.score < 60) return 'rgba(237, 66, 69, 0.2)';
      if (props.score < 80) return 'rgba(254, 231, 92, 0.2)';
      return 'rgba(87, 242, 135, 0.2)';
    }};
    color: ${props => {
      if (props.score < 60) return colors.red;
      if (props.score < 80) return colors.yellow;
      return colors.green;
    }};
  }
`;

const QuestionCard = styled(motion.div)`
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  .question-meta {
    font-size: 0.875rem;
    color: ${colors.greyple};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  .difficulty {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: ${props => {
      if (props.difficulty === 'hard') return 'rgba(239, 68, 68, 0.2)';
      if (props.difficulty === 'medium') return 'rgba(245, 158, 11, 0.2)';
      return 'rgba(16, 185, 129, 0.2)';
    }};
    color: ${props => {
      if (props.difficulty === 'hard') return colors.red;
      if (props.difficulty === 'medium') return colors.yellow;
      return colors.green;
    }};
  }
`;

const QuestionText = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const OptionItem = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => {
    if (props.selected && props.isCorrect) return colors.green;
    if (props.selected && !props.isCorrect) return colors.red;
    if (props.isCorrect && props.showAnswer) return colors.green;
    if (props.wasPreviouslySelected) return colors.yellow;
    return 'rgba(255, 255, 255, 0.1)';
  }};
  background-color: ${props => {
    if (props.selected && props.isCorrect) return 'rgba(87, 242, 135, 0.1)';
    if (props.selected && !props.isCorrect) return 'rgba(237, 66, 69, 0.1)';
    if (props.isCorrect && props.showAnswer) return 'rgba(87, 242, 135, 0.1)';
    if (props.wasPreviouslySelected) return 'rgba(254, 231, 92, 0.1)';
    return 'transparent';
  }};
  cursor: ${props => props.showAnswer ? 'default' : 'pointer'};
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  color: ${colors.white};
  position: relative;
  
  &:hover {
    background-color: ${props => props.showAnswer ? props.selected ? props.isCorrect ? 'rgba(87, 242, 135, 0.1)' : 'rgba(237, 66, 69, 0.1)' : props.isCorrect ? 'rgba(87, 242, 135, 0.1)' : 'transparent' : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${props => props.showAnswer ? props.selected ? props.isCorrect ? colors.green : colors.red : props.isCorrect ? colors.green : 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  .option-letter {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: ${props => {
      if (props.selected && props.isCorrect) return colors.green;
      if (props.selected && !props.isCorrect) return colors.red;
      if (props.isCorrect && props.showAnswer) return colors.green;
      if (props.wasPreviouslySelected) return colors.yellow;
      return 'rgba(255, 255, 255, 0.1)';
    }};
    margin-right: 1rem;
    font-weight: 600;
  }
  
  .option-text {
    flex: 1;
  }
  
  .option-icon {
    margin-left: 1rem;
    color: ${props => props.isCorrect ? colors.green : colors.red};
    opacity: ${props => props.showAnswer ? 1 : 0};
  }
  
  .previous-answer-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${colors.yellow};
    color: white !important;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 10px;
    display: ${props => props.wasPreviouslySelected ? 'block' : 'none'};
  }
`;

const ExplanationBox = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.25rem;
  margin-top: 1.5rem;
  border-left: 3px solid ${colors.blurple};
  
  h4 {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    
    svg {
      margin-right: 0.75rem;
      color: ${colors.blurple};
    }
  }
  
  p {
    color: ${colors.greyple};
    line-height: 1.6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${colors.blurple};
  color: ${colors.white};
  
  &:hover:not(:disabled) {
    background-color: #4752c4;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${colors.white};
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
  
  .progress {
    height: 100%;
    background-color: ${colors.blurple};
    width: ${props => props.progress || 0}%;
    transition: width 0.3s ease;
  }
`;

const LoaderSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 3px solid ${colors.blurple};
  animation: spin 1s linear infinite;
  margin: ${props => props.margin || '2rem auto'};
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  
  p {
    margin-top: 1.5rem;
    color: ${colors.greyple};
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

const CompletionCard = styled.div`
  background-color: ${colors.darkButNotBlack};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  
  .header {
    text-align: center;
    margin-bottom: 2rem;
    
    svg {
      font-size: 3.5rem;
      color: ${colors.blurple};
      margin-bottom: 1rem;
    }
    
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      background: linear-gradient(90deg, ${colors.blurple}, #a5b4fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    p {
      color: ${colors.greyple};
      font-size: 1.1rem;
      line-height: 1.6;
      max-width: 80%;
      margin: 0 auto;
    }
  }
  
  .progress-improvement {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    margin: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    
    .progress-item {
      text-align: center;
      flex: 1;
      
      .label {
        font-size: 0.9rem;
        color: ${colors.greyple};
        margin-bottom: 0.5rem;
      }
      
      .value {
        font-size: 2rem;
        font-weight: 700;
        color: ${colors.blurple};
      }
      
      .sublabel {
        font-size: 0.8rem;
        color: ${colors.greyple};
        margin-top: 0.25rem;
      }
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
  }
  
  .benefits {
    margin: 2rem 0;
    
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      
      svg {
        margin-right: 0.75rem;
        color: ${colors.blurple};
      }
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        
        svg {
          color: ${colors.green};
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          flex-shrink: 0;
        }
        
        div {
          .benefit-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
            color: ${colors.white};
          }
          
          .benefit-desc {
            font-size: 0.9rem;
            color: ${colors.greyple};
            line-height: 1.5;
          }
        }
      }
    }
  }
`;

const ReviewedQuizzes = styled.div`
  margin: 1.5rem 0;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
      color: ${colors.blurple};
    }
  }
  
  .quiz-list {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
    
    .quiz-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      
      &:last-child {
        border-bottom: none;
      }
      
      .quiz-name {
        display: flex;
        align-items: center;
        
        svg {
          margin-right: 0.75rem;
          color: ${colors.blurple};
          opacity: 0.7;
        }
      }
      
      .score {
        display: flex;
        align-items: center;
        font-weight: 600;
        
        span {
          color: ${props => props.score < 60 ? colors.red : props.score < 80 ? colors.yellow : colors.green};
          margin-left: 0.5rem;
        }
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
`;

// Add a new styled component for priority explanation
const PriorityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => {
    if (props.reason === "Low performance") return colors.red;
    if (props.reason === "Recent attempt") return colors.yellow;
    return colors.green;
  }};
  margin-left: 0.5rem;
  
  svg {
    margin-right: 0.3rem;
  }
`;

const SessionHeader = styled.div`
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
      color: ${colors.blurple};
    }
  }
  
  p {
    color: ${colors.greyple};
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
  }
  
  .session-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    
    .meta-item {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      display: flex;
      align-items: center;
      font-size: 0.85rem;
      
      svg {
        margin-right: 0.5rem;
        color: ${colors.blurple};
      }
      
      span {
        font-weight: 600;
        margin-left: 0.25rem;
      }
    }
  }
`;

// Add a new styled component for previous incorrect answer notification
const PreviousAnswerNote = styled.div`
  background-color: rgba(254, 231, 92, 0.1);
  border: 1px solid ${colors.yellow};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    color: ${colors.yellow};
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: ${colors.white};
  }
`;

// Sample questions with performance data
const sampleQuestions = [
  {
    id: 1,
    question: "What is the main difference between mitosis and meiosis?",
    options: [
      "Mitosis produces two identical cells, while meiosis produces four genetically different cells",
      "Mitosis occurs in plants, while meiosis occurs in animals",
      "Mitosis is sexual reproduction, while meiosis is asexual reproduction",
      "Mitosis happens in the liver, while meiosis happens in the brain"
    ],
    correctOptionIndex: 0,
    difficulty: "medium",
    topic: "Biology",
    previousPerformance: 0.4, // 40% correct rate in past attempts
    explanation: "Mitosis is a process of cell division that results in two identical daughter cells with the same number of chromosomes as the parent cell. Meiosis, on the other hand, results in four genetically diverse daughter cells, each with half the number of chromosomes as the parent cell.",
    lastAttempted: "2023-09-15"
  },
  {
    id: 2,
    question: "Which law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another?",
    options: [
      "Zeroth Law of Thermodynamics",
      "First Law of Thermodynamics",
      "Second Law of Thermodynamics",
      "Third Law of Thermodynamics"
    ],
    correctOptionIndex: 1,
    difficulty: "hard",
    topic: "Physics",
    previousPerformance: 0.2, // 20% correct rate in past attempts
    explanation: "The First Law of Thermodynamics, also known as the Law of Conservation of Energy, states that energy cannot be created or destroyed, only transferred or converted from one form to another. The total energy of an isolated system remains constant.",
    lastAttempted: "2023-09-10"
  },
  {
    id: 3,
    question: "What is the primary function of DNA?",
    options: [
      "Energy storage",
      "Protein synthesis",
      "Genetic information storage",
      "Cell structure support"
    ],
    correctOptionIndex: 2,
    difficulty: "easy",
    topic: "Biology",
    previousPerformance: 0.9, // 90% correct rate in past attempts
    explanation: "DNA (Deoxyribonucleic Acid) serves as the primary storage molecule for genetic information in living organisms. It contains the instructions necessary for the development, functioning, growth, and reproduction of all known organisms and many viruses.",
    lastAttempted: "2023-09-20"
  },
  {
    id: 4,
    question: "What is the difference between an ionic and covalent bond?",
    options: [
      "Ionic bonds involve the sharing of electrons, while covalent bonds involve the transfer of electrons",
      "Ionic bonds involve the transfer of electrons, while covalent bonds involve the sharing of electrons",
      "Ionic bonds occur in solids, while covalent bonds occur in liquids",
      "Ionic bonds are stronger than covalent bonds"
    ],
    correctOptionIndex: 1,
    difficulty: "medium",
    topic: "Chemistry",
    previousPerformance: 0.3, // 30% correct rate in past attempts
    explanation: "Ionic bonds form when electrons are transferred from one atom to another, resulting in positive and negative ions that attract each other. Covalent bonds form when electrons are shared between atoms, typically to achieve a more stable electron configuration.",
    lastAttempted: "2023-09-05"
  },
  {
    id: 5,
    question: "What is the Pythagorean theorem?",
    options: [
      "The sum of the angles in a triangle equals 180 degrees",
      "The area of a circle equals πr²",
      "In a right triangle, the sum of the squares of the two shorter sides equals the square of the hypotenuse",
      "The perimeter of a rectangle equals 2(length + width)"
    ],
    correctOptionIndex: 2,
    difficulty: "easy",
    topic: "Mathematics",
    previousPerformance: 0.7, // 70% correct rate in past attempts
    explanation: "The Pythagorean theorem states that in a right triangle, the square of the length of the hypotenuse (the side opposite the right angle) equals the sum of the squares of the lengths of the other two sides. This is commonly written as a² + b² = c², where c represents the hypotenuse.",
    lastAttempted: "2023-09-18"
  }
];

// Add the missing generateRetakeQuestions function before the ActiveRecall component
const generateRetakeQuestions = async (retakeInfo) => {
  try {
    // This would normally fetch previous quiz data from the API
    // For now, we'll use a simplified approach for the demo
    const quizQuestions = await apiService.getQuizQuestions(retakeInfo.quizId);
    
    if (!quizQuestions || !quizQuestions.data) {
      throw new Error('No questions found for retake');
    }
    
    // Prioritize previously incorrect questions
    return quizQuestions.data.map(q => {
      const wasIncorrect = retakeInfo.previousAnswers.some(
        a => a.questionId === q.id && !a.correct
      );
      
      return {
        ...q,
        previousPerformance: wasIncorrect ? 0.2 : 0.8,
        difficulty: wasIncorrect ? 'hard' : 'medium',
        priorityScore: wasIncorrect ? 100 : 50,
        priorityReason: wasIncorrect ? "Previously incorrect" : "Review",
        userPreviousAnswer: retakeInfo.previousAnswers.find(a => a.questionId === q.id)?.answerId
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  } catch (error) {
    console.error('Error generating retake questions:', error);
    return sampleQuestions;
  }
};

// Add missing styled components
const LoadingContainer = styled(LoadingState)`
  min-height: 60vh;
`;

const LoadingSpinner = styled(LoaderSpinner)`
  margin: 0 auto 1.5rem;
`;

// Improve the CompletionScreen component with detailed answer summaries
const CompletionScreen = ({ 
  stats, 
  questions, 
  isRetake, 
  originalQuizId,
  calculateRetakeImprovement,
  resetSession,
  formatTime 
}) => {
  const navigate = useNavigate();
  const [showAnswerSummary, setShowAnswerSummary] = useState(false);
  
  // Separate correct and incorrect questions
  const incorrectQuestions = questions.filter((_, index) => {
    const questionStats = stats.questionResults ? stats.questionResults[index] : null;
    return questionStats && !questionStats.correct;
  });
  
  const correctQuestions = questions.filter((_, index) => {
    const questionStats = stats.questionResults ? stats.questionResults[index] : null;
    return questionStats && questionStats.correct;
  });
  
  // Function to handle quiz retake
  const handleRetakeQuiz = () => {
    // Safe extraction of quiz ID with proper type checking to avoid the split error
    let quizId = 'unknown';
    
    if (originalQuizId) {
      quizId = String(originalQuizId);
    } else if (questions && questions.length > 0 && questions[0]?.id) {
      // Ensure id is a string before trying to split it
      const id = String(questions[0].id);
      // Check if the ID contains an underscore before splitting
      if (id.includes('_')) {
        quizId = id.split('_')[0];
      } else {
        quizId = id; // Use the whole ID if no underscore is found
      }
    }
    
    const quizData = {
      quizId: quizId,
      title: 'Quiz Retake',
      previousScore: Math.round((stats.correct / stats.completed) * 100),
      previousAnswers: stats.questionResults?.map((result, index) => ({
        questionId: questions[index]?.id,
        answerId: result.selectedOption,
        correct: result.correct
      })) || []
    };
    
    localStorage.setItem('activeRecallRetake', JSON.stringify(quizData));
    window.location.reload();
  };
  
  return (
    <CompletionCard>
      <div className="header">
        <FaCheckCircle />
        <h2>{isRetake ? 'Quiz Retake Complete!' : 'Active Recall Complete!'}</h2>
        <p>
          {isRetake 
            ? 'You\'ve successfully completed your quiz retake with a focus on previously challenging questions.' 
            : 'You\'ve successfully completed your personalized active recall session focusing on your weakest areas.'}
        </p>
      </div>
      
      <SessionStats>
        <StatItem highlight={colors.blurple}>
          <h3><FaQuestionCircle /> Questions</h3>
          <div className="value">{stats.completed}</div>
        </StatItem>
        <StatItem highlight={colors.green}>
          <h3><FaCheckCircle /> Correct</h3>
          <div className="value">{stats.correct}</div>
        </StatItem>
        <StatItem highlight={colors.red}>
          <h3><FaTimesCircle /> Incorrect</h3>
          <div className="value">{stats.incorrect}</div>
        </StatItem>
        <StatItem>
          <h3><FaClock /> Time</h3>
          <div className="value">{formatTime(stats.timeSpent)}</div>
        </StatItem>
      </SessionStats>
      
      <div className="progress-improvement">
        {isRetake ? (
          <>
            <div className="progress-item">
              <div className="label">Improvement on Incorrect Questions</div>
              <div className="value">
                {calculateRetakeImprovement()}%
              </div>
              <div className="sublabel">Questions now correct</div>
            </div>
            <div className="progress-item">
              <div className="label">Current Score</div>
              <div className="value">{Math.round((stats.correct / stats.completed) * 100)}%</div>
              <div className="sublabel">This session</div>
            </div>
            <div className="progress-item">
              <div className="label">Knowledge Boost</div>
              <div className="value">+{Math.min(Math.round(stats.correct * 5), 100)}%</div>
              <div className="sublabel">Estimated improvement</div>
            </div>
          </>
        ) : (
          <>
            <div className="progress-item">
              <div className="label">Knowledge Reinforced</div>
              <div className="value">+{Math.min(Math.round(stats.correct * 3), 100)}%</div>
              <div className="sublabel">Estimated improvement</div>
            </div>
            <div className="progress-item">
              <div className="label">Retention Score</div>
              <div className="value">{Math.round((stats.correct / stats.completed) * 100)}%</div>
              <div className="sublabel">This session</div>
            </div>
            <div className="progress-item">
              <div className="label">Long-term Benefit</div>
              <div className="value">{Math.max(1, Math.floor(stats.correct / 3))}x</div>
              <div className="sublabel">Improved retention</div>
            </div>
          </>
        )}
      </div>
      
      {/* New Answer Summary Toggle Button */}
      <AnswerSummaryToggle onClick={() => setShowAnswerSummary(!showAnswerSummary)}>
        <div className="toggle-icon">
          {showAnswerSummary ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        <span>{showAnswerSummary ? "Hide Answer Summary" : "Show Answer Summary"}</span>
      </AnswerSummaryToggle>
      
      {/* New Detailed Answer Summary Section */}
      {showAnswerSummary && (
        <AnswerSummarySection>
          {incorrectQuestions.length > 0 && (
            <SummaryCategory>
              <h3><FaTimesCircle style={{color: colors.red}} /> Incorrect Answers</h3>
              <ul>
                {incorrectQuestions.map((question, index) => {
                  const questionStats = stats.questionResults?.find(
                    qr => qr.questionIndex === questions.findIndex(q => q.id === question.id)
                  );
                  return (
                    <SummaryItem key={index} incorrect>
                      <div className="question-text">{question.question}</div>
                      <div className="answers">
                        <div className="selected">
                          <span>Your answer:</span> 
                          <span className="incorrect">
                            {question.options[questionStats?.selectedOption || 0]}
                          </span>
                        </div>
                        <div className="correct">
                          <span>Correct answer:</span> 
                          <span className="correct-text">
                            {question.options[question.correctOptionIndex]}
                          </span>
                        </div>
                      </div>
                      {question.explanation && (
                        <div className="explanation">
                          <FaLightbulb /> {question.explanation}
                        </div>
                      )}
                    </SummaryItem>
                  );
                })}
              </ul>
            </SummaryCategory>
          )}
          
          {correctQuestions.length > 0 && (
            <SummaryCategory>
              <h3><FaCheckCircle style={{color: colors.green}} /> Correct Answers</h3>
              <ul>
                {correctQuestions.map((question, index) => (
                  <SummaryItem key={index} correct>
                    <div className="question-text">{question.question}</div>
                    <div className="answers">
                      <div className="selected">
                        <span>Your answer:</span> 
                        <span className="correct-text">
                          {question.options[question.correctOptionIndex]}
                        </span>
                      </div>
                    </div>
                  </SummaryItem>
                ))}
              </ul>
            </SummaryCategory>
          )}
        </AnswerSummarySection>
      )}
      
      <ActionButtons>
        <SecondaryButton onClick={() => navigate('/quiz-history')}>
          <FaHistory /> View Quiz History
        </SecondaryButton>
        
        <PrimaryButton onClick={resetSession}>
          <FaBrain /> New Session
        </PrimaryButton>
      </ActionButtons>
    </CompletionCard>
  );
};

const ActiveRecall = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get data passed from Dashboard
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    completed: 0,
    correct: 0,
    incorrect: 0,
    timeSpent: 0,
    questionResults: []
  });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isRetake, setIsRetake] = useState(false);
  const [originalQuizId, setOriginalQuizId] = useState(null);
  
  // Timer for tracking time spent
  const [startTime, setStartTime] = useState(null);
  
  useEffect(() => {
    const loadAvailableQuizzes = async () => {
      setIsLoading(true);
      
      try {
        if (state && state.quizzes && state.quizzes.length > 0) {
          // If quizzes were passed from Dashboard, use them
          setAvailableQuizzes(state.quizzes);
        } else {
          // Otherwise, fetch quizzes from API
          const documents = await apiService.getDocuments();
          const quizzes = [];
          
          if (documents && documents.data) {
            for (const doc of documents.data) {
              try {
                const quizResponse = await apiService.getDocumentQuizzes(doc.id);
                if (quizResponse && quizResponse.data && quizResponse.data.length > 0) {
                  quizzes.push({
                    id: doc.id,
                    title: doc.filename,
                    questionCount: quizResponse.data.length,
                    date: doc.upload_date
                  });
                }
              } catch (err) {
                console.error(`Error fetching quizzes for document ${doc.id}:`, err);
              }
            }
          }
          setAvailableQuizzes(quizzes);
        }
      } catch (error) {
        console.error('Error loading available quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check if we're doing a retake
    const checkForRetake = () => {
      const retakeData = localStorage.getItem('activeRecallRetake');
      
      if (retakeData) {
        const retakeInfo = JSON.parse(retakeData);
        setIsRetake(true);
        setOriginalQuizId(retakeInfo.quizId);
        setSelectedQuiz({
          id: retakeInfo.quizId,
          title: retakeInfo.title || 'Quiz Retake'
        });
        return true;
      }
      return false;
    };
    
    // First check for retake, if no retake then load available quizzes
    if (!checkForRetake()) {
      loadAvailableQuizzes();
    } else {
      prepareRetakeSession();
    }
  }, [state]);
  
  const prepareRetakeSession = async () => {
    setIsLoading(true);
    try {
      const retakeData = localStorage.getItem('activeRecallRetake');
      if (!retakeData) return;
      
      const retakeInfo = JSON.parse(retakeData);
      // Generate questions for the retake
      const retakeQuestions = await generateRetakeQuestions(retakeInfo);
      setQuestions(retakeQuestions);
      
      localStorage.removeItem('activeRecallRetake'); // Clear retake data
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error preparing retake session:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const prepareActiveRecallSession = async (quizId) => {
    setIsLoading(true);
    
    try {
      console.log(`Preparing active recall session for quiz ID: ${quizId}`);
      
      // Get questions for this quiz directly using documented endpoint
      const quizQuestions = await apiService.getQuizQuestions(quizId);
      
      if (!quizQuestions || !quizQuestions.data || quizQuestions.data.length === 0) {
        throw new Error('No questions found for this quiz. The quiz may not exist or has no questions.');
      }
      
      console.log(`Successfully loaded ${quizQuestions.data.length} questions`);
      
      // Process questions to match the documented API format:
      // {"id": 1, "question": "...", "options": [...], "correct_option_index": 2, "hint": "...", "explanation": "..."}
      const preparedQuestions = quizQuestions.data.map(q => {
        // Handle different API response formats
        const questionData = {
          id: q.id || `${quizId}_${Math.random().toString(36).substring(2, 9)}`,
          question: q.question || q.text || "Question content unavailable",
          options: Array.isArray(q.options) ? q.options : [],
          correctOptionIndex: q.correct_option_index !== undefined 
            ? q.correct_option_index 
            : (q.correctAnswer !== undefined ? parseInt(q.correctAnswer, 10) : 0),
          explanation: q.explanation || q.explanation_text || "",
          hint: q.hint || "",
          previousPerformance: 0.5, // Default performance
          difficulty: q.difficulty || 'medium',
          priorityScore: 50
        };
        
        return questionData;
      });
      
      // Try to get quiz history to prioritize questions
      try {
        const history = await apiService.getQuizAttemptsByQuizId(quizId);
        
        if (history && history.data && history.data.length > 0) {
          console.log(`Found ${history.data.length} previous attempts for this quiz`);
          
          // Process quiz history according to documented format
          const questionStats = {};
          
          // Organize attempt data by question
          history.data.forEach(attempt => {
            // API returns a "answers" field that contains detailed answer data
            if (attempt.answers && Array.isArray(attempt.answers)) {
              attempt.answers.forEach(answer => {
                // Use the quiz_id field as documented
                const questionId = answer.quiz_id;
                
                if (!questionStats[questionId]) {
                  questionStats[questionId] = {
                    correct: 0,
                    incorrect: 0,
                    total: 0,
                    lastIncorrect: false
                  };
                }
                
                questionStats[questionId].total++;
                
                // Use is_correct field as documented
                if (answer.is_correct) {
                  questionStats[questionId].correct++;
                } else {
                  questionStats[questionId].incorrect++;
                  // Track if the most recent attempt was incorrect
                  if (attempt.date > (questionStats[questionId].lastAttemptDate || '')) {
                    questionStats[questionId].lastIncorrect = true;
                    questionStats[questionId].lastAttemptDate = attempt.date;
                  }
                }
              });
            }
          });
          
          // Update question data with performance info
          for (let i = 0; i < preparedQuestions.length; i++) {
            const q = preparedQuestions[i];
            const stats = questionStats[q.id];
            
            if (stats) {
              const previousPerformance = stats.total > 0 ? stats.correct / stats.total : 0.5;
              preparedQuestions[i] = {
                ...q,
                previousPerformance,
                difficulty: previousPerformance < 0.4 ? 'hard' : previousPerformance < 0.7 ? 'medium' : 'easy',
                priorityScore: stats.lastIncorrect ? 100 : (1 - previousPerformance) * 100,
                lastIncorrect: stats.lastIncorrect
              };
            }
          }
          
          // Sort: First previously incorrect, then by priorityScore (lower performance first)
          preparedQuestions.sort((a, b) => {
            if (a.lastIncorrect && !b.lastIncorrect) return -1;
            if (!a.lastIncorrect && b.lastIncorrect) return 1;
            return b.priorityScore - a.priorityScore;
          });
        } else {
          console.log('No previous attempts found for this quiz');
        }
      } catch (historyError) {
        console.warn('Could not load quiz history, using unsorted questions:', historyError);
        // Continue with unsorted questions if history fails
      }
      
      // Verify we have valid data before setting questions
      if (preparedQuestions.length === 0) {
        throw new Error('No valid questions could be prepared for this quiz.');
      }
      
      // Check that all questions have the required fields
      const invalidQuestions = preparedQuestions.filter(q => 
        !q.question || !Array.isArray(q.options) || q.options.length === 0
      );
      
      if (invalidQuestions.length > 0) {
        console.warn(`Found ${invalidQuestions.length} invalid questions, removing them`);
        // Filter out invalid questions
        const validQuestions = preparedQuestions.filter(q => 
          q.question && Array.isArray(q.options) && q.options.length > 0
        );
        
        if (validQuestions.length === 0) {
          throw new Error('No valid questions found for this quiz.');
        }
        
        setQuestions(validQuestions);
      } else {
        setQuestions(preparedQuestions);
      }
      
      setStartTime(Date.now());
      console.log('Active recall session prepared successfully');
    } catch (error) {
      console.error('Error preparing active recall session:', error);
      
      // Show error to user
      alert(`Could not load questions: ${error.message}`);
      
      // Go back to quiz selection
      setSelectedQuiz(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  // When user selects a quiz
  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    prepareActiveRecallSession(quiz.id);
  };

  const handleOptionSelect = (optionIndex) => {
    if (showAnswer) return;
    
    setSelectedOption(optionIndex);
    setShowAnswer(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctOptionIndex;
    
    setSessionStats(prev => {
      // Create or update the questionResults array to track each question's result
      const questionResults = prev.questionResults || [];
      questionResults[currentQuestionIndex] = {
        questionIndex: currentQuestionIndex,
        questionId: currentQuestion.id,
        selectedOption: optionIndex,
        correctOption: currentQuestion.correctOptionIndex,
        correct: isCorrect
      };
      
      return {
        ...prev,
        completed: prev.completed + 1,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        incorrect: isCorrect ? prev.incorrect : prev.incorrect + 1,
        questionResults
      };
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      // Calculate total time spent
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      setSessionStats(prev => ({
        ...prev,
        timeSpent: totalTime
      }));
      setSessionComplete(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowAnswer(false);
    }
  };
  
  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setSessionComplete(false);
    setSessionStats({
      completed: 0,
      correct: 0,
      incorrect: 0,
      timeSpent: 0,
      questionResults: []
    });
    setStartTime(Date.now());
  };
  
  // Function to start a retake session
  const startRetakeQuiz = (quizId, title, previousScore) => {
    // In a real implementation, this would fetch the user's previous answers
    // For this example, we'll create mock data
    const mockPreviousAnswers = [
      { questionId: 1, correct: false },
      { questionId: 2, correct: false },
      { questionId: 3, correct: true },
      { questionId: 4, correct: true },
      { questionId: 5, correct: false },
      { questionId: 6, correct: true },
      { questionId: 7, correct: false },
      { questionId: 8, correct: true },
    ];
    
    // Store retake information in localStorage
    const retakeData = {
      quizId,
      title,
      previousScore,
      previousAnswers: mockPreviousAnswers,
      timestamp: Date.now()
    };
    
    localStorage.setItem('activeRecallRetake', JSON.stringify(retakeData));
    
    // Reload the page to start the retake session
    window.location.reload();
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Add this function to the component to get a better explanation
  const getRetakeExplanation = (question) => {
    if (!isRetake || !question.userPreviousAnswer) {
      return getPersonalizedExplanation(question, selectedOption);
    }
    
    const previousAnswerLetter = String.fromCharCode(65 + parseInt(question.userPreviousAnswer));
    const correctAnswerLetter = String.fromCharCode(65 + question.correctOptionIndex);
    
    const personalizedExplanation = getPersonalizedExplanation(question, question.userPreviousAnswer);
    
    return `${personalizedExplanation}
    
In your previous attempt, you selected option ${previousAnswerLetter}: "${question.options[parseInt(question.userPreviousAnswer)]}".
    
The correct answer is option ${correctAnswerLetter}: "${question.options[question.correctOptionIndex]}".`;
  };
  
  const getPersonalizedExplanation = (question, userAnswer) => {
    if (userAnswer === null || userAnswer === undefined) {
      return question.explanation || 'No explanation available.';
    }
    
    try {
      // Parse the explanation as JSON
      const explanations = typeof question.explanation === 'string' 
        ? JSON.parse(question.explanation) 
        : question.explanation;
      
      if (typeof explanations === 'object' && explanations !== null) {
        // Convert userAnswer index to option letter (0 -> A, 1 -> B, etc.)
        const optionLetter = String.fromCharCode(65 + parseInt(userAnswer));
        return explanations[optionLetter] || explanations[userAnswer] || 'No explanation available for this option.';
      }
    } catch (error) {
      console.warn('Failed to parse explanation as JSON:', error);
    }
    
    // Fallback to original explanation if parsing fails
    return question.explanation || 'No explanation available.';
  };
  
  // Calculate improvement for retake sessions
  const calculateRetakeImprovement = () => {
    if (!isRetake) return 0;
    
    const incorrectQuestionsCount = questions.filter(q => 
      q.priorityReason === "Previously incorrect"
    ).length;
    
    // Use sessionStats instead of a nonexistent results object
    // The ratio of correct answers to total answers gives an approximation
    const correctRatio = sessionStats.correct / sessionStats.completed;
    const estimatedImprovement = Math.round(correctRatio * 100);
    
    return estimatedImprovement;
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <ContentContainer>
          <LoadingState>
            <LoaderSpinner />
            <p>Preparing your {isRetake ? 'quiz retake' : 'personalized active recall'} session...</p>
          </LoadingState>
        </ContentContainer>
      </PageContainer>
    );
  }
  
  if (sessionComplete) {
    return (
      <PageContainer>
        <ContentContainer>
          <Header>
            <Title>
              <FaBrain /> {isRetake ? 'Quiz Retake Complete' : 'Active Recall Session'}
            </Title>
            <BackLink to="/quiz-history">
              <FaArrowLeft /> Back to Quiz History
            </BackLink>
          </Header>
          
          <CompletionScreen 
            stats={sessionStats} 
            questions={questions} 
            isRetake={isRetake}
            originalQuizId={originalQuizId}
            calculateRetakeImprovement={calculateRetakeImprovement}
            resetSession={resetSession}
            formatTime={formatTime}
          />
        </ContentContainer>
      </PageContainer>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <PageContainer className="active-recall-container">
      <ContentContainer>
        <Header>
          <Title>
            <FaBrain />
            Active Recall Learning
          </Title>
          <BackLink to="/dashboard">
            <FaArrowLeft />
            Back to Dashboard
          </BackLink>
        </Header>
        
        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <p>Preparing your active recall session...</p>
          </LoadingContainer>
        ) : sessionComplete ? (
          <CompletionScreen 
            stats={sessionStats} 
            questions={questions} 
            isRetake={isRetake}
            originalQuizId={originalQuizId}
            calculateRetakeImprovement={calculateRetakeImprovement}
            resetSession={resetSession}
            formatTime={formatTime}
          />
        ) : !selectedQuiz ? (
          <>
            <InstructionCard>
              <h2>Select a Quiz for Active Recall</h2>
              <p>Choose one of your learning materials to strengthen your knowledge. We'll prioritize questions you've struggled with in the past, followed by a mix of questions you've answered correctly before.</p>
            </InstructionCard>
            
            {availableQuizzes.length === 0 ? (
              <EmptyState>
                <FaBook />
                <h3>No quizzes available</h3>
                <p>Upload documents and generate quizzes first to use Active Recall</p>
                <ActionButton to="/dashboard">
                  Go to Dashboard
                </ActionButton>
              </EmptyState>
            ) : (
              <QuizzesGrid>
                {availableQuizzes.map(quiz => (
                  <QuizSelectionCard key={quiz.id} onClick={() => handleQuizSelect(quiz)}>
                    <h3>{quiz.title}</h3>
                    <p>
                      <FaQuestionCircle />
                      {quiz.questionCount || '?'} questions
                    </p>
                    <SelectButton>
                      Start Practice
                    </SelectButton>
                  </QuizSelectionCard>
                ))}
              </QuizzesGrid>
            )}
          </>
        ) : (
          // Quiz questions display
          <>
            <QuizLabel score={currentQuestion?.previousPerformance ? (currentQuestion.previousPerformance * 100) : null}>
              <div className="quiz-source">
                <FaBook /> {selectedQuiz.title}
              </div>
              {currentQuestion?.previousPerformance !== null && currentQuestion?.previousPerformance !== 0.5 && (
                <div className="previous-score">
                  Previous score: {Math.round(currentQuestion.previousPerformance * 100)}%
                </div>
              )}
            </QuizLabel>
            
            <ProgressBar progress={progress}>
              <div className="progress"></div>
            </ProgressBar>
            
            {currentQuestion?.lastIncorrect && (
              <PreviousAnswerNote>
                <FaExclamationCircle />
                <p>You answered this question incorrectly in a previous attempt. Take your time to get it right!</p>
              </PreviousAnswerNote>
            )}
            
            <QuestionCard
              key={currentQuestion?.id || currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionHeader difficulty={currentQuestion?.difficulty || 'medium'}>
                <div className="question-meta">
                  <FaQuestionCircle /> Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="difficulty">
                  {currentQuestion?.difficulty === 'hard' ? 'Hard' : 
                   currentQuestion?.difficulty === 'medium' ? 'Medium' : 'Easy'}
                </div>
              </QuestionHeader>
              
              <QuestionText>{currentQuestion?.question}</QuestionText>
              
              <OptionsContainer>
                {currentQuestion?.options.map((option, index) => (
                  <OptionItem
                    key={index}
                    selected={selectedOption === index}
                    isCorrect={currentQuestion.correctOptionIndex === index}
                    wasPreviouslySelected={isRetake && currentQuestion.userPreviousAnswer === index.toString()}
                    showAnswer={showAnswer}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="previous-answer-badge">Previous Answer</div>
                    <div className="option-letter">
                      {showAnswer && currentQuestion.correctOptionIndex === index ? (
                        <FaCheckCircle />
                      ) : showAnswer && selectedOption === index ? (
                        <FaTimesCircle />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <div className="option-text">{option}</div>
                    <div className="option-icon">
                      {index === currentQuestion.correctOptionIndex ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                  </OptionItem>
                ))}
              </OptionsContainer>
              
              {showAnswer && currentQuestion?.explanation && (
                <ExplanationBox>
                  <h4><FaLightbulb /> Explanation</h4>
                  <p>{isRetake ? getRetakeExplanation(currentQuestion) : currentQuestion.explanation}</p>
                </ExplanationBox>
              )}
              
              <ActionButtons>
                <SecondaryButton 
                  onClick={handlePrevQuestion} 
                  disabled={currentQuestionIndex === 0}
                >
                  <FaArrowLeft /> Previous
                </SecondaryButton>
                
                {!showAnswer ? (
                  <PrimaryButton onClick={() => handleOptionSelect(currentQuestion.correctOptionIndex)}>
                    <FaLightbulb /> Show Answer
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        <FaArrowRight /> Next Question
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Complete Session
                      </>
                    )}
                  </PrimaryButton>
                )}
              </ActionButtons>
            </QuestionCard>
            
            <SessionStats>
              <StatItem highlight={colors.blurple}>
                <h3><FaQuestionCircle /> Progress</h3>
                <div className="value">{currentQuestionIndex >= 0 && questions.length > 0 ? Math.round(progress) : 0}%</div>
              </StatItem>
              <StatItem highlight={colors.green}>
                <h3><FaCheckCircle /> Correct</h3>
                <div className="value">{sessionStats.correct}</div>
              </StatItem>
              <StatItem highlight={colors.red}>
                <h3><FaTimesCircle /> Incorrect</h3>
                <div className="value">{sessionStats.incorrect}</div>
              </StatItem>
              <StatItem>
                <h3><FaClock /> Time</h3>
                <div className="value">{formatTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000))}</div>
              </StatItem>
            </SessionStats>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

// Additional styled components
const InstructionCard = styled.div`
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${colors.white};
  }
  
  p {
    color: ${colors.greyple};
    line-height: 1.5;
  }
`;

const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const QuizSelectionCard = styled.div`
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${colors.white};
  }
  
  p {
    display: flex;
    align-items: center;
    color: ${colors.greyple};
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const SelectButton = styled.button`
  background-color: ${colors.blurple};
  color: ${colors.white};
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${colors.channelHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  
  svg {
    font-size: 3rem;
    color: ${colors.greyple};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${colors.white};
  }
  
  p {
    color: ${colors.greyple};
    margin-bottom: 2rem;
  }
`;

const ActionButton = styled(Link)`
  background-color: ${colors.blurple};
  color: ${colors.white};
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  
  &:hover {
    background-color: ${colors.channelHover};
  }
`;

const AnswerSummaryToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: ${colors.darkButNotBlack};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: ${colors.white};
  margin: 1.5rem 0;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  font-size: 0.9rem;
  
  .toggle-icon {
    margin-right: 0.5rem;
    color: ${colors.blurple};
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const AnswerSummarySection = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0 2rem;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const SummaryCategory = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    svg {
      margin-right: 0.6rem;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
`;

const SummaryItem = styled.li`
  background-color: ${props => props.incorrect ? 'rgba(237, 66, 69, 0.05)' : props.correct ? 'rgba(87, 242, 135, 0.05)' : 'transparent'};
  border-left: 3px solid ${props => props.incorrect ? colors.red : props.correct ? colors.green : 'transparent'};
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  
  .question-text {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  .answers {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    
    .selected, .correct {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      
      span:first-child {
        font-weight: 600;
        color: ${colors.greyple};
        margin-right: 0.5rem;
        min-width: 100px;
      }
      
      .incorrect {
        color: ${colors.red};
        text-decoration: line-through;
        opacity: 0.8;
      }
      
      .correct-text {
        color: ${colors.green};
      }
    }
  }
  
  .explanation {
    font-size: 0.85rem;
    font-style: italic;
    color: ${colors.greyple};
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    display: flex;
    align-items: flex-start;
    
    svg {
      margin-right: 0.5rem;
      margin-top: 0.2rem;
      color: ${colors.blurple};
      flex-shrink: 0;
    }
  }
`;

export default ActiveRecall;
