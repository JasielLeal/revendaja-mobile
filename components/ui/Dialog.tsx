import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';



interface DialogProps {
    visible: boolean;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
    visible,
    title,
    description,
    cancelText = 'Cancel',
    confirmText = 'Delete alert',
    onCancel,
    onConfirm,
    isLoading = false,
}) => {
    const colors = useThemeColors();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View className="flex-1 items-center justify-center bg-black/60">
                <View className="w-4/5 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: colors.card }}>
                    <Text className="text-xl font-semibold text-center mb-1" style={{ color: colors.foreground }}>{title}</Text>
                    <Text className="text-sm" style={{ color: colors.accentForeground, textAlign: 'center', marginBottom: 24 }}>{description}</Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            className="flex-1 py-3 mr-2 rounded-full"
                            onPress={isLoading ? undefined : onCancel}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            <Text className="text-center font-medium" style={{ color: colors.destructive }}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 py-3 ml-2 rounded-full flex-row items-center justify-center"
                            onPress={isLoading ? undefined : onConfirm}
                            activeOpacity={0.8}
                            style={{ backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color={colors.primaryForeground} />
                            ) : (
                                <Text className="text-center font-medium" style={{ color: colors.primaryForeground }}>{confirmText}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
