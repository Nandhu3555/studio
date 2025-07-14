
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { users as initialUsers, type User } from '@/lib/mock-data';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  findUserByEmail: (email: string) => User | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'btechlib_users';

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers) as User[];
        setUsers(parsedUsers.map((u) => ({ ...u, createdAt: new Date(u.createdAt) })));
      }
    } catch (error) {
      console.error("Could not access local storage for users:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } catch (error) {
        console.error("Could not write to local storage for users:", error);
      }
    }
  }, [users, isLoaded]);
  

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
        ...user,
        id: (Math.random() * 1000).toString(),
        createdAt: new Date(),
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
    return newUser;
  };
  
  const findUserByEmail = (email: string): User | undefined => {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <UserContext.Provider value={{ users, addUser, findUserByEmail }}>
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
