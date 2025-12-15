import { ProductGridSkeleton } from '@/components/skeletons';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ConfigScreen } from './components/config-screen';
import { EditProduct, productType } from './components/edit-product';
import { useInfiniteStoreProducts } from './hooks/useInfiniteStoreProducts';


interface StoreConfig {
    storeName: string;
    storeDescription: string;
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    notifications: boolean;
    lowStockAlert: boolean;
    autoBackup: boolean;
    currency: string;
    taxRate: string;
}

export default function StorePage() {
    const colors = useThemeColors();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'stock' | 'config'>('stock');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
    const [showConfigModal, setShowConfigModal] = useState(false);
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

    // Usar allProducts para estatísticas (cards) e filteredProducts para a lista
    const filteredProducts = allProducts.filter(product => {
        if (stockFilter === 'inStock') return product.quantity > 0;
        if (stockFilter === 'outOfStock') return product.quantity === 0;
        return true; // 'all'
    });

    // Para os cards de estatísticas, usar todos os produtos
    const products = allProducts;

    const [storeConfig, setStoreConfig] = useState<StoreConfig>({
        storeName: 'Leal Perfumaria',
        storeDescription: 'Perfumes e cosméticos de qualidade',
        phone: '+55 11 99999-9999',
        email: 'contato@lealperfumaria.com',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        workingHours: '08:00 - 18:00',
        notifications: true,
        lowStockAlert: true,
        autoBackup: true,
        currency: 'BRL',
        taxRate: '0.00'
    });

    const getTotalProducts = () => products.length;
    const getLowStockProducts = () => products.filter(product => product.quantity <= 5).length;

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
                        {activeTab === 'stock' && (
                            <TouchableOpacity
                                className="bg-white/20 rounded-2xl px-4 py-3"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                onPress={() => router.push('/(tabs)/store/catalog')}
                            >
                                <Ionicons name="add" size={24} color={colors.primaryForeground} />
                            </TouchableOpacity>
                        )}

                        {activeTab === 'config' && (
                            <TouchableOpacity
                                className="bg-white/20 rounded-2xl px-4 py-3"
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 3,
                                }}
                                onPress={() => setShowConfigModal(true)}
                            >
                                <Ionicons name="settings" size={24} color={colors.primaryForeground} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Tabs */}
                <View
                    className="flex-row rounded-xl p-1 mt-3"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <TouchableOpacity
                        className="flex-1 py-2.5 rounded-lg"
                        onPress={() => setActiveTab('stock')}
                        style={{
                            backgroundColor: activeTab === 'stock' ? colors.primary : colors.accent,
                            borderWidth: activeTab === 'stock' ? 1 : 0,
                            borderColor: activeTab === 'stock' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                            shadowColor: activeTab === 'stock' ? '#000' : 'transparent',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.15,
                            shadowRadius: 2,
                            elevation: activeTab === 'stock' ? 3 : 0,
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons
                                name={activeTab === 'stock' ? 'cube' : 'cube-outline'}
                                size={18}
                                color={activeTab === 'stock' ? colors.foreground : colors.primaryForeground}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                className={`font-semibold ${activeTab === 'stock' ? 'text-sm' : 'text-xs'}`}
                                style={{ color: activeTab === 'stock' ? colors.foreground : colors.primaryForeground }}
                            >
                                Estoque
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-1 py-2.5 rounded-lg"
                        onPress={() => setActiveTab('config')}
                        style={{
                            backgroundColor: activeTab === 'config' ? colors.primary : colors.accent,
                            borderWidth: activeTab === 'config' ? 1 : 0,
                            borderColor: activeTab === 'config' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                            shadowColor: activeTab === 'config' ? '#000' : 'transparent',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.15,
                            shadowRadius: 2,
                            elevation: activeTab === 'config' ? 3 : 0,
                        }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons
                                name={activeTab === 'config' ? 'settings' : 'settings-outline'}
                                size={18}
                                color={activeTab === 'config' ? colors.foreground : colors.primaryForeground}
                                style={{ marginRight: 6 }}
                            />
                            <Text
                                className={`font-semibold ${activeTab === 'config' ? 'text-sm' : 'text-xs'}`}
                                style={{ color: activeTab === 'config' ? colors.foreground : colors.primaryForeground }}
                            >
                                Config
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 px-5 relative z-10" style={{ marginTop: -10 }}>
                {activeTab === 'stock' ? (
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
                                    <Text className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
                                        TOTAL DE PRODUTOS
                                    </Text>
                                    <View
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: colors.primary + '20' }}
                                    >
                                        <Ionicons name="cube" size={16} color={colors.primary} />
                                    </View>
                                </View>
                                <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                                    {getTotalProducts()}
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
                                    <Text className="text-sm font-medium" style={{ color: colors.mutedForeground }}>
                                        ESTOQUE BAIXO
                                    </Text>
                                    <View
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: '#ef444420' }}
                                    >
                                        <Ionicons name="alert-circle" size={16} color="#ef4444" />
                                    </View>
                                </View>
                                <Text className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                                    {getLowStockProducts()}
                                </Text>
                            </View>
                        </View>

                        {/* Busca e Filtros */}
                        <View className="mb-4">
                            {/* Campo de busca e Select */}
                            <View className="flex-row gap-2 items-center">
                                <View
                                    className="flex-1 flex-row items-center rounded-xl px-4 py-3.5"
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
                                        className="flex-1 ml-3"
                                        placeholder="Buscar produtos..."
                                        placeholderTextColor={colors.mutedForeground}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        style={{ color: colors.foreground }}
                                    />
                                </View>

                                {/* Select de Filtro */}
                                <TouchableOpacity
                                    className="rounded-xl px-4 py-3.5"
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
                                    onPress={() => {
                                        const options = ['all', 'inStock', 'outOfStock'];
                                        const currentIndex = options.indexOf(stockFilter);
                                        const nextIndex = (currentIndex + 1) % options.length;
                                        setStockFilter(options[nextIndex] as 'all' | 'inStock' | 'outOfStock');
                                    }}
                                >
                                    <Ionicons
                                        name={stockFilter === 'all' ? 'funnel' : stockFilter === 'inStock' ? 'checkmark-circle' : 'close-circle'}
                                        size={20}
                                        color={colors.primary}
                                    />
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
                                                    ...item,
                                                    costPrice: item.costPrice ?? 0,
                                                    status: item.status as "active" | "inactive"
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
                                                        <Text className="font-bold text-base" style={{ color: colors.foreground }}>
                                                            {item.name}
                                                        </Text>
                                                        <Text className="text-sm mt-0.5" style={{ color: colors.mutedForeground }}>
                                                            {item.company} • {item.barcode}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View className="flex-row items-center justify-between mt-2">
                                                    <Text className="font-bold text-lg" style={{ color: colors.primary }}>
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
                ) : (
                    <>
                        {/* Seção de Configurações */}
                        <ConfigScreen />
                    </>
                )}
            </View>

            {/* Modal Configurar Loja */}
            <Modal
                visible={showConfigModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowConfigModal(false)}
            >
                <View
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <View
                        className="rounded-t-3xl p-6"
                        style={{
                            backgroundColor: colors.card,
                            maxHeight: '85%',
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold" style={{ color: colors.foreground }}>
                                Configurar Loja
                            </Text>
                            <TouchableOpacity onPress={() => setShowConfigModal(false)}>
                                <Ionicons name="close" size={24} color={colors.mutedForeground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {/* Nome da Loja */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Nome da Loja
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: Leal Perfumaria"
                                    placeholderTextColor={colors.mutedForeground}
                                    value={storeConfig.storeName}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, storeName: text })}
                                />
                            </View>

                            {/* Descrição */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Descrição
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground,
                                        height: 80,
                                        textAlignVertical: 'top'
                                    }}
                                    placeholder="Ex: Perfumes e cosméticos de qualidade"
                                    placeholderTextColor={colors.mutedForeground}
                                    multiline={true}
                                    value={storeConfig.storeDescription}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, storeDescription: text })}
                                />
                            </View>

                            {/* Telefone */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Telefone
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: +55 11 99999-9999"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="phone-pad"
                                    value={storeConfig.phone}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, phone: text })}
                                />
                            </View>

                            {/* Email */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Email
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: contato@minhaloja.com"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={storeConfig.email}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, email: text })}
                                />
                            </View>

                            {/* Endereço */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Endereço
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground,
                                        height: 80,
                                        textAlignVertical: 'top'
                                    }}
                                    placeholder="Ex: Rua das Flores, 123 - São Paulo, SP"
                                    placeholderTextColor={colors.mutedForeground}
                                    multiline={true}
                                    value={storeConfig.address}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, address: text })}
                                />
                            </View>

                            {/* Horário de Funcionamento */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Horário de Funcionamento
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: 08:00 - 18:00"
                                    placeholderTextColor={colors.mutedForeground}
                                    value={storeConfig.workingHours}
                                    onChangeText={(text) => setStoreConfig({ ...storeConfig, workingHours: text })}
                                />
                            </View>
                        </ScrollView>

                        {/* Botão Salvar */}
                        <TouchableOpacity
                            className="rounded-xl py-4 mt-4"
                            style={{ backgroundColor: colors.primary }}
                            onPress={() => {
                                setShowConfigModal(false);
                                Alert.alert('Sucesso', 'Configurações da loja atualizadas!');
                            }}
                        >
                            <Text className="text-center text-lg font-bold text-white">
                                Salvar Configurações
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
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