import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronDown, 
  FaQuestion, 
  FaUser, 
  FaShieldAlt, 
  FaBrain, 
  FaFileAlt, 
  FaRegLightbulb,
  FaRegCheckCircle,
  FaInfoCircle,
  FaServer
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

// Discord-style section heading
const FAQSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
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
  
  & + & {
    margin-top: 3rem;
  }
`;

// Discord-style FAQ items
const FAQItem = styled.div`
  margin-bottom: 1.25rem;
  border-radius: 8px;
  background-color: ${colors.darkButNotBlack};
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    border-color: rgba(88, 101, 242, 0.3);
  }
`;

// Discord-style question toggle
const FAQQuestion = styled.div`
  padding: 1.25rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: ${colors.white} !important;
  position: relative;
  
  &:hover {
    background-color: rgba(88, 101, 242, 0.05);
  }
  
  svg {
    transition: transform 0.3s ease, color 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    color: ${props => props.isOpen ? colors.blurple : colors.greyple};
    min-width: 16px;
    margin-left: 1rem;
  }
  
  /* Discord-style left accent when open */
  ${props => props.isOpen && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: ${colors.blurple};
      border-radius: 0 4px 4px 0;
    }
  `}
`;

// Discord-style answers with better animation
const FAQAnswer = styled(motion.div)`
  padding: 0 1.25rem;
  color: ${colors.white} !important;
  font-size: 1rem;
  line-height: 1.7;
  
  .answer-content {
    padding: 0.5rem 0 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  a {
    color: ${colors.blurple};
    font-weight: 500;
    transition: color 0.2s, text-shadow 0.2s;
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
  
  ul, ol {
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: -1.2rem;
      top: 0.5rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors.blurple};
    }
  }
  
  .highlight {
    display: inline-block;
    background: rgba(88, 101, 242, 0.1);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    color: ${colors.blurple};
    font-weight: 500;
  }
  
  .note {
    background: rgba(87, 242, 135, 0.05);
    border-left: 3px solid ${colors.green};
    padding: 0.75rem 1rem;
    border-radius: 0 4px 4px 0;
    margin: 1rem 0;
    font-size: 0.95rem;
    display: flex;
    align-items: flex-start;
    
    svg {
      color: ${colors.green};
      margin-right: 0.75rem;
      font-size: 1.1rem;
      margin-top: 0.1rem;
    }
  }
`;

// Enhanced Discord-style CTA section
const CTASection = styled.div`
  margin-top: 4rem;
  text-align: center;
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.1), rgba(235, 69, 158, 0.1));
  border-radius: 16px;
  padding: 3rem 2rem;
  border: 1px solid rgba(88, 101, 242, 0.2);
  position: relative;
  overflow: hidden;
  
  /* Discord-style top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.blurple}, ${colors.fuchsia});
  }
  
  /* Floating shapes in background */
  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(235, 69, 158, 0.1) 0%, rgba(88, 101, 242, 0.1) 100%);
    border-radius: 50%;
    z-index: -1;
    right: -150px;
    bottom: -150px;
    animation: pulse 15s infinite alternate;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.3); opacity: 0.2; }
  }
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: ${colors.white} !important;
    
    span {
      color: ${colors.blurple};
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: ${colors.blurple};
        border-radius: 2px;
      }
    }
  }
  
  p {
    max-width: 600px;
    margin: 0 auto 2rem;
    color: ${colors.greyple} !important;
  }
`;

// Discord-style button with animation
const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  background: ${colors.blurple};
  color: ${colors.white} !important;
  font-weight: 600;
  border-radius: 28px;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.4);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(88, 101, 242, 0.6);
    background: linear-gradient(90deg, ${colors.blurple}, ${colors.fuchsia});
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const FAQ = () => {
  // State to track which questions are open
  const [openItems, setOpenItems] = useState({});
  
  // Toggle function for questions
  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <h1>Frequently Asked Questions</h1>
          <p>
            Everything you need to know about Rectify Learn. Can't find the answer you're looking for? 
            Contact our <a href="mailto:connectrectifylearn@gmail.com" style={{ color: colors.blurple }}>support team</a>.
          </p>
        </PageHeader>
        
        {/* General Questions */}
        <FAQSection>
          <h2><FaQuestion /> General Questions</h2>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('general-1')} 
              isOpen={openItems['general-1']}
            >
              What is Rectify Learn?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['general-1'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Rectify Learn is an AI-powered edtech platform built to revolutionize the way you study and retain information. It automatically generates personalized quizzes, flashcards, and active recall exercises — powered by spaced repetition — from your uploaded study materials, helping you learn smarter, faster, and more effectively.
                    
                    <div className="note">
                      <FaRegLightbulb />
                      <div>
                        Master more. Forget less. Learn intelligently with our cutting-edge edtech solution.
                      </div>
                    </div>
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('general-2')} 
              isOpen={openItems['general-2']}
            >
              How does the free trial work?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['general-2'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >                  <div className="answer-content">
                    All users receive <span className="highlight">10 documents per week</span> to use our system. This allows you to upload documents, generate quizzes, and use all platform features without any payment required.
                    
                    <ul>
                      <li>Each document processing counts towards your weekly limit</li>
                      <li>The limit resets every week</li>
                      <li>You get to experience the full platform capabilities</li>
                    </ul>
                    
                    After using your 10 weekly documents, you'll need to wait for the next week or subscribe to continue using the platform.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('general-3')} 
              isOpen={openItems['general-3']}
            >
              What types of documents can I upload?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['general-3'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Rectify Learn supports a wide variety of document formats:
                    
                    <ul>
                      <li>PDF files (.pdf)</li>
                      <li>Word documents (.doc, .docx)</li>
                      <li>PowerPoint presentations (.ppt, .pptx)</li>
                      <li>Plain text files (.txt)</li>
                      <li>Images containing text (.jpg, .png)</li>
                    </ul>
                    
                    <div className="note">
                      <FaRegCheckCircle />
                      <div>
                        For best results, we recommend uploading documents with clear text and well-structured content. Our system handles formulas, diagrams, and tables, but extremely complex layouts might affect the quality of extracted information.
                      </div>
                    </div>
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
        </FAQSection>
        
        {/* Quiz & Flashcard Features */}
        <FAQSection>
          <h2><FaBrain /> Quiz & Flashcard Features</h2>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('features-1')} 
              isOpen={openItems['features-1']}
            >
              How does the quiz generation work?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['features-1'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Our AI quiz generation follows a sophisticated process:
                    
                    <ol>
                      <li>Your document is analyzed and key concepts are extracted</li>
                      <li>The AI identifies important information, relationships, and potential quiz topics</li>
                      <li>Based on your selected difficulty level and quiz type, questions are formulated</li>
                      <li>The system creates appropriate answer choices and explanations</li>
                      <li>The quiz is organized and presented to you in an interactive format</li>
                    </ol>
                    
                    You can customize the difficulty level (Easy, Medium, Hard), question types, and number of questions to suit your learning needs.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('features-2')} 
              isOpen={openItems['features-2']}
            >
              What makes your Active Recall system special?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['features-2'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Our Smart Active Recall system uses spaced repetition principles and adaptive algorithms to optimize your learning:
                    
                    <ul>
                      <li>Tracks your performance across all quizzes and flashcards</li>
                      <li>Identifies concepts you struggle with and prioritizes them</li>
                      <li>Adjusts question difficulty based on your mastery level</li>
                      <li>Schedules reviews at scientifically optimal intervals</li>
                      <li>Provides detailed insights on your learning progress</li>
                    </ul>
                    
                    <div className="note">
                      <FaInfoCircle />
                      <div>
                        Research shows that active recall with spaced repetition can improve retention by up to 200% compared to passive studying methods.
                      </div>
                    </div>
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('features-3')} 
              isOpen={openItems['features-3']}
            >
              Are there limits on document size or quiz generation?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['features-3'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    We have the following limits in place:
                    
                    <ul>
                      <li>Document size: Maximum 10MB per file</li>
                      <li>Content length: Up to 50 pages of text per document</li>
                      <li>Quiz questions: Up to 50 questions per document</li>
                      <li>Flashcards: Up to 100 flashcards per document</li>
                    </ul>
                    
                    Premium subscribers receive higher limits, with the ability to process larger documents and generate more extensive quizzes and flashcard sets.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
        </FAQSection>
        
        {/* Account & Security */}
        <FAQSection>
          <h2><FaShieldAlt /> Account & Security</h2>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('security-1')} 
              isOpen={openItems['security-1']}
            >
              How is my data handled and secured?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['security-1'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    We take data security and privacy seriously:
                    
                    <ul>
                      <li>All data is encrypted in transit and at rest using industry-standard encryption</li>
                      <li>Your uploaded documents are processed securely and stored in isolated environments</li>
                      <li>We never share your personal data or document content with third parties</li>
                      <li>You maintain ownership of all your documents and learning content</li>
                      <li>You can request deletion of your data at any time</li>
                    </ul>
                    
                    For more details, please review our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
        </FAQSection>
        
        {/* System & Technical */}
        <FAQSection>
          <h2><FaServer /> System & Technical</h2>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('technical-1')} 
              isOpen={openItems['technical-1']}
            >
              How is the AI trained and what models do you use?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['technical-1'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Our AI system uses a combination of advanced language models and custom-trained algorithms:
                    
                    <ul>
                      <li>Document understanding: We use specialized models for document parsing and knowledge extraction</li>
                      <li>Question generation: Custom fine-tuned large language models create educational questions</li>
                      <li>Knowledge assessment: Adaptive algorithms analyze your responses and learning patterns</li>
                      <li>Content verification: Multi-stage verification ensures accuracy of generated content</li>
                    </ul>
                    
                    Our AI is continually trained on educational content across various disciplines to ensure it can handle diverse subjects and maintain high-quality outputs.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('technical-2')} 
              isOpen={openItems['technical-2']}
            >
              What browsers and devices are supported?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['technical-2'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Rectify Learn is designed to work on most modern platforms:
                    
                    <ul>
                      <li><strong>Supported browsers:</strong> Chrome, Firefox, Safari, Edge (latest 2 versions)</li>
                      <li><strong>Desktop:</strong> Windows, macOS, Linux</li>
                      <li><strong>Mobile:</strong> iOS and Android via responsive web design</li>
                      <li><strong>Tablets:</strong> iPad, Android tablets</li>
                    </ul>
                    
                    For the best experience, we recommend using a desktop or laptop computer with a recent version of Chrome or Firefox. Mobile apps for iOS and Android are currently in development.
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
          
          <FAQItem>
            <FAQQuestion 
              onClick={() => toggleItem('technical-3')} 
              isOpen={openItems['technical-3']}
            >
              How do you handle document processing errors?
              <FaChevronDown />
            </FAQQuestion>
            <AnimatePresence>
              {openItems['technical-3'] && (
                <FAQAnswer
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="answer-content">
                    Our system is designed to handle various document issues gracefully:
                    
                    <ul>
                      <li>For corrupted documents, you'll receive an immediate error message with suggestions</li>
                      <li>If text extraction partially fails, we'll process what we can and notify you</li>
                      <li>For documents with complex formatting, we provide preview options before full processing</li>
                      <li>If processing completely fails, we don't count it against your free attempts</li>
                    </ul>
                    
                    <div className="note">
                      <FaInfoCircle />
                      <div>
                        If you encounter persistent issues with document processing, our support team can assist with alternative upload methods or format conversion suggestions.
                      </div>
                    </div>
                  </div>
                </FAQAnswer>
              )}
            </AnimatePresence>
          </FAQItem>
        </FAQSection>
        
        {/* Call to Action */}        <CTASection>
          <h3>Ready to experience <span>Rectify Learn</span>?</h3>
          <p>Sign up today and get started with your 10 free documents per week. No credit card required.</p>
          <CTAButton to="/signup">Get Started Now</CTAButton>
        </CTASection>
      </div>
    </PageContainer>
  );
};

export default FAQ;