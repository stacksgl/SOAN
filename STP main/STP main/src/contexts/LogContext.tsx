import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

interface LogContextValue {
  logs: LogEntry[];
  isLogWindowVisible: boolean;
  setLogWindowVisible: (visible: boolean) => void;
  addLog: (level: LogEntry['level'], message: string) => void;
  clearLogs: () => void;
}

const LogContext = createContext<LogContextValue | undefined>(undefined);

// Mock data for testing
const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toLocaleTimeString(),
    level: 'info',
    message: 'System initialized successfully'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
    level: 'success',
    message: 'Connected to Spotify API'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
    level: 'warning',
    message: 'Rate limit approaching: 95/100 requests'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    level: 'error',
    message: 'Failed to scrape playlist: timeout error'
  }
];

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [isLogWindowVisible, setLogWindowVisible] = useState(false);

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep only last 100 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LogContext.Provider
      value={{
        logs,
        isLogWindowVisible,
        setLogWindowVisible,
        addLog,
        clearLogs
      }}
    >
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}