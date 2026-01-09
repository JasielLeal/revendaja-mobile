import { ProductGridSkeleton } from '@/components/skeletons';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { EditProduct, productType } from './components/edit-product';
import { useInfiniteStoreProducts } from './hooks/useInfiniteStoreProducts';
import { useStoreSummary } from './hooks/useStoreSumary';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StorePage() {
    const colors = useThemeColors();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [productOriginFilter, setProductOriginFilter] = useState<'all' | 'custom' | 'catalog'>('all');
    const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<productType | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

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
        refetch,
    } = useInfiniteStoreProducts(debouncedQuery ? 50 : 20, debouncedQuery);

    const allProducts = data?.pages.flatMap(page => page.data) ?? [];

    // Filtro por origem (customizados vs catálogo)
    const isCustomProduct = (p: any) => {
        const typeStr = typeof p.type === 'string' ? p.type.toLowerCase() : '';
        const looksCustomByType = typeStr.includes('custom');
        const looksCustomByCatalog = p.catalogId === 0 || p.catalogId === null || typeof p.catalogId === 'undefined';
        return looksCustomByType || looksCustomByCatalog;
    };

    const filteredProducts = allProducts.filter(product => {
        if (productOriginFilter === 'custom' && !isCustomProduct(product)) return false;
        if (productOriginFilter === 'catalog' && isCustomProduct(product)) return false;

        if (stockStatusFilter === 'inStock' && !(product.quantity > 0)) return false;
        if (stockStatusFilter === 'outOfStock' && !(product.quantity === 0)) return false;

        return true;
    });

    const insets = useSafeAreaInsets();

    // Para os cards de estatísticas, usar todos os produtos
    const products = allProducts;

    const { data: summaryData, isPending } = useStoreSummary()

    const tabBarHeight = useBottomTabBarHeight();

    return (
        <View style={{ flex: 1 }}>
            {/* Background principal */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background laranja que vai até metade da tela */}
            <View
                className="absolute top-0 left-0 right-0"
                style={{ height: 180, backgroundColor: colors.primary }}
            />

            {/* Ondinha de transição com shadow */}
            <View
                className="absolute"
                style={{
                    top: 140,
                    left: 0,
                    right: 0,
                    height: 50,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            />

            {/* Header */}
            <View className="px-5 pt-10 pb-4">
                <View className="flex-row items-center justify-between mb-4 mt-4">
                    <View className="flex-1">
                        <Text
                            className="text-base font-medium mb-1"
                            style={{ color: colors.primaryForeground + '90' }}
                        >
                            Minha Loja
                        </Text>
                        <Text
                            className="text-2xl font-black tracking-tight"
                            style={{ color: colors.primaryForeground }}
                        >
                            Gestão
                        </Text>
                    </View>

                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            className="bg-white/20 rounded-2xl px-4 py-3"
                            onPress={() => router.push('/(tabs)/store/catalog')}
                        >
                            <Ionicons name="add" size={24} color={colors.primaryForeground} />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            <View className="flex-1 px-5 relative z-10" style={{ marginTop: -10 }}>
                <>
                    {/* Estatísticas do Estoque */}
                    <View className="flex-row mb-5 justify-center gap-4 mt-2">
                        <View
                            className="flex-1 p-4 rounded-xl"
                            style={{
                                backgroundColor: colors.card,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                elevation: 3,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-sm font-medium" allowFontScaling={false} style={{ color: colors.mutedForeground }}>
                                    TOTAL DE PRODUTOS
                                </Text>
                                <View
                                    className="w-8 h-8 rounded-full items-center justify-center"
                                    style={{ backgroundColor: colors.primary + '20' }}
                                >
                                    <Ionicons name="cube" size={16} color={colors.primary} />
                                </View>
                            </View>
                            <Text className="text-2xl font-bold" allowFontScaling={false} style={{ color: colors.foreground }}>
                                {

                                    isPending ?
                                        <ActivityIndicator size="small" color={colors.foreground} /> :
                                        summaryData?.totalProducts ?? 0
                                }
                            </Text>
                        </View>

                        <View
                            className="p-4 rounded-xl"
                            style={{
                                backgroundColor: colors.card,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                elevation: 3,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-sm font-medium" allowFontScaling={false} style={{ color: colors.mutedForeground }}>
                                    ESTOQUE BAIXO
                                </Text>
                                <View
                                    className="w-8 h-8 rounded-full items-center justify-center"
                                    style={{ backgroundColor: '#ef444420' }}
                                >
                                    <Ionicons name="alert-circle" size={16} color="#ef4444" />
                                </View>
                            </View>
                            <Text className="text-2xl font-bold" allowFontScaling={false} style={{ color: '#ef4444' }}>
                                {
                                    isPending ?
                                        <ActivityIndicator size="small" color={colors.foreground} /> :
                                        summaryData?.lowStockProducts ?? 0
                                }
                            </Text>
                        </View>
                    </View>

                    {/* Busca e Filtros */}
                    <View className="mb-4">
                        {/* Campo de busca e Select */}
                        <View className="flex-row gap-2 items-center">
                            <View
                                className={
                                    Platform.OS === 'ios' ?
                                        "flex-1 flex-row items-center rounded-xl px-4 py-3.5"
                                        :
                                        "flex-1 flex-row items-center rounded-xl px-4 py-3"
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
                                    style={{
                                        color: colors.foreground,
                                        paddingVertical: 0,
                                    }}
                                />
                            </View>

                            {/* Select de Tipo (Todos, Customizados, Catálogo) */}
                            <TouchableOpacity
                                className="rounded-xl px-4 py-3.5 flex-row items-center"
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
                                onPress={() => setShowFilterModal(true)}
                            >
                                <Ionicons name="funnel" size={18} color={colors.primary} />

                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Lista de Produtos */}
                    <View className="mb-5">
                        {isLoading ? (
                            <View className="px-4">
                                <ProductGridSkeleton />
                            </View>
                        ) : (
                            <FlatList
                                data={filteredProducts}
                                contentContainerStyle={{ paddingBottom: tabBarHeight + 80 }}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedProduct({
                                                id: item.id,
                                                name: item.name,
                                                price: item.price,
                                                quantity: item.quantity,
                                                brand: item.brand,
                                                barcode: item.barcode,
                                                company: item.company,
                                                imgUrl: item.imgUrl,
                                                validity_date: item.validity_date ?? '', // fallback if missing
                                                cost_price: item.cost_price ?? item.catalogPrice ?? 0, // fallback to catalogPrice or 0
                                                status: item.status as "active" | "inactive",
                                            });
                                            setShowEditModal(true);
                                        }}
                                        className="flex-row items-center p-3.5 mb-2.5 rounded-xl"
                                        style={{
                                            backgroundColor: colors.card,
                                            shadowColor: '#000',
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.06,
                                            shadowRadius: 4,
                                            elevation: 2,
                                            borderColor: colors.border + '20',
                                            borderWidth: 1,
                                            opacity: (item.status === 'inactive') ? 0.7 : 1,
                                        }}
                                    >
                                        <Image
                                            source={{ uri: item.imgUrl }}
                                            style={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 10,
                                                marginRight: 12
                                            }}
                                            contentFit="cover"
                                        />
                                        <View className="flex-1">
                                            <View className="flex-row items-start justify-between mb-1">
                                                <View className="flex-1 mr-2" style={{ minHeight: 58 }}>
                                                    <Text className="font-bold text-base" allowFontScaling={false} style={{ color: colors.foreground }}>
                                                        {item.name}
                                                    </Text>
                                                    <Text className="text-sm mt-0.5" allowFontScaling={false} style={{ color: colors.mutedForeground }}>
                                                        {
                                                            item.company === "Custom" ? "Produto Customizado" : item.company
                                                        } • {item.barcode}
                                                    </Text>
                                                </View>
                                                {item.status === 'inactive' && (
                                                    <View
                                                        className="flex-row items-center px-2 py-1 rounded-lg"
                                                        style={{ backgroundColor: '#ef444415' }}
                                                    >
                                                        <Ionicons name="close-circle" size={14} color="#ef4444" />
                                                        <Text className="ml-1 text-xs font-semibold" allowFontScaling={false} style={{ color: '#ef4444' }}>
                                                            Desativado
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View className="flex-row items-center justify-between mt-2">
                                                <Text className="font-bold text-lg" allowFontScaling={false} style={{ color: colors.primary }}>
                                                    R$ {(item.price / 100).toFixed(2).replace('.', ',')}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <View
                                                        className="px-2 py-1.5 rounded-lg min-w-12 items-center"
                                                        style={{
                                                            backgroundColor: item.quantity <= 5 ? '#ef444415' : colors.primary + '15'
                                                        }}
                                                    >
                                                        <Text
                                                            className="font-bold text-sm"
                                                            allowFontScaling={false}
                                                            style={{
                                                                color: item.quantity <= 5 ? '#ef4444' : colors.primary
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                onEndReached={() => {
                                    if (hasNextPage && !isFetchingNextPage) {
                                        fetchNextPage();
                                    }
                                }}
                                onEndReachedThreshold={0.2}
                                ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
                                refreshing={isLoading}
                                onRefresh={refetch}
                            />
                        )}
                        {products.length === 0 && !isLoading && (
                            <View
                                className="items-center py-12 px-6 rounded-xl"
                                style={{ backgroundColor: colors.card + '50' }}
                            >
                                <View
                                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                    style={{ backgroundColor: colors.primary + '15' }}
                                >
                                    <Ionicons name="cube-outline" size={32} color={colors.primary} />
                                </View>
                                <Text className="text-center text-lg font-semibold mb-2" style={{ color: colors.foreground }}>
                                    Nenhum produto encontrado
                                </Text>
                                <Text className="text-center text-sm leading-5" style={{ color: colors.mutedForeground }}>
                                    Tente ajustar os filtros ou{searchQuery ? ' sua busca' : '\nadicionar novos produtos'}
                                </Text>
                            </View>
                        )}
                    </View>
                </>
            </View>
            {/* Modal de filtro por tipo */}
            <Modal
                visible={showFilterModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="flex-1 justify-end"
                    onPress={() => setShowFilterModal(false)}
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                >
                    <View
                        className="rounded-t-2xl p-4"
                        style={{
                            backgroundColor: colors.card,
                            paddingBottom: insets.bottom + 12,
                        }}
                    >
                        <Text className="text-base font-semibold mb-3" style={{ color: colors.foreground }}>
                            Filtrar produtos
                        </Text>

                        <Text className="text-xs font-semibold mb-2" style={{ color: colors.mutedForeground }}>
                            Origem
                        </Text>
                        {[
                            { key: 'all', label: 'Todos' },
                            { key: 'custom', label: 'Somente customizados' },
                            { key: 'catalog', label: 'Somente catálogo' },
                        ].map(opt => (
                            <TouchableOpacity
                                key={opt.key}
                                className="flex-row items-center py-3 px-2 rounded-lg mb-1"
                                onPress={() => setProductOriginFilter(opt.key as 'all' | 'custom' | 'catalog')}
                                style={{
                                    backgroundColor:
                                        productOriginFilter === (opt.key as any) ? colors.accent : 'transparent',
                                }}
                            >
                                <Ionicons
                                    name={
                                        productOriginFilter === (opt.key as any)
                                            ? 'radio-button-on'
                                            : 'radio-button-off'
                                    }
                                    size={18}
                                    color={colors.primary}
                                />
                                <Text className="ml-2" style={{ color: colors.foreground }}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={{ height: 8 }} />
                        <Text className="text-xs font-semibold mb-2" style={{ color: colors.mutedForeground }}>
                            Estoque
                        </Text>
                        {[
                            { key: 'all', label: 'Todos' },
                            { key: 'inStock', label: 'Em estoque' },
                            { key: 'outOfStock', label: 'Sem estoque' },
                        ].map(opt => (
                            <TouchableOpacity
                                key={opt.key}
                                className="flex-row items-center py-3 px-2 rounded-lg mb-1"
                                onPress={() => setStockStatusFilter(opt.key as 'all' | 'inStock' | 'outOfStock')}
                                style={{
                                    backgroundColor:
                                        stockStatusFilter === (opt.key as any) ? colors.accent : 'transparent',
                                }}
                            >
                                <Ionicons
                                    name={
                                        stockStatusFilter === (opt.key as any)
                                            ? 'radio-button-on'
                                            : 'radio-button-off'
                                    }
                                    size={18}
                                    color={colors.primary}
                                />
                                <Text className="ml-2" style={{ color: colors.foreground }}>{opt.label}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            className="mt-2 py-3 rounded-xl items-center"
                            onPress={() => setShowFilterModal(false)}
                            style={{ backgroundColor: colors.primary }}
                        >
                            <Text className="font-semibold" style={{ color: colors.foreground }}>
                                Concluir
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <EditProduct
                visible={showEditModal}
                product={selectedProduct}
                onClose={() => {
                    setShowEditModal(false)
                }}
            />
        </View>
    );
}