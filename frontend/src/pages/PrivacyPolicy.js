import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, 
  FaDatabase, 
  FaUserLock, 
  FaEnvelope
} from 'react-icons/fa';

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

// Main container with subtle background
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.notQuiteBlack};
  padding: 2rem 0 6rem;
  position: relative;
  overflow: hidden;
  
  /* Discord-style subtle noise background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.03;
    z-index: -1;
  }
`;

// Enhanced Discord-style header
const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  
  /* Discord-style floating shapes in background */
  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    filter: blur(40px);
    opacity: 0.2;
  }
  
  &::before {
    width: 200px;
    height: 200px;
    background: ${colors.green};
    top: -80px;
    left: 10%;
    animation: float 8s ease-in-out infinite;
  }
  
  &::after {
    width: 300px;
    height: 300px;
    background: ${colors.blurple};
    bottom: -100px;
    right: 5%;
    animation: float 10s ease-in-out infinite reverse;
  }
  
  @keyframes float {
    0% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
    100% { transform: translateY(0) scale(1); }
  }
  
  h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, ${colors.green}, ${colors.blurple});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    display: inline-block;
    text-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    
    &::after {
      content: '';
      position: absolute;
      height: 5px;
      background: linear-gradient(90deg, ${colors.green}, ${colors.blurple});
      width: 80px;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 5px;
    }
    
    @media (max-width: 768px) {
      font-size: 2.8rem;
    }
    
    @media (max-width: 576px) {
      font-size: 2.2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto;
    color: ${colors.greyple} !important;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      padding: 0 1.5rem;
    }
  }
`;

// Discord-style section
const PrivacySection = styled.section`
  max-width: 900px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(87, 242, 135, 0.2);
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${colors.white} !important;
    
    svg {
      color: ${colors.green};
      background: rgba(87, 242, 135, 0.1);
      padding: 0.6rem;
      border-radius: 50%;
      font-size: 1.2rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 576px) {
      font-size: 1.5rem;
    }
  }
`;

// Discord-style text content
const PrivacyContent = styled.div`
  color: ${colors.greyple} !important;
  font-size: 1rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: ${colors.white} !important;
    font-size: 1.3rem;
    margin: 2rem 0 1rem;
    font-weight: 600;
  }
  
  ul, ol {
    margin: 1rem 0 1.5rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.8rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1.2rem;
      top: 0.7rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors.green};
    }
  }
  
  a {
    color: ${colors.green};
    font-weight: 500;
    transition: all 0.2s;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: ${colors.green};
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: ${colors.blurple};
      text-decoration: none;
      text-shadow: 0 0 8px rgba(88, 101, 242, 0.3);
      
      &::after {
        transform: scaleX(1);
        background-color: ${colors.blurple};
      }
    }
  }
  
  .highlight {
    background: rgba(87, 242, 135, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: ${colors.green};
    font-weight: 500;
  }
  
  .info-box {
    background: rgba(87, 242, 135, 0.05);
    border-left: 3px solid ${colors.green};
    padding: 1.5rem;
    border-radius: 0 4px 4px 0;
    margin: 2rem 0;
  }
  
  .last-updated {
    font-style: italic;
    margin-top: 3rem;
    font-size: 0.9rem;
  }
`;

// Back to Top floating button
const BackToTopButton = styled.a`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${colors.green};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 14px rgba(87, 242, 135, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  
  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, ${colors.green}, ${colors.blurple});
  }
  
  svg {
    font-size: 1.4rem;
  }
`;

const PrivacyPolicy = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <h1>Privacy Policy</h1>
          <p>
            At Rectify Learn, we prioritize the privacy and security of your data.
            This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </PageHeader>
        
        <PrivacySection>
          <h2><FaShieldAlt /> Overview</h2>
          <PrivacyContent>
            <p>
              This Privacy Policy describes how Rectify Learn ("we", "us", or "our") collects, uses, 
              and shares your personal information when you use our website and edtech services 
              (collectively, the "Services").
            </p>
            <p>
              By using Rectify Learn, you agree to the collection and use of information in accordance 
              with this policy. We will not use or share your information with anyone except as 
              described in this Privacy Policy.
            </p>
            <div className="info-box">
              <strong>Important:</strong> Please read this Privacy Policy carefully to understand our 
              practices regarding your personal data and how we will treat it.
            </div>
          </PrivacyContent>
        </PrivacySection>
        
        <PrivacySection>
          <h2><FaDatabase /> Information We Collect</h2>
          <PrivacyContent>
            <h3>Information You Provide to Us</h3>
            <p>
              When you register for an account, we collect:
            </p>
            <ul>
              <li>Your name</li>
              <li>Email address</li>
              <li>Password (stored securely)</li>
              <li>Profile information (optional)</li>
            </ul>
            
            <h3>Documents and Learning Materials</h3>
            <p>
              When you use our Services, we collect and store:
            </p>
            <ul>
              <li>Documents you upload for quiz and flashcard generation</li>
              <li>Study materials you create or customize</li>
              <li>Learning progress data and quiz results</li>
            </ul>
            
            <h3>Payment Information</h3>
            <p>
              When you purchase a subscription:
            </p>
            <p>
              We do not directly collect or store your payment information. All payments are 
              processed through our third-party payment processors, who collect and store your 
              payment details according to their own privacy policies and security standards.
            </p>
            
            <h3>Refund Policy</h3>
            <p>
              You may request a refund within 3 days of purchase.
            </p>
          </PrivacyContent>
        </PrivacySection>
        
        <PrivacySection>
          <h2><FaUserLock /> How We Use Your Information</h2>
          <PrivacyContent>
            <p>
              We use your information for the following purposes:
            </p>
            <ul>
              <li>To provide, maintain, and improve our Services</li>
              <li>To generate personalized quizzes and flashcards based on your uploaded materials</li>
              <li>To track your learning progress and performance</li>
              <li>To process your payments and subscriptions</li>
              <li>To communicate with you about your account and our Services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To detect and prevent fraud and security incidents</li>
              <li>To analyze usage patterns and improve our product features</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h3>AI Processing of Your Materials</h3>
            <p>
              Our platform uses artificial intelligence to analyze your uploaded documents and 
              generate educational content. This process involves:
            </p>
            <ul>
              <li>Text extraction and analysis of your uploaded materials</li>
              <li>Processing content to identify key concepts and information</li>
              <li>Creating quizzes, flashcards, and learning exercises based on the content</li>
            </ul>
            <p>
              The AI processing occurs on secure servers and is designed to enhance your learning experience.
            </p>
          </PrivacyContent>
        </PrivacySection>
        
        <PrivacySection>
          <h2><FaEnvelope /> Contact Us</h2>
          <PrivacyContent>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:connectrectifylearn@gmail.com">connectrectifylearn@gmail.com</a><br />
              Or visit our <Link to="/faq">FAQ page</Link> for more information.
            </p>
            
            <h3>Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes 
              to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <p className="last-updated">Last Updated: April 16, 2025</p>
          </PrivacyContent>
        </PrivacySection>
      </div>
      
      <BackToTopButton onClick={scrollToTop}>
        <span>↑</span>
      </BackToTopButton>
    </PageContainer>
  );
};

export default PrivacyPolicy;