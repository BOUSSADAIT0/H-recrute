import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { STORAGE_KEYS } from '../config/constants';
import { theme, darkTheme } from '../styles/theme';

// Initial state
const initialState = {
  isDarkMode: false,
  theme: theme,
  toggleTheme: () => {},
  setTheme: () => {},
};

// Create context
export const ThemeContext = createContext(initialState);

// Provider Component
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.APP_THEME);
        
        if (savedTheme !== null) {
          const isDark = savedTheme === 'dark';
          setIsDarkMode(isDark);
          setCurrentTheme(isDark ? darkTheme : theme);
        } else {
          // Use device theme if no saved preference
          const isDark = colorScheme === 'dark';
          setIsDarkMode(isDark);
          setCurrentTheme(isDark ? darkTheme : theme);
        }
      } catch (error) {
        console.error('Error loading theme preference', error);
      }
    };

    loadTheme();
  }, [colorScheme]);

  // Toggle between light and dark themes
  const toggleTheme = async () => {
    try {
      const newIsDarkMode = !isDarkMode;
      setIsDarkMode(newIsDarkMode);
      setCurrentTheme(newIsDarkMode ? darkTheme : theme);
      
      // Save theme preference
      await AsyncStorage.setItem(
        STORAGE_KEYS.APP_THEME,
        newIsDarkMode ? 'dark' : 'light'
      );
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  };

  // Set specific theme (light or dark)
  const setTheme = async (themeMode) => {
    try {
      const isDark = themeMode === 'dark';
      setIsDarkMode(isDark);
      setCurrentTheme(isDark ? darkTheme : theme);
      
      // Save theme preference
      await AsyncStorage.setItem(STORAGE_KEYS.APP_THEME, themeMode);
    } catch (error) {
      console.error('Error saving theme preference', error);
    }
  };

  // Value object to be provided to consumers
  const value = {
    isDarkMode,
    theme: currentTheme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;