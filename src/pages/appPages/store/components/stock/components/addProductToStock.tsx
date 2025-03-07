import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Input } from '@/components/input';
import Icon from "react-native-vector-icons/Ionicons";
import { useInfiniteQuery } from '@tanstack/react-query';
import { GetGlobalProducts } from '../services/getGlobalProducts';  // Importar sua função de requisição
import { DetailsProduct } from '../components/detailsProduct';  // Importando o componente de detalhes do produto
import { RootStackParamList } from '@/types/navigation';
import { Platform } from 'react-native';
import { useSuccess } from '@/context/successContext';


export function AddProductToStock() {
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);  // Novo estado para armazenar o produto selecionado

    function openDetails(product: any) {
        setSelectedProduct(product);  // Armazena o produto clicado
        setDetailsVisible(!detailsVisible);  // Abre o modal de detalhes
    }

    function closeDetails() {
        setDetailsVisible(false);
        setSelectedProduct(null);  // Reseta o produto quando o modal for fechado
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
    });

    const allProducts = data?.pages.flatMap((page) => page.data.items) || [];

    

    return (
        <View className="bg-bg flex-1 w-full px-5">
            <View className='flex flex-row justify-between mt-16'>
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Icon name='chevron-back' size={20} color={"#fff"} />
                </TouchableOpacity>
                <Text className='text-white font-semibold'>Adicionar produto</Text>
                <TouchableOpacity className='text-white'>
                    <Icon name='add' size={20} color={"#fff"} onPress={() => navigate.push("AddCustomProduct")} />
                </TouchableOpacity>
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
                style={{ marginBottom: 10 }}
                renderItem={({ item }) => {
                    return (
                        isPending ?

                            <View className="flex justify-center mt-72">
                                <ActivityIndicator size="small" color={"#FF7100"} />
                            </View>

                            :

                            <>
                                <TouchableOpacity className="mt-5 flex flex-row items-center gap-5" onPress={() => openDetails(item)}>
                                    <Image
                                        source={item.imgUrl ? { uri: item.imgUrl } : require("@/assets/kaiak.jpg")}
                                        className="w-[75px] h-[75px] rounded-xl"
                                    />
                                    <View>
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            className='text-sm w-[220px]'
                                            style={{
                                                fontSize: Platform.OS === 'ios' ? 16 : 12, // Ajusta o tamanho do texto para o nome do produto
                                                fontWeight: '600',
                                                color: 'white',
                                            }}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: Platform.OS === 'ios' ? 14 : 12, // Ajusta o tamanho do texto para a empresa
                                                color: '#B0B0B0', // Cor padrão para o texto secundário
                                            }}
                                        >
                                            {item.company}
                                        </Text>
                                        <View className="flex flex-row items-center gap-1">
                                            <Text
                                                style={{
                                                    fontSize: Platform.OS === 'ios' ? 14 : 12, // Ajusta o tamanho do texto para o preço normal
                                                    fontWeight: '600',
                                                    color: 'white',
                                                }}
                                            >
                                                De: R$ {(Number(item.normalPrice) / 100).toFixed(2).replace('.', ',')}
                                            </Text>
                                        </View>
                                        <View className="flex flex-row items-center gap-1">
                                            <Text
                                                style={{
                                                    fontSize: Platform.OS === 'ios' ? 14 : 12, // Ajusta o tamanho do texto para o preço sugerido
                                                    fontWeight: '600',
                                                    color: '#FF7100', // Cor para destacar o preço sugerido
                                                }}
                                            >
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

            

            <DetailsProduct
                open={detailsVisible}
                onClose={closeDetails}
                product={selectedProduct}  // Passa o produto para o DetailsProduct
            />
        </View>
    );
}
