import { Text, View } from "react-native";
import { FinancialOverview } from "./components/financialOverview";
import { Input } from "@/components/input";
import React from "react";

export function Extract() {

    return (
        <>
            <View className="bg-bg h-screen w-full px-5">
                <View>
                    <Text className="text-white font-medium mt-16 text-lg text-center mb-5">Extrato</Text>
                </View>
                

                <FinancialOverview />
            </View>
        </>
    );
}
