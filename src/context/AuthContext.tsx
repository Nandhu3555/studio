
'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { type User } from '@/lib/mock-data';
import { useUsers } from './UserContext';

type LoggedInUser = User & { name: string; email: string };

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: LoggedInUser | null;
  login: (email: string, role: 'student' | 'admin') => void;
  logout: () => void;
  updateUser: (data: Partial<LoggedInUser>) => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use a BroadcastChannel to sync auth state across tabs
const authChannel = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<LoggedInUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  const { findUserByEmail, updateUser: updateUserInUserContext } = useUsers();

  const loadStateFromLocalStorage = useCallback(() => {
    try {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const admin = localStorage.getItem('isAdmin') === 'true';
      const storedEmail = localStorage.getItem('userEmail');
      
      setIsLoggedIn(loggedIn);
      setIsAdmin(admin);

      if (loggedIn && storedEmail) {
        if (admin) {
            setUser({ 
                id: 'admin',
                name: 'Admin User', 
                email: storedEmail,
                password: 'nandhu@sunny', // Prototype only
                createdAt: new Date(),
                branch: 'Administration',
                year: 0,
            });
        } else {
            const foundUser = findUserByEmail(storedEmail);
            setUser(foundUser || null);
        }
      } else {
        setUser(null);
      }

    } catch (error) {
        console.error("Could not access local storage for auth:", error);
    } finally {
        setIsAuthReady(true);
    }
  }, [findUserByEmail]);

  useEffect(() => {
    loadStateFromLocalStorage();

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_CHANGE') {
        loadStateFromLocalStorage();
      }
    };

    authChannel?.addEventListener('message', handleMessage);

    return () => {
      authChannel?.removeEventListener('message', handleMessage);
    };
  }, [loadStateFromLocalStorage]);

  const notifyAuthChange = () => {
    authChannel?.postMessage({ type: 'AUTH_CHANGE' });
  };

  const login = (email: string, role: 'student' | 'admin') => {
    let userData: LoggedInUser | null = null;
    
    if (role === 'admin') {
        userData = { 
            id: 'admin',
            name: 'Admin User', 
            email, 
            password: 'nandhu@sunny', // This is just for the prototype
            createdAt: new Date(),
            branch: 'Administration',
            year: 0,
            avatarUrl: undefined,
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
          // Store only non-sensitive identifier, not the whole user object
          localStorage.setItem('userEmail', userData.email);
          notifyAuthChange();
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
        localStorage.removeItem('userEmail');
        notifyAuthChange();
    } catch (error) {
        console.error("Could not access local storage:", error);
    }
    
    router.push('/login');
  };

  const updateUser = (data: Partial<LoggedInUser>) => {
    if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        updateUserInUserContext(updatedUser.id, data);
        try {
            // If email is changed, update it in localStorage
            if (data.email) {
                localStorage.setItem('userEmail', data.email);
            }
            notifyAuthChange();
        } catch (error) {
            console.error("Could not access local storage:", error);
        }
    }
  };


  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, user, login, logout, isAuthReady, updateUser }}>
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
