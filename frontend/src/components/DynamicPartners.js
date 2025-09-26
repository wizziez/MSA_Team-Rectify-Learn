import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { PartnerManager, DISPLAY_CONFIGS } from '../utils/partnersConfig';

// Animations
const fadeInOutSlide = keyframes`
  0%, 45% { opacity: 0; transform: translateY(10px); }
  5%, 40% { opacity: 1; transform: translateY(0); }
  50%, 100% { opacity: 0; transform: translateY(-10px); }
`;

const slideIn = keyframes`
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const PartnersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PartnerTitle = styled.h3`
  font-size: ${props => props.size === 'large' ? '2.2rem' : props.size === 'small' ? '0.85rem' : '1.8rem'};
  font-weight: ${props => props.size === 'small' ? '600' : '700'};
  color: ${props => props.size === 'small' ? 'rgba(255, 255, 255, 0.75)' : '#ffffff'} !important;
  margin: 0 0 ${props => props.size === 'small' ? '1.25rem' : '0.8rem'} 0;
  text-align: center;
  letter-spacing: ${props => props.size === 'small' ? '0.5px' : 'normal'};
  text-transform: ${props => props.size === 'small' ? 'uppercase' : 'none'};
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'large' ? '1.8rem' : props.size === 'small' ? '0.8rem' : '1.5rem'};
  }
`;

const PartnerSubtitle = styled.p`
  font-size: ${props => props.size === 'large' ? '1.1rem' : props.size === 'small' ? '0.85rem' : '1rem'};
  color: #ffffff !important;
  margin: 0 0 2rem 0;
  text-align: center;
  max-width: 700px;
  
  @media (max-width: 768px) {
    font-size: ${props => props.size === 'large' ? '1rem' : props.size === 'small' ? '0.8rem' : '0.9rem'};
    margin-bottom: 1.5rem;
    padding: 0 1rem;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'small' ? '200px' : '280px'};
  height: ${props => props.size === 'small' ? '80px' : '110px'};
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: ${props => props.size === 'small' ? '70px' : '90px'};
    width: ${props => props.size === 'small' ? '180px' : '250px'};
  }
`;

const LogoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 800px;
  align-items: center;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PartnerLogo = styled.div`
  position: ${props => props.rotating ? 'absolute' : 'relative'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.rotating ? 0 : 1};
  ${props => {
    if (props.rotating && props.isVisible) {
      return css`animation: ${fadeInOutSlide} ${props.duration || 10}s infinite;`;
    } else if (!props.rotating) {
      return css`animation: ${slideIn} 0.6s ease forwards;`;
    }
    return '';
  }}
  animation-delay: ${props => props.delay || '0s'};
  cursor: ${props => props.interactive ? 'pointer' : 'default'};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: ${props => props.interactive ? 'scale(1.05)' : 'none'};
  }
  
  svg {
    width: ${props => props.size === 'small' ? '24px' : '32px'};
    height: ${props => props.size === 'small' ? '24px' : '32px'};
    margin-bottom: 0.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .logo-label {
    font-size: ${props => props.size === 'small' ? '0.8rem' : '0.95rem'};
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      font-size: ${props => props.size === 'small' ? '0.75rem' : '0.85rem'};
    }
  }
`;

const PartnerBadge = styled.div`
  background: rgba(88, 101, 242, 0.1);
  border: 1px solid rgba(88, 101, 242, 0.3);
  border-radius: 15px;
  padding: 0.3rem 0.8rem;
  font-size: 0.7rem;
  color: rgba(88, 101, 242, 1);
  margin-top: 0.3rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const PartnerInfo = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 0.8rem;
  border-radius: 8px;
  min-width: 200px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, bottom 0.3s ease;
  z-index: 1000;
  
  ${PartnerLogo}:hover & {
    opacity: 1;
    bottom: -50px;
    pointer-events: auto;
  }
  
  .partner-desc {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
  }
  
  .partner-benefits {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.7);
    
    ul {
      margin: 0;
      padding-left: 1rem;
    }
  }
`;

const DynamicPartners = ({ 
  displayType = 'LANDING_PAGE',
  title = 'Strategic Partnerships',
  subtitle = 'Backed by industry-leading startup programs providing enterprise resources and expertise',
  size = 'medium',
  interactive = false,
  showRotation = true,
  showInfo = false,
  className = ''
}) => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [partners, setPartners] = useState([]);
  const [rotationGroups, setRotationGroups] = useState([]);
  
  const config = DISPLAY_CONFIGS[displayType] || DISPLAY_CONFIGS.LANDING_PAGE;

  useEffect(() => {
    const loadPartners = () => {
      if (showRotation && config.rotationInterval > 0) {
        const groups = PartnerManager.getRotatingPartners(config);
        setRotationGroups(groups);
        setPartners(groups[0] || []);
      } else {
        const staticPartners = PartnerManager.getPartnersForDisplay(config);
        setPartners(staticPartners);
      }
    };

    loadPartners();
  }, [displayType, showRotation]);

  useEffect(() => {
    if (showRotation && rotationGroups.length > 1 && config.rotationInterval > 0) {
      const interval = setInterval(() => {
        setCurrentGroup(prev => (prev + 1) % rotationGroups.length);
      }, config.rotationInterval);

      return () => clearInterval(interval);
    }
  }, [rotationGroups, showRotation, config.rotationInterval]);

  useEffect(() => {
    if (rotationGroups.length > 0) {
      setPartners(rotationGroups[currentGroup] || []);
    }
  }, [currentGroup, rotationGroups]);

  const renderPartnerLogo = (partner, index) => {
    const isRotating = showRotation && rotationGroups.length > 1;
    const logoContent = partner.logo.type === 'svg' 
      ? <div dangerouslySetInnerHTML={{ __html: partner.logo.content }} />
      : <div className="text-logo">{partner.logo.content}</div>;

    return (
      <PartnerLogo
        key={`${partner.id}-${currentGroup}`}
        rotating={isRotating}
        isVisible={true}
        delay={`${index * (config.animationDelay / 1000)}s`}
        duration={config.rotationInterval / 1000}
        size={size}
        interactive={interactive}
      >
        {logoContent}
        <div className="logo-label">{partner.name}</div>
        {partner.category && (
          <PartnerBadge>{partner.category.replace('_', ' ')}</PartnerBadge>
        )}
        
        {showInfo && interactive && (
          <PartnerInfo>
            <div className="partner-desc">{partner.description}</div>
            {partner.benefits && (
              <div className="partner-benefits">
                <ul>
                  {partner.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </PartnerInfo>
        )}
      </PartnerLogo>
    );
  };

  if (partners.length === 0) {
    return null;
  }

  const useGrid = !showRotation || rotationGroups.length <= 1;

  return (
    <PartnersContainer className={className}>
      {title && <PartnerTitle size={size}>{title}</PartnerTitle>}
      {subtitle && <PartnerSubtitle size={size}>{subtitle}</PartnerSubtitle>}
      
      {useGrid ? (
        <LogoGrid>
          {partners.map((partner, index) => renderPartnerLogo(partner, index))}
        </LogoGrid>
      ) : (
        <LogoContainer size={size}>
          {partners.map((partner, index) => renderPartnerLogo(partner, index))}
        </LogoContainer>
      )}
    </PartnersContainer>
  );
};

export default DynamicPartners;
