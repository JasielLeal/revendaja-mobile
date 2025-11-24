import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface DateFilterDropdownProps {
    visible: boolean;
    dateFilters: string[];
    selectedDateFilter: string;
    onClose: () => void;
    onFilterSelect: (filter: string) => void;
    onCustomDatePress: () => void;
}

export function DateFilterDropdown({
    visible,
    dateFilters,
    selectedDateFilter,
    onClose,
    onFilterSelect,
    onCustomDatePress
}: DateFilterDropdownProps) {
    const colors = useThemeColors();

    if (!visible) return null;

    return (
        <>
            {/* Backdrop */}
            <TouchableOpacity
                className="absolute inset-0 z-10"
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                onPress={onClose}
                activeOpacity={1}
            />

            {/* Dropdown */}
            <View className="absolute top-[100px] left-4 right-4 z-20">
                <View
                    className="rounded-3xl p-4"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderWidth: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Text
                        className="text-lg font-bold mb-3"
                        style={{ color: colors.foreground }}
                    >
                        Filtrar por período
                    </Text>
                    {dateFilters.map((filter) => {
                        const isSelected = selectedDateFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                className="flex-row items-center justify-between py-3 px-2"
                                onPress={() => {
                                    if (filter === 'Personalizado') {
                                        onCustomDatePress();
                                    } else {
                                        onFilterSelect(filter);
                                    }
                                }}
                                style={{
                                    backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
                                    borderRadius: 12,
                                }}
                            >
                                <View className="flex-row items-center">
                                    <Ionicons
                                        name={filter === 'Hoje' ? 'today' :
                                            filter === 'Esta semana' ? 'calendar' :
                                                filter === 'Este mês' ? 'calendar-outline' :
                                                    filter === 'Personalizado' ? 'calendar-sharp' : 'time'}
                                        size={20}
                                        color={isSelected ? colors.primary : colors.mutedForeground}
                                    />
                                    <Text
                                        className="ml-3 text-base font-medium"
                                        style={{
                                            color: isSelected ? colors.primary : colors.foreground
                                        }}
                                    >
                                        {filter}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </>
    );
}
