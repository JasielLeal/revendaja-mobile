import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface DialogProps {
    visible: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
    showCancel?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
    visible,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false,
    showCancel = true,
}) => {
    const colors = useThemeColors();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View className="flex-1 items-center justify-center bg-black/60">
                <View
                    className="w-4/5 rounded-2xl p-6 shadow-lg"
                    style={{ backgroundColor: colors.card }}
                >
                    <Text
                        className="text-xl font-semibold text-center mb-1"
                        allowFontScaling={false}
                        style={{ color: colors.foreground }}
                    >
                        {title}
                    </Text>

                    <Text
                        className="text-sm text-center mb-6"
                        allowFontScaling={false}
                        style={{ color: colors.accentForeground }}
                    >
                        {description}
                    </Text>

                    <View className="flex-row">
                        {showCancel && (
                            <TouchableOpacity
                                className="flex-1 py-3 mr-2 rounded-full"
                                onPress={isLoading ? undefined : onCancel}
                                activeOpacity={0.8}
                                disabled={isLoading}
                            >
                                <Text
                                    className="text-center font-medium"
                                    allowFontScaling={false}
                                    style={{ color: colors.destructive }}
                                >
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            className={`flex-1 py-3 rounded-full flex-row items-center justify-center ${showCancel ? 'ml-2' : ''
                                }`}
                            onPress={isLoading ? undefined : onConfirm}
                            activeOpacity={0.8}
                            style={{
                                backgroundColor: colors.primary,
                                opacity: isLoading ? 0.7 : 1,
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={colors.primaryForeground}
                                />
                            ) : (
                                <Text
                                    className="text-center font-medium"
                                    allowFontScaling={false}
                                    style={{ color: colors.primaryForeground }}
                                >
                                    {confirmText}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
