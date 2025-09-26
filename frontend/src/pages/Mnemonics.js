import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaArrowLeft, 
  FaLightbulb, 
  FaRegLightbulb, 
  FaBrain,
  FaUpload,
  FaFolder,
  FaCheck,
  FaTimes,
  FaPlay,
  FaTrash,
  FaCog,
  FaInfoCircle,
  FaBookmark,
  FaRandom,
  FaFlash
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiService from '../utils/apiService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 300px);
  background: linear-gradient(135deg, var(--background-color) 0%, rgba(15, 15, 15, 0.98) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 3rem;
    min-height: calc(100vh - 400px);
  }
  
  @media (max-width: 480px) {
    margin-bottom: 4rem;
    min-height: calc(100vh - 450px);
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: relative;
  z-index: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  color: white !important;
  margin: 0;
  font-weight: 900;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-text {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      border-radius: 2px;
      opacity: 0.7;
    }
  }
  
  .title-icon {
    color: var(--primary-color);
    animation: ${float} 3s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white !important;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(var(--primary-rgb), 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 200px;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  * {
    color: white !important;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(var(--primary-rgb), 0.3);
    
    &::before {
      left: calc(100% + 200px);
    }
    
    * {
      color: white !important;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 6px rgba(var(--primary-rgb), 0.2);
    }
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white !important;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  * {
    color: white !important;
  }
  
  &:hover {
    background: var(--hover-background);
    border-color: var(--primary-color);
    color: white !important;
    transform: translateY(-2px);
    
    * {
      color: white !important;
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-background);
  border-radius: 20px;
  border: 2px dashed var(--border-color);
  margin-top: 2rem;
  animation: ${fadeIn} 0.6s ease forwards;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color), var(--primary-color));
    border-radius: 20px;
    z-index: -1;
    opacity: 0.3;
    animation: ${shine} 2s linear infinite;
  }
  
  .empty-icon {
    font-size: 3.5rem;
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    animation: ${float} 3s ease-in-out infinite;
  }
  
  h3 {
    font-size: 1.8rem;
    color: white !important;
    margin-bottom: 1rem;
  }
  
  p {
    color: white !important;
    max-width: 500px;
    margin-bottom: 2rem;
    line-height: 1.6;
    opacity: 0.9;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    
    h3 {
      font-size: 1.5rem;
    }
    
    .actions {
      flex-direction: column;
    }
  }
`;

const DocumentSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
`;

const DocumentCard = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(var(--primary-rgb), 0.3);
    
    .delete-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    z-index: 1;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(237, 66, 69, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(237, 66, 69, 0.3);
  
  &:hover {
    background: rgb(237, 66, 69);
    transform: translateY(0) scale(1.1);
    box-shadow: 0 6px 16px rgba(237, 66, 69, 0.4);
  }
`;

const DocumentHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 2rem 1.5rem;
  color: white;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  h3 {
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.9;
    font-weight: 500;
  }
`;

const DocumentContent = styled.div`
  padding: 1.5rem;
  
  p {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.75rem 0;
    color: white !important;
    font-size: 0.875rem;
    font-weight: 500;
    
    svg {
      color: var(--primary-color);
      flex-shrink: 0;
    }
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 1rem;
    
    &.has-mnemonics {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    &.no-mnemonics {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(var(--primary-rgb), 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Alert = styled.div`
  padding: 1.2rem;
  border-radius: 12px;
  margin: 1.5rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
                              props.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                              'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'success' ? '#10b981' : 
                    props.type === 'warning' ? '#f59e0b' :
                    '#ef4444'};
  border: 1px solid ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 
                               props.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' :
                               'rgba(239, 68, 68, 0.2)'};
  
  svg {
    flex-shrink: 0;
    margin-top: 0.1rem;
  }
  
  .alert-content {
    flex: 1;
    
    .alert-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    
    .alert-message {
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(-2px);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const MnemonicsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const MnemonicCard = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    border-radius: 16px 16px 0 0;
  }
  
  .mnemonic-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
    
    .mnemonic-topic {
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
      margin: 0;
    }
    
    .mnemonic-type {
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .mnemonic-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    text-align: center;
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(var(--primary-rgb), 0.05);
    border-radius: 12px;
    border: 1px solid rgba(var(--primary-rgb), 0.1);
    position: relative;
    
    &::before {
      content: '"';
      position: absolute;
      top: 0.5rem;
      left: 0.75rem;
      font-size: 2rem;
      color: rgba(var(--primary-rgb), 0.3);
      font-family: serif;
    }
    
    &::after {
      content: '"';
      position: absolute;
      bottom: 0.5rem;
      right: 0.75rem;
      font-size: 2rem;
      color: rgba(var(--primary-rgb), 0.3);
      font-family: serif;
    }
  }
  
  .mnemonic-explanation {
    color: white;
    line-height: 1.6;
    font-size: 0.95rem;
    opacity: 0.9;
    
    strong {
      color: var(--primary-color);
      font-weight: 600;
    }
  }
`;

const GenerationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  
  .modal-content {
    background: var(--card-background);
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    
    h3 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        color: white;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      input, textarea, select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.05);
        color: white;
        font-size: 0.95rem;
        
        &:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      }
      
      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }
    
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      
      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        input[type="checkbox"] {
          width: auto;
        }
        
        label {
          margin: 0;
          font-weight: 500;
          cursor: pointer;
        }
      }
    }
    
    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      justify-content: flex-end;
    }
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  color: white !important;
  border: 1px solid rgba(var(--primary-rgb), 0.1);

  svg {
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    background: rgba(var(--primary-rgb), 0.1);
    border-color: rgba(var(--primary-rgb), 0.2);
  }
`;

const Mnemonics = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [mnemonics, setMnemonics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    types: [],
    topics: '',
    instructions: ''
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getMnemonicDocuments();
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to load your documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleGenerateMnemonics = async (document) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiService.generateMnemonics(document.id, generationOptions);
      
      // After successful generation, fetch the mnemonics
      const mnemonicsResponse = await apiService.getMnemonics(document.id);
      setMnemonics(mnemonicsResponse.data || []);
      setSelectedDocument(document);
      setShowGenerationModal(false);
      
      // Reset generation options
      setGenerationOptions({
        types: [],
        topics: '',
        instructions: ''
      });
      
    } catch (error) {
      console.error("Error generating mnemonics:", error);
      setError(error.message || "Failed to generate mnemonics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewMnemonics = async (document) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedDocument(document);
      
      const response = await apiService.getMnemonics(document.id);
      setMnemonics(response.data || []);
    } catch (error) {
      console.error("Error fetching mnemonics:", error);
      setError("Failed to load mnemonics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (e, documentId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this document and its mnemonics? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await apiService.deleteDocument(documentId);
        
        // Remove from local state
        setDocuments(docs => docs.filter(doc => doc.id !== documentId));
        
        // If this was the selected document, clear selection
        if (selectedDocument && selectedDocument.id === documentId) {
          setSelectedDocument(null);
          setMnemonics([]);
        }
        
      } catch (error) {
        console.error("Error deleting document:", error);
        setError("Failed to delete document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToDocuments = () => {
    setSelectedDocument(null);
    setMnemonics([]);
    setError(null);
  };

  const handleTypeChange = (type) => {
    setGenerationOptions(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const openGenerationModal = (document) => {
    setSelectedDocument(document);
    setShowGenerationModal(true);
  };

  const closeGenerationModal = () => {
    setShowGenerationModal(false);
    setGenerationOptions({
      types: [],
      topics: '',
      instructions: ''
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            {selectedDocument ? 'Loading mnemonics...' : 'Loading your documents...'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert type="error">
          <FaTimes />
          <div className="alert-content">
            <div className="alert-title">Error</div>
            <div className="alert-message">{error}</div>
          </div>
        </Alert>
      );
    }

    // Show mnemonics for selected document
    if (selectedDocument && mnemonics.length > 0) {
      return (
        <>
          <BackButton onClick={handleBackToDocuments}>
            <FaArrowLeft /> Back to all documents
          </BackButton>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Mnemonics for "{selectedDocument.filename}"
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {mnemonics.length} mnemonic{mnemonics.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          
          <MnemonicsList>
            {mnemonics.map((mnemonic, index) => (
              <MnemonicCard key={index}>
                <div className="mnemonic-header">
                  <h3 className="mnemonic-topic">{mnemonic.topic}</h3>
                  <span className="mnemonic-type">{mnemonic.mnemonic_type}</span>
                </div>
                
                <div className="mnemonic-text">
                  {mnemonic.mnemonic}
                </div>
                
                <div className="mnemonic-explanation">
                  <strong>How it helps:</strong> {mnemonic.mnemonic_explanation}
                </div>
              </MnemonicCard>
            ))}
          </MnemonicsList>
        </>
      );
    }

    // Show empty state if no documents
    if (documents.length === 0) {
      return (
        <EmptyState>
          <FaBrain className="empty-icon" />
          <h3>No documents found</h3>
          <p>Upload documents to create AI-powered mnemonics and enhance your memory with our advanced features:</p>
          <FeatureList>
            <FeatureItem>
              <FaCheck /> Acronym mnemonics
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Acrostic mnemonics  
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Rhyme mnemonics
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Smart topic detection
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Custom instructions
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Memory explanations
            </FeatureItem>
          </FeatureList>
          <div className="actions">
            <PrimaryButton>
              <Link to="/upload" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUpload /> Upload Document
              </Link>
            </PrimaryButton>
          </div>
        </EmptyState>
      );
    }

    // Show document selector
    return (
      <>
        <p style={{ marginBottom: '2rem', color: 'rgba(255, 255, 255, 0.9)' }}>
          Select a document to generate or review mnemonics:
        </p>
        
        <DocumentSelector>
          {documents.map(doc => (
            <DocumentCard key={doc.id}>
              <DeleteButton 
                className="delete-btn"
                onClick={(e) => handleDeleteDocument(e, doc.id)}
                aria-label="Delete document"
              >
                <FaTrash size={14} />
              </DeleteButton>
              
              <DocumentHeader>
                <h3>{doc.filename}</h3>
                <p>Added on {new Date(doc.upload_date || Date.now()).toLocaleDateString()}</p>
              </DocumentHeader>
              
              <DocumentContent>
                <p><FaFolder /> {(doc.file_type || 'PDF').toUpperCase()}</p>
                
                {doc.has_mnemonics ? (
                  <>
                    <div className="status-badge has-mnemonics">
                      <FaCheck /> Mnemonics Ready
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <PrimaryButton onClick={() => handleReviewMnemonics(doc)}>
                        <FaPlay /> Review Mnemonics
                      </PrimaryButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="status-badge no-mnemonics">
                      <FaInfoCircle /> No Mnemonics Yet
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <PrimaryButton onClick={() => openGenerationModal(doc)}>
                        <FaBrain /> Generate Mnemonics
                      </PrimaryButton>
                    </div>
                  </>
                )}
              </DocumentContent>
            </DocumentCard>
          ))}
        </DocumentSelector>
      </>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FaBrain className="title-icon" />
          <span className="title-text">Mnemonics</span>
        </PageTitle>
        
        <HeaderActions>
          <SecondaryButton>
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUpload /> Upload Document
            </Link>
          </SecondaryButton>
        </HeaderActions>
      </PageHeader>
      
      {renderContent()}
      
      {/* Generation Modal */}
      {showGenerationModal && (
        <GenerationModal>
          <div className="modal-content">
            <h3>
              <FaCog /> Configure Mnemonic Generation
            </h3>
            
            <div className="form-group">
              <label>Mnemonic Types (optional)</label>
              <div className="checkbox-group">
                {['acronym', 'acrostic', 'rhyme'].map(type => (
                  <div key={type} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={type}
                      checked={generationOptions.types.includes(type)}
                      onChange={() => handleTypeChange(type)}
                    />
                    <label htmlFor={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                Leave empty to let AI choose the best types
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="topics">Specific Topics (optional)</label>
              <input
                type="text"
                id="topics"
                value={generationOptions.topics}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, topics: e.target.value }))}
                placeholder="e.g., photosynthesis, Newton's laws, etc."
              />
              <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
                Separate multiple topics with commas
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="instructions">Additional Instructions (optional)</label>
              <textarea
                id="instructions"
                value={generationOptions.instructions}
                onChange={(e) => setGenerationOptions(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Any specific instructions for mnemonic generation..."
              />
            </div>
            
            <div className="modal-actions">
              <SecondaryButton onClick={closeGenerationModal}>
                Cancel
              </SecondaryButton>
              <PrimaryButton 
                onClick={() => handleGenerateMnemonics(selectedDocument)}
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner /> : <FaBrain />}
                Generate Mnemonics
              </PrimaryButton>
            </div>
          </div>
        </GenerationModal>
      )}
    </PageContainer>
  );
};

export default Mnemonics;
