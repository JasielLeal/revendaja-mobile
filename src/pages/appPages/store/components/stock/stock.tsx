import { Text, TouchableOpacity } from "react-native";
import { Store } from "../../store";
import { Button } from "@/components/buttton";
import { View } from "react-native";
import { Input } from "@/components/input";
import Icon from 'react-native-vector-icons/Ionicons';
import { StockItem } from "./components/stockItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetStock } from "./services/GetStock";
import { useState } from "react";
import { FlatList } from "react-native";


export function Stock() {

    const pageSize = 10
    const [searchTerm, setSearchTerm] = useState('');

    const { data } = useInfiniteQuery({
        queryKey: ["GetStock", searchTerm],
        queryFn: ({ pageParam = 0 }) => {
            return GetStock({ pageSize, page: pageParam + 1, searchTerm })
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
    }) //parei aqui

    const allStock = data?.pages.flatMap((page) => page.data.items) || []

    console.log(allStock)

    return (
        <>
            <Store>
                <View className="px-5">
                    <View className="flex flex-row items-center justify-between mt-5">
                        <Text className="text-white text-xl font-semibold">
                            Estoque
                        </Text>
                        <Button name="Adicionar Produto" />
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
                        <TouchableOpacity className="bg-forenground p-2 rounded-xl">
                            <Icon name="filter" color={"#fff"} size={25} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={allStock}
                        keyExtractor={(item) => item.id}
                        style={{ marginBottom: 180 }}
                        renderItem={({ item }) => {
                            const productData = item.customProduct || item.product;

                            return (
                                <StockItem
                                    name={productData?.name || "Produto Indefinido"}
                                    price={item.customPrice || productData?.suggestedPrice || "0"}
                                    brand={productData?.brand || "Marca Desconhecida"}
                                    quantity={item.quantity || 0}
                                    imageUrl={productData?.imgUrl || undefined}
                                />
                            );
                        }}
                    />
                </View>
            </Store>
        </>
    )
}