import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const SignupContainer = styled.div`
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

const SignupCard = styled.div`
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

const SignupHeader = styled.div`
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

const LoginLink = styled.div`
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
  padding: 1rem;
  background: ${props => props.success ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)'};
  color: ${props => props.success ? 'rgba(152, 255, 170, 0.9)' : 'rgba(255, 160, 160, 0.9)'};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid ${props => props.success ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)'};
`;

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const Signup = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  // For debugging: log when component mounts/unmounts and check for URL errors
  useEffect(() => {
    console.log('Signup component mounted');
    
    // Check if we have any auth errors in the URL (Google auth might redirect with error)
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      setAuthError(`${error}: ${errorDescription || 'Authentication failed'}`);
      setError(`Authentication error: ${errorDescription || 'Failed to sign up with Google'}`);
    }
    
    return () => {
      console.log('Signup component unmounted');
    };
  }, []);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      setLoading(true);
      console.log('Attempting email/password signup');

      // Call the signup function from AuthContext, passing first and last names in metadata
      await signup(values.email, values.password, {
        data: {
          first_name: values.firstName,
          last_name: values.lastName
        }
      });
      
      // Show success message
      setSuccess(true);
      setSuccessMessage('A confirmation email has been sent to your address. Please verify your email to complete the registration process. If you don\'t see it in your inbox, please check your spam or junk folder and mark our email as "Not Spam" to ensure you receive future communications.');
      
      // Navigate to login page after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      
    } catch (error) {
      console.error('Supabase Signup error:', error);
      // Use the error message provided by Supabase
      setError(error.message || 'Failed to create an account. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      console.log('Attempting Google signup');
      await loginWithGoogle();
      // No need to navigate as Supabase OAuth redirects automatically
    } catch (error) {
      console.error('Google sign up error:', error);
      setError(error.message || 'Failed to sign up with Google. Please try again.');
      setSuccess(false);
      setGoogleLoading(false);
    }
  };
  
  return (
    <SignupContainer>
      <SignupCard>
        <SignupHeader>
          <h1>Create Account</h1>
          <p>Sign up to get started with Rectify Learn</p>
        </SignupHeader>
        
        {error && <Alert>{error}</Alert>}
        {success && <Alert success>{successMessage}</Alert>}
        {authError && !error && !success && <Alert>{authError}</Alert>}
        
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <FormGroup>
                <StyledLabel htmlFor="firstName">First Name</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <StyledInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    className={errors.firstName && touched.firstName ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="firstName" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <StyledInput
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    className={errors.lastName && touched.lastName ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="lastName" component={ErrorText} />
              </FormGroup>

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
                    placeholder="Create a password"
                    className={errors.password && touched.password ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <StyledLabel htmlFor="confirmPassword">Confirm Password</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <StyledInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="confirmPassword" component={ErrorText} />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </SubmitButton>

              <Divider>
                <span>or</span>
              </Divider>

              <GoogleButton 
                type="button" 
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
              >
                <FaGoogle /> 
                {googleLoading ? 'Connecting...' : 'Sign Up with Google'}
              </GoogleButton>
              
              <LoginLink>
                Already have an account? <Link to="/login">Sign in</Link>
              </LoginLink>
            </Form>
          )}
        </Formik>
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup;