import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import template from "../../../assets/template.jpg";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    barcode: string;
    img: any;
}

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
    const [activeTab, setActiveTab] = useState<'stock' | 'config'>('stock');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);

    const [products, setProducts] = useState<Product[]>([
        { id: '1', name: 'Perfume Chanel Nº5', price: 450.00, stock: 12, category: 'Perfumes', barcode: '7891000123456', img: template },
        { id: '2', name: 'Perfume Hugo Boss', price: 280.00, stock: 8, category: 'Perfumes', barcode: '7891000123457', img: template },
        { id: '3', name: 'Hidratante Corporal', price: 85.00, stock: 25, category: 'Cuidados', barcode: '7891000123458', img: template },
        { id: '4', name: 'Perfume Feminino Importado', price: 380.00, stock: 5, category: 'Perfumes', barcode: '7891000123459', img: template },
        { id: '5', name: 'Kit Presente Masculino', price: 320.00, stock: 15, category: 'Kits', barcode: '7891000123460', img: template },
    ]);

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

    // Estados para adicionar produto
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Perfumes',
        barcode: ''
    });

    const categories = ['Todos', 'Perfumes', 'Cuidados', 'Kits', 'Maquiagem'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getTotalProducts = () => products.reduce((sum, product) => sum + product.stock, 0);
    const getLowStockProducts = () => products.filter(product => product.stock <= 5).length;

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.barcode) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
            return;
        }

        const product: Product = {
            id: Date.now().toString(),
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            category: newProduct.category,
            barcode: newProduct.barcode,
            img: template
        };

        setProducts([...products, product]);
        setNewProduct({ name: '', price: '', stock: '', category: 'Perfumes', barcode: '' });
        setShowAddProduct(false);
        Alert.alert('Sucesso', 'Produto adicionado ao estoque');
    };

    const updateStock = (productId: string, newStock: number) => {
        setProducts(products.map(product =>
            product.id === productId
                ? { ...product, stock: Math.max(0, newStock) }
                : product
        ));
    };

    const removeProduct = (productId: string) => {
        Alert.alert(
            'Remover Produto',
            'Tem certeza que deseja remover este produto do estoque?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: () => setProducts(products.filter(p => p.id !== productId))
                }
            ]
        );
    };

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
                                onPress={() => setShowAddProduct(true)}
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

            <ScrollView className="flex-1 px-5 relative z-10" style={{ marginTop: -10 }}>
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
                            {/* Campo de busca */}
                            <View className="mb-3">
                                <View
                                    className="flex-row items-center rounded-xl px-4 py-3.5"
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
                            </View>

                            {/* Categorias */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                                <View className="flex-row space-x-2 px-1 gap-2">
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            className="px-4 py-2.5 rounded-xl"
                                            style={{
                                                backgroundColor: selectedCategory === category ? colors.primary : colors.card,
                                                borderColor: selectedCategory === category ? colors.primary : colors.border + '30',
                                                borderWidth: 1,
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: selectedCategory === category ? 0.1 : 0.03,
                                                shadowRadius: 2,
                                                elevation: selectedCategory === category ? 2 : 1,
                                            }}
                                            onPress={() => setSelectedCategory(category)}
                                        >
                                            <Text
                                                className="font-semibold text-sm"
                                                style={{
                                                    color: selectedCategory === category ? 'white' : colors.foreground
                                                }}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Lista de Produtos */}
                        <View className="mb-5">


                            {filteredProducts.map((product) => (
                                <View
                                    key={product.id}
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
                                        source={product.img}
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
                                            <View className="flex-1 mr-2">
                                                <Text className="font-bold text-base" style={{ color: colors.foreground }}>
                                                    {product.name}
                                                </Text>
                                                <Text className="text-sm mt-0.5" style={{ color: colors.mutedForeground }}>
                                                    {product.category} • {product.barcode}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => removeProduct(product.id)}
                                                className="p-1.5"
                                                style={{
                                                    backgroundColor: '#ef444410',
                                                    borderRadius: 6
                                                }}
                                            >
                                                <Ionicons name="trash-outline" size={14} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>

                                        <View className="flex-row items-center justify-between mt-2">
                                            <Text className="font-bold text-lg" style={{ color: colors.primary }}>
                                                R$ {product.price.toFixed(2).replace('.', ',')}
                                            </Text>

                                            <View className="flex-row items-center">
                                                <TouchableOpacity
                                                    onPress={() => updateStock(product.id, product.stock - 1)}
                                                    className="w-7 h-7 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: colors.muted }}
                                                >
                                                    <Ionicons name="remove" size={12} color={colors.foreground} />
                                                </TouchableOpacity>

                                                <View
                                                    className="mx-3 px-2.5 py-1.5 rounded-lg min-w-12 items-center"
                                                    style={{
                                                        backgroundColor: product.stock <= 5 ? '#ef444415' : colors.primary + '15'
                                                    }}
                                                >
                                                    <Text
                                                        className="font-bold text-sm"
                                                        style={{
                                                            color: product.stock <= 5 ? '#ef4444' : colors.primary
                                                        }}
                                                    >
                                                        {product.stock}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => updateStock(product.id, product.stock + 1)}
                                                    className="w-7 h-7 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: colors.primary }}
                                                >
                                                    <Ionicons name="add" size={12} color="white" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}

                            {filteredProducts.length === 0 && (
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
                        <View className="mb-4 mt-1">
                            {/* Informações da Loja */}
                            <View
                                className="p-4 rounded-xl mb-3"
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
                                <View className="flex-row items-center mb-3">
                                    <View
                                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: colors.primary + '15' }}
                                    >
                                        <Ionicons name="storefront" size={20} color={colors.primary} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                                            {storeConfig.storeName}
                                        </Text>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                            {storeConfig.storeDescription}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setShowConfigModal(true)}
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                    >
                                        <Ionicons name="pencil" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>

                                <View className="space-y-2">
                                    <View className="flex-row items-center py-1">
                                        <Ionicons name="call" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                                        <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.phone}</Text>
                                    </View>
                                    <View className="flex-row items-center py-1">
                                        <Ionicons name="mail" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                                        <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.email}</Text>
                                    </View>
                                    <View className="flex-row items-center py-1">
                                        <Ionicons name="location" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                                        <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.address}</Text>
                                    </View>
                                    <View className="flex-row items-center py-1">
                                        <Ionicons name="time" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                                        <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.workingHours}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Configurações do Sistema */}
                            <View
                                className="p-4 rounded-xl mb-3"
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
                                <Text className="text-lg font-bold mb-3" style={{ color: colors.foreground }}>
                                    Configurações do Sistema
                                </Text>

                                {/* Notificações */}
                                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons name="notifications" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                                        <View>
                                            <Text className="font-medium" style={{ color: colors.foreground }}>
                                                Notificações
                                            </Text>
                                            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                Receber alertas do sistema
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        className={`w-12 h-6 rounded-full ${storeConfig.notifications ? 'bg-green-500' : 'bg-gray-300'}`}
                                        onPress={() => setStoreConfig({ ...storeConfig, notifications: !storeConfig.notifications })}
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <View
                                            className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.notifications ? 'translate-x-6' : 'translate-x-1'}`}
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Alerta de Estoque Baixo */}
                                <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons name="alert-circle" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                                        <View>
                                            <Text className="font-medium" style={{ color: colors.foreground }}>
                                                Alerta de Estoque Baixo
                                            </Text>
                                            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                Notificar quando estoque ≤ 5
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        className={`w-12 h-6 rounded-full ${storeConfig.lowStockAlert ? 'bg-green-500' : 'bg-gray-300'}`}
                                        onPress={() => setStoreConfig({ ...storeConfig, lowStockAlert: !storeConfig.lowStockAlert })}
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <View
                                            className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.lowStockAlert ? 'translate-x-6' : 'translate-x-1'}`}
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Backup Automático */}
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons name="cloud-upload" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                                        <View>
                                            <Text className="font-medium" style={{ color: colors.foreground }}>
                                                Backup Automático
                                            </Text>
                                            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                Sincronizar dados na nuvem
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        className={`w-12 h-6 rounded-full ${storeConfig.autoBackup ? 'bg-green-500' : 'bg-gray-300'}`}
                                        onPress={() => setStoreConfig({ ...storeConfig, autoBackup: !storeConfig.autoBackup })}
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <View
                                            className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.autoBackup ? 'translate-x-6' : 'translate-x-1'}`}
                                            style={{
                                                shadowColor: '#000',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.2,
                                                shadowRadius: 2,
                                                elevation: 2,
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Ações Rápidas */}
                            <View
                                className="p-4 rounded-xl"
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
                                <Text className="text-lg font-bold mb-3" style={{ color: colors.foreground }}>
                                    Ações Rápidas
                                </Text>

                                <View className="flex-row space-x-2 mb-3">
                                    <TouchableOpacity
                                        className="flex-1 p-3 rounded-lg items-center"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                        onPress={() => Alert.alert('Backup', 'Fazendo backup dos dados...')}
                                    >
                                        <Ionicons name="cloud-download" size={20} color={colors.primary} />
                                        <Text className="text-xs font-semibold mt-1.5" style={{ color: colors.primary }}>
                                            Backup
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        className="flex-1 p-3 rounded-lg items-center"
                                        style={{ backgroundColor: colors.primary + '10' }}
                                        onPress={() => Alert.alert('Relatórios', 'Gerando relatórios...')}
                                    >
                                        <Ionicons name="bar-chart" size={20} color={colors.primary} />
                                        <Text className="text-xs font-semibold mt-1.5" style={{ color: colors.primary }}>
                                            Relatórios
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    className="p-3 rounded-lg items-center"
                                    style={{ backgroundColor: '#ef444410' }}
                                    onPress={() => Alert.alert('Limpar Dados', 'Esta ação não pode ser desfeita!', [
                                        { text: 'Cancelar', style: 'cancel' },
                                        { text: 'Confirmar', style: 'destructive' }
                                    ])}
                                >
                                    <Ionicons name="trash" size={20} color="#ef4444" />
                                    <Text className="text-xs font-semibold mt-1.5" style={{ color: '#ef4444' }}>
                                        Limpar Dados
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Modal Adicionar Produto */}
            <Modal
                visible={showAddProduct}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddProduct(false)}
            >
                <View
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <View
                        className="rounded-t-3xl p-6"
                        style={{
                            backgroundColor: colors.card,
                            maxHeight: '80%',
                        }}
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold" style={{ color: colors.foreground }}>
                                Adicionar Produto
                            </Text>
                            <TouchableOpacity onPress={() => setShowAddProduct(false)}>
                                <Ionicons name="close" size={24} color={colors.mutedForeground} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView>
                            {/* Nome */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Nome do Produto
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: Perfume Chanel"
                                    placeholderTextColor={colors.mutedForeground}
                                    value={newProduct.name}
                                    onChangeText={(text) => setNewProduct({ ...newProduct, name: text })}
                                />
                            </View>

                            {/* Preço */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Preço (R$)
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: 450.00"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="numeric"
                                    value={newProduct.price}
                                    onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
                                />
                            </View>

                            {/* Estoque */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Quantidade em Estoque
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: 15"
                                    placeholderTextColor={colors.mutedForeground}
                                    keyboardType="numeric"
                                    value={newProduct.stock}
                                    onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
                                />
                            </View>

                            {/* Categoria */}
                            <View className="mb-4">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Categoria
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row space-x-2">
                                        {categories.slice(1).map((category) => (
                                            <TouchableOpacity
                                                key={category}
                                                className="px-4 py-2 rounded-xl"
                                                style={{
                                                    backgroundColor: newProduct.category === category ? colors.primary : colors.muted,
                                                    borderColor: newProduct.category === category ? colors.primary : colors.border,
                                                    borderWidth: 1,
                                                }}
                                                onPress={() => setNewProduct({ ...newProduct, category })}
                                            >
                                                <Text
                                                    className="font-medium"
                                                    style={{
                                                        color: newProduct.category === category ? 'white' : colors.foreground
                                                    }}
                                                >
                                                    {category}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Código de Barras */}
                            <View className="mb-6">
                                <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground }}>
                                    Código de Barras
                                </Text>
                                <TextInput
                                    className="border rounded-xl px-4 py-3"
                                    style={{
                                        borderColor: colors.border,
                                        backgroundColor: colors.background,
                                        color: colors.foreground
                                    }}
                                    placeholder="Ex: 7891000123456"
                                    placeholderTextColor={colors.mutedForeground}
                                    value={newProduct.barcode}
                                    onChangeText={(text) => setNewProduct({ ...newProduct, barcode: text })}
                                />
                            </View>
                        </ScrollView>

                        {/* Botão Adicionar */}
                        <TouchableOpacity
                            className="rounded-xl py-4 mt-4"
                            style={{ backgroundColor: colors.primary }}
                            onPress={handleAddProduct}
                        >
                            <Text className="text-center text-lg font-bold text-white">
                                Adicionar ao Estoque
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        </View>
    );
}