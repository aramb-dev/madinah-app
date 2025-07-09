import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FONT_SIZE_STORAGE_KEY = 'fontSize';
const DEFAULT_FONT_SIZE = 16;

interface FontSizeContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  isLoading: boolean;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSizeState] = useState(DEFAULT_FONT_SIZE);

  useEffect(() => {
    loadFontSize();
  }, []);

  const loadFontSize = async () => {
    try {
      const savedSize = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
      if (savedSize !== null) {
        setFontSizeState(parseFloat(savedSize));
      }
    } catch (error) {
      console.error('Error loading font size:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setFontSize = async (size: number) => {
    try {
      await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, String(size));
      setFontSizeState(size);
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, isLoading }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}