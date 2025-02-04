import React from "react";
import { TouchableOpacity, Text, Platform } from "react-native";
import { TouchableOpacityProps } from "react-native";

type ButtonProps = TouchableOpacityProps & {
    name: string;
};

export function Button({ name, disabled, ...props }: ButtonProps) {
    return (
        <TouchableOpacity
            className={`${
                disabled ? "bg-[#9b4702]" : "bg-primaryPrimary"
            } ${Platform.OS === "ios" ? "py-4 px-4" : "py-3 px-3"} rounded-xl mt-2`}
            disabled={disabled}
            {...props}
        >
            <Text
                className={`text-center font-medium ${
                    disabled ? "text-gray-200" : "text-white"
                } ${Platform.OS !== "ios" && "text-sm"}`}
            >
                {name}
            </Text>
        </TouchableOpacity>
    );
}
