import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import logo from '../Logo/Logo.png';
import DynamicPartners from './DynamicPartners';
import PropTypes from 'prop-types';

// Logo animation - enhanced with slight rotation
const logoAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.7) translateY(10px);
  }
  45% {
    opacity: 1;
    transform: scale(1.1) translateY(-5px);
  }
  70% {
    transform: scale(0.95) translateY(2px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

// Enhanced glow animation for the logo
const pulseGlow = keyframes`
  0% {
    filter: drop-shadow(0 0 15px rgba(64, 78, 237, 0.6));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(88, 101, 242, 1));
  }
  100% {
    filter: drop-shadow(0 0 15px rgba(64, 78, 237, 0.6));
  }
`;

// Extra outer glow effect animation
const outerGlow = keyframes`
  0% {
    box-shadow: 0 0 15px rgba(64, 78, 237, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(88, 101, 242, 0.7);
  }
  100% {
    box-shadow: 0 0 15px rgba(64, 78, 237, 0.4);
  }
`;

// Fade out animation
const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    visibility: hidden;
  }
`;

// Text gradient animation
const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Fade in up animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Subtle float animation
const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-7px);
  }
`;

// Container with AMOLED black background and subtle noise texture
const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background: #000000; /* True AMOLED black */
  animation: ${props => props.fadeOut ? fadeOut : 'none'} 0.9s ease forwards;
  animation-delay: ${props => props.fadeOut ? '2.5s' : '0s'};
  padding: 1rem;
  box-sizing: border-box;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(64, 78, 237, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(88, 101, 242, 0.02) 0%, transparent 40%),
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cg fill='%235865F2' opacity='0.03'%3E%3Ccircle cx='100' cy='100' r='1'/%3E%3Ccircle cx='250' cy='150' r='1'/%3E%3Ccircle cx='350' cy='50' r='0.5'/%3E%3Ccircle cx='50' cy='250' r='0.5'/%3E%3Ccircle cx='300' cy='300' r='1'/%3E%3Ccircle cx='150' cy='50' r='0.5'/%3E%3Ccircle cx='200' cy='350' r='0.5'/%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
    opacity: 0.15;
  }
`;

// Logo container with modern glassmorphism effect
const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  border-radius: 1.75rem;
  background: rgba(15, 15, 20, 0.75);
  box-shadow: 
    0 10px 35px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(64, 78, 237, 0.1);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 1.2s ease-out forwards;
  max-width: 380px;
  width: 90%;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, rgba(64, 78, 237, 0), rgba(88, 101, 242, 0.7), rgba(64, 78, 237, 0));
    animation: ${gradientShift} 3s ease infinite;
    background-size: 200% 200%;
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem;
    max-width: 340px;
  }
  
  @media (max-width: 480px) {
    padding: 2rem;
    max-width: 300px;
  }
`;

// Logo with animation - simplified with just the enhanced glow
const LogoImage = styled.img`
  width: 180px;
  height: auto;
  margin-bottom: 1.25rem;
  animation: 
    ${logoAnimation} 1.5s ease-out forwards,
    ${pulseGlow} 3s ease-in-out infinite 1s;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 160px;
  }
  
  @media (max-width: 480px) {
    width: 140px;
  }
  
  @media (max-width: 360px) {
    width: 120px;
  }
`;

// Add a wrapper for the logo with glow effect
const LogoWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
    height: 90%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(88, 101, 242, 0.15) 0%, rgba(64, 78, 237, 0.05) 50%, transparent 70%);
    z-index: 1;
    filter: blur(8px);
  }
`;

// App Name with gradient
const AppName = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
  margin: 0.5rem 0;
  text-align: center;
  background: linear-gradient(90deg, #404EED, #5865F2, #738AFF, #5865F2, #404EED);
  background-size: 300% 300%;
  animation: ${gradientShift} 5s ease infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

// Tagline with modern styling and word-by-word animation
const TaglineContainer = styled.div`
  margin: 0.75rem 0 1.75rem;
  text-align: center;
  width: 100%;
`;

const TaglineWord = styled.span`
  display: inline-block;
  font-size: 1.05rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0.25rem;
  opacity: 0;
  animation: ${fadeInUp} 0.5s ease forwards;
  animation-delay: ${props => props.delay}s;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.85rem;
    margin: 0 0.15rem;
  }
`;

// Partner section with improved design
const PartnerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 1.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(64, 78, 237, 0.15);
  width: 100%;
  opacity: 0;
  animation: ${fadeInUp} 0.8s ease forwards 1.8s;
`;

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const splashScreenShown = sessionStorage.getItem('splashScreenShown');
    if (splashScreenShown) {
      if (onFinish) onFinish();
      return;
    }

    // Start fade out after 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    // Call onFinish after animations complete
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3900); // Total animation time including fade out
    
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  // Split tagline into words for animation
  const taglineWords = "Master More, Forget Less, Learn Intelligently".split(" ");
  
  return (
    <SplashContainer fadeOut={fadeOut}>
      <LogoContainer>
        <LogoImage src={logo} alt="Rectify Learn Logo" />
        
        <TaglineContainer>
          {taglineWords.map((word, index) => (
            <TaglineWord 
              key={`${word}-${index}`} 
              delay={1.2 + index * 0.1}
            >
              {word}
            </TaglineWord>
          ))}
        </TaglineContainer>        <PartnerSection>
          <DynamicPartners
            displayType="SPLASH_SCREEN"
            title="In Partnership With"
            subtitle=""
            size="small"
            interactive={false}
            showRotation={true}
            showInfo={false}
          />
        </PartnerSection>
      </LogoContainer>
    </SplashContainer>
  );
};

SplashScreen.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default SplashScreen;