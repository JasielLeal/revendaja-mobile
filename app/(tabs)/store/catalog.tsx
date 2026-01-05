import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Platform
} from 'react-native';
import { AddProductSheet } from './components/AddProductSheet';
import { CatalogProduct, useInfiniteCatalogProducts } from './hooks/useInfiniteCatalogProducts';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CatalogScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
    const [showAddProductSheet, setShowAddProductSheet] = useState(false);

    // Debounce do termo de busca
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteCatalogProducts(10, debouncedQuery);

    // Extrair os produtos de todas as páginas
    // A resposta vem como: { products: [...], page: 1, pageSize: 10, totalPages: 46, ... }
    const products = data?.pages.flatMap((page: any) => page.products) ?? [];

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const formatPrice = (price: number) => {
        return (price / 100).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const renderProduct = ({ item }: { item: CatalogProduct }) => (
        <TouchableOpacity
            className="flex-1 m-2 rounded-xl overflow-hidden"
            style={{
                backgroundColor: colors.card,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 3,
                elevation: 2,
                height: 300, // Altura fixa para uniformidade
            }}
            onPress={() => {
                setSelectedProduct(item);
                setShowAddProductSheet(true);
            }}
        >
            {/* Imagem do Produto */}
            <View
                style={{
                    height: 160,
                    backgroundColor: colors.muted,
                    overflow: 'hidden',
                }}
            >
                <Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                />
                <View
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                >
                    <Text className="text-xs font-bold" allowFontScaling={false} style={{ color: colors.primaryForeground }}>
                        {item.company}
                    </Text>
                </View>
            </View>

            {/* Informações do Produto */}
            <View className="p-3 flex-1 flex justify-between">
                <View>
                    <Text
                        className="text-xs font-semibold mb-1"
                        style={{ color: colors.mutedForeground }}     
                    >
                        {item.brand}
                    </Text>
                    <Text
                        className="text-[15px] font-bold mb-2 leading-4"
                        numberOfLines={3}
                        style={{ color: colors.foreground }}
                        allowFontScaling={false}
                    >
                        {item.name}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text
                        className="text-lg font-bold"
                        style={{ color: colors.primary }}
                        allowFontScaling={false}
                    >
                        {formatPrice(item.price)}
                    </Text>
                    <TouchableOpacity
                        className="w-8 h-8 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary + '20' }}
                        onPress={() => {
                            setSelectedProduct(item);
                            setShowAddProductSheet(true);
                        }}
                    >
                        <Ionicons
                            name="add"
                            size={18}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="px-5 pb-4 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center"
                    >
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color={colors.foreground}
                        />
                    </TouchableOpacity>
                    <Text
                        className="text-xl font-bold flex-1 ml-4"
                        allowFontScaling={false}
                        style={{ color: colors.foreground }}
                    >
                        Catálogo
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/(tabs)/store/custom-product')}>
                        <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                            Adicone seu produto
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Input de Busca */}
                <View className="px-5 pb-4">
                    <View
                        className={
                            Platform.OS === 'ios' ?
                                "flex-row items-center rounded-xl px-4 py-3.5"
                                :
                                "flex-row items-center rounded-xl px-4 py-1"
                        }
                        style={{

                            backgroundColor: colors.card,
                            borderColor: colors.border + '40',
                            borderWidth: 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.04,
                            shadowRadius: 3,
                            elevation: 1,
                        }}
                    >
                        <Ionicons name="search" size={20} color={colors.mutedForeground} />
                        <TextInput
                            allowFontScaling={false}
                            className="flex-1 ml-3"
                            placeholder="Buscar produtos..."
                            placeholderTextColor={colors.mutedForeground}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={{ color: colors.foreground }}
                        />
                    </View>
                </View>

                {/* Lista de Produtos */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={products}
                        renderItem={renderProduct}
                        keyExtractor={item => item?.id?.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ paddingHorizontal: 8 }}
                        contentContainerStyle={{
                            paddingBottom: tabBarHeight + 20,
                            paddingHorizontal: 4,
                        }}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <View className="py-8">
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            ) : null
                        }
                    />
                )}
            </SafeAreaView>

            {/* Sheet para adicionar produto */}
            <AddProductSheet
                visible={showAddProductSheet}
                product={selectedProduct}
                onClose={() => {
                    setShowAddProductSheet(false);
                    setSelectedProduct(null);
                }}
                onSuccess={() => {
                    // Opcional: atualizar lista ou fazer algo após sucesso
                }}
            />
        </View>
    );
}
