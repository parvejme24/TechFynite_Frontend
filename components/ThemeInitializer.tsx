"use client";

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeInitializer() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Always ensure light mode is the default
    const savedTheme = localStorage.getItem('theme');
    
    // If no theme is saved or it's set to system, default to light
    if (!savedTheme || savedTheme === 'system') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
    
    // Remove any dark class from html element to ensure light mode
    document.documentElement.classList.remove('dark');
  }, [setTheme]);

  return null; // This component doesn't render anything
} 