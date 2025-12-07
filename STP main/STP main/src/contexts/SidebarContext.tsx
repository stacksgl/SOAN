import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isCompletelyClosed: boolean;
  setIsCompletelyClosed: (closed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isCompletelyClosed, setIsCompletelyClosed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCompletelyClosed, setIsCompletelyClosed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarState must be used within a SidebarProvider');
  }
  return context;
};

