import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import apiService from '../utils/apiService';
import { 
  FaPlus, 
  FaBook, 
  FaClock, 
  FaCalendarAlt, 
  FaChartLine, 
  FaPlay,
  FaEye,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaBrain,
  FaRocket,
  FaLightbulb,
  FaGraduationCap,
  FaCheckCircle,
  FaMagic
} from 'react-icons/fa';
import StudyPlanCreationModal from '../components/StudyPlanCreationModal';
import StudyPlanCard from '../components/StudyPlanCard';

const StudyPlannerContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ActionBar = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CreatePlanButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

const StudyPlansGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 0;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: white;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem auto;
  max-width: 600px;
  text-align: center;
`;

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const slideUp = keyframes`
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const rotateIcon = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progressBar = keyframes`
  0% { width: 0%; }
  100% { width: 100%; }
`;

const floatingParticle = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

// Generation Loader Styled Components
const GenerationLoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 50%);
    ${css`animation: ${sparkle} 3s ease-in-out infinite alternate;`}
  }
`;

const LoaderCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 215, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  ${css`animation: ${slideUp} 0.6s ease-out, ${pulseAnimation} 4s ease-in-out infinite;`}
  position: relative;
  z-index: 1;
`;

const LoaderIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: #ffd700;
  ${css`animation: ${rotateIcon} 2s linear infinite;`}
`;

const LoaderTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  font-weight: 600;
  ${css`animation: ${pulseAnimation} 2s ease-in-out infinite;`}
`;

const LoaderMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.5;
  ${css`animation: ${slideUp} 0.8s ease-out;`}
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 2rem;
`;

const StepIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.active ? '#ffd700' : 'transparent'};
  transition: all 0.3s ease;
  min-width: 80px;
`;

const StepIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.6)'};
  ${props => props.active && css`animation: ${pulseAnimation} 1.5s ease-in-out infinite;`}
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.8)'};
  font-weight: ${props => props.active ? '600' : '400'};
  text-align: center;
`;

const TipContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border-left: 4px solid #ffd700;
`;

const TipIcon = styled.div`
  font-size: 1.2rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const TipText = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
`;

const StudyPlanner = () => {
  const navigate = useNavigate();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [error, setError] = useState(null);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    loadStudyPlans();
  }, []);

  const loadStudyPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getStudyPlans();
      setStudyPlans(response.data || []);
    } catch (error) {
      console.error('Error loading study plans:', error);
      setError('Failed to load study plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    setShowCreationModal(true);
  };

  const handlePlanGenerationStarted = () => {
    setShowCreationModal(false);
    setGeneratingPlan(true);
  };

  const handlePlanCreated = (newPlan) => {
    setStudyPlans(prev => [newPlan, ...prev]);
    setGeneratingPlan(false);
  };

  const handlePlanGenerationError = () => {
    setGeneratingPlan(false);
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this study plan?')) {
      return;
    }

    try {
      await apiService.deleteStudyPlan(planId);
      setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error('Error deleting study plan:', error);
      alert('Failed to delete study plan. Please try again.');
    }
  };

  const handleViewPlan = (planId) => {
    navigate(`/study-plan/${planId}`);
  };

  const filteredAndSortedPlans = studyPlans
    .filter(plan => {
      if (filter === 'all') return true;
      return plan.status === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'exam_date':
          return new Date(a.exam_date) - new Date(b.exam_date);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <StudyPlannerContainer>
        <LoadingSpinner>
          <FaSpinner className="fa-spin" style={{ marginRight: '1rem' }} />
          Loading Study Plans...
        </LoadingSpinner>
      </StudyPlannerContainer>
    );
  }

  if (generatingPlan) {
    return (
      <StudyPlannerContainer>
        <StudyPlanGenerationLoader />
      </StudyPlannerContainer>
    );
  }

  return (
    <StudyPlannerContainer>
      <Header>
        <Title>AI Study Planner</Title>
        <Subtitle>
          Create personalized study roadmaps powered by AI to maximize your exam preparation
        </Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ActionBar>
        <CreatePlanButton onClick={handleCreatePlan}>
          <FaPlus />
          Create New Study Plan
        </CreatePlanButton>

        <FilterBar>
          <FilterSelect 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </FilterSelect>

          <FilterSelect 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Recently Created</option>
            <option value="exam_date">Exam Date</option>
            <option value="title">Title</option>
          </FilterSelect>
        </FilterBar>
      </ActionBar>

      <StudyPlansGrid>
        {filteredAndSortedPlans.length > 0 ? (
          filteredAndSortedPlans.map(plan => (
            <StudyPlanCard
              key={plan.id}
              plan={plan}
              onView={() => handleViewPlan(plan.id)}
              onDelete={() => handleDeletePlan(plan.id)}
            />
          ))
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <FaBook />
            </EmptyStateIcon>
            <EmptyStateTitle>
              {filter === 'all' ? 'No Study Plans Yet' : `No ${filter} Study Plans`}
            </EmptyStateTitle>
            <EmptyStateText>
              {filter === 'all' 
                ? 'Create your first AI-powered study plan to get started with personalized learning paths, resource recommendations, and progress tracking.'
                : `You don't have any ${filter} study plans. Try creating a new plan or changing the filter.`
              }
            </EmptyStateText>
          </EmptyState>
        )}
      </StudyPlansGrid>

      {showCreationModal && (
        <StudyPlanCreationModal
          isOpen={showCreationModal}
          onClose={() => setShowCreationModal(false)}
          onPlanCreated={handlePlanCreated}
          onGenerationStarted={handlePlanGenerationStarted}
          onGenerationError={handlePlanGenerationError}
        />
      )}
    </StudyPlannerContainer>
  );
};

// Enhanced Study Plan Generation Loader Component
const StudyPlanGenerationLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');

  const steps = [
    { icon: FaBrain, title: 'Analyzing Documents', message: 'AI is processing your uploaded materials...' },
    { icon: FaLightbulb, title: 'Identifying Key Topics', message: 'Extracting important concepts and themes...' },
    { icon: FaMagic, title: 'Generating Study Plan', message: 'Creating your personalized roadmap...' },
    { icon: FaRocket, title: 'Finding Resources', message: 'Searching for the best learning materials...' },
    { icon: FaGraduationCap, title: 'Finalizing Plan', message: 'Putting together your complete study guide...' }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 3000); // Change step every 3 seconds

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    setCurrentMessage(steps[currentStep].message);
  }, [currentStep]);

  const CurrentIcon = steps[currentStep].icon;

  const tips = [
    "💡 Your AI study plan will include personalized timelines and priority topics",
    "🎯 We're finding the best YouTube videos and articles for your subjects", 
    "📚 The plan adapts to your available study hours each day",
    "🚀 You'll get interactive quizzes and flashcards integrated into your schedule"
  ];

  return (
    <GenerationLoaderContainer>
      <LoaderCard>
        <LoaderIcon>
          <CurrentIcon />
        </LoaderIcon>
        
        <LoaderTitle>{steps[currentStep].title}</LoaderTitle>
        <LoaderMessage>{currentMessage}</LoaderMessage>
        
        <StepsContainer>
          {steps.map((step, index) => (
            <StepIndicator key={index} active={index === currentStep}>
              <StepIcon active={index === currentStep}>
                <step.icon />
              </StepIcon>
              <StepLabel active={index === currentStep}>
                {step.title.split(' ')[0]}
              </StepLabel>
            </StepIndicator>
          ))}
        </StepsContainer>
        
        <TipContainer>
          <TipIcon>
            <FaLightbulb />
          </TipIcon>
          <TipText>
            {tips[currentStep % tips.length]}
          </TipText>
        </TipContainer>
      </LoaderCard>
    </GenerationLoaderContainer>
  );
};

export default StudyPlanner;
