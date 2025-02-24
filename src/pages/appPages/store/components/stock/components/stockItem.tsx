import React from "react";
import { Text, View, Image, Platform } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import { OptionsSwipeable } from "./optionsSwipeable";
import { calculatePercentage } from "@/utils/formatDiscount";

interface StockItemProps {
    id: string
    productId: string
    name: string;
    price: string;
    brand: string;
    quantity: number;
    imageUrl?: string;
    barcode: string;
    discount?: number;
}

export function StockItem({ name, price, quantity, imageUrl, id, discount, productId }: StockItemProps) {

    const priceNumber = Number(price);
    const discountPercentage = discount ? calculatePercentage(priceNumber, discount).percentage : 0;

    return (
        <Swipeable renderRightActions={() => <OptionsSwipeable id={id} discount={discount} productId={productId}  />} overshootRight={false} rightThreshold={100}>
            <View className="mt-5 flex flex-row items-center gap-5 bg-bg">
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
                                    {
                                        discount ?
                                            <Text className="text-textForenground text-sm">
                                                - {discountPercentage.toFixed(2)}% de desconto
                                            </Text>
                                            :
                                            ''
                                    }
                                </View>
                                {
                                    quantity <= 0 ?
                                        <Text className="text-sm text-red-500">Sem estoque</Text>
                                        :
                                        <Text className="text-primaryPrimary text-sm">
                                            {quantity}x em Estoque
                                        </Text>
                                }
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
                                    {
                                        discount ?
                                            <Text className="text-textForenground text-sm">
                                                - {discountPercentage.toFixed(2)}% de desconto
                                            </Text>
                                            :
                                            ''
                                    }
                                </View>
                                {
                                    quantity <= 0 ?
                                        <Text className="text-sm text-red-500">Sem estoque</Text>
                                        :
                                        <Text className="text-primaryPrimary text-sm">
                                            {quantity}x em Estoque
                                        </Text>
                                }
                            </>
                    }

                </View>
            </View>
        </ Swipeable>
    );
}
