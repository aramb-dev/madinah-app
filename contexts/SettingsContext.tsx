// contexts/SettingsContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Define the shape of the context data
interface SettingsContextState {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  fontSize: number;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setFontSize: (size: number) => void;
}

// 2. Create the Context
const SettingsContext = createContext<SettingsContextState | undefined>(undefined);

// 3. Create the Provider Component
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme() ?? 'light';
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSizeState] = useState(16);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      if (savedTheme) {
        setThemeState(savedTheme as 'light' | 'dark' | 'system');
      }
      if (savedFontSize) {
        setFontSizeState(Number(savedFontSize));
      }
    };
    loadSettings();
  }, []);

  // Function to update and persist theme
  const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  // Function to update and persist font size
  const setFontSize = async (newSize: number) => {
    setFontSizeState(newSize);
    await AsyncStorage.setItem('fontSize', String(newSize));
  };

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  const value = {
    theme,
    effectiveTheme,
    fontSize,
    setTheme,
    setFontSize,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Create the custom hook
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};