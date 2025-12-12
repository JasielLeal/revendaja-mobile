import type { Notification } from '@/app/(tabs)/home/hooks/useNotifications';
import { useNotificationsContext } from '@/app/providers/NotificationsProvider';
import { NotificationsSkeleton } from '@/components/skeletons';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface NotificationsCenterProps {
    visible: boolean;
    onClose: () => void;
}

export function NotificationsCenter({ visible, onClose }: NotificationsCenterProps) {
    const colors = useThemeColors();
    const { notifications, unreadCount, isLoading, markAsRead, deleteNotification: deleteNotif, clearAll } = useNotificationsContext();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Agora';
        if (minutes < 60) return `${minutes}m atrás`;
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        return formatDate(date);
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            className="mx-3 my-2 flex-row items-center p-4 rounded-2xl"
            style={{
                backgroundColor: item.read ? colors.card : colors.primary + '15',
                borderLeftWidth: 4,
                borderLeftColor: item.read ? 'transparent' : colors.primary,
            }}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.7}
        >
            {/* Ícone */}
            <View
                className="p-3 rounded-full mr-4"
                style={{
                    backgroundColor: colors.primary,
                }}
            >
                <Ionicons name="bag-check" size={24} color="#fff" />
            </View>

            {/* Conteúdo */}
            <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                    <Text
                        className="font-bold text-base flex-1"
                        style={{
                            color: colors.foreground,
                        }}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                    <Text
                        className="text-xs ml-2"
                        style={{
                            color: colors.mutedForeground,
                        }}
                    >
                        {formatTime(item.timestamp)}
                    </Text>
                </View>

                <Text
                    className="text-sm"
                    style={{
                        color: colors.mutedForeground,
                    }}
                    numberOfLines={2}
                >
                    {item.body}
                </Text>
            </View>

            {/* Botão de deletar */}
            <TouchableOpacity
                className="p-2 ml-2"
                onPress={(e) => {
                    e.stopPropagation();
                    deleteNotif(item.id);
                }}
            >
                <Ionicons name="close" size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View
                    className="flex-1 mt-16 rounded-t-3xl"
                    style={{ backgroundColor: colors.background }}
                >
                    {/* Header */}
                    <View
                        className="flex-row items-center justify-between p-4 border-b"
                        style={{ borderBottomColor: colors.border }}
                    >
                        <View>
                            <Text
                                className="text-2xl font-bold"
                                style={{ color: colors.foreground }}
                            >
                                Notificações
                            </Text>
                            {unreadCount > 0 && (
                                <Text
                                    className="text-xs mt-1"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    {unreadCount} não lida{unreadCount !== 1 ? 's' : ''}
                                </Text>
                            )}
                        </View>

                        <View className="flex-row items-center gap-3">

                            <TouchableOpacity
                                className="p-2 rounded-full"
                                style={{ backgroundColor: colors.muted }}
                                onPress={onClose}
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={colors.foreground}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Lista de Notificações */}
                    {isLoading ? (
                        <NotificationsSkeleton />
                    ) : notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            renderItem={renderNotificationItem}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 20, paddingTop: 12 }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefreshing}
                                    onRefresh={handleRefresh}
                                    tintColor={colors.primary}
                                />
                            }
                            style={{ backgroundColor: colors.background }}
                        />
                    ) : (
                        <View
                            className="flex-1 items-center justify-center"
                            style={{ backgroundColor: colors.background }}
                        >
                            <Ionicons
                                name="notifications-off-outline"
                                size={64}
                                color={colors.mutedForeground}
                                style={{ marginBottom: 16 }}
                            />
                            <Text
                                className="text-lg font-semibold text-center"
                                style={{ color: colors.foreground, marginBottom: 8 }}
                            >
                                Sem notificações
                            </Text>
                            <Text
                                className="text-sm text-center px-4"
                                style={{ color: colors.mutedForeground }}
                            >
                                Você será notificado sobre novas vendas e eventos importantes
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}
