import React, { createContext, useContext, useState, ReactNode } from 'react';

type PronunciationSpeed = 'normal' | 'slow';

interface LearningContextType {
  autoPlayAudio: boolean;
  pronunciationSpeed: PronunciationSpeed;
  showTransliteration: boolean;
  setAutoPlayAudio: (value: boolean) => void;
  setPronunciationSpeed: (value: PronunciationSpeed) => void;
  setShowTransliteration: (value: boolean) => void;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export const LearningProvider = ({ children }: { children: ReactNode }) => {
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [pronunciationSpeed, setPronunciationSpeed] = useState<PronunciationSpeed>('normal');
  const [showTransliteration, setShowTransliteration] = useState(true);

  return (
    <LearningContext.Provider
      value={{
        autoPlayAudio,
        pronunciationSpeed,
        showTransliteration,
        setAutoPlayAudio,
        setPronunciationSpeed,
        setShowTransliteration,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearningContext = () => {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error('useLearningContext must be used within a LearningProvider');
  }
  return context;
};