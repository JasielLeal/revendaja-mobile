import { Notification, useNotifications } from '@/app/(tabs)/home/hooks/useNotifications';
import React, { createContext, ReactNode, useContext } from 'react';

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

interface NotificationsProviderProps {
    children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
    const notificationsManager = useNotifications();

    return (
        <NotificationsContext.Provider value={notificationsManager}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotificationsContext() {
    const context = useContext(NotificationsContext);

    if (!context) {
        throw new Error('useNotificationsContext must be used within NotificationsProvider');
    }

    return context;
}
