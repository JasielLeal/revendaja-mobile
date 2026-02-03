import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";

interface InputProps extends Omit<TextInputProps, 'placeholderTextColor'> {
    label?: string;
    error?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
}

export default function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    isPassword,
    ...props
}: InputProps) {
    const colors = useThemeColors();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="mb-4">
            {label && (
                <Text
                    style={{ color: colors.foreground }}
                    className="mb-2 font-medium"
                >
                    {label}
                </Text>
            )}

            <View
                className="w-full rounded-2xl px-4 py-4 justify-center flex-row items-center"
                style={{
                    
                    backgroundColor: colors.card,
                    gap: 8,
                }}
            >
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={colors.mutedForeground}
                    />
                )}

                <TextInput
                    className="flex-1 text-base"
                    style={{
                        color: colors.foreground,
                        paddingVertical: 0,
                        minHeight: 24,
                        textAlignVertical: 'center',
                    }}
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={isPassword && !showPassword}
                    autoCapitalize={"none"}
                    {...props}
                />

                {isPassword ? (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color={colors.mutedForeground}
                        />
                    </TouchableOpacity>
                ) : rightIcon ? (
                    <Ionicons
                        name={rightIcon}
                        size={20}
                        color={colors.mutedForeground}
                    />
                ) : null}
            </View>

            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
