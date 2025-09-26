import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaLock, FaCheckCircle } from 'react-icons/fa';

// Reuse styling from the ForgotPassword component
const ResetPasswordContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #13111C 0%, #322450 100%);
  position: relative;
  overflow: hidden;
`;

const ResetPasswordCard = styled.div`
  background: rgba(25, 21, 40, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 
              0 8px 20px rgba(91, 91, 249, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2), 
                0 10px 30px rgba(91, 91, 249, 0.15),
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #5B5BF9 0%, #5B5BF9 100%);
  }
  
  @media (max-width: 576px) {
    padding: 2.5rem 1.8rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.2rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #5B5BF9 0%, #5B5BF9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.05rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.75rem;
  position: relative;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled(Field)`
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  
  &:focus {
    border-color: #5B5BF9;
    outline: none;
    box-shadow: 0 0 0 3px rgba(91, 91, 249, 0.2);
    background-color: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.9);
  }
  
  &.error {
    border-color: #ff6b6b;
    background-color: rgba(255, 107, 107, 0.05);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.95rem;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.1rem;
  transition: color 0.3s ease;
  z-index: 2;
  
  ${InputWrapper}:focus-within & {
    color: #5B5BF9;
  }
`;

const ErrorText = styled.div`
  color: #ff6b6b;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚠';
    margin-right: 6px;
    font-size: 0.9rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #5B5BF9 0%, #5B5BF9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(91, 91, 249, 0.3);
  
  &:hover {
    box-shadow: 0 8px 20px rgba(91, 91, 249, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

const SuccessMessage = styled.div`
  text-align: center;
  
  svg {
    font-size: 3rem;
    color: #4BB543;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: #4BB543;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2rem;
  }
  
  button {
    background: linear-gradient(135deg, #5B5BF9 0%, #5B5BF9 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.9rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(91, 91, 249, 0.4);
    }
  }
`;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for token in both URL hash and URL query parameters
  useEffect(() => {
    // First, try the hash method (for backward compatibility)
    const hash = window.location.hash;
    const query = new URLSearchParams(location.search);
    const tokenFromQuery = query.get('token');
    const typeFromQuery = query.get('type');
    
    // Case 1: We have a token in the hash fragment (old format)
    if (hash) {
      // Parse the hash to get the access token
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const tokenType = params.get('token_type');

      if (accessToken && refreshToken && tokenType === 'bearer') {
        // Store the tokens in localStorage for Supabase to use
        localStorage.setItem('rectifyToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // Clear the hash from the URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
    }
    
    // Case 2: We have a token in the query parameters (new format from Supabase email)
    if (tokenFromQuery && typeFromQuery === 'recovery') {
      // Store the token in localStorage
      localStorage.setItem('resetToken', tokenFromQuery);
      
      // No need to clear the URL here as we want to keep the token for now
      return;
    }
    
    // No valid token found in either format
    if (!localStorage.getItem('rectifyToken') && !localStorage.getItem('resetToken')) {
      setAlertMessage("Invalid or missing reset token. Please try requesting a new password reset link.");
      setIsSuccess(false);
    }
  }, [location]);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      
      // Try to get tokens in order of preference
      const token = localStorage.getItem('rectifyToken');
      const resetToken = localStorage.getItem('resetToken');
      
      if (!token && !resetToken) {
        throw new Error('No valid reset token found. Please request a new password reset link.');
      }

      // Update the password using the appropriate token
      await updatePassword(values.password, resetToken);
      
      // Clear the tokens after successful password reset
      localStorage.removeItem('rectifyToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('resetToken');
      
      setIsSuccess(true);
      setResetComplete(true);
      setAlertMessage('Your password has been successfully reset.');
    } catch (error) {
      console.error('Password reset error:', error);
      setIsSuccess(false);
      if (error.message.includes('Invalid login credentials')) {
        setAlertMessage('Invalid or expired reset token. Please request a new password reset link.');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        setAlertMessage('Password must be at least 6 characters long.');
      } else {
        setAlertMessage(error.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  if (resetComplete) {
    return (
      <ResetPasswordContainer>
        <ResetPasswordCard>
          <SuccessMessage>
            <FaCheckCircle />
            <h2>Password Reset Complete</h2>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <button onClick={handleNavigateToLogin}>Go to Login</button>
          </SuccessMessage>
        </ResetPasswordCard>
      </ResetPasswordContainer>
    );
  }

  return (
    <ResetPasswordContainer>
      <ResetPasswordCard>
        <Header>
          <h1>Reset Password</h1>
          <p>Enter your new password below</p>
        </Header>

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

              <FormGroup>
                <StyledLabel htmlFor="password">New Password</StyledLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <StyledInput
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your new password"
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
                    placeholder="Confirm your new password"
                    className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                  />
                </InputWrapper>
                <ErrorMessage name="confirmPassword" component={ErrorText} />
              </FormGroup>

              <SubmitButton type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Resetting...' : 'Reset Password'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </ResetPasswordCard>
    </ResetPasswordContainer>
  );
};

export default ResetPassword;