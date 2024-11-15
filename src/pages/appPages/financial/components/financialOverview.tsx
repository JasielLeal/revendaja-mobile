import Select from "@/components/select";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Text, View, FlatList, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { GetSales } from "../services/getSales";

export function FinancialOverview() {
    const [month, setMonth] = useState('1'); // Estado inicial do mês selecionado

    const options = [
        { label: 'Jan', value: '1' },
        { label: 'Feb', value: '2' },
        { label: 'Mar', value: '3' },
        { label: 'Apr', value: '4' },
        { label: 'May', value: '5' },
        { label: 'Jun', value: '6' },
        { label: 'Jul', value: '7' },
        { label: 'Aug', value: '8' },
        { label: 'Sep', value: '9' },
        { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' },
        { label: 'Dec', value: '12' },
    ];

    const pageSize = 10
    const page = 1

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: ['MonthlyExtract', month],
        queryFn: ({ pageParam = 0 }) => {
            
            return GetSales({ month, pageSize, page });
        },
        getNextPageParam: (lastPage, allPages) => {
            // Checa se a página atual alcançou o total de páginas disponíveis
            const currentPage = allPages.length;
            if (currentPage < lastPage.totalPages) {
                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página é atingida
            }
        },
        initialPageParam: 0
    });

    const handleMonthSelect = (value) => {
        setMonth(value);
    };

    return (
        <>
            <View className="bg-forenground p-4 rounded-xl mt-5">
                <View className="flex flex-row items-center justify-between">
                    <View>
                        <Text className="text-white text-sm">
                            Saldo
                        </Text>
                        <Text className="text-white font-semibold text-xl">
                            R$ 12.000,00
                        </Text>
                    </View>
                    <Select
                        label="Selecione o mês"
                        options={options}
                        onSelect={handleMonthSelect}
                    />
                </View>
            </View>

            <FlatList
                data={data?.pages?.flatMap(page => page.data) || []}
                keyExtractor={(item) => String(item.day)}
                style={{ marginBottom: 50, marginTop: 30 }}
                renderItem={({ item: dayData }) => (
                    <View key={dayData.day}>
                        <View className="flex flex-row items-center justify-between border-b border-b-[#ffffff52] pb-1 mb-5">
                            <Text className="text-[8px] capitalize text-white">
                                {new Date(dayData.day).toLocaleDateString()}
                            </Text>
                            <Text className="text-[8px] text-white font-semibold">
                                Saldo do dia R$ {(dayData.totalValue / 100).toFixed(2)}
                            </Text>
                        </View>

                        <FlatList
                            data={dayData.sales}
                            keyExtractor={(sale) => sale.id}
                            renderItem={({ item: sale }) => (
                                <View className="flex flex-row items-start justify-between mb-3 p-2 bg-[#333] rounded-lg">
                                    <View>
                                        <Text className="text-white text-sm font-semibold">{sale.customer}</Text>
                                        <Text className="text-white text-xs">{sale.transactionType}</Text>
                                        <Text className="text-white text-xs">Total: R$ {(sale.totalPrice / 100).toFixed(2)}</Text>
                                    </View>
                                    <View>
                                        {sale.saleItems.map((item) => (
                                            <View key={item.id} className="flex flex-row items-center mt-2">
                                                <Image
                                                    source={{ uri: item.stock.customProduct?.imgUrl || item.stock.product?.imgUrl }}
                                                    style={{ width: 40, height: 40, marginRight: 10 }}
                                                />
                                                <View>
                                                    <Text className="text-white text-xs">
                                                        {item.stock.customProduct?.name || item.stock.product?.name}
                                                    </Text>
                                                    <Text className="text-white text-xs">
                                                        Quantidade: {item.quantity}
                                                    </Text>
                                                    <Text className="text-white text-xs">
                                                        Preço: R$ {(item.price / 100).toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.1}
            />
        </>
    );
}
