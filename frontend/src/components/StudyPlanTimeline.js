import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaBook, FaClock, FaCheckCircle, FaCircle } from 'react-icons/fa';

const TimelineCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const TimelineTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const StudyPlanMeta = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const MetaLabel = styled.div`
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaValue = styled.div`
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
`;

const DocumentsList = styled.div`
  margin-bottom: 1.5rem;
`;

const DocumentsTitle = styled.div`
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DocumentIcon = styled.div`
  color: #667eea;
  font-size: 0.9rem;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  color: #333;
  font-weight: 500;
  font-size: 0.85rem;
  margin-bottom: 2px;
`;

const DocumentMeta = styled.div`
  color: #666;
  font-size: 0.75rem;
`;

const WeeklyOverview = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
`;

const WeekTitle = styled.div`
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DayCell = styled.div`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  ${props => {
    if (props.isToday) {
      return `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      `;
    }
    if (props.isExamDay) {
      return `
        background: #ffebee;
        color: #c62828;
        border: 2px solid #c62828;
      `;
    }
    if (props.hasStudy) {
      return `
        background: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #4caf50;
      `;
    }
    return `
      background: #f8f9fa;
      color: #666;
      border: 1px solid #e0e0e0;
    `;
  }}

  &:hover {
    transform: scale(1.05);
  }
`;

const DayLabel = styled.div`
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const WeekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const CurrentWeekIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  border-radius: 8px;
`;

const StudyPlanTimeline = ({ studyPlan, currentDay }) => {
  if (!studyPlan) return null;

  // Calculate current week
  const startDate = new Date(studyPlan.created_at);
  const today = new Date();
  const examDate = new Date(studyPlan.exam_date);

  // Generate calendar for current week
  const getCurrentWeek = () => {
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const currentWeek = getCurrentWeek();

  const isDayWithStudy = (date) => {
    const daysDiff = Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return daysDiff >= 1 && daysDiff <= studyPlan.days_until_exam;
  };

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const isExamDay = (date) => {
    return date.toDateString() === examDate.toDateString();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExam = () => {
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <TimelineCard>
      <TimelineHeader>
        <FaCalendarAlt />
        <TimelineTitle>Study Timeline</TimelineTitle>
      </TimelineHeader>

      <StudyPlanMeta>
        <MetaRow>
          <MetaLabel>
            <FaClock />
            Daily Study Time
          </MetaLabel>
          <MetaValue>{studyPlan.daily_study_hours} hours</MetaValue>
        </MetaRow>
        
        <MetaRow>
          <MetaLabel>
            <FaCalendarAlt />
            Study Period
          </MetaLabel>
          <MetaValue>{studyPlan.days_until_exam} days</MetaValue>
        </MetaRow>
        
        <MetaRow>
          <MetaLabel>
            <FaCheckCircle />
            Total Hours
          </MetaLabel>
          <MetaValue>{studyPlan.total_study_hours} hours</MetaValue>
        </MetaRow>
      </StudyPlanMeta>

      {studyPlan.documents && studyPlan.documents.length > 0 && (
        <DocumentsList>
          <DocumentsTitle>
            <FaBook />
            Study Materials ({studyPlan.documents.length})
          </DocumentsTitle>
          {studyPlan.documents.slice(0, 3).map(doc => (
            <DocumentItem key={doc.id}>
              <DocumentIcon>
                <FaBook />
              </DocumentIcon>
              <DocumentInfo>
                <DocumentName>{doc.filename}</DocumentName>
                <DocumentMeta>
                  {doc.file_type?.toUpperCase()} • {(doc.size / 1024).toFixed(1)}KB
                </DocumentMeta>
              </DocumentInfo>
            </DocumentItem>
          ))}
          {studyPlan.documents.length > 3 && (
            <DocumentItem>
              <DocumentIcon>
                <FaBook />
              </DocumentIcon>
              <DocumentInfo>
                <DocumentName>+{studyPlan.documents.length - 3} more documents</DocumentName>
                <DocumentMeta>Additional study materials</DocumentMeta>
              </DocumentInfo>
            </DocumentItem>
          )}
        </DocumentsList>
      )}

      <WeeklyOverview>
        <WeekTitle>Current Week</WeekTitle>
        
        <CurrentWeekIndicator>
          <FaCircle style={{ color: '#667eea', fontSize: '0.5rem' }} />
          <span style={{ fontSize: '0.85rem', color: '#333' }}>
            {getDaysUntilExam() > 0 ? `${getDaysUntilExam()} days until exam` : 'Exam today!'}
          </span>
        </CurrentWeekIndicator>

        <WeekGrid>
          {WeekDays.map((day, index) => (
            <DayLabel key={index}>{day}</DayLabel>
          ))}
        </WeekGrid>
        
        <WeekGrid>
          {currentWeek.map((date, index) => (
            <DayCell
              key={index}
              isToday={isToday(date)}
              isExamDay={isExamDay(date)}
              hasStudy={isDayWithStudy(date)}
            >
              {date.getDate()}
            </DayCell>
          ))}
        </WeekGrid>

        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '2px' }}></div>
            Today
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#e8f5e8', border: '1px solid #4caf50', borderRadius: '2px' }}></div>
            Study Day
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', background: '#ffebee', border: '1px solid #c62828', borderRadius: '2px' }}></div>
            Exam Day
          </div>
        </div>
      </WeeklyOverview>
    </TimelineCard>
  );
};

export default StudyPlanTimeline;
