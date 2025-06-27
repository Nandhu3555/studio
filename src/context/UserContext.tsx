'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { users as initialUsers, type User } from '@/lib/mock-data';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);

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
