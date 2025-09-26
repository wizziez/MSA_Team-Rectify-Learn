import React from 'react';
import styled from 'styled-components';
import { FaChartLine, FaClock, FaCheckCircle, FaCalendarAlt, FaFire } from 'react-icons/fa';

const ProgressCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const ProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ProgressTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const OverallProgress = styled.div`
  margin-bottom: 2rem;
`;

const ProgressCircle = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
`;

const CircleSvg = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: #f0f0f0;
  stroke-width: 8;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: url(#gradient);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s ease;
`;

const PercentageText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const ProgressLabel = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
`;

const CurrentDayInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const CurrentDayTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentDayStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
`;

const TimelineInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TimelineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const TimelineLabel = styled.div`
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimelineValue = styled.div`
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
`;

const StudyPlanProgress = ({ progress }) => {
  if (!progress) return null;

  const circumference = 2 * Math.PI * 50; // radius = 50
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress.progress.overall_percentage / 100) * circumference;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (examDate) => {
    const exam = new Date(examDate);
    const today = new Date();
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <ProgressCard>
      <ProgressHeader>
        <FaChartLine />
        <ProgressTitle>Study Progress</ProgressTitle>
      </ProgressHeader>

      <OverallProgress>
        <ProgressCircle>
          <CircleSvg>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#667eea" />
                <stop offset="100%" stopColor="#764ba2" />
              </linearGradient>
            </defs>
            <CircleBackground
              cx="60"
              cy="60"
              r="50"
            />
            <CircleProgress
              cx="60"
              cy="60"
              r="50"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </CircleSvg>
          <PercentageText>
            {Math.round(progress.progress.overall_percentage)}%
          </PercentageText>
        </ProgressCircle>
        <ProgressLabel>Overall Progress</ProgressLabel>
      </OverallProgress>

      <StatsGrid>
        <StatItem>
          <StatNumber>{progress.progress.completed_steps}</StatNumber>
          <StatLabel>Steps Done</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{progress.progress.total_steps}</StatNumber>
          <StatLabel>Total Steps</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{Math.round(progress.progress.completed_hours)}</StatNumber>
          <StatLabel>Hours Done</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{Math.round(progress.progress.total_study_hours)}</StatNumber>
          <StatLabel>Total Hours</StatLabel>
        </StatItem>
      </StatsGrid>

      <CurrentDayInfo>
        <CurrentDayTitle>
          <FaFire />
          Day {progress.current_day.day_number} Progress
        </CurrentDayTitle>
        <CurrentDayStats>
          <span>{progress.current_day.completed_steps}/{progress.current_day.total_steps} tasks</span>
          <span>{Math.round(progress.current_day.progress_percentage)}% complete</span>
        </CurrentDayStats>
      </CurrentDayInfo>

      <TimelineInfo>
        <TimelineItem>
          <TimelineLabel>
            <FaCalendarAlt />
            Days Since Start
          </TimelineLabel>
          <TimelineValue>{progress.timeline.days_since_start}</TimelineValue>
        </TimelineItem>
        
        <TimelineItem>
          <TimelineLabel>
            <FaClock />
            Days Remaining
          </TimelineLabel>
          <TimelineValue>
            {getDaysRemaining(progress.timeline.exam_date)}
          </TimelineValue>
        </TimelineItem>

        <TimelineItem>
          <TimelineLabel>
            <FaCheckCircle />
            Exam Date
          </TimelineLabel>
          <TimelineValue>
            {formatDate(progress.timeline.exam_date)}
          </TimelineValue>
        </TimelineItem>
      </TimelineInfo>
    </ProgressCard>
  );
};

export default StudyPlanProgress;
