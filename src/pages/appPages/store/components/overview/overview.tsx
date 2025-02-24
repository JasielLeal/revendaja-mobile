import { Text } from "react-native";
import { View } from "react-native";
import React from "react";
import { Graphic } from "./components/graphic";


export function Overview() {

    return (
        <>
            <View className="px-5 flex-1 bg-bg">
                <View className="flex flex-row items-center justify-between mt-5">
                    <Text className="text-white text-xl font-semibold">Overview</Text>
                </View>
                <Graphic />
                
            </View>
        </>
    )
}