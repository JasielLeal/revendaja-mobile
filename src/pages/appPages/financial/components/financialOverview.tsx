import Select from "@/components/select";
import { useState } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export function FinancialOverview() {

    const sales = [
        { id: 1, name: 'Jasiel Viana', type: 'Pix', amount: '+R$ 1.435,39', purchaseDay: 'Segunda-Feira, 1 de Janeiro' },
        { id: 2, name: 'Maria Silva', type: 'Cartão de Crédito', amount: '+R$ 750,00', purchaseDay: 'Terça-Feira, 3 de Fevereiro' },
        { id: 3, name: 'Carlos Pereira', type: 'Dinheiro', amount: '+R$ 220,50', purchaseDay: 'Quarta-Feira, 5 de Março' },
        { id: 4, name: 'Ana Souza', type: 'Pix', amount: '+R$ 520,00', purchaseDay: 'Sábado, 7 de Abril' },
        { id: 5, name: 'Lucas Mendes', type: 'Boleto', amount: '+R$ 1.150,75', purchaseDay: 'Segunda-Feira, 9 de Maio' },
        { id: 6, name: 'Fernanda Oliveira', type: 'Cartão de Débito', amount: '+R$ 330,25', purchaseDay: 'Quinta-Feira, 12 de Junho' },
        { id: 7, name: 'João Santos', type: 'Pix', amount: '+R$ 430,00', purchaseDay: 'Sábado, 14 de Julho' },
        { id: 8, name: 'Larissa Costa', type: 'Dinheiro', amount: '+R$ 210,00', purchaseDay: 'Segunda-Feira, 16 de Agosto' },
        { id: 9, name: 'Ricardo Lima', type: 'Cartão de Crédito', amount: '+R$ 1.980,50', purchaseDay: 'Terça-Feira, 18 de Setembro' },
        { id: 10, name: 'Patrícia Ferreira', type: 'Cartão de Débito', amount: '+R$ 685,00', purchaseDay: 'Quarta-Feira, 20 de Outubro' },
        { id: 11, name: 'Renato Almeida', type: 'Pix', amount: '+R$ 840,00', purchaseDay: 'Sexta-Feira, 22 de Novembro' },
        { id: 12, name: 'Carla Silva', type: 'Boleto', amount: '+R$ 600,00', purchaseDay: 'Domingo, 24 de Dezembro' },
        { id: 13, name: 'Gabriel Rocha', type: 'Dinheiro', amount: '+R$ 150,00', purchaseDay: 'Sábado, 26 de Janeiro' },
        { id: 14, name: 'Gabriel Rocha', type: 'Dinheiro', amount: '+R$ 150,00', purchaseDay: 'Sábado, 26 de Janeiro' },
        { id: 15, name: 'Gabriel Rocha', type: 'Dinheiro', amount: '+R$ 150,00', purchaseDay: 'Sábado, 26 de Janeiro' }
    ];

    const options = [
        { label: 'Jan', value: '1' },
        { label: 'Feb', value: '2' },
        { label: 'Mar', value: '3' },
        { label: 'Apr', value: '4' },
        { label: 'May', value: '5' },
        { label: 'Jun', value: '6' },
        { label: 'Jul', value: '7' },
        { label: 'Aug', value: '8' },
        { label: 'Sep', value: '9' },
        { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' },
        { label: 'Dec', value: '12' },
    ]

    const handleMonthSelect = (value: string) => {
        console.log('Mês selecionado:', value);
    };

    return (
        <>
            <View className="bg-forenground p-4 rounded-xl mt-5">
                <View className="flex flex-row items-center justify-between">
                    <View>
                        <Text className="text-white text-sm">
                            Saldo
                        </Text>
                        <Text className="text-white font-semibold text-xl">
                            R$ 12.000,00
                        </Text>
                    </View>
                    <Select
                        label="Selecione o mês"
                        options={options}
                        onSelect={handleMonthSelect}
                    />
                </View>
            </View>




            <FlatList
                data={sales}
                keyExtractor={(item) => String(item.id)}
                style={{ marginBottom: 50, marginTop: 30 }}
                renderItem={({ item }) => (
                    <View key={item.id}>
                        <View className="flex flex-row items-center justify-between border-b border-b-[#ffffff52] pb-1 mb-5 ">
                            <Text className="text-[8px] capitalize text-white">{item.purchaseDay}</Text>
                            <Text className="text-[8px] text-white font-semibold">Saldo do dia R$ 220,00</Text>
                        </View>
                        <TouchableOpacity key={item.id}>
                            <View className="flex flex-row justify-between items-start mb-4 mt-4">
                                <View className="flex flex-row gap-4">
                                    <View className="bg-primaryPrimary p-3 rounded-xl">
                                        <Icon name="bag-check-outline" color={'#fff'} size={25} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-medium text-sm">
                                            {item.name}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">
                                            {item.type}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex flex-row items-center gap-4">
                                    <Text className="text-white text-sm font-medium">
                                        {item.amount}
                                    </Text>
                                    <Icon name="chevron-forward-outline" color={"#fff"} size={20} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </>
    )
}