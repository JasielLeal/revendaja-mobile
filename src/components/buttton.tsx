import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
    name: string;
};

export function Button({ name, ...props }: ButtonProps) {

    return (
        Platform.OS == 'ios' ?

            <>
                <TouchableOpacity className="bg-primaryPrimary py-4 px-4 rounded-xl mt-2" {...props}>
                    <Text className="text-center font-medium text-white">
                        {name}
                    </Text>
                </TouchableOpacity>
            </>
            :
            <>
                <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-2" {...props}>
                    <Text className="text-center font-medium text-white text-sm">
                        {name}
                    </Text>
                </TouchableOpacity>
            </>
    )
}