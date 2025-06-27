'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, role: 'student' | 'admin') => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
      const admin = sessionStorage.getItem('isAdmin') === 'true';
      const storedUser = sessionStorage.getItem('user');
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch (error) {
        console.error("Could not access session storage for auth:", error);
    } finally {
        setIsAuthReady(true);
    }
  }, []);

  const login = (email: string, role: 'student' | 'admin') => {
    const userData = { name: role === 'admin' ? 'Admin User' : 'B.Tech Student', email };
    setIsLoggedIn(true);
    setIsAdmin(role === 'admin');
    setUser(userData);
    
    try {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('isAdmin', role === 'admin' ? 'true' : 'false');
        sessionStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
        console.error("Could not access session storage:", error);
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    
    try {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('user');
    } catch (error) {
        console.error("Could not access session storage:", error);
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
