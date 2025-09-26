import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaPlus, 
  FaRandom, 
  FaSyncAlt, 
  FaRegLightbulb, 
  FaRegCheckCircle,
  FaRegClock,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaEllipsisH,
  FaUpload,
  FaDownload,
  FaTags,
  FaFolder,
  FaLightbulb,
  FaCheck,
  FaTimes,
  FaPlay,
  FaTrash
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiService from '../utils/apiService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

const unflip = keyframes`
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
`;

const float3D = keyframes`
  0% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-10px) rotateY(5deg); }
  100% { transform: translateY(0) rotateY(0deg); }
`;

const PageContainer = styled.div`
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 300px);
  background: linear-gradient(135deg, var(--background-color) 0%, rgba(15, 15, 15, 0.98) 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 3rem;
    min-height: calc(100vh - 400px);
  }
  
  @media (max-width: 480px) {
    margin-bottom: 4rem;
    min-height: calc(100vh - 450px);
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
  position: relative;
  z-index: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  color: white !important;
  margin: 0;
  font-weight: 900;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  position: relative;
  
  span {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 50%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      border-radius: 2px;
      opacity: 0.7;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white !important;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(var(--primary-rgb), 0.2);
  
  * {
    color: white !important;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(var(--primary-rgb), 0.3);
    
    * {
      color: white !important;
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: white !important;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  * {
    color: white !important;
  }
  
  &:hover {
    background: var(--hover-background);
    border-color: var(--primary-color);
    color: white !important;
    transform: translateY(-2px);
    
    * {
      color: white !important;
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: var(--card-background);
  border-radius: 16px;
  border: 1px dashed var(--border-color);
  margin-top: 2rem;
  animation: ${fadeIn} 0.6s ease forwards;
  
  svg {
    font-size: 3.5rem;
    color: white !important;
    margin-bottom: 1.5rem;
    opacity: 0.7;
  }
  
  h3 {
    font-size: 1.8rem;
    color: white !important;
    margin-bottom: 1rem;
  }
  
  p {
    color: white !important;
    max-width: 500px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    
    h3 {
      font-size: 1.5rem;
    }
    
    .actions {
      flex-direction: column;
    }
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 280px;
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  
  @media (max-width: 968px) {
    flex: 1;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  color: white !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--primary-color);
  }
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li`
  margin-bottom: 0.8rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 8px;
  color: white !important;
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;
  
  &:hover, &.active {
    background: rgba(var(--primary-rgb), 0.08);
    color: var(--primary-color);
  }
  
  &.active {
    font-weight: 600;
  }
  
  .count {
    margin-left: auto;
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary-color);
    border-radius: 12px;
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
  }
`;

const ContentArea = styled.div`
  flex: 1;
`;

const SearchBox = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  background: var(--card-background);
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
  }
  
  input {
    flex: 1;
    border: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    background: transparent;
    color: white !important;
    outline: none;
    
    &::placeholder {
      color: white !important;
    }
  }
  
  button {
    background: transparent;
    border: none;
    color: white !important;
    padding: 0 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  
  .filters {
    display: flex;
    gap: 0.8rem;
    flex-wrap: wrap;
  }
`;

const FilterButton = styled.button`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover, &.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: rgba(var(--primary-rgb), 0.05);
  }
  
  &.active {
    font-weight: 600;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

// New components for the functional flashcards features
const NavigationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  background: ${props => props.primary 
    ? 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' 
    : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.primary 
    ? '0 4px 8px rgba(var(--primary-rgb), 0.3)' 
    : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary 
      ? '0 6px 12px rgba(var(--primary-rgb), 0.4)' 
      : '0 4px 8px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  background: rgba(var(--primary-rgb), 0.1);
  height: 8px;
  border-radius: 4px;
  margin-top: 2rem;
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: white !important;
  font-size: 0.9rem;
`;

const DeckInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag {
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary-color);
    border-radius: 4px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white !important;
    font-size: 0.9rem;
    
    span {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
`;

const FlashcardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FlashcardItem = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeIn} 0.6s ease forwards;
  animation-delay: ${props => props.delay}s;
  opacity: 0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: white !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .info {
    display: flex;
    justify-content: space-between;
    color: white !important;
    font-size: 0.9rem;
    margin-top: 1.5rem;
    
    .stat {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
  }
  
  .progress {
    height: 5px;
    background: rgba(var(--primary-rgb), 0.1);
    border-radius: 3px;
    margin-top: 1rem;
    overflow: hidden;
    
    .bar {
      height: 100%;
      background: var(--primary-color);
      width: ${props => props.progress || 0}%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  }
  
  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  
  .tag {
    background: rgba(var(--primary-rgb), 0.1);
    color: var(--primary-color);
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 500;
  }
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: ${props => props.active ? 'var(--primary-color)' : 'var(--text-secondary)'};
  font-weight: ${props => props.active ? '600' : '500'};
  position: relative;
  cursor: pointer;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${props => props.active ? 'var(--primary-color)' : 'transparent'};
    border-radius: 1px;
  }
  
  &:hover {
    color: var(--primary-color);
  }
`;

const FlashcardContainer = styled.div`
  margin: 3rem auto;
  perspective: 1200px;
  max-width: 700px;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  position: relative;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
  
  &:hover {
    filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4));
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    min-height: 200px;
    aspect-ratio: auto;
    height: 280px;
    margin: 2rem auto;
  }
  
  @media (max-width: 480px) {
    height: 250px;
    margin: 1.5rem auto;
  }
  
  @media (max-width: 360px) {
    height: 220px;
  }
`;

const FlashcardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  transform-style: preserve-3d;
  border-radius: 20px;
  transform: ${props => props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  cursor: pointer;
  
  &:hover {
    transform: ${props => props.flipped ? 'rotateY(180deg) scale(1.02)' : 'rotateY(0deg) scale(1.02)'};
  }
`;

const FlashcardSide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 8px 16px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%);
    z-index: 1;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
    animation: shimmer 4s infinite linear;
    z-index: 2;
  }
  
  @keyframes shimmer {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 360px) {
    padding: 1rem;
  }
`;

const FlashcardFront = styled(FlashcardSide)`
  background: linear-gradient(145deg, #6366f1 0%, #8B5CF6 50%, #4f46e5 100%);
  color: white !important;
  position: relative;
  
  &::before {
    background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  }
  
  h3 {
    font-size: 1.75rem;
    text-align: center;
    line-height: 1.6;
    margin: 0;
    padding: 0 1rem;
    position: relative;
    z-index: 3;
    color: white !important;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    
    @media (max-width: 768px) {
      font-size: 1.4rem;
      padding: 0;
    }
    
    @media (max-width: 480px) {
      font-size: 1.25rem;
      line-height: 1.5;
    }
    
    @media (max-width: 360px) {
      font-size: 1.1rem;
      line-height: 1.4;
    }
  }
`;

const FlashcardBack = styled(FlashcardSide)`
  background: linear-gradient(145deg, #4f46e5 0%, #6366f1 50%, #4338ca 100%);
  color: white !important;
  transform: rotateY(180deg);
  
  &::before {
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
  }
  
  p {
    font-size: 1.375rem;
    text-align: center;
    line-height: 1.7;
    position: relative;
    z-index: 3;
    color: white !important;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 768px) {
      font-size: 1.125rem;
      line-height: 1.6;
    }
    
    @media (max-width: 480px) {
      font-size: 1rem;
      line-height: 1.5;
    }
    
    @media (max-width: 360px) {
      font-size: 0.9rem;
      line-height: 1.4;
      padding: 0;
    }
  }
`;

const FlashcardControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem auto 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    margin: 1.5rem auto 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
  }
`;

const CircleButton = styled.button`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: ${props => {
    if (props.className === 'flip') return 'white';
    if (props.className === 'prev') return '#f1f5f9';
    if (props.className === 'next') return '#4f46e5';
    return 'white';
  }};
  color: ${props => {
    if (props.className === 'flip') return '#4f46e5';
    if (props.className === 'prev') return '#64748b';
    if (props.className === 'next') return 'white';
    return '#4f46e5';
  }};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => {
      if (props.className === 'flip') return '#f9f9f9';
      if (props.className === 'prev') return '#e2e8f0';
      if (props.className === 'next') return '#4338ca';
      return '#f9f9f9';
    }};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 360px) {
    width: 2.2rem;
    height: 2.2rem;
    font-size: 0.85rem;
  }
`;

const FlashcardHint = styled.div`
  position: absolute;
  bottom: 1.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    font-size: 0.75rem;
  }
`;

const DocumentSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const DocumentCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    
    .delete-btn {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
  opacity: 0;
  transform: translateY(-5px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgb(237, 66, 69);
    transform: translateY(0) scale(1.1);
  }
`;

const DocumentHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  padding: 1.5rem;
  color: white;
  
  h3 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  p {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    opacity: 0.8;
  }
`;

const DocumentContent = styled.div`
  padding: 1.5rem;
  
  p {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    color: white !important;
    font-size: 0.875rem;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(var(--primary-rgb), 0.3);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  background-color: ${props => props.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 
                              props.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                              'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'success' ? '#065F46' : 
                    props.type === 'warning' ? '#92400E' :
                    '#991B1B'};
  
  svg {
    margin-right: 0.75rem;
    flex-shrink: 0;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  color: white;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(var(--primary-rgb), 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  color: white !important;

  svg {
    color: var(--primary-color);
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    background: rgba(var(--primary-rgb), 0.1);
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Flashcards = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStudying, setIsStudying] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [reviewSession, setReviewSession] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getDocuments();
        setDocuments(response.data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError("Failed to load your documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFlip = () => {
    console.log('Flipping card. Current state:', isFlipped);
    setIsFlipped(prevState => !prevState);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      if (isFlipped) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex(currentCardIndex + 1);
        }, 300);
      } else {
        setCurrentCardIndex(currentCardIndex + 1);
      }
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      if (isFlipped) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentCardIndex(currentCardIndex - 1);
        }, 300);
      } else {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    }
  };

  const handleShuffleCards = () => {
    setIsFlipped(false);
    setCurrentCardIndex(0);
    
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
  };

  const handleSelectDeck = async (document) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedDocument(document);
      
      // First try to get existing flashcards
      const response = await apiService.getFlashcards(document.id);
      console.log('Initial flashcards response:', response);
      
      if (response.data && response.data.length > 0) {
        setFlashcards(response.data);
      } else {
        // If no flashcards exist, generate new ones
        try {
          console.log('No existing flashcards, generating new ones for document:', document.id);
          const generatedFlashcards = await apiService.generateFlashcards(document.id, {
            count: 10,
            difficulty: 'medium'
          });
          
          console.log('Generated flashcards:', generatedFlashcards);
          
          if (generatedFlashcards && generatedFlashcards.length > 0) {
            setFlashcards(generatedFlashcards);
          } else {
            console.warn('No flashcards were generated');
            setError("Failed to generate flashcards. Please try again.");
            setFlashcards([]);
          }
        } catch (genError) {
          console.error("Error generating flashcards:", genError);
          setError(genError.message || "Failed to generate flashcards. Please try again.");
          setFlashcards([]);
        }
      }
      
      setCurrentCardIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error in handleSelectDeck:", error);
      setError(error.message || "Failed to load flashcards. Please try again.");
      setFlashcards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartStudy = () => {
    if (flashcards.length > 0) {
      setIsStudying(true);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const handleBackToDeckSelection = () => {
    setIsStudying(false);
    setSelectedDocument(null);
    setFlashcards([]);
  };

  const handleGenerateFlashcards = async (document) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await apiService.generateFlashcards(document.id, {
        count: 10,
        difficulty: 'medium'
      });
      
      await handleSelectDeck(document);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError("Failed to generate flashcards. Please try again later.");
      setIsLoading(false);
    }
  };

  const handleConfidenceSelect = (level) => {
    setConfidenceLevel(level);
    const currentCard = flashcards[currentCardIndex];
    
    // Add review to session
    setReviewSession(prev => [...prev, {
      flashcard_id: currentCard.id,
      confidence_level: level
    }]);
    
    // Move to next card after a short delay
    setTimeout(() => {
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
        setConfidenceLevel(null);
      } else {
        // Submit review session when all cards are reviewed
        handleSubmitReview();
      }
    }, 500);
  };

  const handleSubmitReview = async () => {
    try {
      setIsLoading(true);
      await apiService.submitFlashcardReview(selectedDocument.id, reviewSession);
      
      // Show success message and reset state
      setError(null);
      setReviewSession([]);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setConfidenceLevel(null);
      setIsStudying(false);
    } catch (error) {
      setError("Failed to submit review session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (e, documentId) => {
    e.stopPropagation(); // Prevent card click event
    
    if (window.confirm('Are you sure you want to delete this document and its flashcards? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await apiService.deleteDocument(documentId);
        
        // Remove from local state
        setDocuments(docs => docs.filter(doc => doc.id !== documentId));
        
      } catch (error) {
        console.error("Error deleting document:", error);
        setError("Failed to delete document. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
            {selectedDocument ? 'Loading flashcards...' : 'Loading your documents...'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert type="error">
          <FaTimes />
          {error}
        </Alert>
      );
    }

    if (isStudying && flashcards.length > 0) {
      const currentCard = flashcards[currentCardIndex];
      
      return (
        <>
          <BackButton onClick={handleBackToDeckSelection}>
            <FaArrowLeft /> Back to deck selection
          </BackButton>
          
          <FlashcardContainer>
            <FlashcardInner 
              flipped={isFlipped} 
              onClick={handleFlip}
              style={{ cursor: 'pointer' }}
            >
              <FlashcardFront>
                <h3>{currentCard.front}</h3>
                {currentCard.hint && (
                  <FlashcardHint>
                    <FaRegLightbulb /> {currentCard.hint}
                  </FlashcardHint>
                )}
              </FlashcardFront>
              <FlashcardBack>
                <p>{currentCard.back}</p>
                {!confidenceLevel && isFlipped && (
                  <div style={{ 
                    marginTop: '1.5rem', 
                    display: 'flex', 
                    gap: '0.5rem', 
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                    padding: '0 0.5rem'
                  }}>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfidenceSelect('low');
                      }}
                      style={{ 
                        background: '#ef4444',
                        padding: window.innerWidth <= 480 ? '0.5rem 0.8rem' : '0.6rem 1rem',
                        fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
                        minWidth: window.innerWidth <= 360 ? '60px' : 'auto'
                      }}
                    >
                      <FaTimes /> Low
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfidenceSelect('medium');
                      }}
                      style={{ 
                        background: '#f59e0b',
                        padding: window.innerWidth <= 480 ? '0.5rem 0.8rem' : '0.6rem 1rem',
                        fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
                        minWidth: window.innerWidth <= 360 ? '60px' : 'auto'
                      }}
                    >
                      <FaRegClock /> Medium
                    </Button>
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfidenceSelect('high');
                      }}
                      style={{ 
                        background: '#10b981',
                        padding: window.innerWidth <= 480 ? '0.5rem 0.8rem' : '0.6rem 1rem',
                        fontSize: window.innerWidth <= 480 ? '0.8rem' : '0.9rem',
                        minWidth: window.innerWidth <= 360 ? '60px' : 'auto'
                      }}
                    >
                      <FaCheck /> High
                    </Button>
                  </div>
                )}
              </FlashcardBack>
            </FlashcardInner>
            
            <FlashcardControls>
              <CircleButton 
                className="prev" 
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0 || confidenceLevel !== null}
              >
                <FaArrowLeft />
              </CircleButton>
              
              <CircleButton 
                className="flip" 
                onClick={() => {
                  console.log("Flip button clicked");
                  handleFlip();
                }}
                disabled={confidenceLevel !== null}
              >
                <FaSyncAlt />
              </CircleButton>
              
              <CircleButton 
                className="next" 
                onClick={handleNextCard}
                disabled={currentCardIndex === flashcards.length - 1 || confidenceLevel !== null}
              >
                <FaArrowRight />
              </CircleButton>
            </FlashcardControls>
            
            <div style={{ 
              textAlign: 'center', 
              marginTop: '1rem', 
              fontSize: '0.875rem',
              color: '#f1f5f9'
            }}>
              {currentCardIndex + 1} / {flashcards.length}
            </div>
          </FlashcardContainer>
        </>
      );
    }

    if (selectedDocument && !isStudying) {
      return (
        <>
          <BackButton onClick={() => setSelectedDocument(null)}>
            <FaArrowLeft /> Back to all documents
          </BackButton>
          
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h2>{selectedDocument.filename}</h2>
            <p>{flashcards.length} flashcards available</p>
            
            <div style={{ margin: '2rem 0' }}>
              <PrimaryButton onClick={handleStartStudy}>
                <FaPlay /> Study Now
              </PrimaryButton>
              
              <div style={{ marginTop: '1rem' }}>
                <SecondaryButton onClick={() => handleGenerateFlashcards(selectedDocument)}>
                  <FaRegLightbulb /> Generate New Flashcards
                </SecondaryButton>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (documents.length === 0) {
      return (
        <EmptyState>
          <FaFolder />
          <h3>No documents found</h3>
          <p>Upload documents to create flashcards and enhance your learning with our advanced features:</p>
          <FeatureList>
            <FeatureItem>
              <FaCheck /> Smart hints for better understanding
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Confidence level tracking
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> AI-powered flashcard generation
            </FeatureItem>
            <FeatureItem>
              <FaCheck /> Progress tracking system
            </FeatureItem>
          </FeatureList>
          <div className="actions">
            <PrimaryButton>
              <Link to="/upload" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUpload /> Upload Document
              </Link>
            </PrimaryButton>
          </div>
        </EmptyState>
      );
    }

    return (
      <>
        <p style={{ marginBottom: '2rem' }}>Select a document to study with flashcards:</p>
        
        <DocumentSelector>
          {documents.map(doc => (
            <DocumentCard key={doc.id} onClick={() => handleSelectDeck(doc)}>
              <DeleteButton 
                className="delete-btn"
                onClick={(e) => handleDeleteDocument(e, doc.id)}
                aria-label="Delete document"
              >
                <FaTrash size={14} />
              </DeleteButton>
              <DocumentHeader>
                <h3>{doc.filename}</h3>
                <p>Added on {new Date(doc.upload_date).toLocaleDateString()}</p>
              </DocumentHeader>
              <DocumentContent>
                <p><FaFolder /> {doc.file_type.toUpperCase()}</p>
                <p><FaRegLightbulb /> Click to study with flashcards</p>
              </DocumentContent>
            </DocumentCard>
          ))}
        </DocumentSelector>
      </>
    );
  };

  return (
    <PageContainer className="flashcards-container">
      <PageHeader>
        <PageTitle>
          <span>Flash</span>cards
        </PageTitle>
        
        <HeaderActions>
          <SecondaryButton>
            <Link to="/upload" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaUpload /> Upload Document
            </Link>
          </SecondaryButton>
        </HeaderActions>
      </PageHeader>
      
      {renderContent()}
    </PageContainer>
  );
};

export default Flashcards;
