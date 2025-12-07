import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ColumnVisibilitySettings {
  streams: boolean;
  genre: boolean;
  releaseDate: boolean;
  dailyStreams: boolean;
  averageDailyStreams: boolean;
  distributor: boolean;
  trendPercentage: boolean;
}

interface ColumnVisibilityContextType {
  columnVisibility: ColumnVisibilitySettings;
  setColumnVisibility: (settings: ColumnVisibilitySettings) => void;
  toggleColumn: (column: keyof ColumnVisibilitySettings) => void;
}

const ColumnVisibilityContext = createContext<ColumnVisibilityContextType | undefined>(undefined);

export const ColumnVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [columnVisibility, setColumnVisibilityState] = useState<ColumnVisibilitySettings>(() => {
    const saved = localStorage.getItem('columnVisibility');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default settings
    return {
      streams: true,
      genre: true,
      releaseDate: true,
      dailyStreams: true,
      averageDailyStreams: true,
      distributor: false,
      trendPercentage: true
    };
  });

  useEffect(() => {
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const setColumnVisibility = (settings: ColumnVisibilitySettings) => {
    setColumnVisibilityState(settings);
  };

  const toggleColumn = (column: keyof ColumnVisibilitySettings) => {
    setColumnVisibilityState(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  return (
    <ColumnVisibilityContext.Provider value={{
      columnVisibility,
      setColumnVisibility,
      toggleColumn
    }}>
      {children}
    </ColumnVisibilityContext.Provider>
  );
};

export const useColumnVisibility = (): ColumnVisibilityContextType => {
  const context = useContext(ColumnVisibilityContext);
  if (!context) {
    throw new Error('useColumnVisibility must be used within a ColumnVisibilityProvider');
  }
  return context;
};
