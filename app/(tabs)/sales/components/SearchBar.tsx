import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (text: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
    const colors = useThemeColors();

    return (
        <View className="px-4 mb-4">
            <View
                className="flex-row items-center rounded-2xl px-4 py-3"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: 1,
                }}
            >
                <Ionicons name="search" size={20} color={colors.mutedForeground} />
                <TextInput
                    className="flex-1 ml-3 text-base"
                    placeholder="Buscar por cliente ou produto..."
                    placeholderTextColor={colors.mutedForeground}
                    style={{ color: colors.foreground }}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                />
                {searchQuery !== '' && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
