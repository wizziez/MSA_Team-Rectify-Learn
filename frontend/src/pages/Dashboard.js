import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaUpload, 
  FaBook, 
  FaQuestionCircle, 
  FaFileAlt,
  FaHistory,
  FaClock, 
  FaTrophy, 
  FaLightbulb, 
  FaChartLine,
  FaSearch,
  FaExclamationCircle,
  FaTrash,
  FaPlus,
  FaBrain,
  FaRocket,
  FaRegCalendarAlt,
  FaUserGraduate,
  FaChartBar,
  FaFileDownload,
  FaFilter,
  FaSort,
  FaCaretDown,
  FaInfoCircle,
  FaFilePdf,
  FaHashtag,
  FaAt,
  FaUsers,
  FaDiscord,
  FaCalendarAlt,
  FaPlay,
  FaCheck,
  FaRegClone
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../utils/apiService';
import MnemonicsButton from '../components/MnemonicsButton';
import SummaryButton from '../components/SummaryButton';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
  dark: '#36393F',
  channelHover: 'rgba(88, 101, 242, 0.3)',
  channelSelected: '#42464D',
  memberList: '#2F3136',
  chatInput: '#40444B',
  highlight: 'rgba(88, 101, 242, 0.3)'
};

// Button components defined first to avoid circular references
const PrimaryButton = styled.div`
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(var(--primary-rgb), 0.25);
  }
  
  svg {
    font-size: 1.125rem;
  }
`;

const SecondaryButton = styled.div`
  background: white;
  color: black !important;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
  }
  
  svg {
    font-size: 1.125rem;
  }
`;

// Discord layout components
const DashboardContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, ${colors.dark} 0%, ${colors.notQuiteBlack} 100%);
  position: relative;
  color: ${colors.white};
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(ellipse at top right, rgba(88, 101, 242, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at bottom left, rgba(235, 69, 158, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Sidebar = styled.div`
  width: 240px;
  background-color: ${colors.darkButNotBlack};
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  /* Discord-style scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
  
  /* Discord-style scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

// Discord-style sidebar components
const ServerHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    color: ${colors.white};
    font-size: 1rem;
    font-weight: 600;
  }
`;

const ChannelCategory = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  padding: 0 1rem;
`;

const CategoryHeader = styled.div`
  color: ${colors.greyple};
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.5rem;
    font-size: 0.75rem;
  }
`;

const ChannelList = styled.div`
  margin: 0;
  padding: 0;
`;

const Channel = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin: 0 0.5rem 0.25rem;
  border-radius: 4px;
  color: ${props => props.active ? colors.white : colors.greyple};
  background-color: ${props => props.active ? colors.channelSelected : 'transparent'};
  transition: all 0.1s;
  font-size: 0.95rem;
  font-weight: ${props => props.active ? '500' : '400'};
  
  svg {
    margin-right: 0.75rem;
    color: ${props => props.active ? colors.white : colors.greyple};
    font-size: 1rem;
  }
  
  &:hover {
    background-color: ${props => props.active ? colors.channelSelected : colors.channelHover};
    color: ${colors.white};
    
    svg {
      color: ${colors.white};
    }
  }
`;

// Discord-style stats components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(145deg, ${colors.darkButNotBlack} 0%, rgba(44, 47, 51, 0.95) 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.accentColor || colors.blurple} 0%, ${props => props.accentColor ? props.accentColor + '80' : colors.blurple + '80'} 100%);
    border-radius: 16px 16px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, ${props => props.accentColor ? props.accentColor + '10' : 'rgba(88, 101, 242, 0.1)'} 0%, transparent 50%);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  
  svg {
    width: 28px;
    height: 28px;
    padding: 8px;
    border-radius: 12px;
    margin-right: 1rem;
    color: white;
    background: linear-gradient(135deg, ${props => props.iconBg || colors.blurple} 0%, ${props => props.iconBg ? props.iconBg + 'CC' : colors.blurple + 'CC'} 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  
  span {
    color: ${colors.white};
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${colors.white};
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatChange = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.positive ? colors.green : colors.red};
  background: ${props => props.positive ? 'rgba(87, 242, 135, 0.15)' : 'rgba(237, 66, 69, 0.15)'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  
  svg {
    margin-right: 0.25rem;
  }
`;

// Discord-style welcome header
const HeaderSection = styled.div`
  margin-bottom: 2.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 2rem;
  }
`;

const WelcomeBox = styled.div`
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.95) 0%, rgba(235, 69, 158, 0.95) 50%, rgba(139, 92, 246, 0.95) 100%);
  border-radius: 24px;
  padding: 2.5rem;
  color: white;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 32px rgba(88, 101, 242, 0.3), 0 4px 16px rgba(235, 69, 158, 0.2);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(235, 69, 158, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(88, 101, 242, 0.2) 0%, transparent 50%);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    animation: shimmer 3s infinite linear;
    z-index: 1;
  }
  
  @keyframes shimmer {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.75rem;
  }
`;

const WelcomeContent = styled.div`
  position: relative;
  z-index: 2;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
  
  p {
    opacity: 0.95;
    font-size: 1.0625rem;
    max-width: 500px;
    line-height: 1.6;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`;

const TokenUsageCard = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.5rem;
  min-width: 280px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  h4 {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    
    svg {
      margin-right: 0.5rem;
      color: white !important;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
  }
`;

const UsageBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin: 0.75rem 0;
  overflow: hidden;
  position: relative;
  
  div {
    height: 100%;
    width: ${props => props.percentage || 0}%;
    background: white;
    border-radius: 4px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
  }
`;

const UsageText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  opacity: 0.9;
  color: white !important;
  
  span {
    color: white !important;
  }
  
  span:last-child {
    font-weight: 600;
    color: white !important;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  background: ${props => props.secondary ? 'rgba(255, 255, 255, 0.15)' : 'white'};
  color: ${props => props.secondary ? 'white !important' : 'var(--primary-color) !important'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid ${props => props.secondary ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  position: relative;
  overflow: hidden;
  
  /* Force text visibility for non-secondary buttons */
  &:not([secondary]) {
    color: var(--primary-color) !important;
    * {
      color: var(--primary-color) !important;
    }
  }
  
  svg {
    margin-right: 0.5rem;
    transition: transform 0.3s ease;
    color: inherit !important;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }
  
  span {
    display: flex;
    align-items: center;
    line-height: 1;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.secondary ? 
      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)' : 
      'linear-gradient(90deg, rgba(var(--primary-rgb),0) 0%, rgba(var(--primary-rgb),0.1) 50%, rgba(var(--primary-rgb),0) 100%)'};
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.secondary ? 
      '0 5px 15px rgba(255, 255, 255, 0.1)' : 
      '0 5px 15px rgba(var(--primary-rgb), 0.15)'};
    
    &::before {
      transform: translateX(100%);
    }
    
    svg {
      transform: scale(1.1);
    }
  }
`;

// Main content section styling
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.625rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    height: 4px;
    width: 40px;
    background: var(--primary-color);
    bottom: -10px;
    left: 0;
    border-radius: 4px;
  }
  
  svg {
    margin-right: 0.875rem;
    color: var(--primary-color);
    font-size: 1.25rem;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: white !important;
  margin-top: 0.5rem;
`;

const SectionActions = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ToolBar = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
    pointer-events: none;
  }
  
  input {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    font-size: 0.875rem;
    width: 220px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.3s;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    }
    
    @media (max-width: 768px) {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Enhanced content tab navigation
const ContentTabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
`;

const TabButton = styled.button`
  padding: 0.875rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: none;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'white !important'};
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-color)' : 'transparent'};
  position: relative;
  z-index: 1;
  
  &:hover {
    color: var(--primary-color);
  }
  
  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    margin-left: 0.75rem;
    background: ${props => props.active ? 'var(--primary-color)' : '#e5e7eb'};
    color: ${props => props.active ? 'white' : '#1f2937 !important'};
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.2s;
  }
`;

const Section = styled.div`
  margin-bottom: 3.5rem;
  background: rgba(44, 47, 51, 0.8);
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    padding: 1.25rem 1rem;
    margin-bottom: 2.5rem;
  }
`;

// Premium card designs
const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
`;

const DocumentCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.6);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    
    .card-actions {
      opacity: 1;
    }
  }
`;

const DocTypeHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    
    svg {
      color: white;
      font-size: 1.25rem;
    }
  }
  
  .pdf {
    background: linear-gradient(135deg, #F87171 0%, #EF4444 100%);
  }
  
  .ppt {
    background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
  }
  
  .doc {
    background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
  }
  
  .txt {
    background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%);
  }
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #1f2937 !important;
    max-width: 200px;
  }
  
  p {
    font-size: 0.75rem;
    color: #6b7280 !important;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.375rem;
      font-size: 0.675rem;
    }
  }
`;

const DocContent = styled.div`
  padding: 1.25rem 1.5rem;
  
  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    color: #6b7280 !important;
    padding-bottom: 1rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  }
  
  .date {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.375rem;
      color: #6b7280 !important;
    }
  }
  
  .size {
    font-weight: 600;
    display: flex;
    align-items: center;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    
    svg {
      margin-right: 0.375rem;
      font-size: 0.675rem;
    }
  }
`;

const DocActions = styled.div`
  display: flex;
  justify-content: space-between;
  
  button {
    flex: 1;
    padding: 0.75rem;
    background: none;
    border: none;
    color: #1f2937 !important;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin: 0 0.25rem;
    
    svg {
      margin-right: 0.375rem;
      transition: transform 0.2s;
    }
    
    &:hover {
      color: var(--primary-color);
      background: rgba(var(--primary-rgb), 0.05);
      
      svg {
        transform: scale(1.1);
      }
    }
    
    &.primary {
      color: var(--primary-color);
      font-weight: 600;
      
      &:hover {
        background: rgba(var(--primary-rgb), 0.1);
      }
    }
    
    &.danger {
      color: #DC2626;
      
      &:hover {
        background: rgba(220, 38, 38, 0.05);
      }
    }
  }
`;

const CardActions = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
  
  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    color: #1f2937 !important;
    transition: all 0.2s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      box-shadow: 0 3px 10px rgba(var(--primary-rgb), 0.2);
    }
  }
`;

const ActionMenu = styled.div`
  display: none; // Hide the menu as we're now showing direct action buttons
`;

// Define QuizActions after PrimaryButton and SecondaryButton
const QuizActions = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  padding: 1rem 1.5rem 1.5rem;
  gap: 0.75rem;
  
  .top-row {
    display: flex;
    gap: 0.75rem;
    
    ${PrimaryButton}, ${SecondaryButton} {
      flex: 1;
      height: 44px;
      justify-content: center;
      align-items: center;
      font-size: 0.875rem;
      padding: 0.6rem 1rem;
      min-width: 0;
    }
  }
  
  .bottom-row {
    display: flex;
    justify-content: center;
    
    /* Make MnemonicsButton full width in bottom row */
    a[href="/mnemonics"] {
      width: 100% !important;
      height: 44px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0.6rem 1rem !important;
      font-size: 0.875rem !important;
    }
  }
`;

// Enhanced quiz cards
const QuizCard = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-radius: 20px 20px 0 0;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: rgba(var(--primary-rgb), 0.3);
  }
`;

const QuizDifficultyBadge = styled.div`
  position: absolute;
  right: 1.25rem;
  top: 1.25rem;
  background: ${props => {
    if (props.level === 'easy') return 'rgba(16, 185, 129, 0.85)';
    if (props.level === 'medium') return 'rgba(245, 158, 11, 0.85)';
    if (props.level === 'hard') return 'rgba(239, 68, 68, 0.85)';
    return 'rgba(107, 114, 128, 0.85)';
  }};
  backdrop-filter: blur(5px);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 1;
  
  svg {
    margin-right: 0.375rem;
    font-size: 0.675rem;
  }
`;

const QuizCardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const QuizInfo = styled.div`
  flex: 1;
  padding: 0.5rem 0;
`;

const QuizTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937 !important;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const QuizMeta = styled.div`
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  color: #6b7280 !important;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  
  span {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: #6b7280 !important;
    }
  }
`;

const MasteryScore = styled.span`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: var(--primary-color) !important;
  background: rgba(99, 102, 241, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  
  svg {
    margin-right: 0.25rem;
    color: var(--primary-color) !important;
  }
`;

const QuizProgress = styled.div`
  margin-top: auto;
  
  span {
    display: block;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: #6b7280 !important;
    font-weight: 600;
  }
`;

// Enhanced empty state
const EmptyState = styled.div`
  text-align: center;
  padding: 3.5rem 2rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.6);
  
  svg {
    height: 4rem;
    width: 4rem;
    color: var(--primary-color) !important;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: #1f2937 !important;
  }
  
  p {
    color: #4b5563 !important;
    max-width: 500px;
    margin: 0 auto 2rem;
    font-size: 1.125rem;
  }
`;

// Enhanced alert component
const Alert = styled.div`
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  background-color: ${props => props.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.success ? '#065F46' : '#991B1B'};
  border: 1px solid ${props => props.success ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'};
  box-shadow: 0 4px 10px ${props => props.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  position: relative;
  overflow: hidden;
  font-weight: 500;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.success ? '#10B981' : '#EF4444'};
  }
  
  svg {
    margin-right: 1rem;
    flex-shrink: 0;
    font-size: 1.25rem;
  }
`;

// Enhanced loading spinner
const Spinner = styled.div`
  width: ${props => props.size || '3rem'};
  height: ${props => props.size || '3rem'};
  border: 3px solid rgba(var(--primary-rgb), 0.15);
  border-left-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${props => props.margin || '2rem auto'};
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  
  p {
    margin-top: 1.5rem;
    color: ${colors.white};
    font-size: 1.125rem;
    font-weight: 500;
  }
`;

const RecallBanner = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    
    div {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      
      a {
        width: 100%;
        margin-right: 0 !important;
      }
    }
  }
`;

const RecallInfo = styled.div`
  h3 {
    font-size: 1.375rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: white;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    max-width: 500px;
    font-size: 1.0625rem;
    line-height: 1.5;
  }
`;

const ViewHistoryLink = styled.div`
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const QuizzesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.75rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProgressBar = styled.div`
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  div {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

// Add these new styled components after other styled components
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedCard = styled.div`
  transition: all 0.2s ease;
  
  &.item-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  &.item-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }
  
  &.item-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  &.item-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 300ms, transform 300ms;
  }
  
  ${props => props.isDeleting && css`
    animation: ${fadeOut} 0.3s ease forwards;
  `}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  -webkit-tap-highlight-color: transparent; /* Removes the tap highlight on mobile */
  
  ${props => props.isOpen && css`
    opacity: 1;
    visibility: visible;
  `}
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  opacity: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  
  ${props => props.isOpen && css`
    transform: scale(1);
    opacity: 1;
  `}
  
  h3 {
    color: white !important;
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }
  
  p {
    color: white !important;
    margin-bottom: 1.5rem;
    word-break: break-word; /* Ensure text breaks properly on small screens */
  }
  
  @media (max-width: 768px) {
    width: calc(100% - 32px);
    padding: 1.5rem;
    margin: 0 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    
    h3 {
      font-size: 1.125rem;
    }
    
    p {
      font-size: 0.9375rem;
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &.cancel {
    background: white;
    color: black !important;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
    }
  }
  
  &.delete {
    background: #EF4444;
    color: white;
    border: none;
    
    &:hover {
      background: #DC2626;
      box-shadow: 0 4px 10px rgba(220, 38, 38, 0.2);
    }
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.875rem;
  }
`;

const SuccessToast = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(16, 185, 129, 0.95);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;
  
  svg {
    margin-right: 0.75rem;
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    left: 20px;
    width: auto;
  }
`;

// Add DeleteButton styled component after RecallBanner
const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(237, 66, 69, 0.9);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0.8;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgb(237, 66, 69);
    transform: scale(1.1);
  }
`;

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [generatingQuizFor, setGeneratingQuizFor] = useState(null);
  const [tokenUsage, setTokenUsage] = useState(null);
  const [studyStreak, setStudyStreak] = useState({
    days: 0,
    previousWeek: 0,
    isLoading: false,
    error: null
  });
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalQuizzes: 0,
    completedQuizzes: 0,
    avgScore: 0
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [deletingQuizId, setDeletingQuizId] = useState(null);

  const handleGenerateQuiz = async (documentId, documentName) => {
    try {
      setError('');
      setGeneratingQuizFor(documentId);
      setSuccessMessage('');
      
      // Use the correct API call with the exact parameters expected by the backend
      const response = await apiService.generateQuiz(documentId, 'easy', 30);
      
      if (response && response.status === "processing") {
        setSuccessMessage(response.message || "Quiz generation has started. Please check back in a few moments.");
      } else {
        console.log(`Generated quiz for document ${documentId} with easy difficulty`);
        setSuccessMessage(`Quiz generated successfully for "${documentName}"`);
      }
      
      // Try to fetch the generated quizzes
      try {
        const quizzesResponse = await apiService.getDocumentQuizzes(documentId);
        if (quizzesResponse.data && quizzesResponse.data.length > 0) {
          updateQuizzesList(documentId, documentName, quizzesResponse.data.length);
        }
      } catch (checkError) {
        console.log('No quizzes available yet, they are still being generated');
        // Add the document to quizzes list anyway so the user can check later
        updateQuizzesList(documentId, documentName, 30);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      
      if (error.message === 'Authentication required' || 
          error.message === 'Your session has expired. Please log in again.') {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }
      
      const errorInfo = apiService.handleApiError(error);
      setError(`Failed to generate quiz: ${errorInfo.detail || errorInfo.message}`);
    } finally {
      setGeneratingQuizFor(null);
      
      // Clear success message after some time
      if (successMessage) {
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    }
  };

  const updateQuizzesList = (documentId, documentName, questionCount) => {
    const newQuiz = {
      id: documentId,
      title: documentName,
      source: documentName,
      date: new Date().toISOString(),
      difficulty: 'medium',
      questions: questionCount || 5,
      image: getRandomImageForQuiz(documents.find(doc => doc.id === documentId)?.file_type || 'pdf'),
      file_type: documents.find(doc => doc.id === documentId)?.file_type || 'pdf'
    };
    
    setQuizzes(prev => {
      const existingIndex = prev.findIndex(quiz => quiz.id === documentId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newQuiz };
        return updated;
      } else {
        return [...prev, newQuiz];
      }
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalQuizzes: prev.totalQuizzes + 1
    }));
  };
  
  const userName = currentUser?.name || 
    `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 
    'User';
  
  const filteredDocuments = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('rectifyToken');
      if (!token) {
        console.log('No authentication token found in Dashboard. User may need to log in again.');
        setError('Authentication error: Please log in again to view your dashboard.');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch all data in parallel using Promise.all to reduce loading time
        const [docsResponse, tokenUsageResponse] = await Promise.all([
          apiService.getDocuments(),
          apiService.getTokenUsage().catch(error => {
            console.error('Error fetching token usage:', error);
            return null; // Return null if token usage fails, but don't stop other requests
          })
        ]);
        
        console.log('Documents response:', docsResponse.data);
        const docs = docsResponse.data || [];
        setDocuments(docs);
        
        // Instead of fetching quizzes one by one (which is slow),
        // fetch all quizzes in parallel
        const quizzesPromises = docs.map(doc => 
          apiService.getDocumentQuizzes(doc.id)
            .then(response => ({
              docId: doc.id,
              docName: doc.filename,
              docType: doc.file_type,
              docDate: doc.upload_date,
              docMasteryScore: doc.document_mastery_score,
              quizzes: response.data
            }))
            .catch(error => ({
              docId: doc.id, 
              docName: doc.filename,
              docType: doc.file_type,
              docDate: doc.upload_date,
              docMasteryScore: doc.document_mastery_score,
              quizzes: []
            }))
        );
        
        const quizzesResults = await Promise.all(quizzesPromises);
        
        // Process quiz results
        const fetchedQuizzes = quizzesResults.map(result => ({
          id: result.docId,
          title: result.docName,
          source: result.docName,
          date: result.docDate,
          difficulty: 'medium',
          questions: result.quizzes?.length || 0,
          image: getRandomImageForQuiz(result.docType),
          progress: Math.floor(Math.random() * 100), // Example progress - replace with actual data
          file_type: result.docType,
          document_mastery_score: result.docMasteryScore
        }));
        
        console.log('Setting quizzes to:', fetchedQuizzes);
        setQuizzes(fetchedQuizzes);
        
        // Set token usage
        if (tokenUsageResponse) {
          setTokenUsage({
            used: tokenUsageResponse.tokens_used,
            total: tokenUsageResponse.max_tokens,
            remaining: tokenUsageResponse.remaining_tokens,
            lastReset: tokenUsageResponse.last_reset
          });
        }
        
        // Set stats
        setStats({
          totalDocuments: docs.length,
          totalQuizzes: fetchedQuizzes.length,
          completedQuizzes: Math.floor(fetchedQuizzes.length * 0.6), // Example - replace with actual data
          avgScore: fetchedQuizzes.length > 0 ? 78 : 0 // Example - replace with actual data
        });
        
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorInfo = apiService.handleApiError(err);
        
        if (err.response && err.response.status === 403) {
          setError('Authentication error: Your session may have expired. Please log in again.');
        } else {
          setError(`Failed to load data: ${errorInfo.detail || errorInfo.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Add effect to fetch and update study streak when dashboard loads
  useEffect(() => {
    const fetchStudyStreak = async () => {
      setStudyStreak(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Try to fetch study streak from API (Disabled)
        // const streakData = await apiService.getStudyStreak();
        
        // if (streakData && streakData.days !== undefined) { // Original condition - streakData is no longer defined here
        if (false) { // Temporarily disable this block as getStudyStreak is commented out
          /* // Usage of streakData commented out due to its declaration being commented out
          setStudyStreak({
            days: streakData.days, 
            previousWeek: streakData.previous_week || streakData.previousWeek || 0, 
            isLoading: false,
            error: null
          });
          */
        } else {
          // If API returns incomplete data, calculate from quiz history
          const quizHistory = await apiService.getQuizAttempts();
          
          if (quizHistory && quizHistory.data) {
            // Update study streak based on quiz history (Disabled)
            // await apiService.updateStudyStreak(quizHistory.data);
            
            // Fetch the updated streak (Disabled)
            // const updatedStreakData = await apiService.getStudyStreak();
            
            // Use fallback calculation since API calls are disabled
            const calculatedStreak = apiService.calculateStreak 
              ? apiService.calculateStreak(quizHistory.data) 
              : 0;

            setStudyStreak({
              days: calculatedStreak, // Use calculated streak
              previousWeek: 0, // No previous week data available
              isLoading: false,
              error: 'Study streak API calls are currently disabled.'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching study streak:', error);
        
        // Fallback to local calculation in case of API errors
        try {
          const quizHistory = await apiService.getQuizAttempts();
          const calculatedStreak = apiService.calculateStreak 
            ? apiService.calculateStreak(quizHistory.data) 
            : 0;
            
          setStudyStreak({
            days: calculatedStreak,
            previousWeek: 0, // We don't have previous week data locally
            isLoading: false,
            error: 'Couldn\'t connect to server, showing locally calculated streak'
          });
        } catch (fallbackError) {
          setStudyStreak({
            days: 0,
            previousWeek: 0,
            isLoading: false,
            error: 'Failed to calculate study streak'
          });
        }
      }
    };
    
    fetchStudyStreak();
    
    // Update study streak when user takes a quiz - simulating real-time updates
    const updateStreak = () => {
      // Record activity for today to update the streak
      const today = new Date().toISOString().split('T')[0];
      const activityRecord = {
        date: today,
        type: 'dashboard_view',
        duration: 0
      };
      
      // Store locally
      const storedActivities = localStorage.getItem('studyActivities');
      const activities = storedActivities ? JSON.parse(storedActivities) : [];
      
      // Only add if not already recorded today
      if (!activities.some(a => a.date === today)) {
        activities.push(activityRecord);
        localStorage.setItem('studyActivities', JSON.stringify(activities));
        console.log('Study streak update skipped (API disabled). Activities:', activities);
      }
    };
    
    // Call immediately to record this session
    updateStreak();
    
    // Set up an interval to regularly check for streak updates
    const streakInterval = setInterval(updateStreak, 60000 * 30); // Check every 30 minutes
    
    return () => clearInterval(streakInterval);
  }, []);
  
  const getRandomImageForQuiz = (fileType) => {
    const imagesByType = {
      pdf: [
        'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      ],
      ppt: [
        'https://images.unsplash.com/photo-1636466497217-26a5867c6979?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      ],
      doc: [
        'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      ]
    };
    
    const relevantImages = imagesByType[fileType] || [
      'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2010&q=80'
    ];
    
    const randomIndex = Math.floor(Math.random() * relevantImages.length);
    return relevantImages[randomIndex];
  };
  
  const handleDeleteDocument = async (docId) => {
    try {
      await apiService.deleteDocument(docId);
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      setQuizzes(prev => prev.filter(quiz => quiz.id !== docId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalDocuments: prev.totalDocuments - 1,
        totalQuizzes: prev.totalQuizzes - (quizzes.some(q => q.id === docId) ? 1 : 0)
      }));
      
      setSuccessMessage("Document successfully deleted");
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    }
  };
  
  // Get document icon based on file type
  const getDocumentIcon = (fileType) => {
    switch(fileType) {
      case 'pdf':
        return <FaFilePdf />;
      case 'ppt':
      case 'pptx':
        return <FaFileDownload />;
      case 'doc':
      case 'docx':
        return <FaFileAlt />;
      default:
        return <FaFileAlt />;
    }
  };

  // Update handleDeleteQuiz function
  const handleDeleteQuiz = async (quizId) => {
    try {
      setDeletingQuizId(quizId);
      
      // Add a shorter delay to allow animation to complete
      setTimeout(async () => {
        console.log(`Deleting quiz with ID: ${quizId}`);
        await apiService.deleteQuiz(quizId);
        
        setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
        
        // Also filter out documents if this quiz was associated with a document
        setDocuments(prev => prev.filter(doc => doc.id !== quizId));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalQuizzes: prev.totalQuizzes - 1,
          totalDocuments: prev.totalDocuments - (documents.some(d => d.id === quizId) ? 1 : 0)
        }));
        
        setSuccessMessage("Quiz successfully deleted");
        setDeletingQuizId(null);
        
        // Clear success message after a timeout
        setTimeout(() => setSuccessMessage(""), 3000);
      }, 300); // Shorter delay to match faster animation
      
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError(`Failed to delete quiz: ${err.message || 'Unknown error'}`);
      setDeletingQuizId(null);
      
      // Clear error message after a timeout
      setTimeout(() => setError(""), 5000);
    }
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <Content>
          <LoadingState>
            <Spinner />
            <p>Loading your learning materials...</p>
          </LoadingState>
        </Content>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer className="dashboard-container">
      <Content>
        <HeaderSection>
          <WelcomeBox>
            <WelcomeContent>
              <h1>Welcome back, {userName}!</h1>
              <p>Track your learning progress and start quizzes to enhance your knowledge</p>
            </WelcomeContent>
            
            {/* Always show token usage section for debugging */}
            <TokenUsageCard>
              <h4>
                <FaBrain />
                AI Token Usage
              </h4>
              {tokenUsage ? (
                <>
                  <UsageBar percentage={(tokenUsage.used / tokenUsage.total) * 100}>
                    <div></div>
                  </UsageBar>
                  <UsageText>
                    <span>{tokenUsage.used} used</span>
                    <span>{tokenUsage.total - tokenUsage.used} remaining</span>
                  </UsageText>
                </>
              ) : (
                <UsageText>
                  <span>Loading token usage...</span>
                </UsageText>
              )}
            </TokenUsageCard>
          </WelcomeBox>
          
          <StatsGrid>
            <StatCard accentColor="#3B82F6">
              <StatHeader iconBg="#3B82F6" iconRgb="59, 130, 246">
                <FaFileAlt />
                <span>Total Documents</span>
              </StatHeader>
              <StatValue>{stats.totalDocuments}</StatValue>
            </StatCard>
            
            <StatCard accentColor="#10B981">
              <StatHeader iconBg="#10B981" iconRgb="16, 185, 129">
                <FaBook />
                <span>Total Quizzes</span>
              </StatHeader>
              <StatValue>{stats.totalQuizzes}</StatValue>
            </StatCard>
            
            <StatCard accentColor="#F59E0B">
              <StatHeader iconBg="#F59E0B" iconRgb="245, 158, 11">
                <FaTrophy />
                <span>Average Score</span>
              </StatHeader>
              <StatValue>{stats.avgScore}%</StatValue>
            </StatCard>
            
            <StatCard accentColor="#8B5CF6">
              <StatHeader iconBg="#8B5CF6" iconRgb="139, 92, 246">
                <FaUserGraduate />
                <span>Study Streak</span>
              </StatHeader>
              {studyStreak.isLoading ? (
                <Spinner size="1.5rem" margin="0.5rem 0" />
              ) : (
                <>
                  <StatValue>{studyStreak.days} day{studyStreak.days !== 1 ? 's' : ''}</StatValue>
                  {studyStreak.previousWeek !== undefined && (
                    <StatChange positive={studyStreak.days >= studyStreak.previousWeek}>
                      <FaChartLine /> 
                      {studyStreak.days > studyStreak.previousWeek 
                        ? `+${studyStreak.days - studyStreak.previousWeek} from last week`
                        : studyStreak.days < studyStreak.previousWeek
                          ? `-${studyStreak.previousWeek - studyStreak.days} from last week`
                          : 'Same as last week'}
                    </StatChange>
                  )}
                </>
              )}
            </StatCard>
          </StatsGrid>
        </HeaderSection>
        
        {error && (
          <Alert>
            <FaExclamationCircle />
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <SuccessToast>
            <FaCheck />
            {successMessage}
          </SuccessToast>
        )}
        
        <Section>
          <SectionHeader>
            <SectionTitle>
              <FaBook />
              Learning Materials
            </SectionTitle>
            
            <ToolBar>
              <SearchInput>
                <FaSearch />
                <input 
                  type="text" 
                  placeholder="Search quizzes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchInput>
            </ToolBar>
          </SectionHeader>
          
          <>
            {documents.length === 0 ? (
              <EmptyState>
                <FaFileAlt />
                <h3>No materials uploaded yet</h3>
                <p>Upload documents to generate quizzes and start learning</p>
                <ActionButton 
                  to="/upload" 
                  className="action-button"
                  style={{ color: 'var(--primary-color)' }}
                >
                  <FaPlus style={{ color: 'var(--primary-color)' }} />
                  <span style={{ color: 'var(--primary-color)' }}>Upload New Material</span>
                </ActionButton>
              </EmptyState>
            ) : filteredQuizzes.length > 0 ? (
              <TransitionGroup component={QuizzesGrid}>
                {filteredQuizzes.map((quiz, index) => (
                  <CSSTransition key={quiz.id || index} timeout={300} classNames="item">
                    <AnimatedCard isDeleting={deletingQuizId === quiz.id}>
                      <QuizCard>
                        <DeleteButton 
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          title={quiz.questions > 0 ? "Delete Quiz" : "Delete Document"}
                        >
                          <FaTrash size={14} />
                        </DeleteButton>
                        <QuizCardContent>
                          <QuizInfo>
                            <QuizTitle>{quiz.title}</QuizTitle>
                            <QuizMeta>
                              <span>
                                <FaQuestionCircle />
                                {quiz.questions} questions
                              </span>
                              <span>
                                <FaCalendarAlt />
                                {new Date(quiz.date).toLocaleDateString()}
                              </span>
                              {quiz.document_mastery_score !== undefined && quiz.document_mastery_score !== null && (
                                <MasteryScore>
                                  <FaTrophy />
                                  Mastery: {(parseFloat(quiz.document_mastery_score) * 100).toFixed(0)}%
                                </MasteryScore>
                              )}
                              <SummaryButton 
                                documentId={quiz.id} 
                                documentTitle={quiz.title}
                              />
                            </QuizMeta>
                          </QuizInfo>
                        </QuizCardContent>
                        
                        <QuizActions>
                          <div className="top-row">
                            {quiz.questions > 0 ? (
                              <PrimaryButton as={Link} to={`/quiz/${quiz.id}`}>
                                Start Quiz
                              </PrimaryButton>
                            ) : (
                              <PrimaryButton 
                                as="button" 
                                onClick={() => handleGenerateQuiz(quiz.id, quiz.title)}
                                disabled={generatingQuizFor === quiz.id}
                              >
                                {generatingQuizFor === quiz.id ? (
                                  <>
                                    <Spinner size="14px" margin="0 6px 0 0" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    Generate Quiz
                                  </>
                                )}
                              </PrimaryButton>
                            )}
                            
                            <SecondaryButton as={Link} to="/flashcards">
                              Flashcards
                            </SecondaryButton>
                          </div>
                          
                          <div className="bottom-row">
                            <MnemonicsButton documentId={quiz.id} />
                          </div>
                        </QuizActions>
                      </QuizCard>
                    </AnimatedCard>
                  </CSSTransition>
                ))}
              </TransitionGroup>
            ) : (
              <EmptyState>
                <FaBook />
                <h3>No quizzes generated yet</h3>
                <p>Upload documents and generate quizzes to start learning</p>
                <ActionButton 
                  to="/upload" 
                  className="action-button"
                  style={{ color: 'var(--primary-color)' }}
                >
                  <FaPlus style={{ color: 'var(--primary-color)' }} />
                  <span style={{ color: 'var(--primary-color)' }}>Upload New Material</span>
                </ActionButton>
              </EmptyState>
            )}
          </>
        </Section>
      </Content>
    </DashboardContainer>
  );
};

export default Dashboard;
