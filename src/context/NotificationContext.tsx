
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { type Notification as NotificationType } from '@/lib/mock-data';

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_STORAGE_KEY = 'btechlib_notifications';
const notificationChannel = typeof window !== 'undefined' ? new BroadcastChannel('notifications') : null;


export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const loadNotificationsFromStorage = useCallback(() => {
    try {
      const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications.map((n: any) => ({...n, timestamp: new Date(n.timestamp)})));
      }
    } catch (error) {
      console.error("Could not access local storage for notifications:", error);
    }
  }, []);

  useEffect(() => {
    loadNotificationsFromStorage();

    const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'NOTIFICATION_CHANGE') {
            loadNotificationsFromStorage();
        }
    };
    
    notificationChannel?.addEventListener('message', handleMessage);

    return () => {
        notificationChannel?.removeEventListener('message', handleMessage);
    };

  }, [loadNotificationsFromStorage]);

  const notifyChange = () => {
    notificationChannel?.postMessage({ type: 'NOTIFICATION_CHANGE' });
  };


  const addNotification = (notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: NotificationType = {
        ...notification,
        id: (Math.random() * 1000).toString(),
        timestamp: new Date(),
        read: false,
    };
    
    setNotifications(prev => {
        const updatedNotifications = [newNotification, ...prev];
        try {
            localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
            notifyChange();
        } catch (error) {
            console.error("Could not write to local storage for notifications:", error);
        }
        return updatedNotifications;
    });
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
