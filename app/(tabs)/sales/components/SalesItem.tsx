import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
                className="rounded-xl pb-4"
                style={{ borderColor: colors.border }}
                onPress={onPress}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                            <View>
                                <Ionicons
                                    name="bag-check-outline"
                                    size={20}
                                    color={colors.primary}
                                    borderWidth={1}
                                    borderColor={colors.border}
                                    className={`border border-${colors.border} p-4 rounded-xl mr-3`}
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
                                <View
                                    className="rounded-full px-3 py-1"
                                    style={{
                                        backgroundColor: getStatusColor(order.status).bg,
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    <Text
                                        className="text-xs font-medium"
                                        allowFontScaling={false}
                                        style={{
                                            color: getStatusColor(order.status).text
                                        }}
                                    >
                                        {getStatusLabel(order.status)}
                                    </Text>
                                </View>
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
