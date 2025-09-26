import React from 'react';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaBook, 
  FaPlay, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaCheckCircle,
  FaPauseCircle,
  FaCircle
} from 'react-icons/fa';

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: #e8f5e8; color: #2e7d32;';
      case 'completed':
        return 'background: #e3f2fd; color: #1976d2;';
      case 'paused':
        return 'background: #fff3e0; color: #f57c00;';
      default:
        return 'background: #f5f5f5; color: #666;';
    }
  }}
`;

const Title = styled.h3`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  padding-right: 80px; /* Space for status badge */
`;

const Description = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.85rem;
`;

const ExamType = styled.span`
  background: #f0f0f0;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const DocumentsList = styled.div`
  margin: 1rem 0;
`;

const DocumentsLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const DocumentsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DocumentChip = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProgressSection = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 4px;
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
  }
`;

const ViewButton = styled(ActionButton)`
  background: #2196F3;
  color: white;

  &:hover {
    background: #1976D2;
  }
`;

const EditButton = styled(ActionButton)`
  background: #FF9800;
  color: white;

  &:hover {
    background: #F57C00;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #f44336;
  color: white;

  &:hover {
    background: #d32f2f;
  }
`;

const DaysUntilExam = styled.div`
  text-align: center;
  margin: 1rem 0;
  padding: 0.75rem;
  background: ${props => {
    if (props.daysLeft <= 3) return 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
    if (props.daysLeft <= 7) return 'linear-gradient(135deg, #ffa726, #ff9800)';
    return 'linear-gradient(135deg, #4CAF50, #45a049)';
  }};
  color: white;
  border-radius: 8px;
  font-weight: 600;
`;

const StudyPlanCard = ({ plan, onView, onEdit, onDelete }) => {
  // Calculate progress (mock calculation - you might want to fetch actual progress)
  const totalSteps = plan.steps?.length || 0;
  const completedSteps = plan.steps?.filter(step => step.is_completed)?.length || 0;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Calculate days until exam
  const examDate = new Date(plan.exam_date);
  const today = new Date();
  const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <FaPlay />;
      case 'completed':
        return <FaCheckCircle />;
      case 'paused':
        return <FaPauseCircle />;
      default:
        return <FaCircle />;
    }
  };

  const formatExamType = (type) => {
    return type.replace('_', ' ');
  };

  return (
    <Card>
      <StatusBadge status={plan.status}>
        {getStatusIcon(plan.status)}
        {plan.status}
      </StatusBadge>

      <Title>{plan.title}</Title>
      
      {plan.description && (
        <Description>{plan.description}</Description>
      )}

      <MetaRow>
        <MetaItem>
          <FaClock />
          {plan.daily_study_hours}h/day
        </MetaItem>
        <ExamType>{formatExamType(plan.exam_type)}</ExamType>
      </MetaRow>

      <MetaRow>
        <MetaItem>
          <FaCalendarAlt />
          Exam: {new Date(plan.exam_date).toLocaleDateString()}
        </MetaItem>
      </MetaRow>

      {daysLeft >= 0 && (
        <DaysUntilExam daysLeft={daysLeft}>
          {daysLeft === 0 ? 'Exam Today!' : `${daysLeft} days until exam`}
        </DaysUntilExam>
      )}

      {plan.documents && plan.documents.length > 0 && (
        <DocumentsList>
          <DocumentsLabel>Study Materials ({plan.documents.length})</DocumentsLabel>
          <DocumentsGrid>
            {plan.documents.slice(0, 3).map(doc => (
              <DocumentChip key={doc.id}>
                <FaBook size={10} />
                {doc.filename}
              </DocumentChip>
            ))}
            {plan.documents.length > 3 && (
              <DocumentChip>
                +{plan.documents.length - 3} more
              </DocumentChip>
            )}
          </DocumentsGrid>
        </DocumentsList>
      )}

      <ProgressSection>
        <ProgressText>
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </ProgressText>
        <ProgressBar>
          <ProgressFill progress={progressPercentage} />
        </ProgressBar>
        <ProgressText>
          <span>{completedSteps} of {totalSteps} steps completed</span>
        </ProgressText>
      </ProgressSection>

      <ActionButtons>
        <ViewButton onClick={onView}>
          <FaEye />
          View Plan
        </ViewButton>
        {onEdit && (
          <EditButton onClick={onEdit}>
            <FaEdit />
            Edit
          </EditButton>
        )}
        <DeleteButton onClick={onDelete}>
          <FaTrash />
          Delete
        </DeleteButton>
      </ActionButtons>
    </Card>
  );
};

export default StudyPlanCard;
