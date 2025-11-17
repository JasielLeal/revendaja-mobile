import { Avatar } from '@/components/ui/avatar';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomePage() {
    const colors = useThemeColors();

    console.log('Current Colors:', colors.foreground);

    const categories = [
        { id: 1, name: 'Iniciar uma venda', icon: 'storefront-outline', screen: 'Vender' },
        { id: 2, name: 'Gerenciar estoque', icon: 'cube-outline', screen: 'Estoque' },
        { id: 3, name: 'Meus pedidos', icon: 'receipt-outline', screen: 'Pedidos' },
        { id: 5, name: 'Relatório financeiro', icon: 'bar-chart-outline', screen: 'Relatórios' },
        { id: 6, name: 'Mais', icon: 'apps-outline', screen: 'Mais' },
    ];

    const sales = [
        { id: 1, name: "Jasiel", paymentMethod: "Cartão de Crédito", amount: 150.75, date: "13/nov" },
        { id: 2, name: "Maria", paymentMethod: "Pix", amount: 89.90, date: "12/nov" },
        { id: 3, name: "Carlos", paymentMethod: "Dinheiro", amount: 45.00, date: "12/nov" },
    ];

    return (
        <View className="flex-1">
            {/* Background com gradiente */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background primário que vai até metade do card */}
            <View
                className="absolute top-0 left-0 right-0"
                style={{ height: 240, backgroundColor: colors.primary }}
            />

            {/* Ondinha de transição com shadow */}
            <View
                className="absolute"
                style={{
                    top: 200,
                    left: 0,
                    right: 0,
                    height: 50,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -5,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="pt-12 pb-5 px-4 ">
                    <View className="flex-row items-center mb-4 mt-5">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-1">
                                <Avatar
                                    name="Jasiel Viana Leal"
                                    size="md"
                                    className="mr-3"
                                    backgroundColor={colors.background}
                                    textColor={colors.foreground}
                                />
                                <Text className='text-primary-foreground font-bold text-xl'>
                                    Olá, Jasiel
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="bg-white/30 rounded-full p-2 ml-2 relative">
                            <Ionicons name="notifications" size={20} color="#fff" />
                            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                                <Text className="text-white text-xs font-bold">26</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Card Principal com Abas */}
                <View className="px-4 relative z-10" style={{ marginTop: -20 }}>
                    <View
                        className="rounded-2xl overflow-hidden shadow-lg"
                        style={{ backgroundColor: colors.card }}
                    >
                        {/* Abas */}
                        <View className="flex-row" style={{ backgroundColor: colors.muted }}>
                            <TouchableOpacity className="flex-1 py-3" style={{ backgroundColor: colors.card }}>
                                <Text className="text-center font-bold" style={{ color: colors.cardForeground }}>Saldo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 py-3">
                                <Text className="text-center text-muted-foreground" style={{ color: colors.mutedForeground }}>Lucro</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 py-3">
                                <Text className="text-center text-muted-foreground" style={{ color: colors.mutedForeground }}>Vendas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 py-3">
                                <Text className="text-center text-muted-foreground" style={{ color: colors.mutedForeground }}>Despesas</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Conteúdo do Saldo */}
                        <View className="p-5">
                            <View className="flex-row items-start mb-2">
                                <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                    R$ 752
                                </Text>
                                <Text className="text-lg font-bold mt-1" style={{ color: colors.cardForeground }}>
                                    ,91
                                </Text>
                                <TouchableOpacity className="ml-3 mt-2">
                                    <Ionicons name="eye-outline" size={20} color={colors.mutedForeground} />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row items-center mb-4">
                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>Rendeu </Text>
                                <Ionicons name="trending-up" size={12} color="#34A853" />
                                <Text className="text-green-600 text-sm font-semibold"> R$ 96,95</Text>
                                <Text className="text-sm" style={{ color: colors.mutedForeground }}> no último mês</Text>
                            </View>

                        </View>
                    </View>
                </View>

                <View className='px-4 mt-4 relative z-10'>
                    <View className="mb-4">
                        <Text className="font-bold text-xl" style={{ color: colors.foreground }}>
                            Últimas vendas
                        </Text>
                        <TouchableOpacity className="flex-row items-center">
                            <Text className=" text-sm font-semibold mr-1" style={{ color: colors.primary }} >
                                Conferir todas
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Vendas */}
                    <View className="space-y-3">
                        {sales.map((sale) => (
                            <TouchableOpacity
                                key={sale.id}
                                className="rounded-xl pb-4"
                                style={{ borderColor: colors.border }}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <View className="flex-row items-center mb-1">
                                            <View>
                                                <Ionicons
                                                    name="bag-check-outline"
                                                    size={20}
                                                    color={colors.primary}
                                                    borderWidth={1}
                                                    borderColor={colors.border}
                                                    className={`border border-${colors.border} p-4 rounded-xl mr-3`}
                                                />
                                            </View>
                                            <View className="flex-1">
                                                <Text
                                                    className="font-semibold text-base"
                                                    style={{ color: colors.foreground }}
                                                >
                                                    {sale.name}
                                                </Text>
                                                <Text
                                                    className="text-sm mb-2"
                                                    style={{ color: colors.mutedForeground }}
                                                >
                                                    {sale.paymentMethod}
                                                </Text>
                                                <View
                                                    className="rounded-full px-3 py-1"
                                                    style={{
                                                        backgroundColor: colors.isDark ? '#166534' : '#dcfce7',
                                                        alignSelf: 'flex-start'
                                                    }}
                                                >
                                                    <Text
                                                        className="text-xs font-medium"
                                                        style={{
                                                            color: colors.isDark ? '#4ade80' : '#166534'
                                                        }}
                                                    >
                                                        Pago
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="items-end">
                                        <Text className="text-green-600 font-bold text-lg">
                                            R$ {sale.amount.toFixed(2).replace('.', ',')}
                                        </Text>
                                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                            {sale.date}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Ações Rápidas - Estilo Mercado Pago */}
                <View className="pt-6 pb-8 px-4" style={{ backgroundColor: colors.background }}>
                    <Text className="font-bold text-xl mb-4" style={{ color: colors.foreground }}>
                        Ações rápidas
                    </Text>


                    {/* Grid de Ações */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                className="p-4 rounded-xl w-32"
                                style={{
                                    marginRight: 12,
                                    backgroundColor: colors.card,
                                }}
                            >
                                <Ionicons
                                    name={category.icon as any}
                                    size={24}
                                    color={colors.primary}
                                    className='mb-6'
                                />
                                <Text className="font-medium" style={{ color: colors.foreground }}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
};
