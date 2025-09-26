import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHistory, 
  FaCalendarAlt, 
  FaClock, 
  FaTrophy,
  FaSearch, 
  FaChartBar, 
  FaSadTear,
  FaEye,
  FaExclamationCircle,
  FaDiscord,
  FaHashtag,
  FaTimes,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaFilter,
  FaSort,
  FaBrain,
  FaLightbulb,
  FaInfoCircle,
  FaCheckCircle
} from 'react-icons/fa';
import { BiRefresh } from 'react-icons/bi';
import apiService from '../utils/apiService';
import { motion } from 'framer-motion';

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
  channelSelected: '#42464D',
  memberList: '#2F3136',
  chatInput: '#40444B',
  highlight: 'rgba(88, 101, 242, 0.3)',
  nearBlack: '#23272A'
};

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${colors.dark};
  color: ${colors.white};
  min-height: calc(100vh - 70px);
  width: 100%;
  max-width: 100%;
  margin: 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    
    .actions-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${colors.blurple};
  }
`;

const SearchBar = styled.div`
  display: flex;
  width: 100%;
  max-width: 350px;
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
  
  input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 4px 0 0 4px;
    font-size: 0.95rem;
    background-color: ${colors.chatInput};
    color: ${colors.white};
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${colors.blurple};
    }
    
    &::placeholder {
      color: ${colors.greyple};
    }
  }
  
  button {
    padding: 0.75rem 1.25rem;
    background-color: ${colors.blurple};
    color: ${colors.white};
    border: none;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-weight: 500;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #4752c4;
    }
    
    svg {
      margin-right: 0.5rem;
    }
    
    @media (max-width: 480px) {
      padding: 0.75rem 1rem;
      
      svg {
        margin-right: 0;
      }
      
      span {
        display: none;
      }
    }
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? colors.blurple : colors.darkButNotBlack};
  color: ${props => props.active ? colors.white : colors.greyple};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? colors.blurple : colors.channelHover};
    color: ${colors.white};
  }
`;

const QuizHistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const QuizHistoryCard = styled.div`
  background-color: ${colors.nearBlack};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid ${props => {
    if (props.score >= 80) return colors.green;
    if (props.score >= 60) return colors.yellow;
    return colors.red;
  }};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.4);
  }
`;

const QuizHeader = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const QuizTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  
  a {
    color: ${colors.white};
    transition: color 0.2s;
    
    &:hover {
      color: ${colors.blurple};
      text-decoration: none;
    }
  }
`;

const QuizDate = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.greyple};
  font-size: 0.85rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${colors.blurple};
    font-size: 0.8rem;
  }
`;

const QuizMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuizTime = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.greyple};
  font-size: 0.85rem;
  
  svg {
    margin-right: 0.5rem;
    color: ${colors.blurple};
    font-size: 0.8rem;
  }
`;

const QuizDetails = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

const ScoreCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1.5rem;
  background-color: ${props => {
    if (props.score >= 80) return 'rgba(87, 242, 135, 0.15)';
    if (props.score >= 60) return 'rgba(254, 231, 92, 0.15)';
    return 'rgba(237, 66, 69, 0.15)';
  }};
  border: 2px solid ${props => {
    if (props.score >= 80) return colors.green;
    if (props.score >= 60) return colors.yellow;
    return colors.red;
  }};
  
  .score {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => {
      if (props.score >= 80) return colors.green;
      if (props.score >= 60) return colors.yellow;
      return colors.red;
    }};
  }
`;

const StatItem = styled.div`
  margin-bottom: 0.75rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${colors.greyple};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.white};
`;

const QuizContent = styled.div`
  padding: 1.25rem;
`;

const QuizScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const QuizScore = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 700;
  background: ${props => {
    if (props.score >= 80) return colors.green;
    if (props.score >= 60) return colors.yellow;
    return colors.red;
  }};
  color: ${colors.white};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const QuizStats = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const QuizStat = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${colors.greyple};
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
    color: ${props => props.color || colors.blurple};
    min-width: 16px;
  }
  
  span {
    margin-left: 0.25rem;
    font-weight: 500;
    color: ${colors.white};
  }
`;

const QuizActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const QuizButton = styled(Link)`
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  background-color: ${colors.blurple};
  color: ${colors.white};
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background-color: #4752c4;
    text-decoration: none;
    color: ${colors.white};
  }
`;

const NoQuizzesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  
  svg {
    font-size: 4rem;
    color: ${colors.greyple};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${colors.white};
  }
  
  p {
    color: ${colors.greyple};
    margin-bottom: 2rem;
    max-width: 500px;
  }
`;

const ActionLink = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${colors.blurple};
  color: ${colors.white};
  border-radius: 4px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1rem;
    color: ${colors.white};
  }
  
  &:hover {
    background-color: #4752c4;
    transform: translateY(-2px);
    text-decoration: none;
    color: ${colors.white};
  }
`;

const Alert = styled.div`
  padding: 1rem;
  background-color: ${props => props.success ? 'rgba(87, 242, 135, 0.1)' : 'rgba(237, 66, 69, 0.1)'};
  color: ${props => props.success ? colors.green : colors.red};
  border-radius: 4px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  border-left: 3px solid ${props => props.success ? colors.green : colors.red};
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }
  
  .close-button {
    margin-left: auto;
    background: none;
    border: none;
    color: ${colors.greyple};
    cursor: pointer;
    font-size: 1rem;
    
    &:hover {
      color: ${colors.white};
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(88, 101, 242, 0.1);
  border-left: 4px solid ${colors.blurple};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const DifficultyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.difficulty) {
      case 'easy': return 'rgba(87, 242, 135, 0.1)';
      case 'medium': return 'rgba(254, 231, 92, 0.1)';
      case 'hard': return 'rgba(237, 66, 69, 0.1)';
      default: return 'rgba(88, 101, 242, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.difficulty) {
      case 'easy': return colors.green;
      case 'medium': return colors.yellow;
      case 'hard': return colors.red;
      default: return colors.blurple;
    }
  }};
  margin-left: 0.5rem;
`;

// Update RecallBanner with a more modern design and improved content
const RecallBanner = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  background: linear-gradient(135deg, ${colors.darkButNotBlack} 0%, #3a3d45 100%);
  border-radius: 12px;
  padding: 1.75rem;
  margin-bottom: 2rem;
  border-left: 4px solid ${colors.blurple};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    right: -10px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(88, 101, 242, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const RecallInfo = styled.div`
  flex: 2;
  position: relative;
  z-index: 1;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    color: ${colors.white};
    
    svg {
      margin-right: 0.75rem;
      color: ${colors.blurple};
    }
  }
  
  .subtitle {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: ${colors.blurple};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: ${colors.greyple};
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    
    li {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      color: ${colors.greyple};
      font-size: 0.9rem;
      
      svg {
        color: ${colors.blurple};
        margin-right: 0.5rem;
        min-width: 16px;
      }
    }
  }
  
  .research {
    font-style: italic;
    font-size: 0.85rem;
    color: ${colors.greyple};
    border-left: 2px solid ${colors.blurple};
    padding-left: 0.75rem;
    margin-top: 0.75rem;
  }
  
  @media (max-width: 768px) {
    text-align: center;
    
    h3, .subtitle {
      justify-content: center;
    }
    
    ul li {
      justify-content: center;
    }
    
    .research {
      text-align: left;
    }
  }
`;

const RecallAction = styled.button`
  flex: 0 0 auto;
  align-self: center;
  padding: 1rem 1.75rem;
  background-color: ${colors.blurple};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(88, 101, 242, 0.3);
  position: relative;
  z-index: 1;
  min-width: 200px;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.1rem;
  }
  
  &:hover {
    background-color: #4752c4;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(88, 101, 242, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PerformanceSection = styled.div`
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const PerformanceTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${colors.blurple};
  }
`;

const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
`;

const StatBox = styled.div`
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  
  h4 {
    color: ${colors.greyple};
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${props => props.highlight || colors.white};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  
  svg {
    font-size: 3rem;
    color: ${colors.greyple};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
  
  p {
    color: ${colors.greyple};
    max-width: 500px;
    margin: 0 auto 1.5rem;
    line-height: 1.5;
  }
  
  button {
    background-color: ${colors.blurple};
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #4752c4;
    }
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

const NoHistory = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: ${colors.darkButNotBlack};
  border-radius: 8px;
  margin: 3rem auto;
  max-width: 600px;
  
  svg {
    font-size: 3rem;
    color: ${colors.greyple};
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${colors.white};
  }
  
  p {
    color: ${colors.greyple};
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: ${colors.blurple};
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #4752c4;
    }
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 0.95rem;
  background-color: ${colors.chatInput};
  color: ${colors.white};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${colors.blurple};
  }
  
  &::placeholder {
    color: ${colors.greyple};
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3a86ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #2a75f3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background-color: #a0c0ff;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    
    span {
      display: none;
    }
  }
`;

const FileIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-right: 8px;
  width: 36px;
  text-align: center;
  
  &.pdf {
    background-color: #f40f02;
    color: white;
  }
  
  &.word {
    background-color: #2b579a;
    color: white;
  }
  
  &.ppt {
    background-color: #d24726;
    color: white;
  }
  
  &.txt {
    background-color: #34495e;
    color: white;
  }
  
  &.img {
    background-color: #27ae60;
    color: white;
  }
`;

const QuizHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgScore: 0,
    bestScore: 0,
    weakTopics: [],
    strongTopics: []
  });
  const [infoMessage, setInfoMessage] = useState('');
  
  // Create a function for fetching history that can be called at any time
  const fetchQuizHistory = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage('');
    
    try {
      // Get quiz history directly from the API
      const historyData = await apiService.getQuizHistory();
      console.log('Quiz history data from API:', historyData);
      
      if (!historyData || historyData.length === 0) {
        setQuizHistory([]);
        calculateStats([]);
        setInfoMessage('No quiz history found. Upload documents and generate quizzes to see your history.');
      } else {
        // Format the quiz history data for display with the updated API response structure
        const formattedHistory = historyData.map(attempt => {
          // Get the score directly from the API and ensure it's an integer percentage
          let finalScore;
          if (attempt.score !== undefined) {
            // If score is a decimal (0-1 range), convert to percentage (0-100)
            finalScore = typeof attempt.score === 'number' && attempt.score <= 1 
              ? Math.round(attempt.score * 100) 
              : Math.round(attempt.score);
          } else {
            // Fallback calculation if no score is provided
            const correctAnswers = attempt.correct_answers || 0;
            const totalQuestions = attempt.total_questions || (attempt.answers ? attempt.answers.length : 0);
            finalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
          }
            
          console.log(`History item: ${attempt.quiz_title}, score ${finalScore}%`);
            
          return {
            id: attempt.id || attempt.quiz_session_id || `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            title: attempt.quiz_title || "Untitled Quiz",
            quizId: attempt.quiz_id || attempt.document_id,
            documentId: attempt.document_id,
            date: attempt.date ? new Date(attempt.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            score: finalScore,
            correctAnswers: attempt.correct_answers || 0,
            totalQuestions: attempt.total_questions || (attempt.answers ? attempt.answers.length : 0),
            timeSpent: attempt.time_spent || 0,
            difficulty: attempt.difficulty || 'medium',
            fileType: attempt.file_type
          };
        });
        
        console.log('Formatted quiz history:', formattedHistory);
        setQuizHistory(formattedHistory);
        calculateStats(formattedHistory);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
      
      // Set a specific error message based on the error
      if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
        setErrorMessage('One or more API endpoints are not available. Please check that the backend server is properly configured.');
      } else if (error.message && error.message.includes('Network Error')) {
        setErrorMessage('Cannot connect to the server. Please check your internet connection and that the backend is running.');
      } else {
        setErrorMessage(`Failed to load quiz history: ${error.message || 'Unknown error'}`);
      }
      
      setQuizHistory([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  };
  
  // Automatically fetch history when component mounts
  useEffect(() => {
    fetchQuizHistory();
    
    // Check URL parameters for refresh=true to force reload history
    // This allows us to refresh when navigating from quiz completion
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('refresh') === 'true') {
      fetchQuizHistory(true);
    }
  }, []);

  // Add refresh handler
  const handleRefresh = () => {
    fetchQuizHistory(true);
  };
  
  const calculateStats = (history) => {
    if (!history || history.length === 0) {
      setStats({
        totalAttempts: 0,
        avgScore: 0,
        bestScore: 0,
        weakTopics: [],
        strongTopics: []
      });
      return;
    }
    
    // Calculate total attempts using actual history data
    const totalAttempts = history.length;
    
    // Calculate average score from actual quiz results
    const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0);
    const avgScore = totalScore / totalAttempts;
    
    // Find best score from actual quiz results
    const bestScore = Math.max(...history.map(quiz => quiz.score));
    
    // Group by actual quiz titles to identify weak and strong areas
    const quizzesByTitle = history.reduce((acc, quiz) => {
      if (!acc[quiz.title]) {
        acc[quiz.title] = [];
      }
      acc[quiz.title].push(quiz);
      return acc;
    }, {});
    
    // Calculate average score per topic using actual data
    const topicScores = Object.entries(quizzesByTitle).map(([title, quizzes]) => {
      const avgTopicScore = quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length;
      return { title, avgScore: avgTopicScore };
    });
    
    // Sort by actual average scores
    topicScores.sort((a, b) => a.avgScore - b.avgScore);
    
    // Get weak and strong topics based on real data
    const weakTopics = topicScores.slice(0, Math.min(2, topicScores.length)).map(t => t.title);
    const strongTopics = topicScores.slice(-Math.min(2, topicScores.length)).reverse().map(t => t.title);
    
    // Set stats with real data
    setStats({
      totalAttempts,
      avgScore,
      bestScore,
      weakTopics,
      strongTopics
    });
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredHistory = quizHistory.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'high' && quiz.score >= 80) return matchesSearch;
    if (filter === 'medium' && quiz.score >= 60 && quiz.score < 80) return matchesSearch;
    if (filter === 'low' && quiz.score < 60) return matchesSearch;
    if (filter === 'recent') {
      const quizDate = new Date(quiz.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && quizDate >= oneWeekAgo;
    }
    
    return false;
  });
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  const getScoreColor = (score) => {
    if (score >= 80) return colors.green;
    if (score >= 60) return colors.yellow;
    return colors.red;
  };
  
  const getStudyRecommendations = () => {
    if (!stats.weakTopics || stats.weakTopics.length === 0) {
      return 'Take more quizzes to get personalized recommendations';
    }
    
    return stats.weakTopics.join(', ');
  };
  
  const startActiveRecall = () => {
    // Implement enhanced active recall functionality
    if (!quizHistory || quizHistory.length === 0) {
      setInfoMessage("You need to take some quizzes first before using Active Recall.");
      return;
    }
    
    // Process all quizzes to find ones with incorrect answers
    // For each quiz, we'll track incorrect answers and performance
    const quizzesWithPerformanceData = quizHistory.map(quiz => {
      const correctPercentage = quiz.score;
      const incorrectPercentage = 100 - correctPercentage;
      
      // Calculate a priority score based on performance and recency
      // Lower score = higher priority (worse performance)
      // Recent quizzes get higher priority (lower score)
      const daysSinceQuiz = Math.floor((new Date() - new Date(quiz.date)) / (1000 * 60 * 60 * 24));
      const recencyFactor = Math.min(1, daysSinceQuiz / 30); // 0 for today, 1 for 30+ days ago
      
      // Priority score: 70% based on performance, 30% on recency
      const priorityScore = (incorrectPercentage * 0.7) + (recencyFactor * 30 * 0.3);
      
      return {
        ...quiz,
        incorrectPercentage,
        priorityScore,
        priorityReason: incorrectPercentage > 30 
          ? "Low performance" 
          : daysSinceQuiz < 7 
            ? "Recent attempt" 
            : "Spaced repetition"
      };
    });
    
    // Sort by priority score (higher scores = higher priority for review)
    const sortedQuizzes = [...quizzesWithPerformanceData].sort((a, b) => 
      b.priorityScore - a.priorityScore
    );
    
    // Take top 5 quizzes for active recall, or all if less than 5
    const topPriorityQuizzes = sortedQuizzes.slice(0, Math.min(5, sortedQuizzes.length));
    
    console.log("Active Recall Session created with quizzes:", topPriorityQuizzes);
    
    // Save the active recall session to localStorage with enhanced metadata
    const activeRecallSession = {
      quizzes: topPriorityQuizzes,
      createdAt: new Date().toISOString(),
      name: "Active Recall Session",
      description: "Personalized review focusing on your weakest topics and questions you've struggled with previously",
      strategy: "Priority based on performance and optimal spacing for retention",
      metadata: {
        totalQuizzes: quizHistory.length,
        selectedQuizzes: topPriorityQuizzes.length,
        averagePriorityScore: topPriorityQuizzes.reduce((sum, q) => sum + q.priorityScore, 0) / topPriorityQuizzes.length,
        algorithm: "performance-weighted spaced repetition"
      }
    };
    
    localStorage.setItem('activeRecallSession', JSON.stringify(activeRecallSession));
    
    // Navigate to the active recall page
    window.location.href = "/active-recall";
  };
  
  const getFileTypeIcon = (fileType) => {
    if (!fileType) return null;
    
    const type = fileType.toLowerCase();
    if (type === 'pdf') {
      return <FileIcon className="pdf">PDF</FileIcon>;
    } else if (type === 'docx' || type === 'doc') {
      return <FileIcon className="word">DOC</FileIcon>;
    } else if (type === 'pptx' || type === 'ppt') {
      return <FileIcon className="ppt">PPT</FileIcon>;
    } else if (type === 'txt') {
      return <FileIcon className="txt">TXT</FileIcon>;
    } else if (type.match(/jpe?g|png|gif|bmp|webp/)) {
      return <FileIcon className="img">IMG</FileIcon>;
    } else {
      return <FileIcon>{type.substring(0, 3).toUpperCase()}</FileIcon>;
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer className="container">
        <LoadingState>
          <LoaderSpinner />
          <p>Loading your quiz history...</p>
        </LoadingState>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer className="container quiz-history-container">
      <PageHeader>
        <PageTitle>
          <FaHistory /> Quiz History
        </PageTitle>
        
        <div className="actions-container" style={{ display: 'flex', gap: '1rem', width: '100%', flexWrap: 'wrap' }}>
          <RefreshButton 
            onClick={handleRefresh} 
            disabled={isLoading || refreshing}
          >
            <BiRefresh className={refreshing ? 'spinning' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </RefreshButton>
          
          <SearchBar>
            <SearchInput 
              type="text" 
              placeholder="Search quizzes..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button>
              <FaSearch /> <span>Search</span>
            </button>
          </SearchBar>
        </div>
      </PageHeader>
      
      {infoMessage && (
        <Alert success>
          <FaInfoCircle />
          <p>{infoMessage}</p>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert>
          <FaExclamationCircle />
          <p>{errorMessage}</p>
        </Alert>
      )}
      
      
      {quizHistory.length > 0 && (
        <PerformanceSection>
          <PerformanceTitle>
            <FaChartBar /> Your Performance
          </PerformanceTitle>
          
          <StatsWrapper>
            <StatBox>
              <h4>Total Attempts</h4>
              <div className="value">{stats.totalAttempts}</div>
            </StatBox>
            
            <StatBox highlight={getScoreColor(stats.avgScore)}>
              <h4>Average Score</h4>
              <div className="value">{stats.avgScore.toFixed(1)}%</div>
            </StatBox>
            
            <StatBox highlight={colors.green}>
              <h4>Best Score</h4>
              <div className="value">{stats.bestScore}%</div>
            </StatBox>
            
            <StatBox highlight={colors.fuchsia}>
              <h4>Focus Areas</h4>
              <div className="value">{stats.weakTopics.length}</div>
            </StatBox>
          </StatsWrapper>
        </PerformanceSection>
      )}
      
      <FilterSection>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Quizzes
        </FilterButton>
        <FilterButton 
          active={filter === 'recent'} 
          onClick={() => setFilter('recent')}
        >
          Recent
        </FilterButton>
        <FilterButton 
          active={filter === 'high'} 
          onClick={() => setFilter('high')}
        >
          High Scores
        </FilterButton>
        <FilterButton 
          active={filter === 'medium'} 
          onClick={() => setFilter('medium')}
        >
          Medium Scores
        </FilterButton>
        <FilterButton 
          active={filter === 'low'} 
          onClick={() => setFilter('low')}
        >
          Low Scores
        </FilterButton>
      </FilterSection>
      
      {filteredHistory.length > 0 ? (
        <QuizHistoryGrid>
          {filteredHistory.map(quiz => (
            <QuizHistoryCard key={quiz.id} score={quiz.score}>
              <QuizHeader>
                <QuizTitle>
                  <Link to={`/quiz/${quiz.quizId}`}>
                    {getFileTypeIcon(quiz.fileType)} {quiz.title}
                  </Link>
                </QuizTitle>
                <QuizMeta>
                  <QuizDate>
                    <FaCalendarAlt /> {new Date(quiz.date).toLocaleDateString()}
                  </QuizDate>
                  {/* <QuizTime>
                    <FaClock /> {formatTime(quiz.timeSpent)}
                  </QuizTime> */}
                </QuizMeta>
              </QuizHeader>
              
              <QuizDetails>
                <ScoreCircle score={quiz.score}>
                  <div className="score">{quiz.score}%</div>
                </ScoreCircle>
                
                <QuizStats>
                  <StatItem>
                    <StatLabel>Questions</StatLabel>
                    <StatValue>{quiz.totalQuestions}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Correct</StatLabel>
                    <StatValue style={{color: quiz.correctAnswers/quiz.totalQuestions >= 0.6 ? colors.green : quiz.correctAnswers/quiz.totalQuestions >= 0.4 ? colors.yellow : colors.red}}>
                      {quiz.correctAnswers}/{quiz.totalQuestions}
                    </StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Accuracy</StatLabel>
                    <StatValue>{Math.round((quiz.correctAnswers/quiz.totalQuestions) * 100)}%</StatValue>
                  </StatItem>
                </QuizStats>
              </QuizDetails>
              
              <QuizActions>
                <QuizButton as={Link} to="/active-recall">
                  <FaHistory /> Retake Quiz
                </QuizButton>
              </QuizActions>
            </QuizHistoryCard>
          ))}
        </QuizHistoryGrid>
      ) : (
        <NoHistory>
          <FaSadTear />
          <h3>No Quiz History Found</h3>
          <p>
            {infoMessage || "You haven't taken any quizzes matching your search criteria yet."}
          </p>
          <Link to="/dashboard">
            <button>Go to Documents</button>
          </Link>
        </NoHistory>
      )}
    </PageContainer>
  );
};

export default QuizHistory;
