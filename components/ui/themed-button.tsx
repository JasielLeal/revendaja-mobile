import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    onPress?: () => void;
    className?: string;
    style?: ViewStyle;
}

export const ThemedButton: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    onPress,
    className,
    style,
}) => {
    const colors = useThemeColors();

    const baseStyle: ViewStyle = {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    };

    const variantStyles: Record<string, ViewStyle> = {
        primary: { backgroundColor: colors.primary },
        secondary: { backgroundColor: colors.secondary },
        destructive: { backgroundColor: colors.destructive },
    };

    const textVariantStyles: Record<string, TextStyle> = {
        primary: { color: colors.primaryForeground },
        secondary: { color: colors.secondaryForeground },
        destructive: { color: colors.destructiveForeground },
    };

    const sizeStyles: Record<string, ViewStyle> = {
        sm: { paddingHorizontal: 12, paddingVertical: 8 },
        md: { paddingHorizontal: 16, paddingVertical: 12 },
        lg: { paddingHorizontal: 24, paddingVertical: 16 },
    };

    const textSizeStyles: Record<string, TextStyle> = {
        sm: { fontSize: 14 },
        md: { fontSize: 16 },
        lg: { fontSize: 18 },
    };

    const buttonStyle = [
        baseStyle,
        variantStyles[variant],
        sizeStyles[size],
        style,
    ];

    const textStyle = [
        { fontWeight: '600' as const },
        textVariantStyles[variant],
        textSizeStyles[size],
    ];

    return (
        <TouchableOpacity
            className={className}
            style={buttonStyle}
            onPress={onPress}
        >
            <Text style={textStyle}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};