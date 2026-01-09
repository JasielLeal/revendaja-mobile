import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    paymentMethod: string;
    customerName: string;
    customerPhone: string;
    createdAt: string;
}

interface SalesItemProps {
    order: Order;
    onPress: () => void;
    getStatusLabel: (status: string) => string;
    getStatusColor: (status: string) => { bg: string; text: string };
}

export function SalesItem({ order, onPress, getStatusLabel, getStatusColor }: SalesItemProps) {
    const colors = useThemeColors();

    return (
        <View className="px-4 mb-4">
            <TouchableOpacity
                className="rounded-xl"
                style={{ borderColor: colors.border }}
                onPress={onPress}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <View>
                                <Ionicons
                                    name="bag-check-outline"
                                    size={Platform.OS === 'ios' ? 30 : 25}
                                    color={colors.primary}
                                    className={`bg-${colors.primary} rounded-2xl p-2 mr-3`}
                                    style={
                                        order.status === 'approved'
                                            ? { backgroundColor: colors.primary + '20'}
                                            : { backgroundColor: colors.primary + '20' }
                                    }
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className="font-semibold text-base"
                                    style={{ color: colors.foreground }}
                                    allowFontScaling={false}
                                >
                                    {order.customerName}
                                </Text>
                                <Text
                                    className="text-sm mb-2"
                                    style={{ color: colors.mutedForeground }}
                                    allowFontScaling={false}
                                >
                                    {order.paymentMethod}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="items-end">
                        <Text className={order.status === 'approved' ? "text-green-600 font-bold text-lg" : "text-yellow-600 font-bold text-lg"} allowFontScaling={false}>
                            {
                                order.status === 'approved' ? <Text allowFontScaling={false}>+{formatCurrency(order.total)}</Text> : <Text allowFontScaling={false}>{formatCurrency(order.total)}</Text>
                            }
                        </Text>
                        <Text className="text-xs" style={{ color: colors.mutedForeground }} allowFontScaling={false}>
                            {formatDate(order.createdAt)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}
