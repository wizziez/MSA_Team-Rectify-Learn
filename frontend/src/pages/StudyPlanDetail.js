import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../utils/apiService';
import { 
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaBook,
  FaGraduationCap,
  FaChartLine,
  FaPlay,
  FaPause,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaYoutube,
  FaGlobe,
  FaNewspaper,
  FaBlog,
  FaQuestionCircle,
  FaLightbulb,
  FaClone,
  FaExternalLinkAlt
} from 'react-icons/fa';
import StudyPlanProgress from '../components/StudyPlanProgress';
import StudyPlanTimeline from '../components/StudyPlanTimeline';

const StudyPlanDetailContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  opacity: 0.9;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    order: -1;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const CardTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
`;

const DaySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const DayButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 60px;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e9ecef'};
  }
`;

const StudyStep = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.completed ? '#4CAF50' : '#e0e0e0'};
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${props => props.completed ? '#f8fff8' : 'white'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.completed ? '#4CAF50' : '#667eea'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const StepTitle = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

const StepTitleText = styled.h4`
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StepMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const StepMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StepDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.5rem 0 1rem 0;
`;

const StepResources = styled.div`
  margin-top: 1rem;
`;

const ResourcesTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
`;

const ResourcesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ResourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 12px;
  background: #f8f9fa;
  color: #007bff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #e3f2fd;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #e3f2fd;
    color: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
    border-color: #007bff;
  }

  svg {
    font-size: 1rem;
    flex-shrink: 0;
  }
`;

const CompleteButton = styled.button`
  background: ${props => props.completed ? '#4CAF50' : '#667eea'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  justify-content: center;

  &:hover {
    background: ${props => props.completed ? '#45a049' : '#5a6fd8'};
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const PriorityBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => {
    switch (props.priority) {
      case 'high':
        return 'background: #ffebee; color: #c62828;';
      case 'medium':
        return 'background: #fff3e0; color: #f57c00;';
      case 'low':
        return 'background: #e8f5e8; color: #2e7d32;';
      default:
        return 'background: #f5f5f5; color: #666;';
    }
  }}
`;

const TypeIcon = styled.div`
  font-size: 1rem;
  color: #667eea;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin: 1rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const StudyPlanDetail = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState(null);
  const [steps, setSteps] = useState([]);
  const [progress, setProgress] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStep, setUpdatingStep] = useState(null);

  useEffect(() => {
    if (planId) {
      loadStudyPlan();
      loadProgress();
      loadSteps();
    }
  }, [planId]);

  useEffect(() => {
    if (planId && selectedDay) {
      loadSteps(selectedDay);
    }
  }, [selectedDay]);

  const loadStudyPlan = async () => {
    try {
      const response = await apiService.getStudyPlan(planId);
      setStudyPlan(response.data);
    } catch (error) {
      console.error('Error loading study plan:', error);
      setError('Failed to load study plan details.');
    }
  };

  const loadProgress = async () => {
    try {
      const response = await apiService.getStudyPlanProgress(planId);
      setProgress(response.data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadSteps = async (day = null) => {
    try {
      setLoading(true);
      const response = await apiService.getStudyPlanSteps(planId, day);
      setSteps(response.data || []);
    } catch (error) {
      console.error('Error loading study steps:', error);
      setError('Failed to load study steps.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStep = async (stepId, currentStatus) => {
    try {
      setUpdatingStep(stepId);
      await apiService.updateStudyPlanStep(stepId, {
        is_completed: !currentStatus
      });
      
      // Update local state
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, is_completed: !currentStatus }
          : step
      ));
      
      // Reload progress
      loadProgress();
      
    } catch (error) {
      console.error('Error updating step:', error);
      alert('Failed to update step. Please try again.');
    } finally {
      setUpdatingStep(null);
    }
  };

  const getStepTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaYoutube />;
      case 'reading':
        return <FaBook />;
      case 'quiz':
        return <FaQuestionCircle />;
      case 'flashcards':
        return <FaClone />;
      case 'mnemonics':
        return <FaLightbulb />;
      case 'review':
        return <FaBook />;
      case 'practice':
        return <FaGraduationCap />;
      default:
        return <FaBook />;
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'youtube':
        return <FaYoutube style={{ color: '#FF0000' }} />;
      case 'article':
        return <FaNewspaper style={{ color: '#4CAF50' }} />;
      case 'blog':
        return <FaBlog style={{ color: '#FF9800' }} />;
      case 'website':
        return <FaGlobe style={{ color: '#2196F3' }} />;
      default:
        return <FaExternalLinkAlt style={{ color: '#666' }} />;
    }
  };

  if (loading && !studyPlan) {
    return (
      <StudyPlanDetailContainer>
        <LoadingSpinner>
          <FaSpinner className="fa-spin" style={{ marginRight: '1rem' }} />
          Loading Study Plan...
        </LoadingSpinner>
      </StudyPlanDetailContainer>
    );
  }

  if (error && !studyPlan) {
    return (
      <StudyPlanDetailContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </StudyPlanDetailContainer>
    );
  }

  if (!studyPlan) {
    return (
      <StudyPlanDetailContainer>
        <ErrorMessage>Study plan not found.</ErrorMessage>
      </StudyPlanDetailContainer>
    );
  }

  // Generate day buttons
  const dayButtons = [];
  for (let i = 1; i <= studyPlan.days_until_exam; i++) {
    dayButtons.push(i);
  }

  return (
    <StudyPlanDetailContainer>
      <Header>
        <BackButton onClick={() => navigate('/study-planner')}>
          <FaArrowLeft />
        </BackButton>
        <HeaderContent>
          <Title>{studyPlan.title}</Title>
          <MetaInfo>
            <MetaItem>
              <FaCalendarAlt />
              Exam: {new Date(studyPlan.exam_date).toLocaleDateString()}
            </MetaItem>
            <MetaItem>
              <FaClock />
              {studyPlan.daily_study_hours}h/day
            </MetaItem>
            <MetaItem>
              <FaGraduationCap />
              {studyPlan.exam_type?.replace('_', ' ')}
            </MetaItem>
          </MetaInfo>
        </HeaderContent>
      </Header>

      <Content>
        <MainContent>
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCalendarAlt />
                Study Schedule - Day {selectedDay}
              </CardTitle>
            </CardHeader>

            <DaySelector>
              {dayButtons.map(day => (
                <DayButton
                  key={day}
                  active={selectedDay === day}
                  onClick={() => setSelectedDay(day)}
                >
                  Day {day}
                </DayButton>
              ))}
            </DaySelector>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <FaSpinner className="fa-spin" style={{ marginRight: '0.5rem' }} />
                Loading steps...
              </div>
            ) : steps.length > 0 ? (
              steps.map(step => (
                <StudyStep key={step.id} completed={step.is_completed}>
                  <StepHeader>
                    <StepTitle>
                      <StepTitleText>
                        <TypeIcon>{getStepTypeIcon(step.step_type)}</TypeIcon>
                        {step.title}
                        <PriorityBadge priority={step.priority}>
                          {step.priority}
                        </PriorityBadge>
                      </StepTitleText>
                      <StepMeta>
                        <StepMetaItem>
                          <FaClock />
                          {step.estimated_duration}h
                        </StepMetaItem>
                        <StepMetaItem>
                          <FaBook />
                          {step.topic}
                        </StepMetaItem>
                      </StepMeta>
                    </StepTitle>
                    <CompleteButton
                      completed={step.is_completed}
                      onClick={() => handleCompleteStep(step.id, step.is_completed)}
                      disabled={updatingStep === step.id}
                    >
                      {updatingStep === step.id ? (
                        <FaSpinner className="fa-spin" />
                      ) : step.is_completed ? (
                        <>
                          <FaCheck />
                          Done
                        </>
                      ) : (
                        <>
                          <FaPlay />
                          Start
                        </>
                      )}
                    </CompleteButton>
                  </StepHeader>

                  <StepDescription>{step.description}</StepDescription>

                  {step.resources && step.resources.length > 0 && (
                    <StepResources>
                      <ResourcesTitle>Recommended Resources:</ResourcesTitle>
                      <ResourcesList>
                        {step.resources.map((resource, index) => (
                          <ResourceLink
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={resource.description}
                          >
                            {getResourceIcon(resource.resource_type)}
                            {resource.title}
                            <FaExternalLinkAlt style={{ marginLeft: 'auto', fontSize: '0.7rem', opacity: 0.7 }} />
                          </ResourceLink>
                        ))}
                      </ResourcesList>
                    </StepResources>
                  )}
                </StudyStep>
              ))
            ) : (
              <EmptyState>
                <FaBook style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
                <p>No study steps scheduled for Day {selectedDay}</p>
              </EmptyState>
            )}
          </Card>
        </MainContent>

        <Sidebar>
          {progress && <StudyPlanProgress progress={progress} />}
          <StudyPlanTimeline studyPlan={studyPlan} currentDay={selectedDay} />
        </Sidebar>
      </Content>
    </StudyPlanDetailContainer>
  );
};

export default StudyPlanDetail;
