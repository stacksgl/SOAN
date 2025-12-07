import React, { createContext, useContext, useState, useEffect } from 'react';

interface ColorModeContextType {
  isColorModeEnabled: boolean;
  setColorModeEnabled: (enabled: boolean) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isColorModeEnabled, setIsColorModeEnabled] = useState(() => {
    const saved = localStorage.getItem('colorModeEnabled');
    return saved ? JSON.parse(saved) : true; // Default is enabled
  });

  const setColorModeEnabled = (enabled: boolean) => {
    setIsColorModeEnabled(enabled);
    localStorage.setItem('colorModeEnabled', JSON.stringify(enabled));
  };

  useEffect(() => {
    localStorage.setItem('colorModeEnabled', JSON.stringify(isColorModeEnabled));
  }, [isColorModeEnabled]);

  return (
    <ColorModeContext.Provider value={{ isColorModeEnabled, setColorModeEnabled }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};
