import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-size: ${props => props.size || '2.5rem'};
  font-weight: ${props => props.weight || '700'};
  margin-bottom: ${props => props.mb || '1.5rem'};
  color: var(--text-color);
  line-height: 1.2;
  
  ${props => props.center && 'text-align: center;'}
  ${props => props.gradient && `
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
  
  @media (max-width: 768px) {
    font-size: ${props => props.mobileSize || '2rem'};
  }
`;

export const Heading2 = styled.h2`
  font-size: ${props => props.size || '2rem'};
  font-weight: ${props => props.weight || '700'};
  margin-bottom: ${props => props.mb || '1.5rem'};
  color: var(--text-color);
  line-height: 1.2;
  
  ${props => props.center && 'text-align: center;'}
  ${props => props.gradient && `
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
  
  @media (max-width: 768px) {
    font-size: ${props => props.mobileSize || '1.75rem'};
  }
`;

export const Heading3 = styled.h3`
  font-size: ${props => props.size || '1.5rem'};
  font-weight: ${props => props.weight || '600'};
  margin-bottom: ${props => props.mb || '1rem'};
  color: var(--text-color);
  line-height: 1.3;
  
  ${props => props.center && 'text-align: center;'}
  ${props => props.gradient && `
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
  
  @media (max-width: 768px) {
    font-size: ${props => props.mobileSize || '1.25rem'};
  }
`;

export const Paragraph = styled.p`
  font-size: ${props => props.size || '1rem'};
  line-height: 1.7;
  margin-bottom: ${props => props.mb || '1.5rem'};
  color: ${props => props.muted ? 'var(--text-secondary)' : 'var(--text-color)'};
  max-width: ${props => props.maxWidth || 'none'};
  
  ${props => props.center && 'text-align: center;'}
  ${props => props.center && !props.maxWidth && 'margin-left: auto; margin-right: auto;'}
`;

export const HighlightText = styled.span`
  color: var(--primary-color);
  ${props => props.bold && 'font-weight: 600;'}
  ${props => props.underline && `
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      border-radius: 2px;
    }
  `}
`;
