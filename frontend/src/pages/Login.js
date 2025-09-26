import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.7;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  }
  
  @media (max-width: 576px) {
    padding: 2rem;
    max-width: 350px;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5px;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    font-weight: 400;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  z-index: 2;
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  font-size: 0.9rem;
  color: #5865F2;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: underline;
    color: #5865F2;
  }
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(88, 101, 242, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  
  a {
    color: #5865F2;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Alert = styled.div`
  padding: 1rem 1.25rem;
  background-color: ${props => props.success ? 'rgba(21, 87, 36, 0.1)' : 'rgba(114, 28, 36, 0.1)'};
  color: ${props => props.success ? '#4BB543' : '#ff6b6b'};
  border-radius: 8px;
  margin-bottom: 1.75rem;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  border-left: 4px solid ${props => props.success ? '#4BB543' : '#ff6b6b'};
  backdrop-filter: blur(5px);
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: ${props => props.success ? '"✓"' : '"✗"'};
    margin-right: 8px;
    font-size: 1rem;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    padding: 0 1rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  span {
    padding: 0 1rem;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // For debugging: log when component mounts/unmounts to track lifecycle
  useEffect(() => {
    console.log('Login component mounted');
    // Check if we have any auth errors in the URL (Google auth might redirect with error)
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      setAuthError(`${error}: ${errorDescription || 'Authentication failed'}`);
      setAlertMessage(`Authentication error: ${errorDescription || 'Failed to login with Google'}`);
      setIsSuccess(false);
    }
    
    return () => {
      console.log('Login component unmounted');
    };
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setAlertMessage('');
      console.log('Attempting email/password login');
      await login(values.email, values.password);
      setIsSuccess(true);
      setAlertMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/upload');
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setIsSuccess(false);
      
      // Check if error message contains "email not confirmed" or similar
      if (error.message && (
        error.message.toLowerCase().includes('email not confirmed') || 
        error.message.toLowerCase().includes('not verified') ||
        error.message.toLowerCase().includes('confirm your email')
      )) {
        // Custom message for email verification issues
        setAlertMessage(`${error.message} Please check your spam or junk folder and mark our email as "Not Spam" to ensure you receive our communications.`);
      } else {
        setAlertMessage(error.message || 'Failed to login. Please try again.');
      }
      
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setAlertMessage('');
      console.log('Attempting Google login');
      await loginWithGoogle();
      // The redirection is handled by Supabase OAuth
    } catch (error) {
      console.error('Google login error:', error);
      setIsSuccess(false);
      setAlertMessage(error.message || 'Failed to login with Google. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginHeader>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your learning journey</p>
        </LoginHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              {alertMessage && (
                <Alert success={isSuccess}>{alertMessage}</Alert>
              )}
              {authError && !alertMessage && (
                <Alert>{authError}</Alert>
              )}

              <FormGroup>
                <StyledLabel htmlFor="email">Email Address</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <StyledInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    className={errors.email && touched.email ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="password">Password</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <StyledInput
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className={errors.password && touched.password ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>

              <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </SubmitButton>

              <OrDivider>
                <span>or</span>
              </OrDivider>

              <GoogleButton 
                type="button" 
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                <FaGoogle /> 
                {googleLoading ? 'Connecting...' : 'Continue with Google'}
              </GoogleButton>

              <SignupLink>
                Don't have an account?<Link to="/signup">Sign Up</Link>
              </SignupLink>
            </Form>
          )}
        </Formik>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;