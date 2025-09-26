import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaHome,
  FaUpload,
  FaHistory,
  FaBrain,
  FaLayerGroup,
  FaQuestionCircle,
  FaInfoCircle,
  FaDollarSign,
  FaRobot
} from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: ${props => props.scrolled 
    ? 'linear-gradient(135deg, rgba(16, 16, 16, 0.95) 0%, rgba(43, 14, 75, 0.9) 100%)' 
    : 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(43, 14, 75, 0.7) 100%)'
  };
  backdrop-filter: blur(20px);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(156, 39, 176, 0.3);
  box-shadow: ${props => props.scrolled 
    ? '0 8px 32px rgba(156, 39, 176, 0.15)' 
    : '0 4px 16px rgba(0, 0, 0, 0.1)'
  };
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  text-decoration: none;
  position: relative;
  
  img {
    width: 45px;
    height: auto;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 8px rgba(156, 39, 176, 0.3)) brightness(1.1);
  }

  &:hover {
    transform: scale(1.05);
    color: #ffffff;
    
    img {
      filter: drop-shadow(0 4px 12px rgba(156, 39, 176, 0.5)) brightness(1.2);
    }
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(156, 39, 176, 0.8), rgba(103, 58, 183, 0.8));
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    img {
      width: 40px;
    }
  }
`;

// Modern hamburger menu with animation
const HamburgerWrapper = styled.div`
  display: none;
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(103, 58, 183, 0.15));
  border: 1px solid rgba(156, 39, 176, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(103, 58, 183, 0.25));
    border-color: rgba(156, 39, 176, 0.5);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HamburgerIcon = styled.div`
  width: 20px;
  height: 2px;
  position: relative;
  background: ${props => props.isOpen ? 'transparent' : '#ffffff'};
  transition: all 0.3s ease;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 2px;
    background: #ffffff;
    transition: all 0.3s ease;
  }
  
  &::before {
    transform: ${props => props.isOpen ? 'rotate(45deg)' : 'translateY(-6px)'};
  }
  
  &::after {
    transform: ${props => props.isOpen ? 'rotate(-45deg)' : 'translateY(6px)'};
  }
`;

const MenuIcon = styled(FaBars)`
  display: none;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: none; /* Hide this since we're using the new hamburger */
  }
`;

const CloseIcon = styled(FaTimes)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  font-size: 1.5rem;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    color: #ffffff;
    transform: rotate(90deg);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-right: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavLinks = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 80%;
    max-width: 350px;
    height: 100vh;
    background: linear-gradient(135deg, rgba(16, 16, 16, 0.98), rgba(43, 14, 75, 0.95));
    flex-direction: column;
    padding: 5rem 2rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: -5px 0 25px rgba(156, 39, 176, 0.3);
    z-index: 1000;
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(156, 39, 176, 0.3);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
        rgba(156, 39, 176, 0.08) 0%, 
        rgba(103, 58, 183, 0.05) 50%, 
        rgba(156, 39, 176, 0.03) 100%
      );
      pointer-events: none;
    }
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  position: relative;
  border: 1px solid transparent;

  &:hover {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(103, 58, 183, 0.15));
    border-color: rgba(156, 39, 176, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.15);
  }

  &.active {
    color: #ffffff !important;
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(103, 58, 183, 0.2));
    border-color: rgba(156, 39, 176, 0.4);
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.2);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(156, 39, 176, 0.8), rgba(103, 58, 183, 0.8));
    transition: width 0.3s ease;
  }

  &:hover::after,
  &.active::after {
    width: 80%;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.9) !important;
    
    &:hover {
      color: #ffffff !important;
      background: linear-gradient(135deg, rgba(156, 39, 176, 0.25), rgba(103, 58, 183, 0.2));
      border-color: rgba(156, 39, 176, 0.3);
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(156, 39, 176, 0.3), rgba(103, 58, 183, 0.2));
      border-color: rgba(156, 39, 176, 0.4);
      color: #ffffff !important;
      font-weight: 600;
    }
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.8), rgba(103, 58, 183, 0.7));
  color: #ffffff;
  border: 1px solid rgba(156, 39, 176, 0.6);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(156, 39, 176, 1), rgba(103, 58, 183, 0.9));
    border-color: rgba(156, 39, 176, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(156, 39, 176, 0.3);
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(103, 58, 183, 0.05));

  &:hover {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(103, 58, 183, 0.15));
    border-color: rgba(156, 39, 176, 0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.2);
  }

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 0.5rem;
    object-fit: cover;
    border: 2px solid rgba(156, 39, 176, 0.4);
  }

  span {
    font-weight: 500;
    color: #ffffff;
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }

  /* Initials circle styling */
  .initials-circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin-right: 0.5rem;
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.8), rgba(103, 58, 183, 0.7));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    border: 2px solid rgba(156, 39, 176, 0.6);
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
  }
`;

const UserMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 200px;
  background: linear-gradient(135deg, rgba(16, 16, 16, 0.95), rgba(43, 14, 75, 0.9));
  border-radius: 0.5rem;
  box-shadow: 0 8px 32px rgba(156, 39, 176, 0.3);
  padding: 0.5rem 0;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 10;
  transition: all 0.3s ease;
  border: 1px solid rgba(156, 39, 176, 0.4);
  backdrop-filter: blur(20px);

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, rgba(16, 16, 16, 0.95), rgba(43, 14, 75, 0.9));
    transform: rotate(45deg);
    z-index: -1;
    border-top: 1px solid rgba(156, 39, 176, 0.4);
    border-left: 1px solid rgba(156, 39, 176, 0.4);
  }
`;

const MenuItem = styled.div`
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  position: relative;

  svg {
    font-size: 0.9rem;
    color: rgba(156, 39, 176, 0.8);
    transition: all 0.2s ease;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(103, 58, 183, 0.15));
    color: white;

    svg {
      color: rgba(156, 39, 176, 1);
      transform: scale(1.1);
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(156, 39, 176, 0.8), rgba(103, 58, 183, 0.6));
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 3px;
  }
`;

const MobileMenuFooter = styled.div`
  display: none;
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
`;

const FooterLogo = styled.img`
  width: 35px;
  height: auto;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  opacity: 0.95;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
`;

const FooterText = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
  letter-spacing: 0.3px;
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

// Helper function to get first and last name regardless of auth provider
const getNameParts = (user) => {
  if (!user?.user_metadata) return { firstName: '', lastName: '' };
  
  // Handle Google auth format
  if (user.user_metadata.name && !user.user_metadata.first_name) {
    const nameParts = user.user_metadata.name.split(' ');
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  }
  
  // Handle email auth format
  return {
    firstName: user.user_metadata.first_name || '',
    lastName: user.user_metadata.last_name || ''
  };
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Log currentUser whenever it changes for debugging
  useEffect(() => {
    console.log('Navbar currentUser:', currentUser);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-profile')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleUserMenuToggle = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Render navigation links based on auth status
  const renderNavLinks = () => {
    if (currentUser) {
      // Authenticated user links
      return (
        <>
          <NavLink to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" className={location.pathname === '/upload' ? 'active' : ''}>
            Upload
          </NavLink>
          <NavLink to="/quiz-history" className={location.pathname === '/quiz-history' ? 'active' : ''}>
            Quizzes
          </NavLink>
          <NavLink to="/review" className={location.pathname === '/review' ? 'active' : ''}>
            Review
          </NavLink>
          <NavLink to="/flashcards" className={location.pathname === '/flashcards' ? 'active' : ''}>
            Flashcards
          </NavLink>
          <NavLink to="/mnemonics" className={location.pathname === '/mnemonics' ? 'active' : ''}>
            Mnemonics
          </NavLink>
          <NavLink to="/study-planner" className={location.pathname.includes('/study-plan') ? 'active' : ''}>
            Study Planner
          </NavLink>
          <NavLink to="/chatbot" className={location.pathname === '/chatbot' ? 'active' : ''}>
          Mr. KnowHow
          </NavLink>
          {/* Removed pricing link for authenticated users */}
        </>
      );
    } else {
      // Non-authenticated user links
      return (
        <>
          <NavLink to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            About Us
          </NavLink>
          <NavLink to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>
            Pricing
          </NavLink>
          <NavLink to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>
            FAQ
          </NavLink>
        </>
      );
    }
  };

  // Render user profile section
  const renderUserProfile = () => {
    if (currentUser) {
      const { firstName, lastName } = getNameParts(currentUser);
      const displayName = getDisplayName(currentUser);
      const profilePic = currentUser.user_metadata?.avatar_url; // Get URL or undefined
      const initials = getInitials(firstName, lastName); // Use updated helper

      return (
        <UserProfile className="user-profile" onClick={handleUserMenuToggle}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" />
          ) : (
            <div className="initials-circle">{initials}</div>
          )}
          <span>{displayName}</span>
          <UserMenu isOpen={isUserMenuOpen}>
            <MenuItem onClick={() => navigate('/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/settings')}>
              <FaCog /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </MenuItem>
          </UserMenu>
        </UserProfile>
      );
    }
    return null;
  };


  const renderAuthButtons = () => {
    if (!currentUser) {
      return (
        <>
          <NavLink to="/login">Login</NavLink>
          <Button onClick={() => navigate('/signup')}>Sign Up</Button>
        </>
      );
    }
    return null;
  };

  return (
    <NavbarContainer scrolled={isScrolled}>
      <NavbarContent>
        <Logo to="/">
          <img src="/logo.png" alt="Logo" />
        </Logo>

        {/* Desktop navigation */}
        <NavLinks>
          {renderNavLinks()}
          {renderAuthButtons()}
          {renderUserProfile()}
        </NavLinks>

        {/* Mobile menu toggle - new modern hamburger */}
        <HamburgerWrapper onClick={toggleMenu}>
          <HamburgerIcon isOpen={isMenuOpen} />
        </HamburgerWrapper>

        {/* Mobile menu (only shown on small screens) */}
        <MobileNavLinks isOpen={isMenuOpen}>
          <CloseIcon onClick={toggleMenu} />

          {renderNavLinks()}
          {renderAuthButtons()}
          {renderUserProfile()}

          <MobileMenuFooter>
          </MobileMenuFooter>
        </MobileNavLinks>
      </NavbarContent>
    </NavbarContainer>
  );
};

export default Navbar;
