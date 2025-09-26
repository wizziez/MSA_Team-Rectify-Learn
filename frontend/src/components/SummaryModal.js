import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { FaTimes, FaBookOpen, FaInfoCircle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import './SummaryModal.css';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  backdrop-filter: blur(8px);
  padding: 20px;
  
  /* Ensure it's above everything */
  isolation: isolate;
  
  ${props => props.isOpen && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 0;
  max-width: 800px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(0, 0, 0, 0.15);
  transform: scale(0.9) translateY(20px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  
  ${props => props.isOpen && css`
    transform: scale(1) translateY(0);
    opacity: 1;
    animation: ${fadeIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  `}
  
  @media (max-width: 768px) {
    width: calc(100% - 20px);
    max-width: none;
    max-height: calc(100vh - 40px);
  }
  
  @media (max-width: 480px) {
    width: calc(100% - 20px);
    max-height: calc(100vh - 40px);
    border-radius: 16px;
  }
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, #667eea 100%);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
    
    svg {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ModalBody = styled.div`
  padding: 2.5rem;
  overflow-y: auto;
  max-height: calc(85vh - 140px);
  
  @media (max-width: 480px) {
    padding: 2rem;
    max-height: calc(100vh - 180px);
  }
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a1a1a1;
    }
  }
`;

const DocumentTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary-color);
  }
`;

const SummaryContent = styled.div`
  line-height: 1.8;
  font-size: 1.0625rem;
  color: #000000;
  
  /* Markdown styling */
  p {
    margin-bottom: 1.25rem;
    color: #000000;
    text-align: justify;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  /* Bold text styling */
  strong {
    font-weight: 700;
    color: #1a1a1a;
  }
  
  /* Italic text styling */
  em {
    font-style: italic;
    color: #2d2d2d;
  }
  
  /* Bullet points styling */
  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      color: #000000;
      
      &::marker {
        color: var(--primary-color);
      }
    }
  }
  
  /* Code styling */
  code {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.875rem;
    color: #374151;
  }
  
  /* Headers if any */
  h1, h2, h3, h4, h5, h6 {
    color: #1a1a1a;
    font-weight: 700;
    margin: 1rem 0 0.5rem 0;
  }
  
  h3 {
    font-size: 1.125rem;
  }
  
  h4 {
    font-size: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #000000;
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #000000;
  }
  
  p {
    font-size: 1rem;
    margin: 0;
    color: #000000;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #000000;
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #f3f4f6;
    border-left-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }
  
  span {
    color: #000000;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SummaryModal = ({ isOpen, onClose, documentTitle, summary, loading }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
      
      // Focus the modal for accessibility
      const modalContent = document.querySelector('[role="dialog"]');
      if (modalContent) {
        modalContent.focus();
      }
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalStyle;
        document.body.classList.remove('modal-open');
      };
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick} className="summary-modal-overlay">
      <ModalContent isOpen={isOpen} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} className="summary-modal-content">
        <ModalHeader>
          <h2 id="modal-title">
            <FaBookOpen />
            Document Summary
          </h2>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <DocumentTitle>
            <FaInfoCircle />
            {documentTitle}
          </DocumentTitle>
          
          {loading ? (
            <LoadingState>
              <div className="spinner"></div>
              <span>Generating comprehensive summary...</span>
            </LoadingState>
          ) : summary ? (
            <SummaryContent>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </SummaryContent>
          ) : (
            <EmptyState>
              <FaInfoCircle />
              <h3>No Summary Available</h3>
              <p>This document doesn't have a generated summary yet. Try re-uploading the document to generate a new summary.</p>
            </EmptyState>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SummaryModal;
