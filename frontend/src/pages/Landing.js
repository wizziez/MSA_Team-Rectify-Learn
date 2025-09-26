import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaChartLine, 
  FaBrain,
  FaLayerGroup,
  FaRegCreditCard,
  FaRegLightbulb,
  FaRegCheckCircle,
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaAward,
  FaRobot,
  FaTimes,
  FaCheckCircle,
  FaLock,
  FaPlay,
  FaSyncAlt,
  FaCode,
  FaUserGraduate,
  FaArrowRight,
  FaBolt
} from 'react-icons/fa';
import axios from 'axios';
import DynamicPartners from '../components/DynamicPartners';

// Discord-inspired colors
const colors = {
  blurple: '#5865F2',
  green: '#57F287',
  yellow: '#FEE75C',
  fuchsia: '#EB459E',
  red: '#ED4245',
  white: '#FFFFFF',
  black: '#23272A',
  darkButNotBlack: '#2C2F33',
  notQuiteBlack: '#23272A',
  greyple: '#99AAB5',
};

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const float3D = keyframes`
  0% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-20px) rotateX(10deg); }
  100% { transform: translateY(0px) rotateX(0deg); }
`;

const fadeInOut = keyframes`
  0%, 32% { opacity: 0; visibility: hidden; transform: translateY(20px); }
  33%, 65% { opacity: 1; visibility: visible; transform: translateY(0); }
  66%, 100% { opacity: 0; visibility: hidden; transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: translateX(-50%) translateY(-50%) translateY(0px) scale(1); }
  50% { transform: translateX(-50%) translateY(-50%) translateY(-2px) scale(1.01); }
`;

// Discord-inspired container
const LandingContainer = styled.div`
  padding: 0;
  position: relative;
  overflow-x: hidden;
  background-color: #2C2F33;
`;

// Wavy dividers
const WaveDivider = styled.div`
  position: absolute;
  width: 100%;
  height: 100px;
  ${props => props.top ? 'top: -1px' : 'bottom: -1px'};
  left: 0;
  
  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    ${props => props.top ? 'transform: rotate(180deg);' : ''}
  }
`;

// Enhanced Modern Hero Section
const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  padding: 8rem 0 10rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, 
    #000000 0%, 
    #0a0610 30%, 
    #1a0829 50%, 
    #0a0610 70%, 
    #000000 100%
  );
  color: #ffffff;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, 
      rgba(156, 39, 176, 0.15) 0%, 
      rgba(103, 58, 183, 0.1) 40%, 
      transparent 70%
    );
    border-radius: 50%;
    z-index: 1;
    animation: ${float} 20s ease-in-out infinite;
    filter: blur(40px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, 
      rgba(156, 39, 176, 0.12) 0%, 
      rgba(103, 58, 183, 0.08) 35%, 
      transparent 65%
    );
    border-radius: 50%;
    z-index: 1;
    animation: ${float} 15s ease-in-out infinite reverse;
    filter: blur(30px);
  }
  
  @media (max-width: 768px) {
    padding: 6rem 0 8rem;
    min-height: auto;
    
    &::before {
      width: 400px;
      height: 400px;
      top: -20%;
      right: -10%;
    }
    
    &::after {
      width: 300px;
      height: 300px;
      bottom: -15%;
      left: -10%;
    }
  }
  
  @media (max-width: 576px) {
    padding: 5rem 0 7rem;
    
    &::before,
    &::after {
      display: none;
    }
  }
`;

const HeroContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 3;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 0 1rem;
  }
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  padding: 3rem 0;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    gap: 2rem;
    padding: 2rem 0;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  @media (max-width: 992px) {
    align-items: center;
    text-align: center;
  order: 2;
  }
`;

const HeroRight = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 992px) {
    order: 1;
  }
`;

const HeroImage = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 550px;
  height: 450px;
  background-image: url('/Homepage_Hero/Homepage_Hero.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${float} 8s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: linear-gradient(135deg, 
      rgba(156, 39, 176, 0.2) 0%, 
      rgba(103, 58, 183, 0.15) 50%, 
      rgba(156, 39, 176, 0.1) 100%
    );
    border-radius: 20px;
    filter: blur(20px);
    z-index: -1;
    animation: ${float} 10s ease-in-out infinite reverse;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, 
      rgba(156, 39, 176, 0.1) 0%, 
      transparent 60%
    );
    border-radius: 50%;
    z-index: -2;
    animation: ${pulse} 6s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    height: 350px;
    max-width: 450px;
  }
  
  @media (max-width: 576px) {
    height: 280px;
    max-width: 350px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.8rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #ffffff !important;
  text-align: left;
  position: relative;
  
  .highlight {
    background: linear-gradient(135deg, 
      #ffffff 0%, 
      #e0e0e0 50%, 
      #c0c0c0 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.6) 0%, 
        rgba(224, 224, 224, 0.8) 50%, 
        rgba(255, 255, 255, 0.6) 100%
      );
      border-radius: 2px;
      animation: ${pulse} 3s ease-in-out infinite;
    }
  }
  
  @media (max-width: 992px) {
    text-align: center;
  }
  
  @media (max-width: 768px) {
    font-size: 3.2rem;
    line-height: 1.2;
  }
  
  @media (max-width: 576px) {
    font-size: 2.4rem;
    line-height: 1.3;
  }
`;

const DynamicText = styled.span`
  position: relative;
  display: inline-block;
  background: linear-gradient(135deg, 
    #ffffff 0%, 
    #e0e0e0 50%, 
    #c0c0c0 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.6s ease;
  transform: ${props => props.isAnimating ? 'translateY(-20px)' : 'translateY(0)'};
  opacity: ${props => props.isAnimating ? '0' : '1'};
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.6) 0%, 
      rgba(224, 224, 224, 0.8) 50%, 
      rgba(255, 255, 255, 0.6) 100%
    );
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.85) !important;
  margin-bottom: 2rem;
  max-width: 550px;
  letter-spacing: 0.3px;
  text-align: left;
  
  @media (max-width: 992px) {
    text-align: center;
    max-width: 600px;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 500px;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    max-width: 100%;
  }
`;

const EmphasizedKeyword = styled.span`
  color: #ffffff;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(255, 255, 255, 0.7) 0%, 
      rgba(224, 224, 224, 0.9) 50%, 
      rgba(255, 255, 255, 0.7) 100%
    );
    border-radius: 1px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const HeroMotto = styled(motion.div)`
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: #ffffff;
  color: #000000;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.15);
  margin-top: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.25);
    background: #f5f5f5;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 992px) {
    align-self: center;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: transparent;
  color: #ffffff;
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
    transform: translateY(-2px);
  }
  
  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
  }
`;

const SocialProof = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 992px) {
    align-items: center;
  }
`;

const SocialProofText = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

const SocialProofLogos = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  opacity: 0.6;
  
  @media (max-width: 576px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const LogoItem = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  
  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`;

const TrustBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, 
    rgba(156, 39, 176, 0.15) 0%, 
    rgba(103, 58, 183, 0.1) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(156, 39, 176, 0.3);
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.2);
  align-self: flex-start;
  
  .icon {
    font-size: 1.1rem;
    color: rgba(156, 39, 176, 0.9);
  }
  
  @media (max-width: 992px) {
    align-self: center;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
    padding: 0.6rem 1.2rem;
    gap: 0.4rem;
  }
`;

const ScienceBackedBadge = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.15) 0%, 
    rgba(16, 185, 129, 0.1) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
  align-self: flex-start;
  max-width: 500px;
  line-height: 1.4;
  
  .icon {
    font-size: 1.2rem;
    color: rgba(34, 197, 94, 0.9);
    flex-shrink: 0;
  }
  
  @media (max-width: 992px) {
    align-self: center;
    max-width: 450px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.875rem 1.5rem;
    gap: 0.6rem;
    max-width: 400px;
  }
  
  @media (max-width: 576px) {
    font-size: 0.85rem;
    padding: 0.75rem 1.25rem;
    gap: 0.5rem;
    max-width: 350px;
    text-align: center;
  }
`;



// Enhanced HeroParticles with 3D educational elements
const HeroParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  perspective: 1000px;
  
  .particle {
    position: absolute;
    background: ${colors.blurple};
    border-radius: 50%;
    opacity: 0.2;
    animation: particleFloat 15s linear infinite;
  }
  
  .edu-object {
    position: absolute;
    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
    opacity: 0.8;
    transform-style: preserve-3d;
    animation: ${float3D} 8s ease-in-out infinite;
    
    @media (max-width: 768px) {
      display: none;
    }
    
    &.book {
      width: 50px;
      height: 40px;
      background: ${colors.yellow};
      border-radius: 3px;
      
      &:after {
        content: '';
        position: absolute;
        left: 5px;
        top: 5px;
        width: 40px;
        height: 30px;
        background: rgba(255,255,255,0.3);
        border-radius: 2px;
      }
    }
    
    &.atom {
      width: 40px;
      height: 40px;
      border: 3px solid ${colors.fuchsia};
      border-radius: 50%;
      
      &:before, &:after {
        content: '';
        position: absolute;
        width: 46px;
        height: 10px;
        left: -3px;
        top: 15px;
        border: 3px solid ${colors.fuchsia};
        border-radius: 50%;
      }
      
      &:after {
        transform: rotate(60deg);
      }
      
      .nucleus {
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors.fuchsia};
        border-radius: 50%;
        left: 15px;
        top: 15px;
      }
    }
    
    &.notebook {
      width: 40px;
      height: 50px;
      background: ${colors.green};
      border-radius: 3px;
      transform: rotate(-15deg);
      
      &:before {
        content: '';
        position: absolute;
        width: 30px;
        height: 3px;
        background: rgba(255,255,255,0.5);
        left: 5px;
        top: 10px;
      }
      
      &:after {
        content: '';
        position: absolute;
        width: 30px;
        height: 3px;
        background: rgba(255,255,255,0.5);
        left: 5px;
        top: 20px;
      }
      
      .line {
        position: absolute;
        width: 30px;
        height: 3px;
        background: rgba(255,255,255,0.5);
        left: 5px;
        top: 30px;
      }
    }
    
    &.flask {
      width: 35px;
      height: 45px;
      border-bottom: 30px solid ${colors.blurple};
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      
      &:before {
        content: '';
        position: absolute;
        width: 15px;
        height: 10px;
        background: ${colors.blurple};
        border-radius: 5px 5px 0 0;
        left: 0;
        top: -10px;
      }
      
      &:after {
        content: '';
        position: absolute;
        width: 15px;
        height: 5px;
        background: ${colors.white};
        opacity: 0.5;
        border-radius: 50%;
        left: 10px;
        top: 15px;
      }
    }
  }
  
  @keyframes particleFloat {
    0% { transform: translateY(100vh); }
    100% { transform: translateY(-100vh); }
  }
`;

// Update HeroMain to match Discord's left-aligned style
const HeroMain = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  animation: ${fadeIn} 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transform-style: preserve-3d;
  perspective: 800px;
  width: 100%;
  max-width: 900px;
  
  @media (max-width: 992px) {
    align-items: center;
    text-align: center;
    perspective: none;
    transform-style: flat;
    padding: 1rem 0;
  }
  
  @media (max-width: 576px) {
    width: 100%;
    padding: 0.5rem 0;
  }
  
  &:hover {
    .hero-3d-shadow {
      transform: translateZ(-3px);
      opacity: 0.6;
      
      @media (max-width: 992px) {
        display: none;
      }
    }
  }
`;

// Update HeroHeadline to have the dynamic text effect
const HeroHeadline = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
  color: ${colors.white};
  position: relative;
  max-width: 900px;
  perspective: 800px;
  text-transform: uppercase;
  
  .static-text {
    display: inline-block;
    margin-right: 15px;
  }
  
  .dynamic-text-wrapper {
    position: relative;
    display: inline-block;
    min-width: 220px;
    height: 5rem;
    overflow: visible;
    
    @media (max-width: 768px) {
      height: 3.5rem;
      min-width: 180px;
      display: block;
    }
    
    @media (max-width: 576px) {
      height: 3rem;
      width: 100%;
      margin-top: 10px;
      text-align: center;
      display: block;
    }
    
    @media (max-width: 380px) {
      height: 2.5rem;
    }
  }
  
  .dynamic-text {
    position: absolute;
    left: 0;
    top: 0;
    white-space: nowrap;
    color: ${colors.yellow};
    opacity: 0;
    visibility: hidden;
    width: auto;
    animation: ${fadeInOut} 9s linear infinite;
    transform: translateY(20px);
    
    @media (max-width: 576px) {
      width: 100%;
      text-align: center;
      left: 0;
      right: 0;
    }
    
    &::after {
      content: '';
      position: absolute;
      height: 8px;
      bottom: 6px;
      left: 0;
      width: 100%;
      background: rgba(235, 69, 158, 0.4);
      z-index: -1;
      border-radius: 8px;
      transform: skew(-10deg);
      
      @media (max-width: 992px) {
        transform: skew(-10deg);
      }
      
      @media (max-width: 576px) {
        height: 5px;
        bottom: 3px;
      }
      
      @media (max-width: 380px) {
        height: 4px;
        bottom: 2px;
      }
    }
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 3s; }
    &:nth-child(3) { animation-delay: 6s; }
  }
  
  @media (max-width: 968px) {
    font-size: 3.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.75rem;
    
    .static-text {
      margin-right: 5px;
    }
    
    .dynamic-text::after {
      height: 6px;
      bottom: 4px;
    }
  }
  
  @media (max-width: 576px) {
    font-size: 2.25rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 1.5rem;
    
    .static-text {
      margin-right: 0;
      margin-bottom: 10px;
      text-align: center;
      width: 100%;
    }
    
    .dynamic-text::after {
      height: 4px;
      bottom: 3px;
    }
  }
  
  @media (max-width: 380px) {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
    
    .static-text {
      margin-bottom: 5px;
    }
  }
`;

const HeroSubheading = styled.p`
  font-size: 1.5rem;
  margin-bottom: 3.5rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  line-height: 1.6;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0 1rem;
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
    padding: 0;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    margin-bottom: 3rem;
    justify-content: center;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    width: 100%;
    max-width: 240px;
    gap: 1rem;
    margin-bottom: 2rem;
    align-items: center;
  }
`;

const PrimaryAction = styled(Link)`
  padding: 1rem 2rem;
  background: ${colors.white};
  color: ${colors.blurple};
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: perspective(1000px) translateZ(0);
  width: auto;
  
  @media (max-width: 576px) {
    width: 100%;
    font-size: 1rem;
    padding: 0.9rem 1.8rem;
  }
  
  @media (max-width: 380px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.95rem;
  }
  
  span {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    margin-left: 0.75rem;
    transition: transform 0.3s ease;
    
    @media (max-width: 380px) {
      margin-left: 0.5rem;
    }
  }
  
  &:hover {
    transform: perspective(1000px) translateY(-2px) translateZ(10px) rotateX(5deg);
    background: ${colors.white};
    box-shadow: 0 12px 30px rgba(88, 101, 242, 0.3);
    
    svg {
      transform: translateX(3px);
    }
    
    @media (max-width: 576px) {
      transform: translateY(-2px);
    }
  }
  
  &:active {
    transform: perspective(1000px) translateY(1px) translateZ(0);
    
    @media (max-width: 576px) {
      transform: translateY(1px);
    }
  }
`;

const SecondaryAction = styled(Link)`
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  color: ${colors.white};
  font-weight: 600;
  font-size: 1.1rem;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  span {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    margin-left: 0.75rem;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    
    svg {
      transform: translateX(3px);
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  z-index: 5;
  
  @media (max-width: 768px) {
    bottom: 25px;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0) translateX(-50%);
    }
    40% {
      transform: translateY(-10px) translateX(-50%);
    }
    60% {
      transform: translateY(-5px) translateX(-50%);
    }
  }
  
  svg {
    margin-top: 0.5rem;
    color: ${colors.white};
    font-size: 1.2rem;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

// Enhanced Learning Tools section with modern glass design
const FeaturesSection = styled.section`
  padding: 10rem 0;
  background: linear-gradient(135deg, #000000 0%, #3b1e7a 50%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 8rem 0;
  }
  
  @media (max-width: 576px) {
    padding: 6rem 0;
  }
`;


const FeaturesContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 60%, #9c27b0 80%, #673ab7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
    margin-bottom: 5rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 4rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 3rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
    padding: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
    
    @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    }
    
    @media (max-width: 576px) {
    gap: 1rem;
    padding: 1rem;
  }
`;

// 3D Model Components to replace emojis
const Brain3D = styled.div`
    width: 100%;
    height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 65%;
    height: 75%;
    background: linear-gradient(135deg, #5865f2, #eb459e);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    top: 12%;
    left: 18%;
    transform: rotateZ(-15deg) rotateX(5deg);
    box-shadow: 0 8px 16px rgba(88, 101, 242, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 45%;
    height: 55%;
    background: linear-gradient(135deg, #57f287, #5865f2);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    top: 22%;
    left: 32%;
    transform: rotateZ(15deg) rotateX(-3deg);
    box-shadow: 0 6px 12px rgba(87, 242, 135, 0.3);
  }
  
  & > div {
    position: absolute;
    width: 20%;
    height: 25%;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    border-radius: 50%;
    top: 35%;
    left: 45%;
    transform: rotateZ(45deg) rotateX(10deg);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  }
`;

const Book3D = styled.div`
      width: 100%;
  height: 100%;
  position: relative;
      transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 85%;
    height: 95%;
    background: linear-gradient(135deg, #f59e0b, #ef4444);
    border-radius: 10px;
    top: 3%;
    left: 8%;
    transform: rotateY(-18deg) rotateX(8deg);
    box-shadow: 0 12px 24px rgba(245, 158, 11, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 75%;
    height: 85%;
    background: linear-gradient(135deg, #10b981, #3b82f6);
        border-radius: 8px;
    top: 8%;
    left: 12%;
    transform: rotateY(-12deg) rotateX(5deg);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
  }
  
  & > div {
    position: absolute;
    width: 60%;
    height: 70%;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    border-radius: 6px;
    top: 12%;
    left: 18%;
    transform: rotateY(-8deg) rotateX(3deg);
    box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3);
  }
`;

const Target3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    width: 85%;
    height: 85%;
    background: linear-gradient(135deg, #ef4444, #f59e0b);
    border-radius: 50%;
    top: 8%;
    left: 8%;
    border: 5px solid rgba(255,255,255,0.4);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 55%;
    height: 55%;
    background: linear-gradient(135deg, #10b981, #3b82f6);
    border-radius: 50%;
    top: 22%;
    left: 22%;
    border: 4px solid rgba(255,255,255,0.5);
    box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
  }
  
  & > div {
    position: absolute;
    width: 30%;
    height: 30%;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    border-radius: 50%;
    top: 35%;
    left: 35%;
    border: 3px solid rgba(255,255,255,0.6);
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
  }
`;

const Robot3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 85%;
    background: linear-gradient(135deg, #6b7280, #9ca3af);
    border-radius: 16px;
    top: 8%;
    left: 12%;
    transform: rotateY(-12deg) rotateX(5deg);
    box-shadow: 0 10px 20px rgba(107, 114, 128, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 45%;
    height: 35%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 12px;
    top: 18%;
    left: 25%;
    transform: rotateY(-8deg) rotateX(3deg);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
  }
  
  & > div {
    position: absolute;
    width: 25%;
    height: 20%;
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 50%;
    top: 25%;
    left: 35%;
    transform: rotateY(-5deg) rotateX(2deg);
    box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      width: 60%;
      height: 60%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 50%;
      top: 20%;
      left: 20%;
      animation: pulse 2s ease-in-out infinite;
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
`;

const Chart3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 80%;
    height: 90%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 12px;
    top: 5%;
    left: 10%;
    transform: rotateY(-15deg) rotateX(8deg);
    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 60%;
    height: 70%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    border-radius: 8px;
    top: 15%;
    left: 20%;
    transform: rotateY(-10deg) rotateX(5deg);
    box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);
  }
  
  & > div {
  position: absolute;
    width: 30%;
    height: 25%;
    background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
    top: 30%;
    left: 35%;
    transform: rotateY(-8deg) rotateX(3deg);
    box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      width: 50%;
      height: 50%;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 50%;
      top: 25%;
      left: 25%;
      animation: pulse 2s ease-in-out infinite;
    }
  }
`;

const Pricing3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 70%;
    height: 80%;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 12px;
    top: 10%;
    left: 15%;
    transform: rotateY(-12deg) rotateX(6deg);
    box-shadow: 0 12px 24px rgba(245, 158, 11, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 50%;
    height: 60%;
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 8px;
    top: 20%;
    left: 25%;
    transform: rotateY(-8deg) rotateX(4deg);
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.4);
  }
  
  & > div {
    position: absolute;
    width: 25%;
    height: 20%;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 50%;
    top: 35%;
    left: 40%;
    transform: rotateY(-6deg) rotateX(2deg);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      width: 60%;
      height: 60%;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 50%;
      top: 20%;
      left: 20%;
      animation: pulse 2s ease-in-out infinite;
    }
  }
`;

const Repetition3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: ${float3D} 4s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    width: 75%;
    height: 85%;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    border-radius: 12px;
    top: 8%;
    left: 12%;
    transform: rotateY(-14deg) rotateX(7deg);
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 55%;
    height: 65%;
    background: linear-gradient(135deg, #06b6d4, #0891b2);
    border-radius: 8px;
    top: 18%;
    left: 22%;
    transform: rotateY(-9deg) rotateX(5deg);
    box-shadow: 0 8px 16px rgba(6, 182, 212, 0.4);
  }
  
  & > div {
    position: absolute;
    width: 28%;
    height: 22%;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    border-radius: 50%;
    top: 32%;
    left: 36%;
    transform: rotateY(-7deg) rotateX(3deg);
    box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      width: 55%;
      height: 55%;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      top: 22%;
      left: 22%;
      animation: pulse 2s ease-in-out infinite;
    }
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 3rem 2.5rem;
  backdrop-filter: blur(15px);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
  }
  
  @media (max-width: 576px) {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }
`;

const FeatureIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  color: #ffffff;
  transition: all 0.3s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 1.6rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 576px) {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
    margin-bottom: 1.25rem;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.75rem;
    font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  letter-spacing: -0.01em;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
    
  @media (max-width: 576px) {
      font-size: 1.25rem;
    }
`;
  
const FeatureDescription = styled.p`
    font-size: 1.1rem;
    line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    margin-bottom: 1.5rem;
      }
      
  @media (max-width: 576px) {
        font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
`;

const FeatureStats = styled.div`
  display: flex;
  gap: 1.25rem;

  @media (max-width: 576px) {
    gap: 1rem;
  }
`;

const StatItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
      font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.04);
  padding: 0.6rem 1rem;
    border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  svg {
        font-size: 0.8rem;
    color: #57f287;
  }
  
  span {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.5rem 0.8rem;
  }
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
`;

// Discord-style document types
const DocTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: var(--card-background);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 1.25rem;
    gap: 1.25rem;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 380px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const DocTypeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 800px;
  
  ${props => props.highlighted && `
    transform: scale(1.1) translateZ(40px);
    
    @media (max-width: 576px) {
      transform: scale(1.05) translateZ(20px);
    }
  `}
  
  .icon-container {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 16px;
    transition: all 0.3s;
    border: 2px solid;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transform: translateZ(30px);
    
    @media (max-width: 768px) {
      width: 70px;
      height: 70px;
      transform: translateZ(20px);
      border-radius: 12px;
    }
    
    @media (max-width: 576px) {
      width: 60px;
      height: 60px;
      transform: none;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
    }
    
    @media (max-width: 380px) {
      width: 50px;
      height: 50px;
    }
  }
  
  .doc-label {
    font-weight: 600;
    color: #333333;
    transform: translateZ(20px);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      transform: translateZ(10px);
    }
    
    @media (max-width: 576px) {
      font-size: 0.85rem;
      transform: none;
    }
    
    @media (max-width: 380px) {
      font-size: 0.8rem;
    }
  }
  
  &:hover {
    transform: ${props => props.highlighted ? 'scale(1.15) translateY(-5px) rotateY(10deg)' : 'translateY(-5px) rotateY(10deg)'};
    
    @media (max-width: 768px) {
      transform: ${props => props.highlighted ? 'scale(1.1) translateY(-3px)' : 'translateY(-3px)'};
    }
    
    @media (max-width: 576px) {
      transform: ${props => props.highlighted ? 'scale(1.05) translateY(-2px)' : 'translateY(-2px)'};
    }
    
    .icon-container {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      transform: translateZ(40px);
      
      @media (max-width: 768px) {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        transform: translateZ(30px);
      }
      
      @media (max-width: 576px) {
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        transform: none;
      }
    }
  }
`;

const DocumentTypes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
  }
  
  @media (max-width: 380px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// API configuration
const API_BASE_URL = 'https://academic-comeback-backend.onrender.com/api';

// Feature Box Animation and Enhancement
const FeatureBoxBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  border-radius: 24px;
  background: rgba(var(--primary-rgb), 0.03);
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 576px) {
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      ${props => props.rotation || '25deg'},
      rgba(var(--primary-rgb), 0.02) 0%,
      rgba(var(--primary-rgb), 0.08) 50%,
      rgba(var(--primary-rgb), 0.02) 100%
    );
    top: 0;
    left: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    right: 0px;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(var(--primary-rgb), 0.12), transparent 70%);
    border-radius: 50%;
    opacity: 0.8;
    
    @media (max-width: 576px) {
      width: 100px;
      height: 100px;
      bottom: -10px;
      right: 0px;
    }
  }
`;

// Microsoft for Startups Section


// How Rectify Learn Works Process Section - Modern Design
const ProcessSection = styled.section`
  padding: 10rem 0;
  background: linear-gradient(135deg, #000000 0%, #3b1e7a 50%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  

  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.6;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
    border-radius: 50%;
  
  @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 8rem 0;
  }
  
  @media (max-width: 576px) {
    padding: 6rem 0;
  }
`;

const ProcessContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 0 1rem;
  }
`;

const ProcessHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 4rem;
  }
  
  @media (max-width: 576px) {
    margin-bottom: 3rem;
  }
`;

const ProcessTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 1rem;
  }
`;

const ProcessTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2.5rem;
  }
`;

const ProcessSubtitle = styled.p`
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

const ProcessCard = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  padding: 4rem;
  backdrop-filter: blur(25px);
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #9c27b0, #673ab7, #3f51b5);
    border-radius: 24px 24px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 3rem;
  }
  
  @media (max-width: 576px) {
    padding: 2rem;
    border-radius: 20px;
    
    &::before {
      border-radius: 20px 20px 0 0;
    }
  }
`;

const StepTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 0.8rem;
  }
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
`;

const StepTab = styled.button`
  padding: 1rem 2rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)'};
  color: ${props => props.active ? '#2c3e50' : 'rgba(255, 255, 255, 0.5)'};
  border: 2px solid ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 8px 25px rgba(255, 255, 255, 0.3)' : 'none'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)'};
    color: ${props => props.active ? '#2c3e50' : 'rgba(255, 255, 255, 0.9)'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 8px 25px rgba(255, 255, 255, 0.4)' : '0 8px 25px rgba(156, 39, 176, 0.3)'};
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
    flex: 1;
    min-width: 90px;
  }
`;

const StepContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const StepNumber = styled.div`
  font-size: 5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #9c27b0, #673ab7);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
  
  @media (max-width: 576px) {
    font-size: 3.5rem;
  }
`;

const StepDetails = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.6rem;
  }
`;

const StepDescription = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

// Enhanced CTA section - matching unified design
const CTASection = styled.section`
  padding: 10rem 0;
  background: linear-gradient(135deg, #000000 0%, #3b1e7a 50%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.4;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0) 70%);
    border-radius: 50%;
    
    @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 8rem 0;
  }
    
    @media (max-width: 576px) {
    padding: 6rem 0;
  }
`;

const CTAContent = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  padding: 4rem;
  backdrop-filter: blur(25px);
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #9c27b0, #673ab7, #3f51b5);
    border-radius: 24px 24px 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 2rem;
    margin: 0 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 2.5rem 1.5rem;
    margin: 0 1rem;
    border-radius: 16px;
    
    &::before {
      border-radius: 16px 16px 0 0;
    }
  }
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  perspective: 1000px;
  color: #ffffff !important;
  
  span {
    color: ${colors.yellow};
    position: relative;
    display: inline-block;
    transform-style: preserve-3d;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 5px;
      width: 100%;
      height: 8px;
      background: rgba(235, 69, 158, 0.5);
      z-index: -1;
      border-radius: 4px;
      transform: skew(-12deg) translateZ(10px);
      box-shadow: 0 8px 20px rgba(235, 69, 158, 0.4);
      
      @media (max-width: 576px) {
        height: 5px;
        bottom: 3px;
      }
    }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 380px) {
    font-size: 1.75rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  color: #ffffff !important;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 380px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    gap: 1rem;
  }
`;

const CTAWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 1.5rem 1rem;
  }
`;

const GlowingButton = styled(Link)`
  padding: 1rem 2.5rem;
  background: ${colors.white};
  color: ${colors.blurple};
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-out;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
  
  @media (max-width: 576px) {
    padding: 0.8rem 1.8rem;
    font-size: 0.95rem;
    width: 100%;
  }
  
  span {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  svg {
    margin-left: 0.75rem;
    color: ${colors.blurple};
    transition: transform 0.3s ease-out;
    
    @media (max-width: 576px) {
      margin-left: 0.5rem;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0));
    transform: translateX(-100%);
    transition: transform 0.6s ease-out;
  }
  
  &:hover {
    transform: translateY(-3px);
    background: ${colors.white};
    color: ${colors.blurple};
    box-shadow: 0 8px 25px rgba(88, 101, 242, 0.4);
    
    svg {
      transform: translateX(5px);
    }
    
    &::after {
      transform: translateX(100%);
    }
    
    @media (max-width: 576px) {
      transform: translateY(-2px);
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(88, 101, 242, 0.3);
  }
`;

// Enhance the UsageLimitOverlay for better responsiveness
const UsageLimitOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  padding: 1rem;
  
  @media (max-width: 600px) {
    padding: 0;
    align-items: flex-end;
  }
`;

// Improve the modal responsiveness
const UsageLimitModal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  transform: translateY(0);
  animation: modalFadeIn 0.5s ease forwards;
  
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 90vh;
    overflow-y: auto;
    margin-bottom: 0;
  }
`;

// Updated LimitIcon for better mobile appearance
const LimitIcon = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, ${colors.blurple}, ${colors.fuchsia});
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  box-shadow: 0 10px 20px rgba(88, 101, 242, 0.3);
  
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

// Updated title and description for better mobile display
const LimitTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }
`;

const LimitDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
  
  @media (max-width: 600px) {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.25rem;
  }
`;

// Improved ProFeatures for better mobile display
const ProFeatures = styled.ul`
  text-align: left;
  margin: 1.5rem 0;
  padding-left: 0;
  list-style: none;
  
  li {
    margin-bottom: 0.75rem;
    color: #555;
    position: relative;
    padding-left: 1.75rem;
    font-size: 1rem;
    display: flex;
    align-items: flex-start;
    
    svg {
      position: absolute;
      left: 0;
      top: 0.25rem;
      color: ${colors.green};
    }
    
    @media (max-width: 600px) {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      
      svg {
        font-size: 0.9rem;
        top: 0.2rem;
      }
    }
  }
`;

const UpgradeButton = styled.button`
  background: linear-gradient(135deg, ${colors.blurple}, ${colors.fuchsia});
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  box-shadow: 0 10px 20px rgba(88, 101, 242, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(88, 101, 242, 0.3);
  }
  
  @media (max-width: 576px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #666;
  }
  
  @media (max-width: 576px) {
    top: 12px;
    right: 12px;
    font-size: 1.25rem;
  }
`;

// Add this new animation for partner logos
const slideInOut = keyframes`
  0% { opacity: 0; transform: translateX(-30px); }
  10% { opacity: 1; transform: translateX(0); }
  90% { opacity: 1; transform: translateX(0); }
  100% { opacity: 0; transform: translateX(30px); }
`;

// Update the partner animations to be more prominent
const fadeInOutSlide = keyframes`
  0%, 45% { opacity: 0; transform: translateY(10px); }
  5%, 40% { opacity: 1; transform: translateY(0); }
  50%, 100% { opacity: 0; transform: translateY(-10px); }
`;

// Enhanced Strategic Partnerships section - matching modern design
const PartnersSection = styled.section`
  padding: 8rem 0;
  background: linear-gradient(135deg, #000000 0%, #3b1e7a 50%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, rgba(156, 39, 176, 0.3) 50%, transparent 100%);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.4;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0) 70%);
    border-radius: 50%;
    
    @media (max-width: 768px) {
      width: 200px;
      height: 200px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 6rem 0;
  }
  
  @media (max-width: 576px) {
    padding: 5rem 0;
  }
`;

const PartnersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const PartnerTitle = styled.h3`
  font-size: 2.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.8rem 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const PartnerSubtitle = styled.p`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2rem 0;
  text-align: center;
  max-width: 700px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 110px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 90px;
    width: 250px;
  }
`;

// Update PartnerLogo for better appearance
const PartnerLogo = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: ${fadeInOutSlide} 10s infinite;
  animation-delay: ${props => props.delay || '0s'};
  transition: all 0.3s ease;
  background: transparent;
  padding: 1.5rem;
  transform: scale(1);
  
  &:hover {
    transform: scale(1.08);
  }
  
  svg {
    height: 48px;
    margin-bottom: 0.8rem;
    transition: all 0.3s ease;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
    
    @media (max-width: 768px) {
      height: 40px;
    }
  }
  
  .logo-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.3s ease;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }  }
`;

// Modal styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  h2 {
    color: #ffffff;
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const FeatureDetailSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: #ffffff;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const FeatureHighlight = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;

  h4 {
    color: #ffffff;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const TechSpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 2rem;

  div {
    text-align: center;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;

    strong {
      display: block;
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    span {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }
  }
`;

const Landing = () => {
  // Dynamic text rotation for hero title
  const dynamicWords = ['Study Space', 'Learning Hub', 'Revision Room', 'Knowledge Lab'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Feature details data
  const featureDetails = {
    quizzer: {
      title: "AI-Based Quizzer with Difficulty Levels",
      description: "Transform your study materials into intelligent quizzes with customizable difficulty levels and detailed explanations.",
      sections: [
        {
          title: "Question Types",
          icon: <FaRegCheckCircle />,
          items: [
            "Multiple Choice Questions with distractors",
            "True/False with explanations",
            "Fill-in-the-blank with context clues",
            "Short answer with keyword matching",
            "Essay questions with rubric scoring"
          ]
        },
        {
          title: "Difficulty Levels",
          icon: <FaChartLine />,
          items: [
            "Beginner: Basic recall and recognition",
            "Intermediate: Application and analysis",
            "Advanced: Synthesis and evaluation",
            "Expert: Critical thinking and problem-solving"
          ]
        },
        {
          title: "Smart Features",
          icon: <FaBrain />,
          items: [
            "Adaptive difficulty based on performance",
            "Personalized question generation",
            "Instant feedback with explanations",
            "Progress tracking and analytics",
            "Weak area identification"
          ]
        }
      ],
      highlight: {
        title: "AI-Powered Intelligence",
        description: "Our advanced AI analyzes your study materials and generates questions that test deep understanding, not just memorization."
      },
      techSpecs: [
        { label: "Question Generation", value: "< 3 seconds" },
        { label: "Accuracy Rate", value: "95%+" },
        { label: "Supported Formats", value: "15+" },
        { label: "Languages", value: "12+" }
      ]
    },
    flashcards: {
      title: "Interactive Flashcards for Quick Review",
      description: "AI-generated flashcards with smart hints, confidence tracking, and spaced repetition for optimal retention.",
      sections: [
        {
          title: "Card Generation",
          icon: <FaLayerGroup />,
          items: [
            "Auto-generated from any study material",
            "Key concept identification",
            "Definition and example pairing",
            "Visual cue integration",
            "Context-aware hints"
          ]
        },
        {
          title: "Learning Features",
          icon: <FaBrain />,
          items: [
            "Spaced repetition algorithm",
            "Confidence-based sorting",
            "Difficulty adjustment",
            "Progress tracking",
            "Streak counters"
          ]
        },
        {
          title: "Study Modes",
          icon: <FaPlay />,
          items: [
            "Classic flip cards",
            "Typing practice mode",
            "Audio pronunciation",
            "Timed challenges",
            "Review sessions"
          ]
        }
      ],
      highlight: {
        title: "Spaced Repetition Science",
        description: "Based on proven cognitive science principles, our flashcards adapt to your learning curve for maximum retention."
      },
      techSpecs: [
        { label: "Retention Rate", value: "85%+" },
        { label: "Review Efficiency", value: "3x faster" },
        { label: "Card Types", value: "8+" },
        { label: "Study Sessions", value: "Unlimited" }
      ]
    },
    activeRecall: {
      title: "Active Recall Learning System",
      description: "Scientifically proven active recall techniques that boost retention by 200% through strategic questioning.",
      sections: [
        {
          title: "Recall Techniques",
          icon: <FaBrain />,
          items: [
            "Blank-filling exercises",
            "Concept mapping",
            "Summary generation",
            "Question-answer pairs",
            "Retrieval practice"
          ]
        },
        {
          title: "Adaptive Learning",
          icon: <FaSyncAlt />,
          items: [
            "Difficulty progression",
            "Weak point targeting",
            "Optimal timing intervals",
            "Performance analytics",
            "Personalized recommendations"
          ]
        },
        {
          title: "Study Strategies",
          icon: <FaLightbulb />,
          items: [
            "Feynman technique integration",
            "Elaborative interrogation",
            "Distributed practice",
            "Interleaving method",
            "Self-explanation prompts"
          ]
        }
      ],
      highlight: {
        title: "Cognitive Science Backed",
        description: "Our active recall system is built on decades of learning research and proven to increase retention by up to 200%."
      },
      techSpecs: [
        { label: "Retention Boost", value: "200%+" },
        { label: "Study Efficiency", value: "50% faster" },
        { label: "Recall Methods", value: "12+" },
        { label: "Progress Tracking", value: "Real-time" }
      ]
    },
    history: {
      title: "Comprehensive Quiz History & Analytics",
      description: "Track your learning journey with detailed analytics, performance insights, and personalized recommendations.",
      sections: [
        {
          title: "Performance Analytics",
          icon: <FaChartBar />,
          items: [
            "Score trends over time",
            "Subject-wise performance",
            "Difficulty level analysis",
            "Time spent tracking",
            "Improvement recommendations"
          ]
        },
        {
          title: "Study Insights",
          icon: <FaLightbulb />,
          items: [
            "Learning pattern identification",
            "Optimal study time suggestions",
            "Weak area highlighting",
            "Strength reinforcement",
            "Study habit analytics"
          ]
        },
        {
          title: "Goal Tracking",
          icon: <FaAward />,
          items: [
            "Custom goal setting",
            "Progress milestones",
            "Achievement badges",
            "Streak tracking",
            "Performance targets"
          ]
        }
      ],
      highlight: {
        title: "Data-Driven Learning",
        description: "Make informed decisions about your study strategy with comprehensive analytics and personalized insights."
      },
      techSpecs: [
        { label: "Data Points", value: "50+" },
        { label: "Report Types", value: "15+" },
        { label: "History Retention", value: "Unlimited" },
        { label: "Export Formats", value: "5+" }
      ]
    },
    fileSupport: {
      title: "Universal File Support System",
      description: "Upload any study material - PDFs, Word docs, PowerPoints, images, and audio files - and let AI transform them into interactive learning tools.",
      sections: [
        {
          title: "Supported Formats",
          icon: <FaFileAlt />,
          items: [
            "PDF documents with text extraction",
            "Word documents (.docx, .doc)",
            "PowerPoint presentations",
            "Image files (JPG, PNG, etc.)",
            "Audio files (MP3, WAV, etc.)"
          ]
        },
        {
          title: "Processing Power",
          icon: <FaRobot />,
          items: [
            "OCR text recognition",
            "Audio transcription",
            "Image content analysis",
            "Slide text extraction",
            "Multi-language support"
          ]
        },
        {
          title: "Smart Conversion",
          icon: <FaCode />,
          items: [
            "Automatic content structuring",
            "Key concept identification",
            "Question generation",
            "Summary creation",
            "Flashcard extraction"
          ]
        }
      ],
      highlight: {
        title: "Universal Compatibility",
        description: "No matter what format your study materials are in, our AI can process and transform them into interactive learning experiences."
      },
      techSpecs: [
        { label: "File Formats", value: "15+" },
        { label: "Processing Speed", value: "< 30 seconds" },
        { label: "File Size Limit", value: "50MB" },
        { label: "Accuracy Rate", value: "98%+" }
      ]
    }
  };

  const openModal = (featureKey) => {
    setSelectedFeature(featureKey);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeature(null);
    document.body.style.overflow = 'unset';
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % dynamicWords.length);
        setIsAnimating(false);
      }, 300); // Half of the animation duration
    }, 3000); // Change word every 3 seconds

    return () => clearInterval(interval);
  }, [dynamicWords.length]);

  const renderParticles = () => {
    const particles = [];
    
    // Add regular particles
    for (let i = 0; i < 15; i++) {
      particles.push(
        <div 
          key={`particle-${i}`} 
          className={`particle particle-${i + 1}`} 
          style={{
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 20 + 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      );
    }
    
    // Add 3D educational objects
    // Book 1
    particles.push(
      <div
        key="edu-book-1"
        className="edu-object book"
        style={{
          top: '15%',
          right: '15%',
          animationDelay: '0.5s',
          transform: 'rotate(15deg)'
        }}
      />
    );
    
    // Atom
    particles.push(
      <div
        key="edu-atom"
        className="edu-object atom"
        style={{
          bottom: '25%',
          left: '10%',
          animationDelay: '1.2s',
        }}
      >
        <div className="nucleus" />
      </div>
    );
    
    // Notebook
    particles.push(
      <div
        key="edu-notebook"
        className="edu-object notebook"
        style={{
          top: '30%',
          left: '20%',
          animationDelay: '0.8s',
        }}
      >
        <div className="line" />
      </div>
    );
    
    // Flask
    particles.push(
      <div
        key="edu-flask"
        className="edu-object flask"
        style={{
          bottom: '30%',
          right: '18%',
          animationDelay: '1.5s',
        }}
      />
    );
    
    // Book 2
    particles.push(
      <div
        key="edu-book-2"
        className="edu-object book"
        style={{
          top: '65%',
          right: '25%',
          animationDelay: '2s',
          transform: 'rotate(-10deg)'
        }}
      />
    );
    
    return particles;
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitInfo, setLimitInfo] = useState(null);
  const [autoFlip, setAutoFlip] = useState(true);
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  // Card data for the features section
  const cardData = [
    {
      title: "AI Quizzer",
      description: "Transform any document into intelligent quizzes with adaptive difficulty and instant feedback.",
      icon: <Brain3D />,
      stats: [
        { icon: "✓", label: "Smart difficulty" },
        { icon: "⚡", label: "Instant feedback" }
      ]
    },
    {
      title: "Smart Flashcards",
      description: "AI-generated flashcards with spaced repetition for optimal memory retention.",
      icon: <Book3D />,
      stats: [
        { icon: "📈", label: "85% retention" },
        { icon: "⏰", label: "Auto-spaced" }
      ]
    },
    {
      title: "Active Recall & Spaced Repetition",
      description: "Advanced learning techniques combining active recall with spaced repetition for optimal memory retention and learning outcomes.",
      icon: <Target3D />,
      stats: [
        { icon: "🎯", label: "Memory retention" },
        { icon: "🔄", label: "Smart intervals" }
      ]
    },
    {
      title: "AI Tutorbot",
      description: "Get instant explanations and concept summaries to understand mistakes faster.",
      icon: <Robot3D />,
      stats: [
        { icon: "💡", label: "Instant help" },
        { icon: "📝", label: "Smart summaries" }
      ]
    },
    {
      title: "Supports all doc type",
      description: "Upload PPT, PDF, DOC or any other document format and get instant quizzes and flashcards.",
      icon: <Chart3D />,
      stats: [
        { icon: "📄", label: "PPT, PDF, DOC" },
        { icon: "⚡", label: "Instant processing" }
      ]
    },
    {
      title: "Transparent Pricing",
      description: "Clear, upfront pricing with no hidden fees. Pay only for what you use with flexible plans including enterprise solutions for coaching and educational institutions.",
      icon: <Pricing3D />,
      stats: [
        { icon: "💰", label: "No hidden fees" },
        { icon: "🏢", label: "Enterprise plans" }
      ]
    }
  ];

  useEffect(() => {
    if (!autoFlip) return;
    
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoFlip]);

  // Function to handle manual flipping
  const handleManualFlip = (value) => {
    // Disable auto-flipping once user interacts
    setAutoFlip(false);
    // Set the flipped state
    setIsFlipped(value);
  };

  // Disable auto-flipping when user interacts manually with the card
  useEffect(() => {
    // Update: this effect helps prevent unresponsiveness by handling state transitions
    const timeoutId = setTimeout(() => {
      // This timeout ensures card renders completely after state change
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [isFlipped]);

  // Function to handle API errors, including token limit exceeded
  const handleApiError = (error) => {
    if (error.response) {
      // Handle 403 Forbidden - Token limit exceeded
      if (error.response.status === 403 && error.response.data.error?.includes('Token limit exceeded')) {
        setShowLimitModal(true);
        
        // Extract limit info if available
        const errorMessage = error.response.data.error;
        const tokenMatch = errorMessage.match(/You have used (\d+) out of (\d+) daily tokens/);
        const timeMatch = errorMessage.match(/Limit will reset in approximately (.+)\.$/);
        
        if (tokenMatch && tokenMatch.length >= 3) {
          setLimitInfo({
            used: parseInt(tokenMatch[1]),
            max: parseInt(tokenMatch[2]),
            resetTime: timeMatch && timeMatch.length > 1 ? timeMatch[1] : null
          });
        }
        
        return true; // Error was handled
      }
    }
    
    // For other errors, let the calling code handle them
    return false;
  };
  
  // Function to check token usage
  const checkTokenUsage = async () => {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      
      // Skip if not authenticated
      if (!authToken) {
        console.log('User not authenticated, skipping token check');
        return { isLimitReached: false };
      }
      
      // Call the token usage endpoint with proper URL
      const response = await axios.get(`${API_BASE_URL}/token-usage/`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      const { tokens_used, max_tokens } = response.data;
      
      // Show limit modal if tokens used >= max tokens
      if (tokens_used >= max_tokens) {
        setLimitInfo({
          used: tokens_used,
          max: max_tokens,
          resetTime: null
        });
        setShowLimitModal(true);
      }
      
      return {
        isLimitReached: tokens_used >= max_tokens,
        tokensUsed: tokens_used,
        maxTokens: max_tokens
      };
    } catch (error) {
      // Handle error, including token limit exceeded
      if (!handleApiError(error)) {
        console.error('Error checking token usage:', error);
      }
      
      // Return limit reached if we can't check
      return { isLimitReached: false };
    }
  };
  
  const handleStartDemo = () => {
    // For the landing page demo, simply show the limit modal
    setShowLimitModal(true);
    
    // In an actual app flow, we would:
    // 1. Attempt to upload a document: POST /documents/process/
    // 2. Then generate a quiz: POST /generate-quiz/
    // 3. Which might trigger a token limit error, caught by handleApiError
  };
  
  const handleUpgrade = () => {
    // Handle upgrade flow - redirect to pricing page
    window.location.href = '/pricing';
  };
  
  // Example function showing document upload that could hit token limits
  const uploadDocument = async (file) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('User not authenticated');
        return null;
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/documents/process/`, formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      // Check if it's a token limit error
      if (!handleApiError(error)) {
        console.error('Error uploading document:', error);
      }
      return null;
    }
  };
  
  // Example function showing quiz generation that could hit token limits
  const generateQuiz = async (documentId, difficulty = 'medium', count = 10) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.log('User not authenticated');
        return null;
      }
      
      const response = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
        document_id: documentId,
        difficulty: difficulty,
        number_of_quizzes: count
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      // Check if it's a token limit error
      if (!handleApiError(error)) {
        console.error('Error generating quiz:', error);
      }
      return null;
    }
  };

  const handleCardClick = (cardIndex) => {
    setSelectedCard(cardIndex);
    
    // Reset selection after 1 second
    setTimeout(() => {
      setSelectedCard(null);
    }, 1000);
  };

  return (
    <LandingContainer className="landing-page">
      <HeroSection>
        <HeroContainer>
          <HeroContent>
            <HeroLeft>
              <HeroTitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Your <span className="highlight">All-in-One</span><br/>
                <DynamicText isAnimating={isAnimating}>{dynamicWords[currentWordIndex]}</DynamicText>
              </HeroTitle>
              
              <HeroSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Upload any study material, create <EmphasizedKeyword>summaries</EmphasizedKeyword>, <EmphasizedKeyword>quizzes</EmphasizedKeyword>, and <EmphasizedKeyword>flashcards</EmphasizedKeyword> in seconds, 
                and practice with scientifically proven methods—all in one powerful platform.
              </HeroSubtitle>
              
                                      <ScienceBackedBadge
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        >
                          <FaBrain className="icon" />
                          Study with proven science-backed methods including spaced repetition and active recall
                        </ScienceBackedBadge>
              
              <HeroMotto
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                "Master More, Forget Less, Learn Intelligently"
              </HeroMotto>
              
              <TrustBadge
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <FaUserGraduate className="icon" />
                Trusted by 1000+ Students & Edu Platforms
              </TrustBadge>
              
              <HeroButtons
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <PrimaryButton to="/signup">
                  Get Started Free <FaArrowRight />
                </PrimaryButton>
              </HeroButtons>
            </HeroLeft>
            
            <HeroRight>
              <HeroImage
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </HeroRight>
          </HeroContent>
        </HeroContainer>
      </HeroSection>
      
      <ProcessSection>
        <ProcessContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ProcessHeader>
              <ProcessTag>
                <FaChartLine />
                PROCESS
              </ProcessTag>
              <ProcessTitle>How Rectify Learn Works</ProcessTitle>
              <ProcessSubtitle>
                Transform your study materials into powerful learning tools in just three simple steps.
              </ProcessSubtitle>
            </ProcessHeader>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <ProcessCard>
              <StepTabs>
                <StepTab 
                  active={activeProcessStep === 0}
                  onClick={() => setActiveProcessStep(0)}
                >
                  STEP 1
                </StepTab>
                <StepTab 
                  active={activeProcessStep === 1}
                  onClick={() => setActiveProcessStep(1)}
                >
                  STEP 2
                </StepTab>
                <StepTab 
                  active={activeProcessStep === 2}
                  onClick={() => setActiveProcessStep(2)}
                >
                  STEP 3
                </StepTab>
              </StepTabs>
            
            {activeProcessStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StepContent>
                  <StepNumber>01</StepNumber>
                  <StepDetails>
                    <StepTitle>Create an Account or Login</StepTitle>
                    <StepDescription>
                      Start your learning journey by creating a new account or logging into your existing Rectify Learn profile. Our secure authentication system ensures your data is protected while providing seamless access to all our AI-powered learning tools.
                    </StepDescription>
                  </StepDetails>
                </StepContent>
              </motion.div>
            )}
            
            {activeProcessStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StepContent>
                  <StepNumber>02</StepNumber>
                  <StepDetails>
                    <StepTitle>Upload Your Study Materials</StepTitle>
                    <StepDescription>
                      Once logged in, you'll be redirected to the upload files tab. Upload any of your study materials - PDFs, Word documents, PowerPoint presentations, or images. Our AI will process your content and prepare it for quiz and flashcard generation.
                    </StepDescription>
                  </StepDetails>
                </StepContent>
              </motion.div>
            )}
            
            {activeProcessStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <StepContent>
                  <StepNumber>03</StepNumber>
                  <StepDetails>
                    <StepTitle>Generate Quizzes and Flashcards</StepTitle>
                    <StepDescription>
                      Wait a few seconds while our AI analyzes your content and generates personalized quizzes and flashcards. Our active recall method tracks your previously mistaken questions and prioritizes them in future study sessions for optimal learning retention.
                    </StepDescription>
                  </StepDetails>
                </StepContent>
              </motion.div>
            )}
          </ProcessCard>
        </motion.div>
        </ProcessContainer>
      </ProcessSection>

      <FeaturesSection>
        <FeaturesContainer>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <SectionTitle>AI powered learning tools</SectionTitle>
            <SectionSubtitle>
              Comprehensive AI-driven solutions for enhanced learning outcomes
            </SectionSubtitle>
          </motion.div>

          <FeatureGrid>
            {cardData.map((card, index) => {
              const isSelected = selectedCard === index;

              return (
                <FeatureCard
                  key={index}
                  isSelected={isSelected}
              initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                  duration: 0.6, 
                    delay: 0.1 + (index * 0.1),
                    type: "spring",
                    stiffness: 100
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: isSelected ? 1.02 : 1.01, 
                    y: isSelected ? -5 : -2,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <FeatureIcon>
                    {card.icon}
                  </FeatureIcon>
                  <FeatureTitle>{card.title}</FeatureTitle>
                  <FeatureDescription>
                    {card.description}
                  </FeatureDescription>
                  <FeatureStats>
                    {card.stats.map((stat, statIndex) => (
                      <StatItem key={statIndex}>
                        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                          {stat.icon}
                        </span>
                        <span>{stat.label}</span>
                      </StatItem>
                    ))}
                  </FeatureStats>
                </FeatureCard>
              );
            })}
          </FeatureGrid>
        </FeaturesContainer>
      </FeaturesSection>
        <PartnersSection>
        <DynamicPartners
          displayType="LANDING_PAGE"
          title="Trusted by Industry Leaders"
          subtitle="Partnering with world-class organizations to deliver exceptional educational technology solutions"
          size="medium"
          interactive={true}
          showRotation={true}
          showInfo={true}
        />
      </PartnersSection>
      
      <CTASection>
        <CTAWrapper>
          <CTAContent>
            <CTATitle>
              Ready to transform your <span>learning experience</span>?
            </CTATitle>
            <CTADescription>
              Experience the future of education with our AI-driven learning tools designed to boost your academic performance.
            </CTADescription>
            <CTAButtons>
              <GlowingButton to="/signup">
                <span>Upload Study Material <FaBolt /></span>
              </GlowingButton>
            </CTAButtons>
          </CTAContent>
        </CTAWrapper>
      </CTASection>
      
      {showLimitModal && (
        <UsageLimitOverlay>
          <UsageLimitModal>
            <CloseButton onClick={() => setShowLimitModal(false)}>×</CloseButton>
            <LimitIcon>
              <FaLock />
            </LimitIcon>
            <LimitTitle>Free Limit Reached</LimitTitle>
            <LimitDescription>
              You've reached the free usage limit on your account. 
              Upgrade to our Pro plan to continue learning without limits.
            </LimitDescription>
            <ProFeatures>
              <li>
                <FaCheckCircle /> Unlimited content generation
              </li>
              <li>
                <FaCheckCircle /> Advanced difficulty levels and customization
              </li>
              <li>
                <FaCheckCircle /> Priority support and early feature access
              </li>
              <li>
                <FaCheckCircle /> Enhanced analytics and progress tracking
              </li>
              <li>
                <FaCheckCircle /> No usage restrictions or waiting periods
              </li>
            </ProFeatures>
            <UpgradeButton onClick={handleUpgrade}>
              Upgrade to Pro Plan
            </UpgradeButton>
          </UsageLimitModal>
        </UsageLimitOverlay>
      )}

      {/* Feature Details Modal */}
      {isModalOpen && selectedFeature && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <ModalHeader>
              <h2>{featureDetails[selectedFeature].title}</h2>
              <p>{featureDetails[selectedFeature].description}</p>
              <ModalCloseButton onClick={closeModal}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>
            
            <ModalBody>
              {featureDetails[selectedFeature].sections.map((section, index) => (
                <FeatureDetailSection key={index}>
                  <h3>
                    {section.icon}
                    {section.title}
                  </h3>
                  <ul>
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <FaCheckCircle />
                        {item}
                      </li>
                    ))}
                  </ul>
                </FeatureDetailSection>
              ))}
              
              <FeatureHighlight>
                <h4>{featureDetails[selectedFeature].highlight.title}</h4>
                <p>{featureDetails[selectedFeature].highlight.description}</p>
              </FeatureHighlight>
              
              <TechSpecs>
                {featureDetails[selectedFeature].techSpecs.map((spec, index) => (
                  <div key={index}>
                    <strong>{spec.value}</strong>
                    <span>{spec.label}</span>
                  </div>
                ))}
              </TechSpecs>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </LandingContainer>
  );
};

export default Landing;


