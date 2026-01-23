// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved !== null) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const html = document.documentElement;

    // Force remove any conflicting classes first
    html.classList.remove('dark', 'light');

    // Add the correct one
    if (isDark) {
      html.classList.remove('light');
      html.classList.add('dark');
      
      console.log('[Theme] Added dark class →', html.classList.toString());
    } else {
      html.classList.remove('dark');
      html.classList.add('light'); // optional - some people add 'light' too
      console.log('[Theme] Removed dark class →', html.classList.toString());
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    console.log('[Theme] Toggle clicked – current:', isDark);
    setIsDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};