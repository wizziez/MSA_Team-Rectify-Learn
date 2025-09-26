import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { 
  FaQuestionCircle, 
  FaLightbulb, 
  FaSearch, 
  FaFilter,
  FaSortAmountDown,
  FaExclamationTriangle,
  FaUpload,
  FaSpinner,
  FaFile,
  FaCheck,
  FaClock,
  FaChartBar,
  FaBook,
  FaTrophy,
  FaBrain,
  FaGraduationCap,
  FaSync,
  FaEye,
  FaPlay,
  FaPlus,
  FaRegSmile,
  FaRegMeh,
  FaRegFrown
} from 'react-icons/fa';
import apiService from '../utils/apiService';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  .container {
    animation: ${fadeIn} 0.5s ease-out;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: white !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #4361ee;
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    
    h1 {
      font-size: 1.75rem;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: ${props => props.gradient || 'linear-gradient(135deg, #4361ee, #3a0ca3)'};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  h3 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    margin: 0;
    opacity: 0.9;
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background: white;
    color: white !important;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f5f5f5;
    }
    
    &.active {
      background: #4361ee;
      color: white;
      border-color: #4361ee;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
    
    button {
      flex: 1;
      justify-content: center;
      font-size: 0.875rem;
      padding: 0.6rem 0.5rem;
    }
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  flex: 1;
  max-width: 400px;
  transition: box-shadow 0.2s ease;
  
  svg {
    color: white !important;
    margin-right: 0.6rem;
  }
  
  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 1rem;
    background: transparent;
    
    &::placeholder {
      color: white !important;
    }
  }
  
  &:focus-within {
    border-color: #4361ee;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const DocumentSection = styled.section`
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.5s ease-out;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    color: white !important;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
    
    svg {
      color: #4361ee;
    }
  }
  
  > p {
    margin-top: 1rem;
    color: white !important;
    font-size: 0.9rem;
  }
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  height: 100%;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 1.1rem;
    color: white !important;
    margin: 0 0 1rem 0;
    font-weight: 600;
  }
  
  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    color: white !important;
    font-size: 0.9rem;
    
    svg {
      color: #4361ee;
    }
  }
  
  &.generate-card {
    background: #f8f9fa;
    border: 2px dashed #e0e0e0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    
    &:hover {
      background: #f0f4ff;
      border-color: #4361ee;
      animation: ${pulse} 1s infinite;
    }
    
    svg {
      font-size: 2rem;
      color: #4361ee;
      margin-bottom: 1rem;
    }
    
    h3 {
      margin-bottom: 0.5rem;
      color: #4361ee;
    }
    
    p {
      color: white !important;
      justify-content: center;
    }
  }
`;

const DifficultyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    if (props.difficulty === 'easy') {
      return `
        background: #e6f7e9;
        color: #2bad6b;
      `;
    } else if (props.difficulty === 'hard') {
      return `
        background: #ffebee;
        color: #e53935;
      `;
    } else {
      return `
        background: #fff8e1;
        color: #f9a826;
      `;
    }
  }}
`;

const QuizStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.completed ? '#2bad6b' : '#f9a826'};
`;

const ScoreBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 600;
  
  ${props => {
    const score = parseInt(props.score);
    if (score >= 80) {
      return `
        background: #e6f7e9;
        color: #2bad6b;
      `;
    } else if (score >= 60) {
      return `
        background: #fff8e1;
        color: #f9a826;
      `;
    } else {
      return `
        background: #ffebee;
        color: #e53935;
      `;
    }
  }}
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  width: 100%;
  margin-top: 1rem;
  
  ${props => {
    if (props.variant === 'secondary') {
      return `
        background: rgba(67, 97, 238, 0.1);
        color: #4361ee;
        
        &:hover {
          background: rgba(67, 97, 238, 0.2);
        }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: #ffebee;
        color: #e53935;
        
        &:hover {
          background: #ffcdd2;
        }
      `;
    } else {
      return `
        background: #4361ee;
        color: white;
        
        &:hover {
          background: #3a56d4;
        }
      `;
    }
  }}
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  svg {
    font-size: 4rem;
    color: #4361ee;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }
  
  h2 {
    font-size: 1.5rem;
    color: white !important;
    margin-bottom: 1rem;
  }
  
  p {
    color: white !important;
    margin-bottom: 1.5rem;
    max-width: 500px;
  }
  
  ${ActionButton} {
    max-width: 250px;
  }
  
  .button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
`;

const EmptyQuizContainer = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  
  svg {
    font-size: 3rem;
    color: #bbb;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.3rem;
    color: white !important;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: white !important;
    margin-bottom: 1.5rem;
  }
  
  .button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      
      ${ActionButton} {
        width: 100%;
        max-width: 250px;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(67, 97, 238, 0.2);
    border-top-color: #4361ee;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1.5rem;
  }
  
  p {
    color: white !important;
    font-size: 1.1rem;
  }
`;

const MyQuizzes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [quizData, setQuizData] = useState({
    documentsWithQuizzes: [],
    totalQuizzes: 0,
    completedQuizzes: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocumentsAndQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch documents
        const docsResponse = await apiService.getDocuments();
        
        if (!docsResponse || !docsResponse.length) {
          setDocuments([]);
          setQuizData({
            documentsWithQuizzes: [],
            totalQuizzes: 0,
            completedQuizzes: 0
          });
          setLoading(false);
          return;
        }
        
        setDocuments(docsResponse);
        
        // Fetch quizzes for each document
        const documentsWithQuizzes = [];
        let totalQuizzes = 0;
        let completedQuizzes = 0;
        
        for (const doc of docsResponse) {
          try {
            const quizzes = await apiService.getDocumentQuizzes(doc.id);
            
            if (quizzes && quizzes.length > 0) {
              const completedCount = quizzes.filter(quiz => quiz.completed).length;
              
              documentsWithQuizzes.push({
                document: doc,
                quizzes: quizzes,
                totalCount: quizzes.length,
                completedCount: completedCount
              });
              
              totalQuizzes += quizzes.length;
              completedQuizzes += completedCount;
            }
          } catch (quizError) {
            console.error(`Error fetching quizzes for document ${doc.id}:`, quizError);
          }
        }
        
        setQuizData({
          documentsWithQuizzes,
          totalQuizzes,
          completedQuizzes
        });
      } catch (err) {
        console.error('Error fetching documents and quizzes:', err);
        setError('Failed to load your quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocumentsAndQuizzes();
  }, []);

  const handleGenerateQuiz = async (documentId, documentTitle) => {
    try {
      setLoading(true);
      const newQuiz = await apiService.generateQuiz(documentId);
      
      if (newQuiz && newQuiz.id) {
        // Update the quiz data with the new quiz
        const updatedDocumentsWithQuizzes = [...quizData.documentsWithQuizzes];
        const docIndex = updatedDocumentsWithQuizzes.findIndex(
          doc => doc.document.id === documentId
        );
        
        if (docIndex !== -1) {
          updatedDocumentsWithQuizzes[docIndex].quizzes.push(newQuiz);
          updatedDocumentsWithQuizzes[docIndex].totalCount += 1;
          
          setQuizData({
            ...quizData,
            documentsWithQuizzes: updatedDocumentsWithQuizzes,
            totalQuizzes: quizData.totalQuizzes + 1
          });
        }
        
        // Navigate to the quiz
        navigate(`/quiz/${newQuiz.id}`);
      }
    } catch (err) {
      console.error('Error generating quiz:', err);
      setError('Failed to generate quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredQuizData = {
    ...quizData,
    documentsWithQuizzes: quizData.documentsWithQuizzes.filter(item => {
      if (filter === 'completed') {
        return item.completedCount > 0;
      } else if (filter === 'incomplete') {
        return item.completedCount < item.totalCount;
      }
      return true;
    })
  };

  const renderQuizDifficulty = (difficulty) => {
    const difficultyIcon = difficulty === 'easy' 
      ? <FaRegSmile /> 
      : difficulty === 'hard' 
        ? <FaRegFrown /> 
        : <FaRegMeh />;
    
    return (
      <DifficultyBadge difficulty={difficulty}>
        {difficultyIcon} {difficulty}
      </DifficultyBadge>
    );
  };

  // Loading state
  if (loading && !documents.length) {
    return (
      <PageContainer>
        <div className="container">
          <PageHeader>
            <h1><FaQuestionCircle /> My Quizzes</h1>
          </PageHeader>
          <LoadingContainer>
            <div className="spinner"></div>
            <p>Loading your quizzes...</p>
          </LoadingContainer>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer>
        <div className="container">
          <PageHeader>
            <h1><FaQuestionCircle /> My Quizzes</h1>
          </PageHeader>
          <EmptyStateContainer>
            <FaExclamationTriangle />
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <ActionButton onClick={() => window.location.reload()}>
              <FaSync /> Try Again
            </ActionButton>
          </EmptyStateContainer>
        </div>
      </PageContainer>
    );
  }

  // Empty state - no documents
  if (!documents.length) {
    return (
      <PageContainer>
        <div className="container">
          <PageHeader>
            <h1><FaQuestionCircle /> My Quizzes</h1>
          </PageHeader>
          <EmptyStateContainer>
            <FaUpload />
            <h2>No Documents Found</h2>
            <p>Upload study materials to generate quizzes and start learning.</p>
            <ActionButton onClick={() => navigate('/upload')}>
              <FaUpload /> Upload Documents
            </ActionButton>
          </EmptyStateContainer>
        </div>
      </PageContainer>
    );
  }

  // Empty state - no quizzes
  if (!quizData.totalQuizzes) {
    return (
      <PageContainer>
        <div className="container">
          <PageHeader>
            <h1><FaQuestionCircle /> My Quizzes</h1>
          </PageHeader>
          
          <EmptyStateContainer>
            <FaLightbulb />
            <h2>No Quizzes Yet</h2>
            <p>You have {documents.length} document{documents.length !== 1 ? 's' : ''}, but no quizzes yet. Generate a quiz to start learning!</p>
            
            <FilterBar>
              <SearchInput>
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchInput>
            </FilterBar>
            
            <QuizGrid>
              {filteredDocuments.map(doc => (
                <QuizCard 
                  key={doc.id}
                  className="generate-card"
                  onClick={() => handleGenerateQuiz(doc.id, doc.title)}
                >
                  <FaPlus />
                  <h3>Generate Quiz</h3>
                  <p>{doc.title}</p>
                </QuizCard>
              ))}
            </QuizGrid>
          </EmptyStateContainer>
        </div>
      </PageContainer>
    );
  }

  // Main content with quizzes
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <h1><FaQuestionCircle /> My Quizzes</h1>
        </PageHeader>
        
        <StatsContainer>
          <StatCard gradient="linear-gradient(135deg, #4361ee, #3a0ca3)">
            <h3>{quizData.totalQuizzes}</h3>
            <p><FaQuestionCircle /> Total Quizzes</p>
          </StatCard>
          
          <StatCard gradient="linear-gradient(135deg, #2bad6b, #1f7a4d)">
            <h3>{quizData.completedQuizzes}</h3>
            <p><FaCheck /> Completed</p>
          </StatCard>
          
          <StatCard gradient="linear-gradient(135deg, #f9a826, #e67e22)">
            <h3>{Math.round((quizData.completedQuizzes / quizData.totalQuizzes) * 100) || 0}%</h3>
            <p><FaTrophy /> Completion Rate</p>
          </StatCard>
        </StatsContainer>
        
        <FilterBar>
          <SearchInput>
            <FaSearch />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>
          
          <FilterGroup>
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              <FaFilter /> All
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => setFilter('completed')}
            >
              <FaCheck /> Completed
            </button>
            <button 
              className={filter === 'incomplete' ? 'active' : ''}
              onClick={() => setFilter('incomplete')}
            >
              <FaClock /> Incomplete
            </button>
          </FilterGroup>
        </FilterBar>
        
        {filteredQuizData.documentsWithQuizzes.length === 0 ? (
          <EmptyQuizContainer>
            <FaFilter />
            <h3>No quizzes match your filters</h3>
            <p>Try changing your search term or filter selection</p>
            <div className="button-group">
              <ActionButton variant="secondary" onClick={() => setFilter('all')}>
                <FaFilter /> Show All Quizzes
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => setSearchTerm('')}>
                <FaSearch /> Clear Search
              </ActionButton>
            </div>
          </EmptyQuizContainer>
        ) : (
          filteredQuizData.documentsWithQuizzes.map(({ document, quizzes, completedCount, totalCount }) => (
            <DocumentSection key={document.id}>
              <h2>
                <FaBook /> {document.title}
              </h2>
              
              <QuizGrid>
                {quizzes.map(quiz => (
                  <QuizCard key={quiz.id}>
                    <div>
                      <h3>{quiz.title || `Quiz #${quiz.id.substring(0, 8)}`}</h3>
                      
                      {quiz.completed && (
                        <ScoreBadge score={quiz.score}>
                          <FaTrophy /> {quiz.score}%
                        </ScoreBadge>
                      )}
                      
                      <p>
                        <FaQuestionCircle /> {quiz.questionCount || 'N/A'} questions
                      </p>
                      
                      <p>
                        {renderQuizDifficulty(quiz.difficulty || 'medium')}
                      </p>
                      
                      <QuizStatus completed={quiz.completed}>
                        {quiz.completed ? (
                          <>
                            <FaCheck /> Completed
                          </>
                        ) : (
                          <>
                            <FaClock /> Not started
                          </>
                        )}
                      </QuizStatus>
                    </div>
                    
                    <ActionButton 
                      variant={quiz.completed ? 'secondary' : 'primary'}
                      onClick={() => navigate(`/quiz/${quiz.id}`)}
                    >
                      {quiz.completed ? (
                        <>
                          <FaEye /> Review Quiz
                        </>
                      ) : (
                        <>
                          <FaPlay /> Start Quiz
                        </>
                      )}
                    </ActionButton>
                  </QuizCard>
                ))}
                
                <QuizCard 
                  className="generate-card"
                  onClick={() => handleGenerateQuiz(document.id, document.title)}
                >
                  <FaPlus />
                  <h3>Generate New Quiz</h3>
                  <p>From {document.title}</p>
                </QuizCard>
              </QuizGrid>
              
              <p>
                <strong>{completedCount}</strong> of <strong>{totalCount}</strong> quizzes completed for this document
              </p>
            </DocumentSection>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default MyQuizzes;
