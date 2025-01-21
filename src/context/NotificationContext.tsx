import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Tipagem da notificação
type Notification = {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean; // Indica se a notificação foi lida
};

// Tipagem do contexto
type NotificationContextType = {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    addNotification: (title: string, message: string, date: string) => void;
    clearNotifications: () => void;
};

// Criação do contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Chave usada para armazenar notificações no AsyncStorage
const NOTIFICATIONS_STORAGE_KEY = "notifications";

// Provider do contexto
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    console.log(notifications)
    // Carregar notificações do AsyncStorage ao inicializar
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
                if (storedNotifications) {
                    setNotifications(JSON.parse(storedNotifications));
                }
            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
            }
        };

        loadNotifications();
    }, []);

    // Atualizar o AsyncStorage sempre que as notificações mudarem
    useEffect(() => {
        const saveNotifications = async () => {
            try {
                await AsyncStorage.setItem(
                    NOTIFICATIONS_STORAGE_KEY,
                    JSON.stringify(notifications)
                );
            } catch (error) {
                console.error("Erro ao salvar notificações:", error);
            }
        };

        saveNotifications();
    }, [notifications]);

    // Função para adicionar uma nova notificação
    const addNotification = (title: string, message: string, date: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [{ id, title, message, date, read: false }, ...prev]);
    };

    // Marcar notificação como lida
    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    // Limpar todas as notificações
    const clearNotifications = async () => {
        try {
            await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
            setNotifications([]);
        } catch (error) {
            console.error("Erro ao limpar notificações:", error);
        }
    };

    // Contar notificações não lidas
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    // Configuração do Expo para receber notificações push
    useEffect(() => {
        const registerForPushNotifications = async () => {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== "granted") {
                    console.warn("Falha ao obter permissão para notificações push!");
                    return;
                }
                // O token de notificações push não é necessário aqui, mas poderia ser usado para enviar notificações
            } else {
                console.warn("Notificações push só funcionam em dispositivos físicos.");
            }
        };

        registerForPushNotifications();

        // Lida com a notificação recebida
        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            const { title, body } = notification.request.content;
            const date = new Date().toISOString();
            addNotification(title || "Nova notificação", body || "", date);
        });

        return () => subscription.remove();
    }, []);

    return (
        <NotificationContext.Provider
            value={{ notifications, unreadCount, markAsRead, addNotification, clearNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Hook para acessar o contexto
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification deve ser usado dentro de um NotificationProvider");
    }
    return context;
};
