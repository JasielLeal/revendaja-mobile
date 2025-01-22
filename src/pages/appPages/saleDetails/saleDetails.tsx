import { formatCurrency } from '@/utils/formatCurrency';
import { useNavigation } from '@react-navigation/native';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { DeleteSale } from './services/deleteSale';
import { useState } from 'react';
import CustomModal from '@/components/modal';
import React from 'react';

export function SaleDetails({ route }: any) {
    const { sale } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false)

    const queryClient = useQueryClient();

    const { mutateAsync: DeleteSaleFn } = useMutation({
        mutationFn: DeleteSale,
        onSuccess: () => {
            queryClient.invalidateQueries(['GetSales'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['CalculateMonthlyBalance'] as InvalidateQueryFilters);
            queryClient.invalidateQueries(['getLatestThreePurchases'] as InvalidateQueryFilters);
            setTimeout(() => {
                navigation.goBack()
            }, 1000)
        },
        onError: () => {

        }
    })

    async function onSub() {
        await DeleteSaleFn(sale.id)
        setModalVisible(false)
    }

    return (
        <View className='bg-bg w-full flex-1'>
            <View className='px-5 pt-16'>
                <View className='flex flex-row justify-between'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-back' size={20} color={"#fff"} />
                    </TouchableOpacity>
                    <Text className='text-white font-semibold'>Detalhes da Compra</Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Icon name='trash' size={20} color={"#dc2626"} />
                    </TouchableOpacity>
                </View>

                {
                    Platform.OS === 'ios' ?
                        <>
                            <View className='flex flex-col justify-center items-center mt-7'>
                                <Text className="bg-[#303030] p-5 rounded-full">
                                    <Icon name='checkmark' size={20} color={"#FF7100"} />
                                </Text>
                                <Text className='text-white font-medium mt-5 text-xl'>R$ {formatCurrency(String(sale.totalPrice))}</Text>
                                <Text className='text-textForenground '>{sale.customer}</Text>
                                <Text className='text-xs bg-[#303030] font-medium py-1 mt-2 px-5 rounded-full text-white '>{sale.transactionType}</Text>
                            </View>

                            <View className='mt-7'>
                                <Text className='text-white font-medium'>Sobre a compra</Text>
                            </View>

                            <View className='bg-[#303030] p-3 rounded-xl mt-5'>
                                <View className='flex flex-row items-center justify-between'>
                                    <Text className='text-white '>Data</Text>
                                    <Text className='text-textForenground  capitalize'>{format(new Date(sale.createdAt), "dd/MM/yyyy")}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white '>Nome</Text>
                                    <Text className='text-textForenground'>{sale.customer}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white'>Metodo de Pagamento</Text>
                                    <Text className='text-textForenground'>{sale.transactionType}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white '>ID</Text>
                                    <Text className='text-textForenground text-xs'>{sale.id}</Text>
                                </View>
                            </View>

                            <Text className='text-white font-medium my-5'>Produtos</Text>

                            <View>
                                {sale.saleItems.map((product: any) => (
                                    <View key={product.id} className='flex flex-row items-center justify-between bg-[#303030] p-3 rounded-xl mb-2'>
                                        <View className='flex flex-row items-center'>

                                            <Text className='text-white mr-3 '>{product.quantity}x</Text>
                                            <Text className='text-white w-[140px] ' numberOfLines={1} ellipsizeMode="tail">
                                                {product.stock.customProduct?.name || product.stock.product?.name}
                                            </Text>
                                        </View>
                                        <Text className='text-white'>R$ {(product.price)}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                        :
                        <>
                            <View className='flex flex-col justify-center items-center mt-7'>
                                <Text className="bg-[#303030] p-5 rounded-full">
                                    <Icon name='checkmark' size={20} color={"#FF7100"} />
                                </Text>
                                <Text className='text-white font-medium mt-5'>R$ {((sale.totalPrice))}</Text>
                                <Text className='text-textForenground text-xs'>{sale.customer}</Text>
                                <Text className='text-xs bg-[#303030] font-medium py-1 mt-2 px-5 rounded-full text-white '>{sale.transactionType}</Text>
                            </View>

                            <View className='mt-7'>
                                <Text className='text-xs text-white font-medium'>Sobre a compra</Text>
                            </View>

                            <View className='bg-[#303030] p-3 rounded-xl mt-5'>
                                <View className='flex flex-row items-center justify-between'>
                                    <Text className='text-white text-xs'>Data</Text>
                                    <Text className='text-textForenground text-[10px] capitalize'>{format(new Date(sale.createdAt), "dd/MM/yyyy")}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white text-xs'>Nome</Text>
                                    <Text className='text-textForenground text-xs'>{sale.customer}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white text-xs'>Forma de Pagamento</Text>
                                    <Text className='text-textForenground text-xs'>{sale.transactionType}</Text>
                                </View>
                                <View className='flex flex-row items-center justify-between mt-2'>
                                    <Text className='text-white text-xs'>ID</Text>
                                    <Text className='text-textForenground text-[10px]'>{sale.id}</Text>
                                </View>
                            </View>

                            <Text className='text-white text-xs font-medium my-5'>Produtos</Text>

                            <View>
                                {sale.saleItems.map((product: any) => (
                                    <View key={product.id} className='flex flex-row items-center justify-between bg-[#303030] p-3 rounded-xl mb-2'>
                                        <View className='flex flex-row items-center'>

                                            <Text className='text-white mr-3 text-xs'>{product.quantity}x</Text>
                                            <Text className='text-white w-[140px] text-xs' numberOfLines={1} ellipsizeMode="tail">
                                                {product.stock.customProduct?.name || product.stock.product?.name}
                                            </Text>
                                        </View>
                                        <Text className='text-white text-xs'>R$ {(String(product?.price))}</Text>
                                    </View>
                                ))}
                            </View>
                        </>
                }
            </View>

            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title="Deseja deletar essa venda?"
                onConfirm={onSub}
                confirmText="Confirmar"
            >
                <Text className="text-white">Essa ação não pode ser desfeita. Os dados da venda não poderam mais ser acessados.</Text>
            </CustomModal>
        </View>
    );
}
