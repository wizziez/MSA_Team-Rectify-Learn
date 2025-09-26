import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Theme Context
const ThemeContext = createContext();

// Create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Always use dark mode - removed local storage and toggle functionality
  const [theme, setTheme] = useState('dark');

  // Apply the theme to the document root on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Apply dark mode styling
    document.documentElement.style.setProperty('--primary-color', '#6366F1');
    document.documentElement.style.setProperty('--primary-rgb', '99, 102, 241');
    document.documentElement.style.setProperty('--secondary-color', '#8B5CF6');
    document.documentElement.style.setProperty('--secondary-rgb', '139, 92, 246');
    document.documentElement.style.setProperty('--background', '#1F2937');
    document.documentElement.style.setProperty('--card-bg', '#374151');
    document.documentElement.style.setProperty('--text', '#F9FAFB');
    document.documentElement.style.setProperty('--text-secondary', '#D1D5DB');
    document.documentElement.style.setProperty('--border', '#4B5563');
  }, []);

  // Provide theme context value without the toggle function
  const value = {
    theme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
