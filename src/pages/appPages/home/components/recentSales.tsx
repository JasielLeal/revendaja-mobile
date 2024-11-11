import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export function RecentSales() {
    const sales = [
        { name: 'Jasiel Viana', type: 'Pix', amount: '+R$ 1.435,39' },
        { name: 'Maria Silva', type: 'Cartão de Crédito', amount: '+R$ 750,00' },
        { name: 'Carlos Pereira', type: 'Dinheiro', amount: '+R$ 220,50' },
    ];

    return (
        <>
            <View className="px-5 mb-7 mt-2 flex flex-row items-center justify-between">
                <Text className="text-white font-medium ">
                    Vendas Recentes
                </Text>
                <TouchableOpacity >
                    <Text className="text-primaryPrimary font-medium">
                        Ver todas
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="px-5 mt-5">
                {sales.map((sale, index) => (
                    <TouchableOpacity key={index} className="mb-5">
                        <View className="flex flex-row justify-between items-start mb-4">
                            <View className="flex flex-row gap-4">
                                <View className="bg-primaryPrimary p-3 rounded-xl">
                                    <Icon name="bag-check-outline" color={'#fff'} size={25} />
                                </View>
                                <View>
                                    <Text className="text-white font-medium text-sm">
                                        {sale.name}
                                    </Text>
                                    <Text className="text-gray-400 text-sm">
                                        {sale.type}
                                    </Text>
                                </View>
                            </View>
                            <View className="flex flex-row items-center gap-4">
                                <Text className="text-white text-sm font-medium">
                                    {sale.amount}
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
