import { Text } from "react-native";
import { Store } from "../../store";
import { View } from "react-native";
import { Button } from "@/components/buttton";
import { Input } from "@/components/input";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Select from "./components/select";
import React from "react";


export function Report() {

    const [searchTerm, setSearchTerm] = useState("");
    const options = [
        { label: 'Janeiro', value: '01' },
        { label: 'Fevereiro', value: '02' },
        { label: 'Março', value: '03' },
        { label: 'Abril', value: '04' },
        { label: 'Maio', value: '05' },
        { label: 'Junho', value: '06' },
        { label: 'Julho', value: '07' },
        { label: 'Agosto', value: '08' },
        { label: 'Setembro', value: '09' },
        { label: 'Outubro', value: '10' },
        { label: 'Novembro', value: '11' },
        { label: 'Dezembro', value: '12' },
    ];


    const currentMonth = (new Date().getMonth() + 1).toString(); // Obtém o mês atual e converte para string

    const [month, setMonth] = useState(currentMonth);
    
    const handleMonthSelect = (value: string) => {
        setMonth(value);
    }

    return (
        <>
           
                <View className="px-5 flex-1 bg-bg">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <Text className="text-white text-xl font-semibold">Despesas</Text>
                        <Button name="Adicionar Despesa" />
                    </View>
                    <View className="mt-5 flex flex-row items-center justify-between w-full">
                        <View className="w-5/6">
                            <Input
                                name="Buscar"
                                placeholder="Buscar"
                                value={searchTerm} // Valor controlado pelo estado
                                onChangeText={(text) => setSearchTerm(text)}
                            />
                        </View>
                        <Select
                            label="Selecione o mês"
                            options={options}
                            onSelect={handleMonthSelect}
                        />
                    </View>
                </View>
           
        </>
    )
}