import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaList, FaTh, FaCalendarAlt, FaCalendarDay, FaTrophy, FaBook, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getReviewDocumentsToday, getReviewDocumentsByDate, getReviewCalendar } from '../utils/apiService';

// Main container
const ReviewContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ReviewHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }
`;

const ViewControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const ViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const DatePicker = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ContentArea = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// List View Components
const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DocumentListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: linear-gradient(145deg, #f8f9ff 0%, #e8ecff 100%);
  border-radius: 16px;
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const DocumentInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  p {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
`;

const MasteryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => {
    if (props.score >= 0.8) return 'linear-gradient(145deg, #10b981, #059669)';
    if (props.score >= 0.6) return 'linear-gradient(145deg, #f59e0b, #d97706)';
    return 'linear-gradient(145deg, #ef4444, #dc2626)';
  }};
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
`;

// Grid View Components
const DocumentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DocumentCard = styled.div`
  background: linear-gradient(145deg, #f8f9ff 0%, #e8ecff 100%);
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const DocumentTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #6b7280;
    
    svg {
      color: #9ca3af;
    }
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

// Calendar View Components
const CalendarContainer = styled.div`
  max-width: 100%;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
`;

const CalendarDay = styled.div`
  background: white;
  min-height: 120px;
  padding: 0.75rem 0.5rem;
  position: relative;
  border: ${props => props.isToday ? '2px solid #667eea' : 'none'};
  
  @media (max-width: 768px) {
    min-height: 80px;
    padding: 0.5rem 0.25rem;
  }
`;

const DayNumber = styled.div`
  font-weight: 600;
  color: ${props => {
    if (props.isToday) return '#ffffff';
    if (props.isOtherMonth) return '#d1d5db';
    return '#374151';
  }};
  background: ${props => props.isToday ? '#667eea' : 'transparent'};
  width: ${props => props.isToday ? '24px' : 'auto'};
  height: ${props => props.isToday ? '24px' : 'auto'};
  border-radius: ${props => props.isToday ? '50%' : '0'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: ${props => props.isToday ? '700' : '600'};
`;

const CalendarEvent = styled.div`
  background: linear-gradient(145deg, #667eea, #764ba2);
  color: white;
  padding: 0.25rem 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1.5rem;
    color: #d1d5db;
  }
`;

const Review = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'grid', 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [documents, setDocuments] = useState([]);
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load documents based on current view and selected date
  useEffect(() => {
    loadDocuments();
  }, [currentView, selectedDate]);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (currentView === 'calendar') {
        const date = new Date(selectedDate);
        const response = await getReviewCalendar(date.getFullYear(), date.getMonth() + 1);
        setCalendarData(response.calendar_data || {});
      } else {
        let response;
        const today = new Date().toISOString().split('T')[0];
        
        if (selectedDate === today) {
          response = await getReviewDocumentsToday();
        } else {
          response = await getReviewDocumentsByDate(selectedDate);
        }
        
        setDocuments(response || []);
      }
    } catch (error) {
      console.error('Error loading review documents:', error);
      setError('Failed to load review documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatMasteryScore = (score) => {
    return Math.round((parseFloat(score) || 0) * 100);
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      // Create local date string to match API format
      const localDateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      // Check if this day matches today
      const isToday = localDateKey === todayDateString;
      
      const dayDocuments = calendarData[localDateKey] || [];
      
      days.push({
        date: currentDate,
        dateKey: localDateKey,
        isToday: isToday,
        isCurrentMonth: currentDate.getMonth() === month,
        documents: dayDocuments
      });
    }
    
    return days;
  };

  const renderListView = () => {
    if (loading) {
      return <EmptyState>
        <FaCalendarDay />
        <h3>Loading...</h3>
        <p>Fetching your review documents...</p>
      </EmptyState>;
    }

    if (documents.length === 0) {
      return <EmptyState>
        <FaCalendarDay />
        <h3>No Documents Scheduled</h3>
        <p>You don't have any documents scheduled for review on {formatDate(selectedDate)}.</p>
      </EmptyState>;
    }

    return (
      <DocumentList>
        {documents.map(doc => (
          <DocumentListItem key={doc.id}>
            <DocumentInfo>
              <h3>{doc.filename}</h3>
              <p>Review Date: {formatDate(doc.next_review_date)}</p>
              <p>Interval: Every {doc.review_interval_days} days</p>
            </DocumentInfo>
            
            <DocumentActions>
              <MasteryBadge score={doc.document_mastery_score || 0}>
                <FaTrophy />
                {formatMasteryScore(doc.document_mastery_score)}%
              </MasteryBadge>
              <ActionButton to={`/quiz/${doc.id}`}>
                <FaPlay />
                Start Review
              </ActionButton>
            </DocumentActions>
          </DocumentListItem>
        ))}
      </DocumentList>
    );
  };

  const renderGridView = () => {
    if (loading) {
      return <EmptyState>
        <FaTh />
        <h3>Loading...</h3>
        <p>Fetching your review documents...</p>
      </EmptyState>;
    }

    if (documents.length === 0) {
      return <EmptyState>
        <FaTh />
        <h3>No Documents Scheduled</h3>
        <p>You don't have any documents scheduled for review on {formatDate(selectedDate)}.</p>
      </EmptyState>;
    }

    return (
      <DocumentGrid>
        {documents.map(doc => (
          <DocumentCard key={doc.id}>
            <CardHeader>
              <MasteryBadge score={doc.document_mastery_score || 0}>
                <FaTrophy />
                {formatMasteryScore(doc.document_mastery_score)}%
              </MasteryBadge>
            </CardHeader>
            
            <DocumentTitle>{doc.filename}</DocumentTitle>
            
            <DocumentMeta>
              <span>
                <FaCalendarDay />
                Review: {formatDate(doc.next_review_date)}
              </span>
              <span>
                <FaBook />
                Interval: Every {doc.review_interval_days} days
              </span>
            </DocumentMeta>
            
            <CardActions>
              <ActionButton to={`/quiz/${doc.id}`}>
                <FaPlay />
                Start Review
              </ActionButton>
            </CardActions>
          </DocumentCard>
        ))}
      </DocumentGrid>
    );
  };

  const renderCalendarView = () => {
    if (loading) {
      return <EmptyState>
        <FaCalendarAlt />
        <h3>Loading...</h3>
        <p>Loading calendar data...</p>
      </EmptyState>;
    }

    const calendarDays = generateCalendarDays();
    const date = new Date(selectedDate);
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    return (
      <CalendarContainer>
        <CalendarHeader>
          <h2>{monthNames[date.getMonth()]} {date.getFullYear()}</h2>
        </CalendarHeader>
        
        <CalendarGrid>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <CalendarDay key={day} style={{ 
              backgroundColor: '#374151', 
              color: '#ffffff',
              fontWeight: 'bold', 
              textAlign: 'center', 
              minHeight: 'auto', 
              padding: '0.75rem',
              fontSize: '0.9rem'
            }}>
              {day}
            </CalendarDay>
          ))}
          
          {calendarDays.map((day, index) => (
            <CalendarDay key={index} isToday={day.isToday}>
              <DayNumber 
                isToday={day.isToday} 
                isOtherMonth={!day.isCurrentMonth}
              >
                {day.date.getDate()}
              </DayNumber>
              
              {day.documents.map((doc, docIndex) => (
                <CalendarEvent 
                  key={docIndex}
                  title={`${doc.filename} - Mastery: ${formatMasteryScore(doc.mastery_score)}%`}
                >
                  {doc.filename}
                </CalendarEvent>
              ))}
            </CalendarDay>
          ))}
        </CalendarGrid>
      </CalendarContainer>
    );
  };

  return (
    <ReviewContainer>
      <ReviewHeader>
        <h1>Review Schedule</h1>
        <p>Manage your spaced repetition learning schedule</p>
      </ReviewHeader>
      
      <ViewControls>
        <ViewButton 
          active={currentView === 'list'}
          onClick={() => setCurrentView('list')}
        >
          <FaList />
          List View
        </ViewButton>
        
        <ViewButton 
          active={currentView === 'grid'}
          onClick={() => setCurrentView('grid')}
        >
          <FaTh />
          Grid View
        </ViewButton>
        
        <ViewButton 
          active={currentView === 'calendar'}
          onClick={() => setCurrentView('calendar')}
        >
          <FaCalendarAlt />
          Calendar View
        </ViewButton>
        
        <DatePicker
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </ViewControls>
      
      <ContentArea>
        {error && (
          <EmptyState>
            <h3>Error</h3>
            <p>{error}</p>
          </EmptyState>
        )}
        
        {!error && currentView === 'list' && renderListView()}
        {!error && currentView === 'grid' && renderGridView()}
        {!error && currentView === 'calendar' && renderCalendarView()}
      </ContentArea>
    </ReviewContainer>
  );
};

export default Review;
