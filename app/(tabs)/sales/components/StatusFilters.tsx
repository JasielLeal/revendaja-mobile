import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StatusFiltersProps {
    filters: string[];
    selectedFilter: string;
    ordersByStatus: {
        total: number;
        approved: number;
        pending: number;
    };
    onFilterSelect: (filter: string) => void;
    getStatusLabel: (status: string) => string;
}

export function StatusFilters({ filters, selectedFilter, ordersByStatus, onFilterSelect, getStatusLabel }: StatusFiltersProps) {
    const colors = useThemeColors();

    return (
        <View className="px-4 mb-6">
            <View className="flex-row justify-between gap-2">
                {filters.map((filter) => {
                    const isSelected = selectedFilter === filter;
                    const filterCount = filter === 'Todos'
                        ? ordersByStatus.total
                        : filter === 'approved'
                            ? ordersByStatus.approved
                            : ordersByStatus.pending;

                    return (
                        <TouchableOpacity
                            key={filter}
                            className="flex-row items-center px-3 py-2 rounded-2xl"
                            style={{
                                backgroundColor: isSelected ? colors.primary : colors.card,
                                borderColor: isSelected ? colors.primary : colors.border,
                                borderWidth: 1,
                            }}
                            onPress={() => onFilterSelect(filter)}
                        >
                            <Text
                                className="font-semibold"
                                style={{
                                    color: isSelected ? colors.primaryForeground : colors.foreground,
                                }}
                            >
                                {getStatusLabel(filter)}
                            </Text>
                            <View
                                className="ml-2 px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: isSelected ? colors.primaryForeground + '20' : colors.muted,
                                }}
                            >
                                <Text
                                    className="text-xs font-bold"
                                    style={{
                                        color: isSelected ? colors.primaryForeground : colors.mutedForeground,
                                    }}
                                >
                                    {filterCount}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
