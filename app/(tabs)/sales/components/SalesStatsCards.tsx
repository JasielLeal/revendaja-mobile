import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface SalesStatsCardsProps {
    totalRevenue: number;
    totalOrders: number;
    selectedDateFilter: string;
}

export function SalesStatsCards({ totalRevenue, totalOrders, selectedDateFilter }: SalesStatsCardsProps) {
    const colors = useThemeColors();

    return (
        <View className="px-4 mb-2 relative z-10" style={{ marginTop: -30 }}>
            <View className="flex-row gap-3 mb-4">
                {/* Total de Vendas */}
                <View
                    className="flex-1 rounded-3xl p-5"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderWidth: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <View
                            className="w-10 h-10 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: colors.primary + '20' }}
                        >
                            <Ionicons name="trending-up" size={20} color={colors.primary} />
                        </View>
                    </View>
                    <Text
                        className="text-xl font-black"
                        style={{ color: colors.foreground }}
                        allowFontScaling={false}
                    >
                        {formatCurrency(totalRevenue)}
                    </Text>
                    <Text
                        className="text-sm font-medium"
                        style={{ color: colors.mutedForeground }}
                        allowFontScaling={false}
                    >
                        Total em vendas
                    </Text>
                </View>

                {/* Vendas Hoje */}
                <View
                    className="flex-1 rounded-3xl p-5"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderWidth: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <View
                            className="w-10 h-10 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: '#3b82f6' + '20' }}
                        >
                            <Ionicons name="calendar" size={20} color="#3b82f6" />
                        </View>
                        <Text
                            className="text-xs font-semibold px-2 py-1 rounded-full"
                            allowFontScaling={false}
                            style={{
                                backgroundColor: '#3b82f6' + '20',
                                color: '#3b82f6'
                            }}
                        >
                            {selectedDateFilter}
                        </Text>
                    </View>
                    <Text
                        className="text-xl font-black"
                        style={{ color: colors.foreground }}
                        allowFontScaling={false}
                    >
                        {totalOrders}
                    </Text>
                    <Text
                        className="text-sm font-medium"
                        allowFontScaling={false}
                        style={{ color: colors.mutedForeground }}
                    >
                        Vendas realizadas
                    </Text>
                </View>
            </View>
        </View>
    );
}
