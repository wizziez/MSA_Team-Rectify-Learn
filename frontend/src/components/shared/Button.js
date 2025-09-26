import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const buttonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: ${props => props.fullWidth ? 'center' : 'flex-start'};
  padding: ${props => props.size === 'sm' ? '0.5rem 1rem' : props.size === 'lg' ? '1rem 2.5rem' : '0.75rem 1.5rem'};
  font-size: ${props => props.size === 'sm' ? '0.875rem' : props.size === 'lg' ? '1.1rem' : '1rem'};
  font-weight: 600;
  border-radius: ${props => props.rounded ? '50px' : '6px'};
  transition: all 0.3s ease;
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  text-align: center;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  svg {
    ${props => props.iconRight ? 'margin-left: 0.5rem;' : 'margin-right: 0.5rem;'}
    transition: transform 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    
    svg {
      ${props => props.iconRight ? 'transform: translateX(3px);' : 'transform: translateX(-3px);'}
    }
  }
`;

const PrimaryButtonElement = styled.button`
  ${buttonStyles}
  background: ${props => props.gradient ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' : 'var(--primary-color)'};
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background: ${props => props.gradient ? 'linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-color) 80%)' : 'var(--primary-dark)'};
  }
`;

const SecondaryButtonElement = styled.button`
  ${buttonStyles}
  background: transparent;
  color: ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
  border: 2px solid ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
  
  &:hover:not(:disabled) {
    background: ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
    color: ${props => props.dark ? 'var(--card-background)' : 'white'};
  }
`;

const PrimaryLinkElement = styled(Link)`
  ${buttonStyles}
  background: ${props => props.gradient ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' : 'var(--primary-color)'};
  color: white;
  border: none;
  text-decoration: none;
  
  &:hover:not(:disabled) {
    background: ${props => props.gradient ? 'linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-color) 80%)' : 'var(--primary-dark)'};
  }
`;

const SecondaryLinkElement = styled(Link)`
  ${buttonStyles}
  background: transparent;
  color: ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
  border: 2px solid ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
  text-decoration: none;
  
  &:hover:not(:disabled) {
    background: ${props => props.dark ? 'var(--text-color)' : 'var(--primary-color)'};
    color: ${props => props.dark ? 'var(--card-background)' : 'white'};
  }
`;

export const PrimaryButton = ({ children, to, ...props }) => {
  if (to) {
    return (
      <PrimaryLinkElement to={to} {...props}>
        {children}
      </PrimaryLinkElement>
    );
  }
  
  return (
    <PrimaryButtonElement {...props}>
      {children}
    </PrimaryButtonElement>
  );
};

export const SecondaryButton = ({ children, to, ...props }) => {
  if (to) {
    return (
      <SecondaryLinkElement to={to} {...props}>
        {children}
      </SecondaryLinkElement>
    );
  }
  
  return (
    <SecondaryButtonElement {...props}>
      {children}
    </SecondaryButtonElement>
  );
};
