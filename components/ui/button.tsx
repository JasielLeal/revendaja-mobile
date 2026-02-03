import { useThemeColors } from "@/hooks/use-theme-colors";
import { Text, TouchableOpacity } from "react-native";

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
    name: React.ReactNode;
    disabled?: boolean;
    onPress?: () => void;
    variant?: ButtonVariant;
}

export default function Button({ name, disabled, onPress, variant = 'primary' }: ButtonProps) {

    const colors = useThemeColors();

    const getBackgroundColor = () => {
        if (disabled) {
            // Quando disabled, usa a cor primary com opacidade reduzida
            switch (variant) {
                case 'primary':
                    return colors.primary;
                case 'secondary':
                    return colors.foreground;
                case 'outline':
                case 'ghost':
                    return 'transparent';
                default:
                    return colors.primary;
            }
        }
        switch (variant) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.foreground;
            case 'outline':
            case 'ghost':
                return 'transparent';
            default:
                return colors.primary;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
                return '#ffffff';
            case 'secondary':
                return colors.background;
            case 'outline':
            case 'ghost':
                return colors.foreground;
            default:
                return '#ffffff';
        }
    };

    const getBorderStyle = () => {
        if (variant === 'outline') {
            return {
                borderWidth: 1.5,
                borderColor: colors.border,
            };
        }
        return {};
    };

    return (
        <TouchableOpacity
            style={{
                backgroundColor: getBackgroundColor(),
                opacity: disabled ? 0.6 : 1,
                gap: 8,
                ...getBorderStyle(),
            }}
            className="w-full flex-row items-center justify-center py-4 rounded-2xl mt-4"
            disabled={disabled}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {typeof name === 'string' ? (
                <Text style={{ color:  getTextColor() }} className="font-bold text-base">
                    {name}
                </Text>
            ) : (
                name
            )}
        </TouchableOpacity>
    )
}