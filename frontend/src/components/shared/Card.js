import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  padding: ${props => props.padding || '2rem'};
  margin-bottom: ${props => props.marginBottom || '2rem'};
  border: 1px solid var(--border-color);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => props.accentColor || 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)'};
    opacity: ${props => props.showAccent ? 1 : 0};
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    transform: ${props => props.hoverEffect ? 'translateY(-7px)' : 'none'};
    box-shadow: ${props => props.hoverEffect ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
    
    &::after {
      opacity: ${props => props.hoverEffect ? 1 : 0};
    }
  }
`;

const Card = ({ 
  children, 
  padding, 
  marginBottom, 
  hoverEffect, 
  showAccent = false,
  accentColor,
  ...props 
}) => {
  return (
    <CardContainer 
      padding={padding} 
      marginBottom={marginBottom}
      hoverEffect={hoverEffect}
      showAccent={showAccent}
      accentColor={accentColor}
      {...props}
    >
      {children}
    </CardContainer>
  );
};

export default Card;
