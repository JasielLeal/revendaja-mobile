import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { FinancialOverview } from "./components/financialOverview";
import { Input } from "@/components/input";

export function Extract() {
    // Estado para controlar o botão selecionado
    const [selected, setSelected] = useState("diario");

    // Função para definir o estado do botão selecionado
    const handleSelect = (option: string) => {
        setSelected(option);
    };

    return (
        <>
            <View className="bg-bg h-screen w-full px-5">
                <View>
                    <Text className="text-white font-medium mt-16 text-lg text-center mb-5">Financeiro</Text>
                </View>
                <Input name="e" placeholder="Nome do cliente..."/>

                <FinancialOverview />
            </View>
        </>
    );
}
