import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaUpload, 
  FaCloudUploadAlt, 
  FaFile, 
  FaFileAlt, 
  FaFilePdf, 
  FaFilePowerpoint, 
  FaFileWord, 
  FaFileExcel,
  FaTrash,
  FaCog,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFeather, // Easy icon
  FaGraduationCap, // Medium icon
  FaChess, // Hard icon
  FaInfoCircle,
  FaArrowRight,
  FaImage,
  FaExclamationTriangle,
  FaTimes,
  FaDiscord,
  FaHashtag,
  FaQuestionCircle
} from 'react-icons/fa';
import apiService from '../utils/apiService';

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
  channelHover: '#3C3F45',
  channelSelected: '#42464D',
  memberList: '#2F3136',
  chatInput: '#40444B',
  highlight: 'rgba(88, 101, 242, 0.3)'
};

// Modern container with enhanced Discord styling
const UploadContainer = styled.div`
  padding: 2rem 0;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, ${colors.dark} 0%, ${colors.notQuiteBlack} 100%);
  color: ${colors.white};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(88, 101, 242, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(235, 69, 158, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 1;
    
    @media (max-width: 768px) {
      padding: 0 1rem;
    }
  }
`;

// Enhanced Discord-style page header with animation
const PageHeader = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(88, 101, 242, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }
  
  h1 {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, ${colors.blurple} 0%, ${colors.fuchsia} 50%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    display: inline-block;
    animation: fadeInUp 1s ease-out;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 768px) {
      font-size: 2.25rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 1.25rem;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.7;
    animation: fadeInUp 1.4s ease-out;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
  
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

// Enhanced Discord-style card
const Card = styled.div`
  background: linear-gradient(145deg, ${colors.darkButNotBlack} 0%, rgba(44, 47, 51, 0.98) 100%);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
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
    background: linear-gradient(90deg, ${colors.blurple} 0%, ${colors.fuchsia} 100%);
    border-radius: 20px 20px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, rgba(88, 101, 242, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
  }
  
  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
    color: ${colors.white};
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
    
    svg {
      margin-right: 1rem;
      color: ${colors.blurple};
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.125rem;
    margin-bottom: 1.75rem;
    line-height: 1.7;
    position: relative;
    z-index: 1;
    
    @media (max-width: 480px) {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
  }
`;

// Enhanced Discord-style upload area
const UploadArea = styled.div`
  border: 3px dashed ${props => props.isDragging ? colors.blurple : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: ${props => props.isDragging ? 
    'linear-gradient(135deg, rgba(88, 101, 242, 0.15) 0%, rgba(235, 69, 158, 0.1) 100%)' : 
    'linear-gradient(135deg, rgba(35, 39, 42, 0.95) 0%, rgba(35, 39, 42, 0.8) 100%)'};
  position: relative;
  overflow: hidden;
  display: ${props => props.visible ? 'block' : 'none'};
  box-shadow: ${props => props.isDragging ? 
    '0 8px 32px rgba(88, 101, 242, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)' : 
    '0 4px 16px rgba(0, 0, 0, 0.1)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(88, 101, 242, 0.05) 0%, transparent 60%);
    opacity: ${props => props.isDragging ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
  
  &:hover {
    border-color: ${colors.blurple};
    background: linear-gradient(135deg, rgba(88, 101, 242, 0.15) 0%, rgba(235, 69, 158, 0.1) 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(88, 101, 242, 0.15), 0 6px 20px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
`;

// Enhanced animated Discord-style upload icon
const UploadIcon = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(88, 101, 242, 0.2) 0%, rgba(235, 69, 158, 0.15) 100%);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: pulse 3s infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, ${colors.blurple}, ${colors.fuchsia});
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: scale(1.1);
    
    &::before {
      opacity: 0.3;
    }
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
  }
  
  svg {
    font-size: 3rem;
    color: ${colors.blurple};
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    z-index: 1;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }
  
  @keyframes pulse {
    0% { 
      transform: scale(1); 
      box-shadow: 0 0 0 0 rgba(88, 101, 242, 0.4); 
    }
    70% { 
      transform: scale(1.05); 
      box-shadow: 0 0 0 20px rgba(88, 101, 242, 0); 
    }
    100% { 
      transform: scale(1); 
      box-shadow: 0 0 0 0 rgba(88, 101, 242, 0); 
    }
  }
`;

// Enhanced upload text
const UploadText = styled.div`
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${colors.white};
    
    @media (max-width: 768px) {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
  
  p {
    color: white !important;
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }
  }
  
  .file-types {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8) !important;
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
`;

// Discord button with gradient
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.small ? '0.75rem 1.25rem' : '0.875rem 1.5rem'};
  background: ${props => props.secondary ? 'transparent' : colors.blurple};
  color: ${props => props.secondary ? colors.greyple : colors.white};
  border: ${props => props.secondary ? `1px solid ${colors.greyple}` : 'none'};
  border-radius: 4px;
  font-weight: 600;
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: ${props => props.small ? '0.6rem 1rem' : '0.75rem 1.25rem'};
    font-size: ${props => props.small ? '0.8rem' : '0.9rem'};
  }
  
  @media (max-width: 480px) {
    width: ${props => props.fullWidthMobile ? '100%' : 'auto'};
  }
  
  &:hover {
    background: ${props => props.secondary ? 'rgba(255, 255, 255, 0.05)' : '#4752c4'};
    border-color: ${props => props.secondary ? colors.white : 'transparent'};
    color: ${props => props.secondary ? colors.white : colors.white};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: ${props => props.secondary ? 'transparent' : 'rgba(88, 101, 242, 0.5)'};
    color: ${props => props.secondary ? colors.greyple : 'rgba(255, 255, 255, 0.7)'};
    cursor: not-allowed;
    border-color: ${props => props.secondary ? 'rgba(153, 170, 181, 0.5)' : 'transparent'};
    transform: none;
  }
  
  svg {
    margin-${props => props.iconRight ? 'left' : 'right'}: 0.5rem;
    font-size: 1rem;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover:after {
    opacity: 1;
  }
`;

// Hidden input for file selection
const HiddenInput = styled.input`
  display: none;
`;

// Discord-style steps progress component
const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  position: relative;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  &:before {
    content: '';
    position: absolute;
    top: 24px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    &:before {
      top: 18px;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.5rem;
    
    &:before {
      display: none;
    }
  }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  flex: 1;
  
  @media (max-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.active ? colors.blurple : props.completed ? colors.green : colors.darkButNotBlack};
  border: 2px solid ${props => props.active ? colors.blurple : props.completed ? colors.green : 'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: ${colors.white};
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
  
  svg {
    font-size: 1.25rem;
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    
    svg {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0;
  }
`;

const StepLabel = styled.div`
  text-align: center;
  
  h4 {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: ${props => props.active ? colors.white : props.completed ? colors.green : colors.greyple};
    transition: all 0.3s ease;
  }
  
  p {
    font-size: 0.875rem;
    color: white !important;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    h4 {
      font-size: 0.9rem;
    }
    
    p {
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    text-align: left;
  }
`;

// File grid with masonry layout effect
const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Enhanced file card with hover effects
const FileCard = styled.div`
  background: ${colors.notQuiteBlack};
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    
    .card-actions {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    &:hover {
      transform: none;
    }
    
    .card-actions {
      opacity: 1;
    }
  }
`;

// Colorful file header based on file type
const FileHeader = styled.div`
  padding: 1rem;
  background: ${props => {
    switch(props.fileType) {
      case 'pdf': return 'rgba(237, 66, 69, 0.1)';
      case 'doc': case 'docx': return 'rgba(88, 101, 242, 0.1)';
      case 'ppt': case 'pptx': return 'rgba(254, 231, 92, 0.1)';
      case 'xls': case 'xlsx': return 'rgba(87, 242, 135, 0.1)';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'rgba(235, 69, 158, 0.1)';
      default: return 'rgba(153, 170, 181, 0.1)';
    }
  }};
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.25rem;
  background: ${props => {
    switch(props.fileType) {
      case 'pdf': return 'rgba(237, 66, 69, 0.2)';
      case 'doc': case 'docx': return 'rgba(88, 101, 242, 0.2)';
      case 'ppt': case 'pptx': return 'rgba(254, 231, 92, 0.2)';
      case 'xls': case 'xlsx': return 'rgba(87, 242, 135, 0.2)';
      case 'jpg': case 'jpeg': case 'png': case 'gif': return 'rgba(235, 69, 158, 0.2)';
      default: return 'rgba(153, 170, 181, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.fileType) {
      case 'pdf': return colors.red;
      case 'doc': case 'docx': return colors.blurple;
      case 'ppt': case 'pptx': return colors.yellow;
      case 'xls': case 'xlsx': return colors.green;
      case 'jpg': case 'jpeg': case 'png': case 'gif': return colors.fuchsia;
      default: return colors.greyple;
    }
  }};
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    margin-right: 0.75rem;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
    color: ${colors.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
  
  span {
    font-size: 0.875rem;
    color: ${colors.greyple};
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
`;

// File body with clean design
const FileBody = styled.div`
  padding: 1rem;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

// Modern progress bar with animation
const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  
  div {
    height: 100%;
    width: ${props => props.progress}%;
    background: ${colors.blurple};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

// Status indicators with icons
const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => {
    if (props.complete) return colors.green;
    if (props.error) return colors.red;
    if (props.uploading) return colors.blurple;
    return colors.greyple;
  }};
  margin-bottom: 0.75rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

// File actions with hover animation
const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0.7;
  transition: all 0.2s ease;
  
  @media (max-width: 480px) {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: ${colors.greyple};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(237, 66, 69, 0.1);
    color: ${colors.red};
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
`;

// Difficulty selector with modern design
const DifficultySelector = styled.div`
  margin-top: 1rem;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const DifficultyButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Enhanced difficulty button with visual indicators and better interaction
const DifficultyButton = styled.button`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 1rem;
  background: ${props => props.selected ? 
    props.level === 'easy' ? 'rgba(87, 242, 135, 0.15)' : 
    props.level === 'medium' ? 'rgba(254, 231, 92, 0.15)' : 
    'rgba(237, 66, 69, 0.15)' : 
    colors.notQuiteBlack
  };
  border: 2px solid ${props => props.selected ? 
    props.level === 'easy' ? colors.green : 
    props.level === 'medium' ? colors.yellow : 
    colors.red : 
    'rgba(255, 255, 255, 0.05)'
  };
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.selected ? 
    props.level === 'easy' ? colors.green : 
    props.level === 'medium' ? colors.yellow : 
    colors.red : 
    colors.greyple
  };
  
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 12px;
    background: ${props => props.selected ? 
      props.level === 'easy' ? 'linear-gradient(135deg, rgba(87, 242, 135, 0.4) 0%, transparent 50%)' : 
      props.level === 'medium' ? 'linear-gradient(135deg, rgba(254, 231, 92, 0.4) 0%, transparent 50%)' : 
      'linear-gradient(135deg, rgba(237, 66, 69, 0.4) 0%, transparent 50%)' : 
      'transparent'
    };
    opacity: ${props => props.selected ? 1 : 0};
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  .difficulty-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .difficulty-label {
    font-weight: 700;
    transition: transform 0.2s ease;
  }
  
  .difficulty-description {
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: ${colors.greyple};
    font-weight: normal;
    opacity: ${props => props.selected ? 1 : 0.7};
    max-width: 100%;
    text-align: center;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => 
      props.level === 'easy' ? 'rgba(87, 242, 135, 0.15)' : 
      props.level === 'medium' ? 'rgba(254, 231, 92, 0.15)' : 
      'rgba(237, 66, 69, 0.15)'
    };
    color: ${props => 
      props.level === 'easy' ? colors.green : 
      props.level === 'medium' ? colors.yellow : 
      colors.red
    };
    border-color: ${props => 
      props.level === 'easy' ? colors.green : 
      props.level === 'medium' ? colors.yellow : 
      colors.red
    };
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    
    .difficulty-icon {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  ${props => props.selected && `
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  `}
  
  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
    font-size: 0.95rem;
    
    .difficulty-icon {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }
    
    .difficulty-description {
      font-size: 0.75rem;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    padding: 0.75rem;
    
    .difficulty-icon {
      margin-bottom: 0;
      margin-right: 0.75rem;
      font-size: 1.5rem;
    }
    
    .difficulty-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .difficulty-description {
      text-align: left;
      margin-top: 0.25rem;
      max-width: 100%;
      font-size: 0.7rem;
    }
    
    ${props => props.selected && `
      transform: translateY(0) scale(1.01);
    `}
  }
`;

// Modern tooltip component
const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  
  .tooltip-text {
    visibility: hidden;
    width: 200px;
    background-color: ${colors.darkButNotBlack};
    color: ${colors.white};
    text-align: center;
    padding: 0.5rem;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.8rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    &:after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: ${colors.darkButNotBlack} transparent transparent transparent;
    }
  }
  
  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

// Loading spinner animation
const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(88, 101, 242, 0.3);
  border-top: 2px solid ${colors.blurple};
  border-radius: 50%;
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Alert component with icon
const Alert = styled.div`
  display: flex;
  align-items: flex-start;
  background: ${props => props.success ? 'rgba(87, 242, 135, 0.1)' : 'rgba(237, 66, 69, 0.1)'};
  color: ${props => props.success ? colors.green : colors.red};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-left: 3px solid ${props => props.success ? colors.green : colors.red};
  position: relative;
  
  svg {
    margin-right: 0.75rem;
    font-size: 1.25rem;
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
  
  div {
    flex: 1;
    
    h4 {
      font-weight: 600;
      margin-bottom: 0.25rem;
      color: white !important;
    }
    
    p {
      color: ${props => props.success ? 'rgba(87, 242, 135, 0.8)' : 'rgba(237, 66, 69, 0.8)'};
      margin: 0;
      font-size: 0.9rem;
    }
  }
  
  button {
    background: none;
    border: none;
    color: ${props => props.success ? colors.green : colors.red};
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    
    svg {
      font-size: 1rem;
    }
    
    div {
      h4 {
        font-size: 0.9rem;
      }
      
      p {
        font-size: 0.8rem;
      }
    }
  }
`;

// Token usage card
const TokenCard = styled.div`
  background: ${colors.notQuiteBlack};
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${colors.white};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: ${colors.blurple};
    }
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    
    h3 {
      font-size: 1rem;
    }
  }
`;

const TokenProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
  
  div {
    height: 100%;
    width: ${props => props.percentage || 0}%;
    background: linear-gradient(to right, ${colors.blurple}, ${colors.fuchsia});
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const TokenStats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${colors.greyple};
  
  span {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
      color: ${colors.green};
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Empty state with illustration
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  
  .icon-container {
    width: 120px;
    height: 120px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(var(--primary-rgb), 0.1);
    animation: pulse 2s infinite;
  }
  
  svg {
    font-size: 3rem;
    color: var(--primary-color);
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white !important;
  }
  
  p {
    color: white !important;
    max-width: 500px;
    margin: 0 auto 2rem;
    line-height: 1.6;
  }
`;

// Footer actions container
const FooterActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    
    a, button {
      width: 100%;
    }
  }
`;

// Enhanced file upload component with better quiz generation flow
const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [tokenUsage, setTokenUsage] = useState(null);
  const [fileSettings, setFileSettings] = useState({}); // Store settings per file
  const [alerts, setAlerts] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [generatedQuizId, setGeneratedQuizId] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [uploadedDocumentId, setUploadedDocumentId] = useState(null);
  const [quizGenerationProgress, setQuizGenerationProgress] = useState(0);
  const [quizTitle, setQuizTitle] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Check authentication status when component loads
  useEffect(() => {
    const token = localStorage.getItem('rectifyToken');
    if (!token) {
      console.warn('No authentication token found in FileUpload component');
      addAlert({
        type: 'error',
        title: 'Authentication Required',
        message: 'You must be logged in to upload files. Please log in again.'
      });
      setIsAuthenticated(false);
    } else {
      console.log('Authentication token found in FileUpload');
      setIsAuthenticated(true);
      // Clear any previous errors when token is available
      setError('');
    }
  }, []);
  
  // Fetch token usage when component loads
  useEffect(() => {
    const fetchTokenUsage = async () => {
      try {
        const response = await apiService.getTokenUsage();
        setTokenUsage(response.data);
      } catch (error) {
        console.error('Failed to fetch token usage:', error);
      }
    };
    
    if (isAuthenticated) {
      fetchTokenUsage();
    }
  }, [isAuthenticated]);
  
  // Auto-upload files when they are added
  useEffect(() => {
    const uploadPendingFiles = async () => {
      const pendingFiles = files.filter(file => file.status === 'pending');
      
      if (pendingFiles.length > 0) {
        setIsUploading(true);
        
        for (const file of pendingFiles) {
          await uploadFile(file);
        }
        
        setIsUploading(false);
        setActiveStep(2); // Move to quiz configuration after upload
      }
    };
    
    if (isAuthenticated && files.some(file => file.status === 'pending')) {
      uploadPendingFiles();
    }
  }, [files, isAuthenticated]);

  // Simulated quiz generation progress
  useEffect(() => {
    let interval;
    if (isGeneratingQuiz && quizGenerationProgress < 90) {
      interval = setInterval(() => {
        setQuizGenerationProgress(prev => Math.min(prev + 5, 90));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGeneratingQuiz, quizGenerationProgress]);

  // Auto-generate quiz title based on file name
  useEffect(() => {
    if (activeStep === 2 && files.some(file => file.status === 'complete')) {
      const completedFile = files.find(file => file.status === 'complete');
      if (completedFile) {
        // Remove file extension from name
        const baseName = completedFile.name.split('.').slice(0, -1).join('.');
        setQuizTitle(`Quiz on ${baseName}`);
      }
    }
  }, [activeStep, files]);

  // Helper function to add alerts
  const addAlert = (alert) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, ...alert }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }, 5000);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };
  
  const processFiles = (fileList) => {
    // Only process the first file and replace any existing one
    const file = Array.from(fileList)[0];
    if (!file) return;
    const extension = file.name.split('.').pop().toLowerCase();
    const fileId = Date.now() + Math.random();
    setFileSettings(prev => ({
      ...prev,
      [fileId]: { difficulty: 'medium' }
    }));
    // Build new single-file entry
    const newFile = {
      id: fileId,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: extension,
      progress: 0,
      status: 'pending',
      documentId: null
    };
    setFiles([newFile]);

    // Show success alert
    addAlert({
      type: 'success',
      title: 'File Added',
      message: 'Your file has been added and is ready for upload.'
    });
  };
  
  const uploadFile = async (fileObj) => {
    try {
      // Update file status to uploading
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileObj.id ? { ...file, status: 'uploading', progress: 5 } : file
        )
      );
      
      // Check if we have a token before attempting upload
      const token = localStorage.getItem('rectifyToken');
      if (!token) {
        console.error('No authentication token found');
        addAlert({
          type: 'error',
          title: 'Authentication Error',
          message: 'Please log in again to upload files.'
        });
        
        // Update file with error status
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file.id === fileObj.id ? { ...file, status: 'error' } : file
          )
        );
        
        return;
      }
      
      // Calculate upload time based on file size - smaller files upload faster
      const fileSizeInMB = fileObj.file.size / (1024 * 1024);
      const isSmallFile = fileSizeInMB < 1; // Less than 1MB
      const isMediumFile = fileSizeInMB >= 1 && fileSizeInMB < 5; // 1-5MB
      
      // Adjust interval and increment based on file size
      const intervalTime = isSmallFile ? 300 : isMediumFile ? 600 : 1000;
      const progressIncrement = isSmallFile ? 20 : isMediumFile ? 12 : 7;
      
      // Start progress simulation - adjusted for file size
      let progress = 10;
      const progressInterval = setInterval(() => {
        if (progress < 90) {
          progress += progressIncrement;
          setFiles(prevFiles => 
            prevFiles.map(file => 
              file.id === fileObj.id ? { ...file, progress } : file
            )
          );
        } else {
          clearInterval(progressInterval);
        }
      }, intervalTime);
      
      // Call the upload API
      const response = await apiService.uploadDocument(fileObj.file);
      clearInterval(progressInterval);
      
      // Update file with success status and documentId
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileObj.id ? { 
            ...file, 
            status: 'complete', 
            progress: 100,
            documentId: response.document_id || response.id
          } : file
        )
      );
      
      // Set uploadedDocumentId for next steps
      setUploadedDocumentId(response.document_id || response.id);
      
      // Show success message
      setSuccessMessage('File uploaded successfully! Now you can configure your quiz.');
      addAlert({
        type: 'success',
        title: 'Upload Complete',
        message: 'Your file has been successfully uploaded. Now you can configure your quiz settings.'
      });
      
      // Move to the quiz configuration step
      setActiveStep(2);
      
      // Refresh token usage
      if (isAuthenticated) {
        try {
          const tokenResponse = await apiService.getTokenUsage();
          setTokenUsage(tokenResponse.data);
        } catch (error) {
          console.error('Failed to refresh token usage:', error);
        }
      }
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Update file with error status
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.id === fileObj.id ? { ...file, status: 'error', progress: 0 } : file
        )
      );
      
      // Show error alert
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      addAlert({
        type: 'error',
        title: 'Upload Failed',
        message: errorMessage
      });
      
      setError(`Upload failed: ${errorMessage}`);
    }
  };
  
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };
  
  const handleRemoveFile = (fileId) => {
    setFiles([]);
  };
  
  const handleGenerateQuiz = async () => {
    // Validate required fields
    if (!quizTitle.trim()) {
      setError('Please enter a title for your quiz.');
      return;
    }
    
    // Get completed file object
    const completedFile = files.find(file => file.status === 'complete');
    if (!completedFile) {
      addAlert({
        type: 'error',
        title: 'No File Available',
        message: 'Please upload a file before generating a quiz.'
      });
      return;
    }
    
    // Validate document ID exists
    if (!completedFile.documentId) {
      addAlert({
        type: 'error',
        title: 'Document ID Missing',
        message: 'The document was not properly processed. Please try uploading it again.'
      });
      return;
    }
    
    // Validate number of questions
    const numQuestions = parseInt(numberOfQuestions, 10);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 30) {
      setError('Number of questions must be between 1 and 30.');
      return;
    }
    
    console.log('Starting quiz generation with parameters:', {
      documentId: completedFile.documentId,
      difficulty: selectedDifficulty,
      number_of_quizzes: numQuestions,
      title: quizTitle
    });
    
    try {
      setIsGeneratingQuiz(true);
      setQuizGenerationProgress(10);
      setError(''); // Clear any previous errors
      
      // Important: ensure documentId is a number if it's stored as a string
      const docId = parseInt(completedFile.documentId, 10) || completedFile.documentId;
      
      // Pass parameters exactly matching the API requirements
      const response = await apiService.generateQuiz(docId, {
        difficulty: selectedDifficulty,
        number_of_quizzes: numQuestions,
        title: quizTitle.trim(),
        include_hints: true,
        include_explanations: true
      });
      
      console.log('Quiz generation response:', response);
      setQuizGenerationProgress(100);
      
      // Handle different API response formats
      const quizId = response.quiz_session_id || response.id || docId;
      setGeneratedQuizId(quizId);
      
      // Show success alert
      addAlert({
        type: 'success',
        title: 'Quiz Generated',
        message: 'Your quiz has been successfully generated and is ready to take!'
      });
      
      // Move to the next step
      setActiveStep(3);
      
      // Delay to show completion message before redirecting
      setTimeout(() => {
        console.log('Quiz generation complete. User can now take the quiz or view it later.');
      }, 1500);
    } catch (error) {
      console.error('Quiz generation error:', error);
      setIsGeneratingQuiz(false);
      setQuizGenerationProgress(0);
      
      // Check if this is a token limit exceeded error
      if (error.message && error.message.includes('API token limit exceeded')) {
        // Extract the reset time information from the error message
        const resetTimeMatch = error.message.match(/Please try again in ([^.]+)/);
        const resetTime = resetTimeMatch ? resetTime[1] : 'some time';
        
        addAlert({
          type: 'error',
          title: 'Token Limit Exceeded',
          message: `You've reached the API usage limit. The limit will reset in ${resetTime}. Please try again later.`
        });
      } else if (error.message && error.message.includes('Invalid quiz generation request')) {
        // Handle invalid input errors
        addAlert({
          type: 'error',
          title: 'Invalid Request',
          message: error.message || 'Please check your quiz settings and try again.'
        });
      } else {
        // Handle other errors
        addAlert({
          type: 'error',
          title: 'Quiz Generation Failed',
          message: error.response?.data?.message || error.message || 'An error occurred while generating the quiz.'
        });
      }
    }
  };
  
  const handleStartQuiz = () => {
    // Find the document ID and quiz ID
    const completedFile = files.find(file => file.status === 'complete');
    
    if (!completedFile || !completedFile.documentId) {
      addAlert({
        type: 'error',
        title: 'No Document Available',
        message: 'Please upload a document before starting a quiz.'
      });
      return;
    }
    
    // Navigate to the quiz page with all necessary parameters
    navigate(`/quiz/${completedFile.documentId}?difficulty=${selectedDifficulty}&quizId=${generatedQuizId}`);
  };
  
  const handleViewLater = () => {
    navigate('/my-quizzes');
  };

  const handleStartQuizDirectly = () => {
    // Find the document ID from completed file
    const completedFile = files.find(file => file.status === 'complete');
    
    if (!completedFile || !completedFile.documentId) {
      addAlert({
        type: 'error',
        title: 'No Document Available',
        message: 'Please upload a document before starting a quiz.'
      });
      return;
    }
    
    // Set quiz title based on file name if not set
    if (!quizTitle) {
      const baseName = completedFile.name.split('.').slice(0, -1).join('.');
      setQuizTitle(`Quiz on ${baseName}`);
    }
    
    setIsGeneratingQuiz(true);
    setQuizGenerationProgress(50);
    
    // Redirect directly to quiz page with difficulty parameter
    setTimeout(() => {
      // Navigate to the quiz page with the document ID and difficulty
      navigate(`/quiz/${completedFile.documentId}?difficulty=${selectedDifficulty}`);
    }, 1500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = (fileType) => {
    switch(fileType) {
      case 'pdf': return <FaFilePdf />;
      case 'doc': case 'docx': return <FaFileWord />;
      case 'ppt': case 'pptx': return <FaFilePowerpoint />;
      case 'xls': case 'xlsx': return <FaFileExcel />;
      case 'jpg': case 'jpeg': case 'png': case 'gif': return <FaImage />;
      default: return <FaFileAlt />;
    }
  };
  
  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'Easy (Beginner-friendly)';
      case 'medium': return 'Medium (Standard level)';
      case 'hard': return 'Hard (Challenging)';
      default: return 'Medium';
    }
  };
  
  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'easy': return <FaFeather />;
      case 'medium': return <FaGraduationCap />;
      case 'hard': return <FaChess />;
      default: return <FaGraduationCap />;
    }
  };
  
  // Filter out files based on status
  const uploadedFiles = files.filter(file => file.status !== 'error');
  const hasCompletedFiles = uploadedFiles.some(file => file.status === 'complete');
  
  const renderFileUploadStep = () => (
    <Card>
      <h2>Upload Your Study Material</h2>
      <p>Upload your notes, textbooks, or any study material you want to create quizzes from.</p>
      
      <UploadArea 
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        visible={uploadedFiles.length === 0}
      >
        <UploadIcon>
          <FaCloudUploadAlt />
        </UploadIcon>
        
        <UploadText>
          <h3>Drop your files here</h3>
          <p>or click to browse from your computer</p>
          <p className="file-types">Supports PDF, Word, PPT, and text files</p>
        </UploadText>
        
        <Button secondary>
          <FaUpload /> Select Files
        </Button>
        
        <HiddenInput 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.rtf"
        />
      </UploadArea>
      
      {uploadedFiles.length > 0 && (
        <FileGrid>
          {uploadedFiles.map(file => (
            <FileCard key={file.id}>
              <FileHeader fileType={file.type}>
                <FileIcon>
                  {getFileIcon(file.type)}
                </FileIcon>
                <FileInfo>
                  <h3>{file.name}</h3>
                  <span>{file.size}</span>
                </FileInfo>
                <Actions className="card-actions">
                  <ActionButton onClick={() => handleRemoveFile(file.id)}>
                    <FaTrash />
                  </ActionButton>
                </Actions>
              </FileHeader>
              
              <FileBody>
                {file.status === 'uploading' && (
                  <>
                    <StatusIndicator uploading>
                      <Spinner /> Uploading...
                    </StatusIndicator>
                    <ProgressBar progress={file.progress}>
                      <div></div>
                    </ProgressBar>
                  </>
                )}
                
                {file.status === 'complete' && (
                  <StatusIndicator complete>
                    <FaCheckCircle /> Upload complete
                  </StatusIndicator>
                )}
                
                {file.status === 'error' && (
                  <StatusIndicator error>
                    <FaTimesCircle /> Upload failed
                  </StatusIndicator>
                )}
                
                {file.status === 'pending' && (
                  <StatusIndicator>
                    <FaClock /> Waiting to upload
                  </StatusIndicator>
                )}
              </FileBody>
            </FileCard>
          ))}
        </FileGrid>
      )}
      
      {error && (
        <Alert>
          <FaExclamationCircle />
          <div>
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <button onClick={() => setError('')}>
            <FaTimes />
          </button>
        </Alert>
      )}
      
      <FooterActions>
        <Link to="/dashboard">
          <Button secondary>
            Cancel
          </Button>
        </Link>
        
        <Button 
          onClick={() => setActiveStep(2)} 
          disabled={!hasCompletedFiles}
          iconRight
        >
          Continue <FaArrowRight />
        </Button>
      </FooterActions>
    </Card>
  );
  
  const renderQuizConfigStep = () => (
    <Card>
      <h2><FaCog /> Configure Your Quiz</h2>
      <p>Select the difficulty level and number of questions for your quiz</p>
      
      <div style={{ marginTop: '2rem' }}>        
        {/* Enhanced Difficulty Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '600', 
            color: colors.white,
            fontSize: '1rem'
          }}>
            Difficulty Level
          </label>
          <DifficultyButtons>
            <DifficultyButton 
              level="easy"
              selected={selectedDifficulty === 'easy'} 
              onClick={() => handleDifficultyChange('easy')}
            >
              <div className="difficulty-icon"><FaFeather /></div>
              <div className="difficulty-content">
                <span className="difficulty-label">Easy</span>
                <div className="difficulty-description">
                  Basic recall and simple concept questions
                </div>
              </div>
            </DifficultyButton>
            
            <DifficultyButton 
              level="medium"
              selected={selectedDifficulty === 'medium'} 
              onClick={() => handleDifficultyChange('medium')}
            >
              <div className="difficulty-icon"><FaGraduationCap /></div>
              <div className="difficulty-content">
                <span className="difficulty-label">Medium</span>
                <div className="difficulty-description">
                  Moderate complexity and application questions
                </div>
              </div>
            </DifficultyButton>
            
            <DifficultyButton 
              level="hard"
              selected={selectedDifficulty === 'hard'} 
              onClick={() => handleDifficultyChange('hard')}
            >
              <div className="difficulty-icon"><FaChess /></div>
              <div className="difficulty-content">
                <span className="difficulty-label">Hard</span>
                <div className="difficulty-description">
                  Advanced analysis and challenging questions
                </div>
              </div>
            </DifficultyButton>
          </DifficultyButtons>
        </div>
        
        {/* Number of Questions Selector */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '600', 
            color: colors.white,
            fontSize: '1rem'
          }}>
            Number of Questions
          </label>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="5" 
              value={numberOfQuestions || 10}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
              style={{ 
                flex: '1',
                accentColor: colors.blurple
              }}
            />
            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: colors.blurple,
              color: colors.white,
              borderRadius: '8px',
              fontWeight: '600',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {numberOfQuestions || 10}
            </div>
          </div>
        </div>
        
        {/* Quiz Title Input */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '600', 
            color: colors.white,
            fontSize: '1rem'
          }}>
            Quiz Title
          </label>
          <input 
            type="text"
            placeholder="Enter a title for your quiz"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: colors.notQuiteBlack,
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: colors.white,
              fontSize: '1rem'
            }}
          />
        </div>
        
        {/* Quiz Preview Card */}
        <div style={{
          backgroundColor: colors.darkButNotBlack,
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '0.25rem 0.75rem',
            backgroundColor: colors.blurple,
            color: colors.white,
            fontSize: '0.75rem',
            fontWeight: '700',
            borderBottomLeftRadius: '8px'
          }}>
            PREVIEW
          </div>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem', 
            marginBottom: '1rem' 
          }}>
            <div style={{ 
              padding: '0.4rem 0.75rem', 
              borderRadius: '999px', 
              backgroundColor: selectedDifficulty === 'easy' 
                ? 'rgba(87, 242, 135, 0.1)' 
                : selectedDifficulty === 'medium' 
                  ? 'rgba(254, 231, 92, 0.1)' 
                  : 'rgba(237, 66, 69, 0.1)',
              color: selectedDifficulty === 'easy' 
                ? colors.green 
                : selectedDifficulty === 'medium' 
                  ? colors.yellow 
                  : colors.red,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {getDifficultyIcon(selectedDifficulty)}
              {getDifficultyLabel(selectedDifficulty)}
            </div>
            
            <div style={{ 
              padding: '0.4rem 0.75rem', 
              borderRadius: '999px', 
              backgroundColor: 'rgba(88, 101, 242, 0.1)',
              color: colors.blurple,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              <FaQuestionCircle />
              {numberOfQuestions || 10} Questions
            </div>
          </div>
          
          <p style={{
            fontSize: '0.85rem',
            color: colors.greyple,
            marginBottom: '0'
          }}>
            This quiz will test your knowledge with {selectedDifficulty} difficulty questions.
          </p>
        </div>
      </div>
      
      {error && (
        <Alert>
          <FaExclamationCircle />
          <div>
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <button onClick={() => setError('')}>
            <FaTimes />
          </button>
        </Alert>
      )}
      
      <FooterActions>
        <Button 
          secondary
          onClick={() => setActiveStep(1)}
        >
          <FaArrowRight style={{ transform: 'rotate(180deg)' }} /> Back to Upload
        </Button>
        
        <Button 
          onClick={handleGenerateQuiz}
          disabled={isGeneratingQuiz || !quizTitle.trim()}
          iconRight
          fullWidthMobile
        >
          Generate Quiz <FaArrowRight />
        </Button>
      </FooterActions>
      
      {isGeneratingQuiz && (
        <div style={{ 
          marginTop: '1.5rem',
          backgroundColor: colors.notQuiteBlack,
          padding: '1.25rem',
          borderRadius: '8px',
          border: '1px solid rgba(88, 101, 242, 0.2)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            gap: '0.75rem'
          }}>
            <Spinner />
            <p style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: '600',
              color: colors.white
            }}>
              Preparing your quiz...
            </p>
          </div>
          
          <ProgressBar progress={quizGenerationProgress}>
            <div></div>
          </ProgressBar>
        </div>
      )}
    </Card>
  );

  const renderQuizReadyStep = () => (
    <Card>
      <h2>Quiz Is Ready!</h2>
      <p>Your custom quiz has been generated and is ready to take.</p>
      
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          margin: '0 auto 1.5rem',
          background: 'rgba(var(--primary-rgb), 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FaCheckCircle style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
        </div>
        
        <h3>{quizTitle}</h3>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '1rem', 
          margin: '1.5rem 0' 
        }}>
          <div style={{ 
            padding: '0.75rem 1.25rem', 
            borderRadius: '2rem', 
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {getDifficultyIcon(selectedDifficulty)}
            {getDifficultyLabel(selectedDifficulty)}
          </div>
          
          <div style={{ 
            padding: '0.75rem 1.25rem', 
            borderRadius: '2rem', 
            backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            <FaQuestionCircle />
            {parseInt(numberOfQuestions, 10) || 10} Questions
          </div>
        </div>
        
        <p style={{ 
          backgroundColor: 'rgba(var(--primary-rgb), 0.05)', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          margin: '1.5rem 0',
          fontSize: '0.9rem',
          color: 'var(--text-secondary-color)',
          textAlign: 'left'
        }}>
          <FaInfoCircle style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }} />
          Your quiz has been saved to your account. You can take it now or access it later from your Quiz list.
        </p>
      </div>
      
      <FooterActions>
        <Button 
          secondary
          onClick={handleViewLater}
        >
          View Later
        </Button>
        
        <Button 
          onClick={handleStartQuiz}
          iconRight
        >
          Take Quiz Now <FaArrowRight />
        </Button>
      </FooterActions>
    </Card>
  );
  
  return (
    <UploadContainer className="upload-container">
      <div className="container">
        <PageHeader>
          <h1>Create Quiz from Your Study Material</h1>
          <p>Upload your document, configure quiz settings, and generate personalized quizzes to test your knowledge.</p>
        </PageHeader>
        
        {/* Progress Steps - Updated to reflect new flow */}
        <Steps>
          <Step>
            <StepNumber active={activeStep === 1} completed={activeStep > 1}>
              {activeStep > 1 ? <FaCheckCircle /> : 1}
            </StepNumber>
            <StepLabel active={activeStep === 1} completed={activeStep > 1}>
              <h4>Upload</h4>
              <p>Upload your study material</p>
            </StepLabel>
          </Step>
          
          <Step>
            <StepNumber active={activeStep === 2} completed={activeStep > 2}>
              {activeStep > 2 ? <FaCheckCircle /> : 2}
            </StepNumber>
            <StepLabel active={activeStep === 2} completed={activeStep > 2}>
              <h4>Difficulty</h4>
              <p>Select difficulty level</p>
            </StepLabel>
          </Step>
          
          <Step>
            <StepNumber active={activeStep === 3} completed={activeStep > 3}>
              {activeStep > 3 ? <FaCheckCircle /> : 3}
            </StepNumber>
            <StepLabel active={activeStep === 3} completed={activeStep > 3}>
              <h4>Take Quiz</h4>
              <p>Answer questions</p>
            </StepLabel>
          </Step>
        </Steps>
        
        {/* Display alerts */}
        {alerts.map(alert => (
          <Alert key={alert.id} success={alert.type === 'success'}>
            {alert.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
            <div>
              <h4>{alert.title}</h4>
              <p>{alert.message}</p>
            </div>
            <button onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}>
              <FaTimes />
            </button>
          </Alert>
        ))}
        
        {/* Render current step */}
        {activeStep === 1 && renderFileUploadStep()}
        {activeStep === 2 && renderQuizConfigStep()}
        {activeStep === 3 && renderQuizReadyStep()}
        
        {/* Token usage info */}
        {tokenUsage && (
          <TokenCard>
            <h3><FaInfoCircle /> Token Usage Information</h3>
            <TokenProgressBar percentage={(tokenUsage.tokens_used / tokenUsage.max_tokens) * 100}>
              <div></div>
            </TokenProgressBar>
            <TokenStats>
              <span><FaCheckCircle /> {tokenUsage.tokens_used.toLocaleString()} tokens used</span>
              <span>{tokenUsage.tokens_remaining.toLocaleString()} tokens remaining</span>
            </TokenStats>
          </TokenCard>
        )}
      </div>
    </UploadContainer>
  );
};

export default FileUpload;

