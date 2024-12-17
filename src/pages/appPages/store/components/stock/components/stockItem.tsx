import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Text, View, Image, Platform, TouchableOpacity } from "react-native";

interface StockItemProps {
    name: string;
    price: string;
    brand: string;
    quantity: number;
    imageUrl?: string;
    barcode: string
}

export function StockItem({ name, price, quantity, imageUrl, barcode }: StockItemProps) {

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    return (
        <TouchableOpacity className="mt-5 flex flex-row items-center gap-5" onPress={() => navigate.navigate('DetailsProductStock', { name, price, quantity, imgUrl: imageUrl, barcode })}>
            <Image
                source={imageUrl ? { uri: imageUrl } : require("@/assets/kaiak.jpg")}
                className="w-[75px] h-[75px] rounded-xl"
            />
            <View>
                {
                    Platform.OS == 'ios' ?
                        <>
                            <Text className="text-white font-semibold text-sm">
                                {name}
                            </Text>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="text-white font-semibold">
                                    R$ {(Number(price) / 100).toFixed(2).replace('.', ',')}
                                </Text>
                                <Text className="text-textForenground">
                                  
                                </Text>
                            </View>
                            <Text className="text-primaryPrimary">
                                {quantity}x em Estoque
                            </Text>
                        </>
                        :
                        <>
                            <Text className="text-white font-semibold text-xs">
                                {name}
                            </Text>
                            <View className="flex flex-row items-center gap-1">
                                <Text className="text-white font-semibold text-sm">
                                    R$ {(Number(price) / 100).toFixed(2).replace('.', ',')}
                                </Text>
                                <Text className="text-textForenground text-sm">
                                    - {barcode}
                                </Text>
                            </View>
                            {
                                quantity === 0 ? 
                                <Text className="text-sm text-red-500">Sem estoque</Text>
                                : 
                                <Text className="text-primaryPrimary text-sm">
                                {quantity}x em Estoque
                            </Text>
                            }
                        </>
                }

            </View>
        </TouchableOpacity>
    );
}
