import { useQuery } from "@tanstack/react-query";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { GetLatestThreePurchases } from "../services/getLatestThreePurchases";
import { formatCurrency } from "@/utils/formatCurrency";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";

interface Sale {
    customer: string;
    transactionType: string;
    totalPrice: string;
}

export function RecentSales() {
    const { data: LatestSales } = useQuery<Sale[]>({
        queryKey: ["getLatestThreePurchases"],
        queryFn: GetLatestThreePurchases
    });

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    const handlePress = (recent: Sale) => {
        navigate.navigate('SaleDetails', { sale: recent });
    }

    return (
        <>
            <View className="px-5 mb-5 mt-2 flex flex-row items-center justify-between">
                {
                    Platform.OS == 'ios' ?
                        <>
                            <Text className="text-white font-medium ">
                                Vendas Recentes
                            </Text>
                            <TouchableOpacity onPress={() => navigate.navigate("Extract")}>
                                <Text className="text-primaryPrimary font-medium">
                                    Ver todas
                                </Text>
                            </TouchableOpacity>
                        </>
                        :
                        <>
                            <Text className="text-white font-medium text-sm">
                                Vendas Recentes
                            </Text>
                            <TouchableOpacity onPress={() => navigate.navigate("Extract")}>
                                <Text className="text-primaryPrimary font-medium text-sm">
                                    Ver todas
                                </Text>
                            </TouchableOpacity>
                        </>
                }
            </View>
            <View className="px-5 mt-5">
                {LatestSales?.map((sale, index) => (
                    <TouchableOpacity key={index} className="mb-5" onPress={() => handlePress(sale)}>
                        <View className="flex flex-row justify-between items-start mb-4">
                            <View className="flex flex-row gap-4">
                                <View className="bg-primaryPrimary p-3 rounded-xl">
                                    <Icon name="bag-check-outline" color={'#fff'} size={25} />
                                </View>
                                <View>
                                    <Text className="text-white font-medium text-sm">
                                        {sale.customer}
                                    </Text>
                                    <Text className="text-gray-400 text-sm">
                                        {sale.transactionType}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row items-center gap-4">
                                <Text className="text-white text-sm font-medium">
                                    R$ {formatCurrency(String(sale.totalPrice))}
                                </Text>
                                <Icon name="chevron-forward-outline" color={"#fff"} size={20} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
}
