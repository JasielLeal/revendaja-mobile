import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    backgroundColor?: string;
    textColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    name,
    size = 'md',
    backgroundColor,
    textColor,
    style,
    textStyle,
    className,
}) => {

    // Função para extrair iniciais do nome
    const getInitials = (fullName: string): string => {
        const names = fullName.trim().split(/\s+/); // Divide por espaços e remove espaços extras

        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        // Pega a primeira letra do primeiro nome e do último nome
        const firstInitial = names[0].charAt(0).toUpperCase();
        const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

        return firstInitial + lastInitial;
    };


    // Tamanhos predefinidos
    const sizeStyles: Record<string, { container: ViewStyle; text: TextStyle }> = {
        sm: {
            container: { width: 32, height: 32, borderRadius: 16 },
            text: { fontSize: 12, fontWeight: '600' },
        },
        md: {
            container: { width: 40, height: 40, borderRadius: 20 },
            text: { fontSize: 14, fontWeight: '600' },
        },
        lg: {
            container: { width: 48, height: 48, borderRadius: 24 },
            text: { fontSize: 16, fontWeight: '600' },
        },
        xl: {
            container: { width: 64, height: 64, borderRadius: 32 },
            text: { fontSize: 20, fontWeight: '700' },
        },
    };

    const initials = getInitials(name);
    const defaultBackgroundColor = backgroundColor;
    const defaultTextColor = textColor || '#FFFFFF';

    const containerStyle: ViewStyle = {
        ...sizeStyles[size].container,
        backgroundColor: defaultBackgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };

    const finalTextStyle: TextStyle = {
        ...sizeStyles[size].text,
        color: defaultTextColor,
        ...textStyle,
    };

    return (
        <View className={className} style={containerStyle}>
            <Text style={finalTextStyle}>
                {initials}
            </Text>
        </View>
    );
};