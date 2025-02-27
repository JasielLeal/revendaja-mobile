import { ActivityIndicator, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { InvalidateQueryFilters, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { GetSalesPendingByStore } from "./services/GetSalesPendingByStore";
import { useSocket } from "@/context/SocketContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { formatCurrency } from "@/utils/formatCurrency";

export function PedingSale() {

    const pageSize = 10;


    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
        queryKey: ["GetSalesPendingByStore"],
        queryFn: ({ pageParam = 0 }) => {
            return GetSalesPendingByStore({
                pageSize,
                page: pageParam + 1,
            });
        },
        staleTime: 1000 * 60 * 5,
        getNextPageParam: (lastPage, allPages) => {
            const currentPage = allPages.length;

            if (currentPage < lastPage.data?.totalPages) {
                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página for atingida
            }
        },
        initialPageParam: 0,
    });

    const allStock = data?.pages.flatMap((page) => page.data.sales) || [];

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
            return `Há ${diffInHours} dias`;
        } else {
            return `Há ${diffInDays} dia`;
        }

    }

    const { socket } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        // Ouve o evento de atualização de vendas
        socket?.on("atualizarVendas", (novaVenda) => {
           

            // Invalida a consulta de vendas pendentes para atualizar a lista de vendas
            queryClient.invalidateQueries(["GetSalesPendingByStore"] as InvalidateQueryFilters);
        });

        // Remover o listener ao desmontar o componente
        return () => {
            socket?.off("atualizarVendas");
        };
    }, [socket, queryClient]);

    const navigate = useNavigation<NavigationProp<RootStackParamList>>();

    function handlePress(sale: Sale) {
        navigate.navigate('PedingSaleDetails', { sale })
    }

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

    return (
        <>

            <View className="px-5 flex-1 bg-bg">
                <View className="flex flex-row items-center justify-between mt-7">
                    <Text className="text-white text-xl font-semibold">Vendas Pendentes</Text>
                </View>
                {
                    allStock.length != 0 ?

                        <FlatList
                            data={allStock}
                            keyExtractor={(item) => item.id}
                            style={Platform.OS === 'ios' ? { marginBottom: 345, marginTop: 10 } : { marginBottom: 320, marginTop: 10 }}
                            renderItem={({ item }) => {

                                return (
                                    Platform.OS === 'ios' ?

                                        <TouchableOpacity className="mt-5 flex flex-row items-center justify-between" onPress={() => handlePress(item)}>
                                            <View className="flex items-center flex-row gap-5">
                                                <View className="bg-forenground p-4 rounded-xl">
                                                    <Text className="text-white">
                                                        <Icon name='alarm' size={20} color={"#FF7100"} />
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text className="text-white">
                                                        {item.customer}
                                                    </Text>
                                                    <Text className="text-white font-medium">
                                                        R$ {formatCurrency(String(item?.totalPrice))}
                                                    </Text>
                                                    <Text className="text-textForenground">
                                                        {timeAgo(item.createdAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Icon name="chevron-forward" size={25} color={"#FF7100"} />
                                            </View>
                                        </TouchableOpacity>

                                        :

                                        <TouchableOpacity className="mt-5 flex flex-row items-center justify-between" onPress={() => handlePress(item)}>
                                            <View className="flex items-center flex-row gap-5">
                                                <View className="bg-forenground p-4 rounded-xl">
                                                    <Text className="text-white">
                                                        <Icon name='alarm' size={20} color={"#FF7100"} />
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text className="text-white text-xs">
                                                        {item.customer}
                                                    </Text>
                                                    <Text className="text-white font-medium text-sm">
                                                        R$ {formatCurrency(String(item?.totalPrice))}
                                                    </Text>
                                                    <Text className="text-textForenground text-xs">
                                                        {timeAgo(item.createdAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Icon name="chevron-forward" size={25} color={"#FF7100"} />
                                            </View>
                                        </TouchableOpacity>

                                )
                            }}
                            onEndReached={() => {
                                if (hasNextPage) {
                                    fetchNextPage();
                                }
                            }}
                            onEndReachedThreshold={1}
                            ListFooterComponent={() => {
                                if (isFetchingNextPage) {
                                    return <ActivityIndicator size="small" color={"#FF7100"} />
                                } else {
                                    return null;
                                }
                            }}
                        />

                        :

                        <View className=" flex items-center justify-center w-full h-4/5">
                            <Text className="text-2xl font-semibold text-center text-textForenground">
                                Você ainda não tem vendas para confirmar :)
                            </Text>
                        </View>
                }

            </View>

        </>
    )
}