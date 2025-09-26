import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  text-align: center;
`;

const NotFoundContent = styled.div`
  max-width: 600px;
  padding: 3rem 2rem;
  background-color: var(--white);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
`;

const ErrorCode = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: var(--white);
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent>
        <ErrorIcon>
          <FaExclamationTriangle />
        </ErrorIcon>
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>Page Not Found</ErrorTitle>
        <ErrorMessage>
          The page you're looking for doesn't exist or has been moved. 
          Please check the URL or head back to the home page.
        </ErrorMessage>
        <BackButton to="/">
          <FaArrowLeft />
          Back to Home
        </BackButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound;
