import { TouchableOpacity, Text } from "react-native";

export function Button({ name }) {
    return (
        <>
            <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-2">
                <Text className="text-center font-medium text-white">
                    {name}
                </Text>
            </TouchableOpacity>
        </>
    )
}