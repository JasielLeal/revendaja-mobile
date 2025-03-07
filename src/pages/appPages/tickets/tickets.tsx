import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListAllStoreByStore } from "./services/ListAllStoreByStore";
import { FlatList } from "react-native-gesture-handler";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import * as Clipboard from "expo-clipboard";
import React from "react";

export function Tickets() {


    const pageSize = 10

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["ListAllStoreByStore"],
        queryFn: ({ pageParam = 0 }) => {
            return ListAllStoreByStore({ pageSize, page: pageParam + 1 })
        },
        getNextPageParam: (lastPage, allPages) => {
            const currentPage = allPages.length;

            if (currentPage < lastPage.data?.totalPages) {

                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página for atingida
            }
        },
        initialPageParam: 0
    })

    const allBankSlips = data?.pages.flatMap((page) => page.data.bankSlips) || []
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    function handlePress(ticket: any) {
        navigate.navigate('TicketsDetails', { ticket })
    }

    interface bankSlip {
        id: string,
        storeId: string,
        companyName: string,
        barcode: string,
        value: number,
        dueDate: Date
    }

    async function clipboardTicket(barcode: string) {
        await Clipboard.setStringAsync(barcode); // Copia o texto para a área de transferência
        Alert.alert("Sucesso", "Código de barras copiado para a área de transferência!");
    }

    function dateSelece(date: Date) {
        if (date == new Date()) {
            return 'Vence Hoje'
        }
        if (date > new Date) {
            return formatDate(String(date))
        } else {
            return 'Vencido'
        }
    }

    return (
        <View className="bg-bg flex-1 w-full px-5">
            <View>
                <View className="flex flex-row items-center mt-16 mb-5 justify-between">
                    <TouchableOpacity onPress={() => navigate.goBack()}>
                        <Icon name="chevron-back" color={"#fff"} size={20} />
                    </TouchableOpacity>
                    <Text className="text-white font-medium text-lg text-center ">Boletos</Text>
                    <TouchableOpacity onPress={() => navigate.navigate('AddBankSlip')}>
                        <Icon name="add" color={"#fff"} size={20} />
                    </TouchableOpacity>
                </View>

            </View>

            <View>
                <FlatList
                    data={allBankSlips}
                    keyExtractor={(item: bankSlip) => item.id}
                    style={{ marginBottom: 180 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="bg-forenground p-4 rounded-xl mt-5"
                            onPress={() => handlePress(item)}
                        >
                            {
                                Platform.OS == 'ios' ?
                                    <>
                                        <View className="flex flex-row items-start justify-between">
                                            <View>
                                                <Text className="text-textForenground">
                                                    {item.companyName}
                                                </Text>
                                                <Text className="text-white font-semibold text-2xl">
                                                    R$ {formatCurrency(String(item.value))}
                                                </Text>
                                            </View>
                                            {
                                                dateSelece(item.dueDate) == 'Vencido' ?
                                                    <Text className="text-red-500">
                                                        {
                                                            dateSelece(item.dueDate)
                                                        }
                                                    </Text>
                                                    :
                                                    <Text className="text-white">
                                                        {
                                                            dateSelece(item.dueDate)
                                                        }
                                                    </Text>
                                            }

                                        </View>
                                        <View className="mt-5 flex flex-row justify-between items-center relative">
                                            <Text
                                                className="bg-bg p-2 rounded-xl text-white w-5/6"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {item.barcode}
                                            </Text>
                                            {/* Botão de copiar posicionado absolutamente */}
                                            <TouchableOpacity
                                                onPress={() => clipboardTicket(item.barcode)}
                                                className="absolute right-0"
                                            >
                                                <Icon name="copy-outline" size={25} color={"#fff"} />
                                            </TouchableOpacity>
                                        </View>
                                    </>

                                    :

                                    <>
                                        <View className="flex flex-row items-start justify-between">
                                            <View>
                                                <Text className="text-textForenground text-xs">
                                                    {item.companyName}
                                                </Text>
                                                <Text className="text-white font-semibold text-xl">
                                                    R$ {formatCurrency(String(item.value))}
                                                </Text>
                                            </View>
                                            {
                                                dateSelece(item.dueDate) == 'Vencido' ?
                                                    <Text className="text-red-500">
                                                        {
                                                            dateSelece(item.dueDate)
                                                        }
                                                    </Text>
                                                    :
                                                    <Text className="text-white">
                                                        {
                                                            dateSelece(item.dueDate)
                                                        }
                                                    </Text>
                                            }

                                        </View>
                                        <View className="mt-5 flex flex-row justify-between items-center relative">
                                            <Text
                                                className="bg-bg p-2 rounded-xl text-white w-5/6 text-sm"
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                            >
                                                {item.barcode}
                                            </Text>
                                            {/* Botão de copiar posicionado absolutamente */}
                                            <TouchableOpacity
                                                onPress={() => clipboardTicket(item.barcode)}
                                                className="absolute right-0"
                                            >
                                                <Icon name="copy-outline" size={25} color={"#fff"} />
                                            </TouchableOpacity>
                                        </View>
                                    </>
                            }
                        </TouchableOpacity>
                    )}
                    onEndReached={() => {
                        if (hasNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={1}
                    ListFooterComponent={() => {
                        if (isFetchingNextPage) {
                            return <ActivityIndicator size="small" color={"#FF7100"} />;
                        } else {
                            return null;
                        }
                    }}
                />

            </View>
        </View>
    )
}