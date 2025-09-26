import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient'; // Import Supabase
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle, FaShieldAlt, FaKey, FaSave } from 'react-icons/fa'; // Add FaSave

// --- Styles (Keep existing styles: FormGroup, Label, Input, SaveButton, AlertMessage, SectionDivider, SectionTitle, PageContainer, ProfileCard, ProfileHeader, ProfileImage, ProfileTitle, ProfileInfo, InfoItem, InfoLabel, InfoValue) ---
const FormGroup = styled.div`
  margin-bottom: 1.75rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: var(--text-color);

  svg {
    margin-right: 0.75rem;
    color: var(--primary-color);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background-color: var(--input-background);
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
  }

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.15);

  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const AlertMessage = styled.div`
  padding: 1.25rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;

  svg {
    margin-right: 1rem;
    font-size: 1.5rem;
  }

  &.error {
    background-color: rgba(239, 71, 111, 0.1);
    color: #ef476f;
    border: 1px solid rgba(239, 71, 111, 0.2);
  }

  &.success {
    background-color: rgba(6, 214, 160, 0.1);
    color: #06d6a0;
    border: 1px solid rgba(6, 214, 160, 0.2);
  }
`;

const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 3rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  color: var(--text-color);

  svg {
    margin-right: 1rem;
    color: var(--primary-color);
  }
`;

const PageContainer = styled.div`
  padding: 3rem 0;
  background: linear-gradient(180deg, var(--background-color) 0%, rgba(67, 97, 238, 0.05) 100%);
  min-height: calc(100vh - 200px);
`;

const ProfileCard = styled.div`
  background-color: var(--card-background);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  padding: 3rem;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    border-radius: 2px;
  }
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
  display: flex; /* Added for centering initials */
  align-items: center; /* Added for centering initials */
  justify-content: center; /* Added for centering initials */
  background-color: var(--primary-color); /* Added background for initials */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Add styles for initials circle */
  .initials-circle-large {
    width: 100%; /* Fill container */
    height: 100%; /* Fill container */
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 3rem; /* Larger font for larger circle */
    line-height: 1; /* Ensure text fits */
  }
`;

const ProfileTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProfileInfo = styled.div`
  /* Keep existing styles */
`;

const InfoItem = styled.div`
  /* Keep existing styles */
`;

const InfoLabel = styled.h3`
  /* Keep existing styles */
`;

const InfoValue = styled.p`
  /* Keep existing styles */
`;

// Helper function to get initials from first and last names
const getInitials = (firstName, lastName) => {
  const firstInitial = firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = lastName?.charAt(0).toUpperCase() || '';
  if (firstInitial && lastInitial) {
    return firstInitial + lastInitial;
  } else if (firstInitial) {
    return firstInitial;
  } else if (lastInitial) {
    return lastInitial;
  }
  return '?'; // Fallback if no names
};

// Helper function to get name parts regardless of auth provider
const getNameParts = (user) => {
  if (!user?.user_metadata) return { firstName: '', lastName: '' };
  
  // Handle Google auth format (uses name or full_name)
  if (user.user_metadata.name && !user.user_metadata.first_name) {
    const nameParts = user.user_metadata.name.split(' ');
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  }
  
  // Handle email auth format (uses first_name and last_name)
  return {
    firstName: user.user_metadata.first_name || '',
    lastName: user.user_metadata.last_name || ''
  };
};

// Helper function to get display name that works with both auth types
const getDisplayName = (user) => {
  if (!user?.user_metadata) return 'User';
  
  // Handle Google auth format (uses name or full_name)
  if (user.user_metadata.name) {
    return user.user_metadata.name;
  }
  
  // Handle email auth format (uses first_name and last_name)
  const firstName = user.user_metadata.first_name || '';
  const lastName = user.user_metadata.last_name || '';
  return (firstName || lastName) ? `${firstName} ${lastName}`.trim() : 'User';
};

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth(); // Need setCurrentUser to update context after name change

  // --- State for Name Update ---
  const [nameData, setNameData] = useState({ firstName: '', lastName: '' });
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');

  // --- State for Password Update ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // --- Effect to load current names into form ---
  useEffect(() => {
    const { firstName, lastName } = getNameParts(currentUser);
    setNameData({ firstName, lastName });
  }, [currentUser]);

  // --- Handlers for Name Update ---
  const handleNameChange = (e) => {
    const { id, value } = e.target;
    setNameData(prev => ({ ...prev, [id]: value }));
    setNameError('');
    setNameSuccess('');
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!nameData.firstName && !nameData.lastName) {
      setNameError('Please enter at least a first or last name.');
      return;
    }
    setNameLoading(true);
    setNameError('');
    setNameSuccess('');

    try {
      const { data: updatedUser, error } = await supabase.auth.updateUser({
        data: {
          first_name: nameData.firstName.trim(),
          last_name: nameData.lastName.trim()
        }
      });

      if (error) throw error;

      // IMPORTANT: Update the user context locally as Supabase doesn't automatically refresh it on metadata update
      if (updatedUser?.user && setCurrentUser) {
         setCurrentUser(updatedUser.user);
      }

      setNameSuccess('Profile updated successfully!');

    } catch (error) {
      console.error('Name update error:', error);
      setNameError(error.message || 'Failed to update profile.');
    } finally {
      setNameLoading(false);
    }
  };

  // --- Handlers for Password Update (Keep existing) ---
  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required'); return;
    }
    if (!passwordData.newPassword) {
      setPasswordError('New password is required'); return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters'); return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match'); return;
    }
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');
    if (!currentUser?.email) {
      setPasswordError('Could not verify user. Please log in again.');
      setPasswordLoading(false); return;
    }
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email, password: passwordData.currentPassword,
      });
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Incorrect current password.');
        }
        throw signInError;
      }
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      if (updateError) { throw updateError; }
      setPasswordSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Password update error:', error);
      setPasswordError(error.message || 'Failed to update password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Extract display logic ---
  const displayName = getDisplayName(currentUser);
  const displayEmail = currentUser?.email || 'Not available';
  const profilePicUrl = currentUser?.user_metadata?.avatar_url;
  const initials = getInitials(nameData.firstName, nameData.lastName);

  return (
    <PageContainer>
      <div className="container">
        <ProfileCard>
          {/* --- User Info Section --- */}
          <ProfileHeader>
            <ProfileImage>
              {profilePicUrl ? (
                <img src={profilePicUrl} alt={displayName} />
              ) : (
                <div className="initials-circle-large">{initials}</div>
              )}
            </ProfileImage>
            <ProfileTitle>{displayName}</ProfileTitle>
             <InfoValue style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>{displayEmail}</InfoValue>
          </ProfileHeader>

          {/* --- Update Profile Info Form --- */}
           <SectionTitle>
            <FaUser />
            Update Profile Information
          </SectionTitle>
           {nameError && (
            <AlertMessage className="error">
              <FaExclamationCircle />
              <div>{nameError}</div>
            </AlertMessage>
          )}
          {nameSuccess && (
            <AlertMessage className="success">
              <FaCheckCircle />
              <div>{nameSuccess}</div>
            </AlertMessage>
          )}
          <form onSubmit={handleNameSubmit}>
             <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={nameData.firstName}
                onChange={handleNameChange}
                placeholder="Enter your first name"
              />
            </FormGroup>
             <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={nameData.lastName}
                onChange={handleNameChange}
                placeholder="Enter your last name"
              />
            </FormGroup>
             <SaveButton type="submit" disabled={nameLoading}>
              {nameLoading ? 'Saving...' : <><FaSave /> Save Profile</>}
            </SaveButton>
          </form>

          <SectionDivider />

          {/* --- Password Update Section --- */}
          <SectionTitle>
            <FaShieldAlt />
            Update Password
          </SectionTitle>
          {passwordError && (
            <AlertMessage className="error">
              <FaExclamationCircle />
              <div>{passwordError}</div>
            </AlertMessage>
          )}
          {passwordSuccess && (
            <AlertMessage className="success">
              <FaCheckCircle />
              <div>{passwordSuccess}</div>
            </AlertMessage>
          )}
          <form onSubmit={handlePasswordSubmit}>
            <FormGroup>
              <Label htmlFor="currentPassword"><FaKey /> Current Password</Label>
              <Input
                type="password"
                id="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="newPassword"><FaLock /> New Password</Label>
              <Input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword"><FaLock /> Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
              />
            </FormGroup>
            <SaveButton type="submit" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </SaveButton>
          </form>
        </ProfileCard>
      </div>
    </PageContainer>
  );
};

export default Profile;
