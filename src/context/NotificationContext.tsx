
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { type Notification as NotificationType } from '@/lib/mock-data';

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = 'btechlib_notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Could not access local storage for notifications:", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error("Could not write to local storage for notifications:", error);
      }
    }
  }, [notifications, isLoaded]);

  const addNotification = (notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationType = {
        ...notification,
        id: (Math.random() * 1000).toString(),
        timestamp: new Date(),
        read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
