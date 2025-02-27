import { Button } from "@/components/buttton";
import { formatCurrency } from "@/utils/formatCurrency";
import { phoneNumberMaskDynamic } from "@/utils/formatNumberPhone";
import { useNavigation } from "@react-navigation/native";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ApprovedSale } from "../services/ApprovedSale";
import Toast from "react-native-toast-message";
import { AxiosError } from "axios";
import { DeleteSale } from "../services/DeleteSale";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";


export function PedingSaleDetails({ route }: any) {

    interface Sale {
        id: string;
        customer: string;
        numberPhone: string;
        transactionType: string;
        totalPrice: number;
        status: string;
        createdAt: string;
        storeId: string;
        saleItems: {
            id: string;
            quantity: number;
            price: number;
            saleId: string;
            stockId: string;
            stock: {
                id: string;
                quantity: number;
                customPrice: number | null;
                suggestedPrice: number;
                normalPrice: number;
                category: string;
                status: string;
                discountValue: number | null;
                storeId: string;
                productId: string | null;
                customProductId: string | null;
                updatedAt: string;
                customProduct: {
                    id: string;
                    name: string;
                    description: string;
                } | null;
                product: {
                    id: string;
                    name: string;
                    normalPrice: number;
                    suggestedPrice: number;
                    description: string;
                    category: string;
                    barcode: string;
                    imgUrl: string;
                    brand: string;
                    company: string;
                    createdAt: string;
                    updatedAt: string;
                } | null;
            };
        }[];
    }

    const { sale }: { sale: Sale } = route.params;
    const navigation = useNavigation();

    function timeAgo(dateString: string): string {
        const now = new Date(); // Data atual
        const past = new Date(dateString); // Data fornecida
        const diffInMs = now.getTime() - past.getTime(); // Diferença em milissegundos

        // Converte para unidades de tempo
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        // Determina a unidade de tempo apropriada
        if (diffInSeconds < 60) {
            return `Há ${diffInSeconds} segundos`;
        } else if (diffInMinutes < 60) {
            return `Há ${diffInMinutes} minutos`;
        } else if (diffInHours < 24) {
            return `Há ${diffInHours} horas`;
        } else if (diffInHours > 48) {
            return `Há ${diffInDays} dias`;
        }
        else {
            return `Há ${diffInDays} dia`;
        }
    }

    const saleId = sale.id;
    const queryClient = useQueryClient();

    const { mutateAsync: ApprovedSaleFn } = useMutation({
        mutationFn: () => ApprovedSale({ saleId }),
        onSuccess: (response) => {
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: response.data.message
            });
            queryClient.invalidateQueries(["GetSalesPendingByStore"] as InvalidateQueryFilters);
            navigation.goBack();
        },
        onError: async (error) => {
            const axiosError = error as AxiosError;
            // Verifica se o status é 404
            if (axiosError?.response?.status === 404) {
                Toast.show({
                    type: 'error',
                    text1: 'Falha na aprovação',
                    text2: axiosError?.response?.data?.error || 'Ocorreu um erro inesperado.',
                });
                return; // Para evitar que outro Toast seja mostrado
            }

            Toast.show({
                type: 'error',
                text1: 'Falha no sistema',
                text2: 'Ocorreu um erro inesperado.',
            });
            return;

        },
    });

    const insets = useSafeAreaInsets();

    const { mutateAsync: DeleteSaleFn } = useMutation({
        mutationFn: () => DeleteSale({ saleId }),
        onSuccess: (response) => {
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: response.data.message
            });
            queryClient.invalidateQueries(["GetSalesPendingByStore"] as InvalidateQueryFilters);
            navigation.goBack();
        },
        onError: async (error) => {
            const axiosError = error as AxiosError;
            // Verifica se o status é 404
            if (axiosError?.response?.status === 404) {
                Toast.show({
                    type: 'error',
                    text1: 'Falha na aprovação',
                    text2: axiosError?.response?.data?.error || 'Ocorreu um erro inesperado.',
                });
                return; // Para evitar que outro Toast seja mostrado
            }
            Toast.show({
                type: 'error',
                text1: 'Falha no sistema',
                text2: 'Ocorreu um erro inesperado.',
            });
            return;

        },

    })

    return (
      
            <View className='bg-bg flex-1'>
                <View className={Platform.OS === 'ios' ? `mb-7 px-5 pt-16 flex justify-between ` : `px-5 pt-16 flex justify-between flex-1 mb-${insets.bottom + 5} bg-bg`} >
                    <View>
                        <View className='flex flex-row justify-between'>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name='chevron-back' size={20} color={"#fff"} />
                            </TouchableOpacity>
                            <Text className='text-white font-semibold'>Informações da Venda</Text>
                            <TouchableOpacity onPress={() => DeleteSaleFn()}>
                                <Icon name='trash' size={20} color={"#dc2626"} />
                            </TouchableOpacity>
                        </View>
                        <View className='flex flex-col justify-center items-center mt-10'>
                            <Text className="bg-[#303030] p-5 rounded-full">
                                <Icon name='alarm' size={20} color={"#FF7100"} />
                            </Text>
                            <Text className="mt-5 text-textForenground text-sm">{timeAgo(sale.createdAt)}</Text>
                            <Text className='text-white font-medium text-xl'>R$ {formatCurrency(String(sale.totalPrice))}</Text>
                            <Text className='text-textForenground '>{sale.customer}</Text>
                            <Text className='text-xs bg-[#303030] font-medium py-1 mt-2 px-5 rounded-full text-white '>{sale.transactionType}</Text>
                        </View>

                        {
                            Platform.OS === 'ios' ?

                                <View className="bg-forenground mt-10 rounded-xl p-4 w-full">
                                    <Text className="text-white font-medium text-lg">
                                        ID
                                    </Text>
                                    <Text className="text-textForenground">
                                        {sale.id}
                                    </Text>

                                    <View className="mt-5 flex gap-2 flex-row w-full">
                                        <View className="flex flex-row items-center justify-between w-full rounded-xl">
                                            <View >
                                                <Text className="text-white font-semibold">Celular</Text>
                                                <Text className="text-textForenground">
                                                    {phoneNumberMaskDynamic(String(sale.numberPhone))}
                                                </Text>
                                            </View>
                                            <View className='flex flex-row items-center'>
                                                <Text className="text-primaryPrimary font-semibold">Copiar</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>

                                :

                                <View className="bg-forenground mt-10 rounded-xl p-4 w-full">
                                    <Text className="text-white font-medium text-sm">
                                        ID
                                    </Text>
                                    <Text className="text-textForenground text-sm">
                                        {sale.id}
                                    </Text>

                                    <View className="mt-5 flex gap-2 flex-row w-full">
                                        <View className="flex flex-row items-center justify-between w-full rounded-xl">
                                            <View >
                                                <Text className="text-white font-semibold text-sm">Celular</Text>
                                                <Text className="text-textForenground text-sm">
                                                    {phoneNumberMaskDynamic(String(sale.numberPhone))}
                                                </Text>
                                            </View>
                                            <View className='flex flex-row items-center'>
                                                <Text className="text-primaryPrimary font-semibold text-sm">Copiar</Text>
                                            </View>
                                        </View>

                                    </View>
                                </View>
                        }

                        {
                            Platform.OS == 'ios' ?

                                <View className='flex gap-2  mt-2'>
                                    <View className="flex flex-row items-center justify-between w-full  p-3 rounded-xl">
                                        <View className='flex flex-row items-center'>
                                            <Text className="text-white font-semibold">Produtos</Text>
                                        </View>
                                        <View className='flex flex-row items-center'>
                                            <Text className="text-primaryPrimary font-semibold">Copiar</Text>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View className='flex gap-2  mt-2'>
                                    <View className="flex flex-row items-center justify-between w-full  p-3 rounded-xl">
                                        <View className='flex flex-row items-center'>
                                            <Text className="text-white font-semibold text-sm">Produtos</Text>
                                        </View>
                                        <View className='flex flex-row items-center'>
                                            <Text className="text-primaryPrimary font-semibold text-sm">Copiar</Text>
                                        </View>
                                    </View>
                                </View>
                        }

                        {
                            Platform.OS == 'ios' ?

                                sale?.saleItems.map((item) => (
                                    <View className='flex gap-2 mb-2' key={item.id}>
                                        <View className="flex flex-row items-center justify-between w-full bg-[#303030] p-3 rounded-xl">
                                            <View className='flex flex-row items-center'>
                                                <Text className='text-white mr-3 '>{item.quantity}</Text>
                                                <Text className='text-white w-[200px] ' numberOfLines={1} ellipsizeMode="tail">
                                                    {item?.stock?.product?.name}
                                                </Text>
                                            </View>
                                            <Text className='text-white'>R$ {formatCurrency(String(item.price))}</Text>
                                        </View>
                                    </View>
                                ))

                                :

                                sale?.saleItems.map((item) => (
                                    <View className='flex gap-2 mb-2' key={item.id}>
                                        <View className="flex flex-row items-center justify-between w-full bg-[#303030] p-3 rounded-xl">
                                            <View className='flex flex-row items-center'>
                                                <Text className='text-white mr-3 text-sm'>{item.quantity}</Text>
                                                <Text className='text-white w-[200px] text-sm' numberOfLines={1} ellipsizeMode="tail">
                                                    {item?.stock?.product?.name}
                                                </Text>
                                            </View>
                                            <Text className='text-white text-sm'>R$ {formatCurrency(String(item.price))}</Text>
                                        </View>
                                    </View>
                                ))
                        }
                    </View>
                    <View>
                        <Button name="Confirmar venda" onPress={() => ApprovedSaleFn()} />
                    </View>
                </View>
            </View>
       
    )
}