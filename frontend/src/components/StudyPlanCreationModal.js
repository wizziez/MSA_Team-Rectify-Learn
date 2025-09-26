import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaBook, 
  FaClock, 
  FaCalendarAlt, 
  FaGraduationCap,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import apiService from '../utils/apiService';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.3s ease;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #000;
  }
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormField = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &:invalid {
    border-color: #f44336;
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const DocumentSelector = styled.div`
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  background: white;
`;

const DocumentItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
`;

const DocumentMeta = styled.div`
  font-size: 0.85rem;
  color: #555;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const HelpText = styled.div`
  font-size: 0.85rem;
  color: #555;
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  border: 1px solid #ffcdd2;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background: #e8f5e8;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #333;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }
`;

const GenerateButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const StudyPlanCreationModal = ({ isOpen, onClose, onPlanCreated, onGenerationStarted, onGenerationError }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    document_ids: [],
    daily_study_hours: 2,
    days_until_exam: 7,
    exam_type: 'mixed',
    additional_context: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadDocuments();
    }
  }, [isOpen]);

  const loadDocuments = async () => {
    try {
      setDocumentsLoading(true);
      const response = await apiService.getDocuments();
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents. Please try again.');
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentToggle = (documentId) => {
    setFormData(prev => ({
      ...prev,
      document_ids: prev.document_ids.includes(documentId)
        ? prev.document_ids.filter(id => id !== documentId)
        : [...prev.document_ids, documentId]
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title for your study plan.');
      return false;
    }

    if (formData.document_ids.length === 0) {
      setError('Please select at least one document to include in your study plan.');
      return false;
    }

    if (formData.daily_study_hours < 0.5 || formData.daily_study_hours > 16) {
      setError('Daily study hours must be between 0.5 and 16 hours.');
      return false;
    }

    if (formData.days_until_exam < 1 || formData.days_until_exam > 7) {
      setError('Days until exam must be between 1 and 7 days.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Close modal immediately and start generation loading
    if (onGenerationStarted) {
      onGenerationStarted();
    }

    try {
      // Log the form data being sent
      console.log('=== STUDY PLAN FORM DATA ===');
      console.log('Form Data Object:', formData);
      console.log('Stringified:', JSON.stringify(formData, null, 2));
      console.log('Document IDs:', formData.document_ids);
      console.log('Daily Study Hours:', formData.daily_study_hours);
      console.log('Days Until Exam:', formData.days_until_exam);
      console.log('============================');

      const response = await apiService.generateStudyPlan(formData);
      
      // Log the response
      console.log('=== API RESPONSE ===');
      console.log('Response:', response);
      console.log('Response Data:', response.data);
      console.log('===================');
      
      // Call the success callback with the created plan
      if (onPlanCreated && response.data?.study_plan) {
        onPlanCreated(response.data.study_plan);
      }

    } catch (error) {
      console.error('Error generating study plan:', error);
      
      // Log detailed error information
      console.log('=== ERROR DETAILS ===');
      console.log('Full Error:', error);
      console.log('Error Response:', error.response);
      console.log('Error Response Data:', error.response?.data);
      console.log('Error Status:', error.response?.status);
      console.log('Error Message:', error.message);
      console.log('====================');
      
      // Notify parent of error and stop loading
      if (onGenerationError) {
        onGenerationError();
      }
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Failed to generate study plan. Please try again.';
      
      // Show error notification (you might want to use a toast notification here)
      alert(errorMessage);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaGraduationCap />
            Create AI Study Plan
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        {error && (
          <ErrorMessage>
            <FaExclamationTriangle />
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            <FaCheck />
            {success}
          </SuccessMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>
              <FaBook />
              Plan Details
            </SectionTitle>
            
            <FormField>
              <Label>Study Plan Title</Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Final Exam Preparation - Computer Science"
                required
              />
            </FormField>

            <FormField>
              <Label>Description (Optional)</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your study goals or exam details..."
              />
            </FormField>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaBook />
              Study Materials
            </SectionTitle>
            
            {documentsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#333' }}>
                <FaSpinner className="fa-spin" style={{ marginRight: '0.5rem' }} />
                Loading your documents...
              </div>
            ) : documents.length > 0 ? (
              <DocumentSelector>
                {documents.map(doc => (
                  <DocumentItem key={doc.id}>
                    <Checkbox
                      checked={formData.document_ids.includes(doc.id)}
                      onChange={() => handleDocumentToggle(doc.id)}
                    />
                    <DocumentInfo>
                      <DocumentName>{doc.filename}</DocumentName>
                      <DocumentMeta>
                        {doc.file_type?.toUpperCase()} • {(doc.size / 1024).toFixed(1)}KB
                        {doc.upload_date && ` • ${new Date(doc.upload_date).toLocaleDateString()}`}
                      </DocumentMeta>
                    </DocumentInfo>
                  </DocumentItem>
                ))}
              </DocumentSelector>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#333' }}>
                No documents found. Please upload some study materials first.
              </div>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaClock />
              Time & Schedule
            </SectionTitle>
            
            <FormRow>
              <FormField>
                <Label>Daily Study Hours</Label>
                <Input
                  type="number"
                  min="0.5"
                  max="16"
                  step="0.5"
                  value={formData.daily_study_hours}
                  onChange={(e) => handleInputChange('daily_study_hours', parseFloat(e.target.value))}
                  required
                />
                <HelpText>How many hours can you study each day? (0.5 - 16 hours)</HelpText>
              </FormField>

              <FormField>
                <Label>Days Until Exam</Label>
                <Input
                  type="number"
                  min="1"
                  max="7"
                  value={formData.days_until_exam}
                  onChange={(e) => handleInputChange('days_until_exam', parseInt(e.target.value))}
                  required
                />
                <HelpText>Number of days available for preparation (1-7 days)</HelpText>
              </FormField>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FaGraduationCap />
              Exam Information
            </SectionTitle>
            
            <FormField>
              <Label>Exam Type</Label>
              <Select
                value={formData.exam_type}
                onChange={(e) => handleInputChange('exam_type', e.target.value)}
              >
                <option value="mixed">Mixed (Multiple formats)</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="essay">Essay Questions</option>
                <option value="short_answer">Short Answer</option>
                <option value="practical">Practical/Lab Exam</option>
              </Select>
              <HelpText>What type of questions will be on your exam?</HelpText>
            </FormField>

            <FormField>
              <Label>Additional Context (Optional)</Label>
              <TextArea
                value={formData.additional_context}
                onChange={(e) => handleInputChange('additional_context', e.target.value)}
                placeholder="Any additional information about the exam, topics to focus on, or specific requirements..."
              />
              <HelpText>Help the AI create a better plan by providing exam details, important topics, or study preferences.</HelpText>
            </FormField>
          </FormSection>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancel
            </CancelButton>
            <GenerateButton type="submit" disabled={loading || documents.length === 0}>
              {loading ? (
                <>
                  <FaSpinner className="fa-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <FaGraduationCap />
                  Make Study Plan
                </>
              )}
            </GenerateButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );

  return createPortal(modalContent, document.body);
};

export default StudyPlanCreationModal;
