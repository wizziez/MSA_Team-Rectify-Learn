import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaCrown, 
  FaRocket, 
  FaUnlockAlt,
  FaInfoCircle,
  FaBolt,
  FaChartLine,
  FaUserGraduate,
  FaFileAlt,
  FaBrain,
  FaHistory,
  FaCode,
  FaUserFriends
} from 'react-icons/fa';

// Color scheme
const colors = {
  dark: '#36393F',
  darker: '#2F3136',
  darkest: '#202225',
  light: '#FFFFFF',
  blurple: '#5865F2',
  green: '#57F287',
  yellow: '#FEE75C',
  red: '#ED4245',
  grey: '#99AAB5',
  lightGrey: '#E5E5E5',
  highlight: 'rgba(88, 101, 242, 0.2)'
};

const Container = styled.div`
  min-height: calc(100vh - 80px);
  background-color: ${colors.dark};
  color: ${colors.light};
  padding: 2rem 0;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${colors.light} !important;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${colors.light} !important;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PromoTag = styled.div`
  background: linear-gradient(90deg, ${colors.blurple}, #7a5cf8);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 30px;
  display: inline-block;
  margin: 1.5rem auto;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);
  
  span {
    margin-left: 5px;
    font-weight: 800;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  
  span {
    margin: 0 1rem;
    font-size: 1.1rem;
    color: ${colors.grey};
  }
  
  span.active {
    color: ${colors.light};
    font-weight: 600;
  }
`;

const ToggleButton = styled.div`
  display: flex;
  position: relative;
  width: 60px;
  height: 30px;
  background: ${props => props.on ? colors.blurple : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.on ? colors.blurple : 'rgba(255, 255, 255, 0.2)'};
  }
  
  .toggle-circle {
    position: absolute;
    width: 24px;
    height: 24px;
    background-color: white;
    border-radius: 50%;
    top: 3px;
    left: ${props => props.on ? '33px' : '3px'};
    transition: left 0.3s ease;
  }
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const PricingCard = styled(motion.div)`
  background: ${props => props.featured ? 'linear-gradient(145deg, #313954, #2c3042)' : colors.darker};
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: ${props => props.featured ? '0 8px 30px rgba(0, 0, 0, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.1)'};
  border: ${props => props.featured ? '2px solid rgba(88, 101, 242, 0.5)' : 'none'};
  
  ${props => props.featured && `
    &:before {
      content: '';
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      background: linear-gradient(45deg, ${colors.blurple}, transparent, ${colors.blurple});
      z-index: -1;
      border-radius: 18px;
      opacity: 0.3;
    }
  `}
`;

const PopularTag = styled.div`
  position: absolute;
  top: -13px;
  right: 2rem;
  background: linear-gradient(90deg, #ffcc00, #ff9900);
  color: #333 !important;
  padding: 0.3rem 1rem;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(255, 180, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MostPopularIcon = styled(FaStar)`
  margin-right: 5px;
`;

const PricingHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PricingIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: ${props => props.color || 'rgba(88, 101, 242, 0.1)'};
  color: ${props => props.iconColor || colors.blurple};
`;

const PricingTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${colors.grey} !important;
`;

const PricingDescription = styled.p`
  color: ${colors.light} !important;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const PricingAmount = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .currency {
    font-size: 1.2rem;
    vertical-align: top;
    position: relative;
    top: 0.5rem;
    margin-right: 0.25rem;
  }
  
  .amount {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .period {
    display: block;
    color: ${colors.grey};
    margin-top: 0.5rem;
    font-size: 0.9rem;
  }
  
  .original-price {
    text-decoration: line-through;
    color: ${colors.grey};
    font-size: 1.2rem;
    margin-right: 0.5rem;
  }
  
  .highlighted-price {
    color: ${colors.green};
  }
`;

const FreeTokens = styled.div`
  background-color: rgba(87, 242, 135, 0.1);
  border: 1px solid rgba(87, 242, 135, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
  
  .token-amount {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${colors.green};
    margin: 0.5rem 0;
  }
  
  .token-period {
    font-size: 0.85rem;
    color: ${colors.grey};
  }
`;

const FeatureList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1;
`;

const Feature = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.9rem;
  font-size: 0.95rem;
  
  svg {
    flex-shrink: 0;
    margin-right: 0.75rem;
    margin-top: 0.2rem;
  }
  
  .feature-text {
    line-height: 1.4;
  }
  
  &.disabled {
    color: ${colors.grey};
    text-decoration: ${props => props.strikethrough ? 'line-through' : 'none'};
    opacity: 0.7;
  }
  
  .info-icon {
    margin-left: 5px;
    font-size: 0.8rem;
    color: ${colors.grey};
    cursor: help;
    vertical-align: super;
  }
  
  .highlight {
    color: ${colors.green};
    font-weight: 600;
  }
`;

const Spacer = styled.div`
  margin: ${props => props.size || '1rem'} 0;
`;

const ActionButton = styled(Link)`
  margin-top: 1.5rem;
  display: block;
  text-align: center;
  padding: 0.9rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background: ${props => {
    if (props.disabled) return 'rgba(153, 170, 181, 0.2)';
    return props.primary 
      ? 'linear-gradient(90deg, #5865F2, #7289da)' 
      : 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.disabled ? colors.grey : colors.light};
  border: none;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.7 : 1};
  text-decoration: none;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-3px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 7px 14px rgba(0, 0, 0, 0.2)'};
    background: ${props => {
      if (props.disabled) return 'rgba(153, 170, 181, 0.2)';
      return props.primary 
        ? 'linear-gradient(90deg, #4752c4, #5d73d4)' 
        : 'rgba(255, 255, 255, 0.15)';
    }};
  }
  
  svg {
    margin-right: 0.5rem;
    vertical-align: middle;
  }
`;

const ComingSoonTag = styled.span`
  background-color: rgba(255, 255, 255, 0.1);
  color: ${colors.grey};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-left: 0.5rem;
  vertical-align: middle;
`;

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const toggleBilling = () => {
    setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly');
  };
  
  const calculateYearlyDiscount = (monthlyPrice) => {
    const yearlyPrice = monthlyPrice * 12 * 0.75; // 25% discount
    return yearlyPrice.toFixed(2);
  };
  
  return (
    <Container>
      <Header>
        <Title>Simple, Transparent Pricing</Title>
        <Subtitle>
          Choose a plan that works best for your study needs. All plans include our core features with varying levels of AI-powered quiz and flashcard generation.
        </Subtitle>
      </Header>
      
      <ToggleWrapper>
        <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
        <ToggleButton on={billingCycle === 'yearly'} onClick={toggleBilling}>
          <div className="toggle-circle" />
        </ToggleButton>
        <span className={billingCycle === 'yearly' ? 'active' : ''}>Yearly <span style={{ color: colors.green }}>Save 25%</span></span>
      </ToggleWrapper>
      
      <PricingGrid>
        {/* Free Tier */}
        <PricingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PricingHeader>
            <PricingIcon color="rgba(153, 170, 181, 0.1)" iconColor={colors.grey}>
              <FaUserGraduate />
            </PricingIcon>
            <PricingTitle>Free</PricingTitle>
            <PricingDescription>
              Perfect for getting started with basic features
            </PricingDescription>
          </PricingHeader>
          
          <PricingAmount>
            <span className="amount">৳0</span>
            <span className="period">forever free</span>
          </PricingAmount>
          
          <FeatureList>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">10 documents</span> per week</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">20 questions</span> generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">20 flashcards</span> generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Spaced repetition system</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Document upload (PDF, DOCX, TXT)</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Basic quiz generation</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Progress tracking</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Weakness analysis</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Study group features</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Agentic AI customized model</span>
            </Feature>
          </FeatureList>
          
          <ActionButton to="/signup" primary>
            Get Started Free
          </ActionButton>
        </PricingCard>
        
        {/* Basic Tier */}
        <PricingCard 
          featured
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <PopularTag>
            <MostPopularIcon />
            Most Popular
          </PopularTag>
          <PricingHeader>
            <PricingIcon color="rgba(88, 101, 242, 0.1)" iconColor={colors.blurple}>
              <FaRocket />
            </PricingIcon>
            <PricingTitle>Basic</PricingTitle>
            <PricingDescription>
              Ideal for regular study needs with enhanced features
            </PricingDescription>
          </PricingHeader>
          
          <PricingAmount>
            <span className="currency">৳</span>
            <span className="amount">
              {billingCycle === 'monthly' ? '99' : calculateYearlyDiscount(99)}
            </span>
            <span className="period">
              {billingCycle === 'monthly' ? 'per month' : 'per year'}
            </span>
            {billingCycle === 'yearly' && (
              <div style={{marginTop: '0.5rem'}}>
                <span className="original-price">৳{99 * 12}</span>
                <span className="highlighted-price">Save 25%</span>
              </div>
            )}
          </PricingAmount>
          
          <FeatureList>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Everything in Free plan</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">25 documents</span> per week</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">50 questions</span> generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">50 flashcards</span> generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Progress tracking</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Weakness analysis</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Advanced quiz customization</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Priority email support</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Study group features</span>
            </Feature>
            <Feature className="disabled">
              <FaTimes color={colors.red} />
              <span className="feature-text">Agentic AI customized model</span>
            </Feature>
          </FeatureList>
          
          <ActionButton disabled>
            Coming Soon
          </ActionButton>
        </PricingCard>
        
        {/* Premium Tier */}
        <PricingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <PricingHeader>
            <PricingIcon color="rgba(254, 231, 92, 0.1)" iconColor={colors.yellow}>
              <FaCrown />
            </PricingIcon>
            <PricingTitle>Premium</PricingTitle>
            <PricingDescription>
              For serious students and professionals with unlimited access
            </PricingDescription>
          </PricingHeader>
          
          <PricingAmount>
            <span className="currency">৳</span>
            <span className="amount">
              {billingCycle === 'monthly' ? '250' : calculateYearlyDiscount(250)}
            </span>
            <span className="period">
              {billingCycle === 'monthly' ? 'per month' : 'per year'}
            </span>
            {billingCycle === 'yearly' && (
              <div style={{marginTop: '0.5rem'}}>
                <span className="original-price">৳{250 * 12}</span>
                <span className="highlighted-price">Save 25%</span>
              </div>
            )}
          </PricingAmount>
          
          <FeatureList>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Everything in Basic plan</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">Unlimited</span> document uploads</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">Unlimited</span> questions generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text"><span className="highlight">Unlimited</span> flashcards generation</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Study group features</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Agentic AI customized fine-tuned model</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Advanced analytics dashboard</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Personalized learning paths</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Priority support with 24h response</span>
            </Feature>
          </FeatureList>
          
          <ActionButton disabled>
            Coming Soon
          </ActionButton>
        </PricingCard>
        
        {/* Enterprise Tier */}
        <PricingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <PricingHeader>
            <PricingIcon color="rgba(235, 69, 158, 0.1)" iconColor={colors.fuchsia}>
              <FaUserFriends />
            </PricingIcon>
            <PricingTitle>Enterprise</PricingTitle>
            <PricingDescription>
              Your idea, our execution. For coaching centers and educational platforms seeking AI-integrated solutions at affordable costs.
            </PricingDescription>
          </PricingHeader>
          
          <PricingAmount>
            <span className="amount" style={{ fontSize: '2.5rem' }}>Custom</span>
            <span className="period">pricing available</span>
          </PricingAmount>
          
          <FeatureList>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Everything in Premium plan</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Custom implementation & setup</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Dedicated customer success manager</span>
            </Feature>
            <Feature>
              <FaCheck color={colors.green} />
              <span className="feature-text">Priority feature development</span>
            </Feature>
          </FeatureList>
          
          <ActionButton to="mailto:connectrectifylearn@gmail.com?subject=Enterprise%20Plan%20Inquiry&body=Hello,%0D%0A%0D%0AI%20am%20interested%20in%20learning%20more%20about%20your%20Enterprise%20plan.%20Please%20provide%20details%20about%20pricing%20and%20features%20for%20our%20organization.%0D%0A%0D%0AOrganization:%20%0D%0AExpected%20Users:%20%0D%0ASpecific%20Requirements:%20%0D%0A%0D%0AThank%20you!" primary>
            Contact Sales
          </ActionButton>
        </PricingCard>
      </PricingGrid>
    </Container>
  );
};

export default Pricing;