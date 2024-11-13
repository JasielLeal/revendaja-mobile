import { TouchableOpacity, Text } from "react-native";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
    name: string;
};

export function Button({ name, ...props }: ButtonProps) {

    return (
        <>
            <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-2" {...props}>
                <Text className="text-center font-medium text-white">
                    {name}
                </Text>
            </TouchableOpacity>
        </>
    )
}