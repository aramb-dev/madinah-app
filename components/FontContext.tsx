import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: 'amiri', name: 'Amiri', fontFamily: 'Amiri-Regular' },
  { id: 'playpen', name: 'Playpen Sans Arabic', fontFamily: 'PlaypenSansArabic-Regular' },
  { id: 'noto-sans', name: 'Noto Sans Arabic', fontFamily: 'NotoSansArabic-Regular' },
  { id: 'ibm-plex', name: 'IBM Plex Sans Arabic', fontFamily: 'IBMPlexSansArabic-Regular' },
  { id: 'noto-kufi', name: 'Noto Kufi Arabic', fontFamily: 'NotoKufiArabic-Regular' },
  { id: 'baloo', name: 'Baloo Bhaijaan 2', fontFamily: 'BalooBhaijaan2-Regular' },
  { id: 'noto-naskh', name: 'Noto Naskh Arabic', fontFamily: 'NotoNaskhArabic-Regular' },
];

interface FontContextType {
  selectedFont: FontOption;
  setSelectedFont: (font: FontOption) => void;
  isLoading: boolean;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const FONT_STORAGE_KEY = 'selectedFont';

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [selectedFont, setSelectedFontState] = useState<FontOption>(AVAILABLE_FONTS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSelectedFont();
  }, []);

  const loadSelectedFont = async () => {
    try {
      const savedFontId = await AsyncStorage.getItem(FONT_STORAGE_KEY);
      if (savedFontId) {
        const font = AVAILABLE_FONTS.find(f => f.id === savedFontId);
        if (font) {
          setSelectedFontState(font);
        }
      }
    } catch (error) {
      console.error('Error loading selected font:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedFont = async (font: FontOption) => {
    try {
      await AsyncStorage.setItem(FONT_STORAGE_KEY, font.id);
      setSelectedFontState(font);
    } catch (error) {
      console.error('Error saving selected font:', error);
    }
  };

  return (
    <FontContext.Provider value={{ selectedFont, setSelectedFont, isLoading }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}