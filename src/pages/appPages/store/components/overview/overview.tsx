import { Text } from "react-native";
import { Store } from "../../store";
import { View } from "react-native";
import { Button } from "@/components/buttton";
import React from "react";

export function Overview() {



    return (
        <>
            <Store>
                <View className="px-5">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <Text className="text-white text-xl font-semibold">Overview</Text>
                        <Button name="Adicionar Produto" />
                    </View>
                </View>

            </Store>
        </>
    )
}