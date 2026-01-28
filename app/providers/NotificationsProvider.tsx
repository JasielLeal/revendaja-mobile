import { Notification, useNotifications } from '@/app/(tabs)/home/hooks/useNotifications';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

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

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data as {
                    orderId?: string;
                    orderNumber?: string;
                } | undefined;

                const orderId = data?.orderId ? String(data.orderId) : undefined;
                const orderNumber = data?.orderNumber ? String(data.orderNumber) : undefined;

                if (orderId || orderNumber) {
                    router.push({
                        pathname: '/(tabs)/sales/sales',
                        params: {
                            ...(orderId ? { orderId } : {}),
                            ...(orderNumber ? { orderNumber } : {}),
                        },
                    });
                }
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

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
