import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Input } from "@/components/input";
import { useEffect, useState } from "react";
import { DetailsProduct } from "./detailsProduct";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetGlobalProducts } from "../services/getGlobalProducts";

export function AddProductToStock() {

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()
    const [detailsVisible, setDetailsVisible] = useState(false)


    function openDetails() {
        setDetailsVisible(!detailsVisible)
    }

    function closeDetails() {
        setDetailsVisible(false)
    }

    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState(""); // Valor digitado no input
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm); // Atualiza o termo apenas após 500ms
        }, 350);

        return () => {
            clearTimeout(handler); // Limpa o timeout anterior
        };
    }, [searchTerm]);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending } = useInfiniteQuery({
        queryKey: ["InsertProductToStock", debouncedSearchTerm],
        queryFn: ({ pageParam = 0 }) => {
            return GetGlobalProducts({
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
    })

    const allProducts = data?.pages.flatMap((page) => page.data.items) || [];

    return (
        <View className="bg-bg h-screen w-full px-5">
            <View className='flex flex-row justify-between mt-16'>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Icon name='chevron-back' size={20} color={"#fff"} />
                </TouchableOpacity>
                <Text className='text-white font-semibold'>Adicionar produto</Text>
                <Text className='text-white w-[33px]'></Text>
            </View>
            <View className="my-5">
                <Input
                    name="Buscar"
                    placeholder="Buscar"
                    value={searchTerm} // Valor controlado pelo estado
                    onChangeText={(text) => setSearchTerm(text)}
                />
            </View>
            <FlatList
                data={allProducts}
                keyExtractor={(item) => item.id}
                style={{ marginBottom: 180 }}
                renderItem={({ item }) => {
                    return (

                        isPending ?

                            <View className="flex justify-center mt-72">
                                <ActivityIndicator size="small" color={"#FF7100"} />
                            </View>

                            :

                            <>
                                <TouchableOpacity className="mt-5 flex flex-row items-center gap-5" onPress={() => openDetails()}>
                                    <Image
                                        source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                        className="w-[75px] h-[75px] rounded-xl"
                                    />
                                    <View>
                                        <Text className="text-white font-semibold text-sm">
                                            {item.name}
                                        </Text>
                                        <Text className="text-textForenground">
                                            {item.company}
                                        </Text>
                                        <View className="flex flex-row items-center gap-1">
                                            <Text className="text-white font-semibold">
                                                De: R$ {(Number(item.normalPrice) / 100).toFixed(2).replace('.', ',')}
                                            </Text>

                                        </View>
                                        <View className="flex flex-row items-center gap-1">
                                            <Text className="text-primaryPrimary font-semibold">
                                                Sugerido: R$ {(Number(item.suggestedPrice) / 100).toFixed(2).replace('.', ',')}
                                            </Text>

                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </>
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

            <DetailsProduct open={detailsVisible} onClose={closeDetails} />
        </View>
    )
}