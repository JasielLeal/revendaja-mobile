import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SalesHeaderProps {
    selectedDateFilter: string;
    showDatePicker: boolean;
    onToggleDatePicker: () => void;
}

export function SalesHeader({ selectedDateFilter, showDatePicker, onToggleDatePicker }: SalesHeaderProps) {
    const colors = useThemeColors();

    return (
        <View className="px-4 pt-12 pb-6">
            <View className="flex-row items-center justify-between mb-6 mt-5">
                <View className="flex-1">
                    <Text
                        className="text-lg font-medium mb-1"
                        style={{ color: colors.primaryForeground + '80' }}
                    >
                        Gestão de vendas
                    </Text>
                    <Text
                        className="text-3xl font-black tracking-tight"
                        style={{ color: colors.primaryForeground }}
                    >
                        Vendas
                    </Text>
                </View>

                <TouchableOpacity
                    className="flex-row items-center bg-white/20 rounded-2xl px-4 py-2"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                    onPress={onToggleDatePicker}
                >
                    <Ionicons name="calendar" size={20} color={colors.primaryForeground} />
                    <Text
                        className="ml-2 text-sm font-semibold"
                        style={{ color: colors.primaryForeground }}
                    >
                        {selectedDateFilter}
                    </Text>
                    <Ionicons
                        name={showDatePicker ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={colors.primaryForeground}
                        className="ml-1"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
