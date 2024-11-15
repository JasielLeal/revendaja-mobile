import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

interface SaleItemProps {
    sale: {
        id: string;
        customerName: string;
        transictionType: string;
        totalPrice: string;
    };
    onPress: () => void;
    onLongPress: () => void;
}

const SaleItem = memo(({ sale, onPress, onLongPress }: SaleItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
            <View className="flex flex-row mb-5 w-full justify-between items-center">
                <View className="flex flex-row items-center">
                    <Text className="border border-primary p-2 rounded-full">
                        <Icon name='cart' size={20} color={'#B66182'} />
                    </Text>
                    <View className="ml-3">
                        <Text className="dark:text-white text-xs font-medium">
                            {sale.customerName}
                        </Text>
                        <Text className="dark:text-text text-xs">
                            {sale.transictionType}
                        </Text>
                        <Text className="dark:text-white text-[10px] tex-text">
                           {sale.totalPrice}
                        </Text>
                    </View>
                </View>
                <Icon name='chevron-forward' size={20} color={'#B66182'} />
            </View>
        </TouchableOpacity>
    );
});

export default SaleItem;
