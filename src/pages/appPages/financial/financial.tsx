import { Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { FinancialOverview } from "./components/financialOverview";

export function Financial() {
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
                <View className="bg-forenground p-2 rounded-full flex flex-row justify-between">
                    <TouchableOpacity
                        className={`py-2 px-7 rounded-full ${selected === "diario" ? "bg-bg" : ""}`}
                        onPress={() => handleSelect("diario")}
                    >
                        <Text className="text-white text-sm">Diário</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-7 rounded-full ${selected === "semanal" ? "bg-bg" : ""}`}
                        onPress={() => handleSelect("semanal")}
                    >
                        <Text className="text-white text-sm">Semanal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-7 rounded-full ${selected === "mensal" ? "bg-bg" : ""}`}
                        onPress={() => handleSelect("mensal")}
                    >
                        <Text className="text-white text-sm">Mensal</Text>
                    </TouchableOpacity>
                </View>

                <FinancialOverview />
            </View>
        </>
    );
}
