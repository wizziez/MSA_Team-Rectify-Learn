import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaBrain } from 'react-icons/fa';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
`;

const MnemonicsButtonWrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: rgba(139, 92, 246, 0.9) !important;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(139, 92, 246, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%);
    border-color: rgba(139, 92, 246, 0.5);
    color: rgba(139, 92, 246, 1) !important;
    transform: translateY(-2px);
    animation: ${pulse} 2s infinite;
    
    &::before {
      left: 100%;
    }
    
    .icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .icon {
    transition: all 0.3s ease;
    font-size: 1rem;
  }
  
  .text {
    font-weight: 600;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    
    .icon {
      font-size: 0.9rem;
    }
  }
`;

const MnemonicsButton = ({ documentId, className, style, children, ...props }) => {
  return (
    <MnemonicsButtonWrapper
      to="/mnemonics"
      className={className}
      style={style}
      {...props}
    >
      <FaBrain className="icon" />
      <span className="text">{children || 'Mnemonics'}</span>
    </MnemonicsButtonWrapper>
  );
};

export default MnemonicsButton;
