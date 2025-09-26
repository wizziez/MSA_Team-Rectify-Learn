import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

// Reuse styling from Login page for consistency
const ForgotPasswordContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #13111C 0%, #322450 100%);
  position: relative;
  overflow: hidden;
`;

const ForgotPasswordCard = styled.div`
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

const BackToLogin = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    color: #5B5BF9;
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

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await resetPassword(values.email);
      setIsSuccess(true);
      setAlertMessage('Password reset email sent! Check your inbox for further instructions.');
      resetForm();
    } catch (error) {
      setIsSuccess(false);
      setAlertMessage(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <Header>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
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

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </SubmitButton>

              <BackToLogin to="/login">
                <FaArrowLeft /> Back to Login
              </BackToLogin>
            </Form>
          )}
        </Formik>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;