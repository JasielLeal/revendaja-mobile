import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, FlatList, ActivityIndicator, Platform } from "react-native";
import { Store } from "../../store";
import { Button } from "@/components/buttton";
import { Input } from "@/components/input";
import Icon from "react-native-vector-icons/Ionicons";
import { StockItem } from "./components/stockItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetStock } from "./services/GetStock";
import { Filter } from "./components/filter";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useSuccess } from "@/context/successContext";

export function Stock() {
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState(""); // Valor digitado no input
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Valor com debounce
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    // Configurando debounce usando setTimeout
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Atualiza o termo apenas após 500ms
        }, 500);

        return () => {
            clearTimeout(handler); // Limpa o timeout anterior
        };
    }, [searchTerm]);

    // Query utilizando o termo debounced
    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
        queryKey: ["GetStock", debouncedSearchTerm, selectedFilter],
        queryFn: ({ pageParam = 0 }) => {
            return GetStock({
                pageSize,
                page: pageParam + 1,
                searchTerm: debouncedSearchTerm,
                filter: selectedFilter
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

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    const allStock = data?.pages.flatMap((page) => page.data.items) || [];

    const [filter, setFilter] = useState(false)

    function openFilter() {
        setFilter(true)
    }

    function closeFilter() {
        setFilter(false)
    }

    const handleFilterSelect = (option: string) => {
        setSelectedFilter(option);
    };


    return (

        <>
            <View className="px-5 flex-1 bg-bg">
                <View className="flex flex-row items-center justify-between mt-5">
                    <Text className="text-white text-xl font-semibold">Estoque</Text>
                    <Button name="Adicionar Produto" onPress={() => navigate.navigate("AddProductToStock")} />
                </View>

                <View className="mt-5 flex flex-row items-center justify-between w-full">
                    <View className="w-5/6">
                        <Input
                            name="Buscar"
                            placeholder="Buscar"
                            value={searchTerm} // Valor controlado pelo estado
                            onChangeText={(text) => setSearchTerm(text)}
                        />
                    </View>
                    <TouchableOpacity className={Platform.OS == 'ios' ? "bg-forenground p-3 rounded-xl" : "bg-forenground p-2 rounded-xl"} onPress={openFilter}>
                        <Icon name="filter" color={"#fff"} size={25} />
                    </TouchableOpacity>
                </View>

                {
                    isPending ?
                        <View className="flex justify-center mt-72">
                            <ActivityIndicator size="small" color={"#FF7100"} />
                        </View>
                        :
                        <FlatList
                            data={allStock}
                            keyExtractor={(item) => item.id}
                            style={Platform.OS === 'ios' ? { marginBottom: 345, marginTop: 10 } : { marginBottom: 320, marginTop: 10 }}
                            renderItem={({ item }) => {
                                const productData = item.customProduct || item.product;

                                return (
                                    <>
                                        <StockItem
                                            id={item.id}
                                            productId={productData.id}
                                            name={productData?.name || "Produto Indefinido"}
                                            price={item.customPrice || productData?.suggestedPrice || "0"}
                                            brand={productData?.brand || "Marca Desconhecida"}
                                            quantity={item.quantity || 0}
                                            imageUrl={productData?.imgUrl || undefined}
                                            barcode={productData.barcode}
                                            discount={item.discountValue}
                                        />
                                    </>
                                );
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
                }
            </View>
            <Filter open={filter} onSelectOption={handleFilterSelect} onClose={closeFilter} />

        </>
    );
}
