import { Text, View, Image } from "react-native";

interface StockItemProps {
    name: string;
    price: string;
    brand: string;
    quantity: number;
    imageUrl?: string;
    barcode: string
}

export function StockItem({ name, price, brand, quantity, imageUrl, barcode }: StockItemProps) {
    return (
        <View className="mt-5 flex flex-row items-center gap-5">
            <Image
                source={imageUrl ? { uri: imageUrl } : require("@/assets/kaiak.jpg")}
                className="w-[75px] h-[75px] rounded-xl"
            />
            <View>
                <Text className="text-white font-semibold text-sm">
                    {name}
                </Text>
                <View className="flex flex-row items-center gap-1">
                    <Text className="text-white font-semibold">
                        R$ {(Number(price) / 100).toFixed(2).replace('.', ',')}
                    </Text>
                    <Text className="text-textForenground">
                        - {barcode}
                    </Text>
                </View>
                <Text className="text-primaryPrimary">
                    {quantity}x em Estoque
                </Text>
            </View>
        </View>
    );
}
