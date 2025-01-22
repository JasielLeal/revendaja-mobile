import Select from "@/components/select";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Text, View, FlatList } from "react-native";
import { GetSales } from "../services/getSales";

import { formatCurrency } from "@/utils/formatCurrency";
import SaleItem from "./saleItem";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { RootStackParamList } from "@/types/navigation";
import { formatDate } from "@/utils/formatDate";
import { MonthAmount } from "./monthAmount";
import React from "react";
import { Input } from "@/components/input";

export function FinancialOverview() {
    const currentMonth = (new Date().getMonth() + 1).toString(); // Obtém o mês atual e converte para string

    const [month, setMonth] = useState(currentMonth); // Define o mês atual como estado inicial // Estado inicial do mês selecionado

    const [searchTerm, setSearchTerm] = useState(""); // Valor digitado no input
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Valor com debounce

    const options = [
        { label: 'Janeiro', value: '01' },
        { label: 'Fevereiro', value: '02' },
        { label: 'Março', value: '03' },
        { label: 'Abril', value: '04' },
        { label: 'Maio', value: '05' },
        { label: 'Junho', value: '06' },
        { label: 'Julho', value: '07' },
        { label: 'Agosto', value: '08' },
        { label: 'Setembro', value: '09' },
        { label: 'Outubro', value: '10' },
        { label: 'Novembro', value: '11' },
        { label: 'Dezembro', value: '12' },
    ];

    const pageSize = 10

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Atualiza o termo apenas após 500ms
        }, 500);

        return () => {
            clearTimeout(handler); // Limpa o timeout anterior
        };
    }, [searchTerm]);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["GetSales", month, debouncedSearchTerm],
        queryFn: ({ pageParam = 0 }) => {
            return GetSales({ month, pageSize, page: pageParam + 1, search: debouncedSearchTerm })
        },
        getNextPageParam: (lastPage, allPages) => {
            const currentPage = allPages.length;

            if (currentPage < lastPage.data.totalPages) {

                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página for atingida
            }
        },
        initialPageParam: 0
    })

    const handleMonthSelect = (value: string) => {
        setMonth(value);
    }

    const transformedData = data?.pages.flatMap(page => page.data.sales).reduce((acc: any, current) => {
        const existingDay = acc.find((item: any) => item.day === current.day);
        if (existingDay) {
            existingDay.sales.push(...current.sales); // Adiciona vendas ao dia existente
        } else {
            acc.push({ ...current, sales: [...current.sales] }); // Adiciona um novo dia
        }
        return acc;
    }, []);

    const addUniqueIdsToSales = (data: any) => {
        let itemCounter = 0; // Inicializa um contador para IDs

        return data.map((day: any) => ({
            ...day,
            sales: day.sales.map((sale: any) => {
                return {
                    ...sale,
                    uniqueId: `${sale.id}-${itemCounter++}` // Cria um ID único combinando o ID da venda e o contador
                };
            })
        }));
    };

    const uniqueSalesData = transformedData ? addUniqueIdsToSales(transformedData) : [];
    const navigate = useNavigation<NavigationProp<RootStackParamList>>();

    function handlePress(sale: any) {
        navigate.navigate('SaleDetails', { sale })
    }

    return (
        <>
            <Input
                name="Buscar"
                placeholder="Buscar"
                value={searchTerm} // Valor controlado pelo estado
                onChangeText={(text) => setSearchTerm(text)}
            />
            <View className="bg-forenground p-4 rounded-xl mt-5">
                <View className="flex flex-row items-center justify-between">
                    <View>
                        <Text className="text-white text-sm">Saldo</Text>
                        <MonthAmount month={month} />
                    </View>
                    <Select
                        label="Selecione o mês"
                        options={options}
                        onSelect={handleMonthSelect}
                    />
                </View>
            </View>

            <FlatList
                data={uniqueSalesData}
                keyExtractor={(item) => item.id}
                style={{ marginBottom: 80 }}
                renderItem={({ item }) => (
                    <View key={item.id}>
                        <View className="flex flex-row items-center justify-between border-b border-b-[#ffffff38] pb-1 mt-5">
                            <Text className=" text-sm capitalize text-white">{formatDate(item.day)}</Text>
                            <Text className=" text-sm text-white font-semibold">Saldo do dia {formatCurrency(String(item.totalValue))}</Text>
                        </View>
                        <View className="mt-5">
                            {item.sales.map((sale: any) => {
                                return (
                                    <SaleItem
                                        key={sale.uniqueId} // Use o novo ID único
                                        sale={sale}
                                        onPress={() => handlePress(sale)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                )}
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

        </>
    );
}
