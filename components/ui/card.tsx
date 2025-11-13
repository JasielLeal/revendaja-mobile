import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    style?: ViewStyle;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
    style?: ViewStyle;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    style?: TextStyle;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
    style?: ViewStyle;
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
    style?: TextStyle;
}

export const Card: React.FC<CardProps> & {
    Header: React.FC<CardHeaderProps>;
    Title: React.FC<CardTitleProps>;
    Content: React.FC<CardContentProps>;
    Description: React.FC<CardDescriptionProps>;
} = ({ children, className, style }) => {
    const colors = useThemeColors();

    const cardStyle: ViewStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        ...style,
    };

    return (
        <View className={className} style={cardStyle}>
            {children}
        </View>
    );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className, style }) => {
    const headerStyle: ViewStyle = {
        padding: 24,
        paddingBottom: 0,
        ...style,
    };

    return (
        <View className={className} style={headerStyle}>
            {children}
        </View>
    );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, className, style }) => {
    const colors = useThemeColors();

    const titleStyle: TextStyle = {
        fontSize: 18,
        fontWeight: '600',
        color: colors.cardForeground,
        ...style,
    };

    return (
        <Text className={className} style={titleStyle}>
            {children}
        </Text>
    );
};

const CardContent: React.FC<CardContentProps> = ({ children, className, style }) => {
    const contentStyle: ViewStyle = {
        padding: 24,
        ...style,
    };

    return (
        <View className={className} style={contentStyle}>
            {children}
        </View>
    );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className, style }) => {
    const colors = useThemeColors();

    const descriptionStyle: TextStyle = {
        fontSize: 14,
        color: colors.mutedForeground,
        ...style,
    };

    return (
        <Text className={className} style={descriptionStyle}>
            {children}
        </Text>
    );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Description = CardDescription;