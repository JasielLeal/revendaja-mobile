import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string; // Salvar como string para AsyncStorage
  read: boolean;
  data?: {
    orderId?: string;
    orderNumber?: string;
    total?: number;
  };
}

const NOTIFICATIONS_STORAGE_KEY = "notifications_list";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar notificações do AsyncStorage ao iniciar
  useEffect(() => {
    loadNotificationsFromStorage();
  }, []);

  const loadNotificationsFromStorage = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        const parsed: Notification[] = JSON.parse(saved);
        setNotifications(parsed);
        const unread = parsed.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações do storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNotificationsToStorage = async (
    newNotifications: Notification[]
  ) => {
    try {
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(newNotifications)
      );
    } catch (error) {
      console.error("Erro ao salvar notificações no storage:", error);
    }
  };

  useEffect(() => {
    // Listener para notificações recebidas enquanto app está aberto
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const newNotification: Notification = {
          id: notification.request.identifier,
          title: notification.request.content.title || "Nova notificação",
          body: notification.request.content.body || "",
          timestamp: new Date().toISOString(),
          read: false,
          data: notification.request.content.data as any,
        };

        // Adiciona a notificação ao topo da lista
        setNotifications((prev) => {
          const updated = [newNotification, ...prev];
          saveNotificationsToStorage(updated);
          return updated;
        });
        setUnreadCount((prev) => prev + 1);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      saveNotificationsToStorage(updated);
      return updated;
    });
    setUnreadCount((prev) => prev + 1);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      );

      // Atualizar contagem de não lidas
      const nowUnread = updated.filter((n) => !n.read).length;
      setUnreadCount(nowUnread);

      // Salvar no storage
      saveNotificationsToStorage(updated);

      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({ ...notif, read: true }));
      setUnreadCount(0);
      saveNotificationsToStorage(updated);
      return updated;
    });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notif) => notif.id !== id);
      saveNotificationsToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotificationsToStorage([]);
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
