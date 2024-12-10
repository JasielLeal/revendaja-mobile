import { formatCurrency } from '@/utils/formatCurrency';
import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

interface SaleItemProps {
    sale: {
        id: string;
        customer: string;
        transactionType: string;
        totalPrice: string;
    };
    onPress: () => void;
}

const SaleItem = memo(({ sale, onPress }: SaleItemProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View className="flex flex-row mb-5 w-full justify-between items-center">
                <View className="flex flex-row items-center">
                    <Text className="border border-primary p-2 rounded-xl bg-primaryPrimary">
                        <Icon name='bag-check-outline' size={30} color={'#fff'} />
                    </Text>
                    <View className="ml-3">
                        <Text className="text-white font-medium">
                            {sale.customer}
                        </Text>
                        <Text className="text-textForenground">
                            {sale.transactionType}
                        </Text>

                    </View>
                </View>
                <View className='flex flex-row items-center'>
                    <Text className="text-white tex-text">
                        R$ {formatCurrency(String(sale.totalPrice))}
                    </Text>
                    <Icon name='chevron-forward' size={20} color={'#FF7100'} />
                </View>
            </View>
        </TouchableOpacity>
    );
});

export default SaleItem;
