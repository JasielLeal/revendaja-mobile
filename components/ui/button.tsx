import { useThemeColors } from "@/hooks/use-theme-colors";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    name: string;
    disabled?: boolean;
    onPress?: () => void;
}

export default function Button({ name, disabled, onPress }: ButtonProps) {

    const colors = useThemeColors();

    return (
        <>
            <TouchableOpacity
                style={{
                    backgroundColor: disabled ? colors.muted : colors.primary,
                    opacity: disabled ? 0.6 : 1
                }}
                className="w-full flex items-center justify-center py-4 rounded-md mt-4"
                disabled={disabled}
                onPress={onPress}
            >
                <Text style={{ color: 'white' }} className="font-bold">
                    {name}
                </Text>
            </TouchableOpacity>

        </>
    )
}