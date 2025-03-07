import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Notification {
    id: string;
    title: string;
    body: string;
    timestamp: string;
    isRead: boolean;
}

interface NotificationsContextProps {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    clearNotifications: () => void;
}

export const NotificationsContext = createContext<NotificationsContextProps>({
    notifications: [],
    unreadCount: 0,
    markAsRead: () => {},
    clearNotifications: () => {},
});

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Atualizar contador automaticamente sempre que as notificações mudarem
    useEffect(() => {
        const count = notifications.filter((notif) => !notif.isRead).length;
        setUnreadCount(count);
    }, [notifications]);

    // Salvar notificações no AsyncStorage
    const saveNotification = async (notification: Notification) => {
        try {
            const stored = await AsyncStorage.getItem("notifications");
            const parsed: Notification[] = stored ? JSON.parse(stored) : [];
            const newNotifications = [{ ...notification, isRead: false }, ...parsed];

            await AsyncStorage.setItem("notifications", JSON.stringify(newNotifications));
            setNotifications(newNotifications);
        } catch (error) {
            console.error("Erro ao salvar notificação:", error);
        }
    };

    // Listener para capturar notificações recebidas quando o app está em primeiro plano
    useEffect(() => {
        const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
            const newNotification: Notification = {
                id: notification.request.identifier,
                title: notification.request.content.title ?? "Sem título",
                body: notification.request.content.body ?? "Sem conteúdo",
                timestamp: new Date().toISOString(),
                isRead: false,
            };
            saveNotification(newNotification);
        });

        // Listener para capturar notificações quando o app está em segundo plano ou fechado
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const notification = response.notification;
            const newNotification: Notification = {
                id: notification.request.identifier,
                title: notification.request.content.title ?? "Sem título",
                body: notification.request.content.body ?? "Sem conteúdo",
                timestamp: new Date().toISOString(),
                isRead: true, // Ao interagir, já marcamos como lida
            };
            saveNotification(newNotification);
        });

        return () => {
            foregroundSubscription.remove();
            backgroundSubscription.remove();
        };
    }, []);

    // Carregar notificações salvas no AsyncStorage
    useEffect(() => {
        const loadNotifications = async () => {
            const stored = await AsyncStorage.getItem("notifications");
            if (stored) {
                setNotifications(JSON.parse(stored));
            }
        };
        loadNotifications();
    }, []);

    // Marcar notificação como lida
    const markAsRead = async (id: string) => {
        const updatedNotifications = notifications.map((notif) =>
            notif.id === id ? { ...notif, isRead: true } : notif
        );

        await AsyncStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        setNotifications(updatedNotifications);
    };

    // Função para limpar notificações
    const clearNotifications = async () => {
        await AsyncStorage.removeItem("notifications");
        setNotifications([]);
    };

    return (
        <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, clearNotifications }}>
            {children}
        </NotificationsContext.Provider>
    );
};
