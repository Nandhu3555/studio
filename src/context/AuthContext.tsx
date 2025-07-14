
'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type User } from '@/lib/mock-data';
import { useUsers } from './UserContext';

type LoggedInUser = User & { name: string; email: string };

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: LoggedInUser | null;
  login: (email: string, role: 'student' | 'admin') => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  const { findUserByEmail } = useUsers();

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const admin = localStorage.getItem('isAdmin') === 'true';
      const storedUser = localStorage.getItem('user');
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
        console.error("Could not access local storage for auth:", error);
    } finally {
        setIsAuthReady(true);
    }
  }, []);

  const login = (email: string, role: 'student' | 'admin') => {
    let userData: LoggedInUser | null = null;
    
    if (role === 'admin') {
        userData = { 
            id: 'admin',
            name: 'Admin User', 
            email, 
            createdAt: new Date(),
            branch: 'Administration',
            year: 0
        };
    } else {
        const foundUser = findUserByEmail(email);
        if (foundUser) {
            userData = foundUser;
        }
    }
    
    if (userData) {
      setIsLoggedIn(true);
      setIsAdmin(role === 'admin');
      setUser(userData);
      
      try {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('isAdmin', role === 'admin' ? 'true' : 'false');
          localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
          console.error("Could not access local storage:", error);
      }
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    
    try {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user');
    } catch (error) {
        console.error("Could not access local storage:", error);
    }
    
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
