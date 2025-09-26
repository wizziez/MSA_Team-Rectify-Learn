import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaBrain, FaEnvelope, FaFacebookSquare } from 'react-icons/fa';
import LogoImage from '../Logo/Logo.png';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #000000 0%, #3b1e7a 50%, #1a1a1a 100%);
  color: #ffffff !important;
  padding: 4rem 0 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent 0%, rgba(156, 39, 176, 0.4) 50%, transparent 100%);
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 0 1.5rem;
    
    .container {
      padding: 0 1.5rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 0 1rem;
    
    .container {
      padding: 0 1rem;
    }
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff !important;
  margin-right: 2rem;
  
  a {
    display: flex;
    align-items: center;
    color: #ffffff !important;
    height: auto;
    margin-bottom: 0.5rem;
    
    &:hover {
      color: var(--primary-color);
    }

    img {
      height: 70px;
      margin-right: 0.5rem;
      transition: transform 0.3s ease;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  svg {
    margin-right: 0.5rem;
    color: var(--primary-color);
    font-size: 1.8rem;
  }
  
  .tagline {
    font-size: 0.9rem;
    font-weight: 400;
    color: #ffffff !important;
    margin-top: 0.25rem;
    margin-left: 0;
    max-width: 200px;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    align-items: center;
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
    
    a {
      justify-content: center;
      width: 100%;
      height: auto;
      margin-bottom: 0.5rem;
      
      img {
        height: 55px;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
    
    .tagline {
      text-align: center;
      margin-top: 0.25rem;
      margin-left: 0;
      font-size: 0.85rem;
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    a img {
      height: 45px;
    }
  }
`;

const QuickLinks = styled.div`
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: #ffffff !important;
    font-weight: 600;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, #9c27b0, #673ab7);
      border-radius: 1px;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 1rem;
  }
  
  a {
    color: rgba(255, 255, 255, 0.8) !important;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    
    &:hover {
      color: #9c27b0 !important;
      transform: translateX(5px);
    }
  }
  
  .coming-soon {
    font-size: 0.8rem;
    color: #9c27b0;
    font-style: italic;
    margin-left: 0.5rem;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    
    h3::after {
      left: 50%;
      transform: translateX(-50%);
    }
    
    ul {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    a:hover {
      transform: translateX(0);
    }
  }
`;

const ContactUs = styled.div`
  h3 {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
    color: #ffffff !important;
    font-weight: 600;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, #9c27b0, #673ab7);
      border-radius: 1px;
    }
  }
  
  a {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.8) !important;
    transition: all 0.3s ease;
    gap: 0.5rem;
    font-size: 0.95rem;
    
    &:hover {
      color: #9c27b0 !important;
      transform: translateX(5px);
    }
  }
  
  svg {
    color: #9c27b0;
    font-size: 1.1rem;
  }
  
  p {
    margin-top: 1.5rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7) !important;
    line-height: 1.6;
    max-width: 240px;
  }
  
  .support-email {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(156, 39, 176, 0.3);
  }
  
  .support-text {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0.8rem;
  }
  
  .social-links {
    display: flex;
    align-items: center;
    margin-top: 1.5rem;
    padding-bottom: 0.5rem;
    
    h4 {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      margin-right: 1rem;
      font-weight: 600;
    }
    
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.8rem;
      
      &:hover {
        transform: translateY(-3px);
      }
    }
  }
  
  .social-icon {
    font-size: 1.8rem;
    color: rgba(255, 255, 255, 0.6);
    transition: all 0.3s ease;
    
    &:hover {
      color: #9c27b0;
      transform: translateY(-3px);
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    
    h3::after {
      left: 50%;
      transform: translateX(-50%);
    }
    
    a {
      justify-content: center;
      
      &:hover {
        transform: translateX(0) translateY(-2px);
      }
    }
    
    p {
      max-width: 100%;
      margin-left: auto;
      margin-right: auto;
    }
    
    .social-links {
      justify-content: center;
    }
  }
`;

const SupportSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 8px;
  text-align: center;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: var(--footer-text);
  }
  
  p {
    color: var(--footer-link);
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  a {
    display: inline-flex;
    align-items: center;
    color: var(--primary-color);
    font-weight: 600;
    transition: all 0.3s ease;
    gap: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const Copyright = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(156, 39, 176, 0.3);
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
  display: block;
  position: relative;
  
  p {
    margin: 0;
    padding: 0 1rem 1.5rem;
    color: rgba(255, 255, 255, 0.7) !important;
    display: block;
  }
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    padding-top: 1.5rem;
    padding-bottom: 1rem;
    font-size: 0.85rem;
    
    p {
      padding-bottom: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    margin-top: 1.5rem;
    font-size: 0.85rem;
    padding-top: 1rem;
    
    p {
      padding: 0 0.5rem 1rem;
      line-height: 1.4;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterLogo>
            <Link to="/">
              <img src={LogoImage} alt="Rectify Learn Logo" />
            </Link>
            <span className="tagline">Master More, Forget Less, Learn Intelligently</span>
          </FooterLogo>
          
          <QuickLinks>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </QuickLinks>

          <ContactUs>
            <h3>Contact Us</h3>
            <a href="mailto:rectifylearn@gmail.com">
              <FaEnvelope />
              rectifylearn@gmail.com
            </a>
            <p>
              We'd love to hear from you!<br />
              Feel free to reach out with any questions, suggestions, or feedback.
            </p>
            
            <div className="social-links">
              <h4>Follow Us:</h4>
              <a href="https://www.facebook.com/rectifylearn" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookSquare className="social-icon" />
              </a>
            </div>
            
            <div className="support-email">
              <p className="support-text">For technical support:</p>
              <a href="mailto:support@rectifylearn.tech">
                <FaEnvelope />
                support@rectifylearn.tech
              </a>
            </div>
          </ContactUs>
        </FooterContent>
        
        <Copyright>
          <p>&copy; {new Date().getFullYear()} Rectify Learn. All rights reserved.</p>
        </Copyright>
      </div>
    </FooterContainer>
  );
};

export default Footer;
