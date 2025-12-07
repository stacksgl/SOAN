import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchMe, logoutSession, loginWithEmailSession, registerWithEmailSession } from '@/lib/authSession';

interface User {
  uid: string;
  email: string | null;
  name?: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await fetchMe();
        if (userData) {
          setUser({
            uid: userData.uid,
            email: userData.email,
            name: userData.displayName || userData.email?.split('@')[0] || 'User'
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const firebaseUser = await loginWithEmailSession(email, password);
      
      // Set user from Firebase data
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const firebaseUser = await registerWithEmailSession(name, email, password);
      
      // Set user from Firebase data
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || name
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutSession();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user state even if API call fails
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...');
      const userData = await fetchMe();
      console.log('Fetched user data:', userData);
      if (userData) {
        const newUser = {
          uid: userData.uid,
          email: userData.email,
          name: userData.displayName || userData.email?.split('@')[0] || 'User'
        };
        console.log('Setting user:', newUser);
        setUser(newUser);
      } else {
        console.log('No user data, setting null');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

