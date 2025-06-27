'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users as initialUsers, type User } from '@/lib/mock-data';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'btechlib_users';

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedUsers = sessionStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers) as User[];
          return parsedUsers.map((u) => ({ ...u, createdAt: new Date(u.createdAt) }));
        }
      }
    } catch (error) {
      console.error("Could not access session storage for users:", error);
    }
    return initialUsers;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Could not write to session storage for users:", error);
    }
  }, [users]);
  

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
        ...user,
        id: (Math.random() * 1000).toString(),
        createdAt: new Date(),
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}
