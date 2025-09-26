import React from 'react';
import styled from 'styled-components';

const ChatbotContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0 1rem;
  }
`;

const ChatbotWrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const IframeContainer = styled.div`
  flex: 1;
  min-height: 700px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(156, 39, 176, 0.3);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(156, 39, 176, 0.15);
  backdrop-filter: blur(20px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(156, 39, 176, 0.05) 0%, 
      rgba(103, 58, 183, 0.03) 50%, 
      rgba(156, 39, 176, 0.02) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ChatbotIframe = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 700px;
  border: none;
  border-radius: 16px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    min-height: 600px;
  }
`;

const LoadingMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  text-align: center;
  z-index: 3;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff6b6b;
  font-size: 1.1rem;
  text-align: center;
  z-index: 3;
  padding: 2rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 107, 107, 0.3);
`;

const Chatbot = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (

      <ChatbotWrapper>
        <IframeContainer>
          {isLoading && (
            <LoadingMessage>
              Loading AI Assistant...
            </LoadingMessage>
          )}
          
          {hasError && (
            <ErrorMessage>
              Unable to load the AI Assistant. Please make sure the chatbot service is running on localhost:8501.
            </ErrorMessage>
          )}
          
          <ChatbotIframe
            src="http://localhost:8501"
            title="AI Study Assistant"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="camera; microphone; clipboard-read; clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          />
        </IframeContainer>
      </ChatbotWrapper>

  );
};

export default Chatbot;
