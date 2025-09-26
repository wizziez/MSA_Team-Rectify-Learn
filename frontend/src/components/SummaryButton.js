import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { FaEye, FaInfoCircle } from 'react-icons/fa';
import SummaryModal from './SummaryModal';
import apiService from '../utils/apiService';

const SummaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: var(--primary-color) !important;
  background: rgba(var(--primary-rgb), 0.1);
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color) !important;
    font-size: 0.875rem;
  }
  
  &:hover {
    background: rgba(var(--primary-rgb), 0.15);
    border-color: rgba(var(--primary-rgb), 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SummaryButtonComponent = ({ documentId, documentTitle, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setLoading(true);
    setError('');
    
    try {
      // Fetch the document details to get the summary
      const response = await apiService.getDocuments();
      const document = response.data.find(doc => doc.id === documentId);
      
      if (document && document.summary) {
        setSummary(document.summary);
      } else {
        setSummary('');
      }
    } catch (err) {
      console.error('Error fetching document summary:', err);
      setError('Failed to load summary');
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SummaryButton 
        onClick={handleOpenModal}
        className={className}
        title="View document summary"
      >
        <FaEye />
        Summary
      </SummaryButton>
      
      {isModalOpen && createPortal(
        <SummaryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          documentTitle={documentTitle}
          summary={error || summary}
          loading={loading}
        />,
        document.body
      )}
    </>
  );
};

export default SummaryButtonComponent;
