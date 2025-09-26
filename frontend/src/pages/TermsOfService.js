import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBalanceScale, FaFileContract, FaMoneyBillWave, FaUserShield, FaExclamationTriangle, FaGavel } from 'react-icons/fa';

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

// Main container
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
    background: ${colors.blurple};
    top: -80px;
    left: 10%;
    animation: float 8s ease-in-out infinite;
  }
  
  &::after {
    width: 300px;
    height: 300px;
    background: ${colors.fuchsia};
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
    background: linear-gradient(90deg, ${colors.blurple}, ${colors.fuchsia});
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
      background: linear-gradient(90deg, ${colors.blurple}, ${colors.fuchsia});
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
const TermsSection = styled.section`
  max-width: 900px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid rgba(88, 101, 242, 0.2);
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${colors.white} !important;
    
    svg {
      color: ${colors.blurple};
      background: rgba(88, 101, 242, 0.1);
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
const TermsContent = styled.div`
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
      background: ${colors.blurple};
    }
  }
  
  a {
    color: ${colors.blurple};
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
      background-color: ${colors.blurple};
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: ${colors.fuchsia};
      text-decoration: none;
      text-shadow: 0 0 8px rgba(235, 69, 158, 0.3);
      
      &::after {
        transform: scaleX(1);
        background-color: ${colors.fuchsia};
      }
    }
  }
  
  .highlight {
    background: rgba(88, 101, 242, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: ${colors.blurple};
    font-weight: 500;
  }
  
  .box {
    background: rgba(88, 101, 242, 0.05);
    border-left: 3px solid ${colors.blurple};
    padding: 1.5rem;
    border-radius: 0 4px 4px 0;
    margin: 2rem 0;
  }
  
  .warning-box {
    background: rgba(237, 66, 69, 0.05);
    border-left: 3px solid ${colors.red};
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
  background: ${colors.blurple};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
  
  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(135deg, ${colors.blurple}, ${colors.fuchsia});
  }
  
  svg {
    font-size: 1.4rem;
  }
`;

const TermsOfService = () => {
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
          <h1>Terms of Service</h1>
          <p>
            Please read these Terms of Service carefully before using Rectify Learn.
            By accessing or using our platform, you agree to be bound by these terms.
          </p>
        </PageHeader>
        
        <TermsSection>
          <h2><FaBalanceScale /> Agreement to Terms</h2>
          <TermsContent>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement made between you, 
              whether personally or on behalf of an entity ("you") and Rectify Learn ("we," "us" or "our"), 
              concerning your access to and use of our website and services.
            </p>
            <p>
              By accessing or using Rectify Learn, you agree to these Terms. If you disagree with any part 
              of the Terms, then you may not access our Services.
            </p>
            <div className="box">
              <strong>Important:</strong> By creating an account or using any of our Services, you 
              acknowledge that you have read, understood, and agree to be bound by these Terms.
            </div>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <h2><FaFileContract /> Services Description</h2>
          <TermsContent>
            <p>
              Rectify Learn is an AI-powered edtech platform that provides quiz generation, 
              flashcard creation, and active recall exercises based on user-uploaded study materials.
              As a leading edtech solution, we aim to transform the way students learn and retain information.
            </p>
            
            <h3>Service Usage</h3>
            <p>
              Our edtech Services allow you to:
            </p>
            <ul>
              <li>Upload educational documents and study materials</li>
              <li>Generate personalized quizzes and flashcards from your materials</li>
              <li>Track your learning progress and performance</li>
              <li>Access your learning materials across devices</li>
              <li>Improve study efficiency through active recall and spaced repetition</li>
            </ul>
            
            <h3>Free Trial</h3>
            <p>
              All users receive three (3) free attempts to use our edtech Services. After exhausting these free 
              attempts, a paid subscription is required to continue using the platform.
            </p>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <h2><FaUserShield /> User Accounts</h2>
          <TermsContent>
            <h3>Account Creation and Responsibility</h3>
            <p>
              When you create an account with us, you must provide accurate, complete, and current 
              information. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account on our Services.
            </p>
            
            <h3>Account Security</h3>
            <p>
              You are responsible for safeguarding the password that you use to access our Services and 
              for any activities or actions under your password. We encourage you to use "strong" passwords 
              (passwords that use a combination of upper and lower case letters, numbers, and symbols).
            </p>
            
            <h3>Account Restrictions</h3>
            <p>
              You may not:
            </p>
            <ul>
              <li>Share your account credentials with others</li>
              <li>Create multiple accounts to access additional free attempts</li>
              <li>Use our Services if you are under 13 years of age</li>
              <li>Misrepresent your identity or affiliation with any person or entity</li>
              <li>Use our Services for any illegal or unauthorized purpose</li>
            </ul>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <h2><FaMoneyBillWave /> Payment Terms</h2>
          <TermsContent>
            <h3>Subscription Model</h3>
            <p>
              After using your three free attempts, continued use of our Services requires purchasing 
              a subscription. All payments are processed securely through our third-party payment processors.
            </p>
            
            <h3>Billing and Renewal</h3>
            <p>
              By purchasing a subscription, you authorize us to charge your payment method on a recurring 
              basis until you cancel your subscription. Subscriptions automatically renew unless canceled 
              before the renewal date.
            </p>
            
            <h3>Refunds</h3>
            <p>
              Refunds are issued at our discretion. You may request a refund within 7 days of your initial 
              purchase if you are dissatisfied with our Services. Refund requests should be sent to 
              <a href="mailto:connectrectifylearn@gmail.com">connectrectifylearn@gmail.com</a>.
            </p>
            
            <h3>Price Changes</h3>
            <p>
              We reserve the right to adjust pricing for our Services at any time. We will provide 
              notice of any price changes by posting the new prices on our website and/or by sending 
              you an email notification.
            </p>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <h2><FaExclamationTriangle /> Acceptable Use Policy</h2>
          <TermsContent>
            <p>
              By using Rectify Learn, you agree not to:
            </p>
            <ul>
              <li>Upload any content that infringes on intellectual property rights</li>
              <li>Upload sensitive personal information of others</li>
              <li>Use our Services to cheat on exams or engage in academic dishonesty</li>
              <li>Attempt to access, tamper with, or use non-public areas of our platform</li>
              <li>Probe, scan, or test the vulnerability of our systems</li>
              <li>Circumvent any technological measure implemented to protect our Services</li>
              <li>Upload any material that contains malware, viruses, or other harmful code</li>
              <li>Post or transmit any content that is unlawful, threatening, abusive, or defamatory</li>
            </ul>
            
            <div className="warning-box">
              <strong>Warning:</strong> Violation of these acceptable use policies may result in the 
              termination of your account and potential legal action.
            </div>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <h2><FaGavel /> Intellectual Property</h2>
          <TermsContent>
            <h3>Your Content</h3>
            <p>
              You retain all ownership rights to the materials you upload to our platform. By uploading 
              content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, 
              process, and transform your content solely for the purpose of providing our Services to you.
            </p>
            
            <h3>Feedback</h3>
            <p>
              If you provide feedback or suggestions about our Services, we may use this feedback 
              without any obligation to you.
            </p>
          </TermsContent>
        </TermsSection>
        
        <TermsSection>
          <TermsContent>
            <h3>Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, in no event shall Rectify Learn, its directors, 
              employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use our Services</li>
              <li>Any content obtained from our Services</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Any errors or inaccuracies in our content</li>
            </ul>
            
            <h3>Disclaimer of Warranties</h3>
            <p>
              Our Services are provided on an "AS IS" and "AS AVAILABLE" basis. Rectify Learn disclaims 
              all warranties of any kind, whether express or implied, including but not limited to the 
              implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            
            <h3>Changes to Terms</h3>
            <p>
              We reserve the right to modify or replace these Terms at any time. Material changes will 
              be notified to you either through the email address associated with your account or by 
              posting a notice on our website.
            </p>
            
            <h3>Termination</h3>
            <p>
              We may terminate or suspend your access to our Services immediately, without prior 
              notice or liability, for any reason whatsoever, including without limitation if you 
              breach the Terms.
            </p>
            
            <h3>Contact Information</h3>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: <a href="mailto:connectrectifylearn@gmail.com">connectrectifylearn@gmail.com</a><br />
              Or visit our <Link to="/faq">FAQ page</Link> for more information.
            </p>
            
            <p>
              By continuing to access or use our Services after any revisions become effective, you 
              agree to be bound by the revised Terms.
            </p>
            
            <p className="last-updated">Last Updated: April 16, 2025</p>
          </TermsContent>
        </TermsSection>
      </div>
      
      <BackToTopButton onClick={scrollToTop}>
        <span>↑</span>
      </BackToTopButton>
    </PageContainer>
  );
};

export default TermsOfService;