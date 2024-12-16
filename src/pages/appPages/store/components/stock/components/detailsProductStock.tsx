import { useRoute } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export function DetailsProductStock() {

    const route = useRoute();
    const { name, price, quantity, imgUrl, barcode } = route.params;

    return (
        <>
            <View className="bg-bg flex-1 w-full px-5">
                <Text >
                  
                </Text>
            </View>
        </>
    )
}