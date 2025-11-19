import { Avatar } from '@/components/ui/avatar';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import { useRecentSales } from './hooks/useRecentSales';

type TabType = 'lucro' | 'vendas' | 'despesas';

export default function HomePage() {
    const colors = useThemeColors();
    const [selectedTab, setSelectedTab] = useState<TabType>('vendas');
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    const categories = [
        { id: 1, name: 'Iniciar uma venda', icon: 'storefront-outline', screen: 'Vender' },
        { id: 2, name: 'Gerenciar estoque', icon: 'cube-outline', screen: 'Estoque' },
        { id: 3, name: 'Meus pedidos', icon: 'receipt-outline', screen: 'Pedidos' },
        { id: 5, name: 'Relatório financeiro', icon: 'bar-chart-outline', screen: 'Relatórios' },
        { id: 6, name: 'Mais', icon: 'apps-outline', screen: 'Mais' },
    ];

    const router = useRouter();

    const { data: sales } = useRecentSales();
    const { data: metrics } = useDashboardMetrics();

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
                            <TouchableOpacity
                                className="flex-1 py-3"
                                style={{ backgroundColor: selectedTab === 'vendas' ? colors.card : 'transparent' }}
                                onPress={() => setSelectedTab('vendas')}
                            >
                                <Text
                                    className="text-center"
                                    style={{
                                        color: selectedTab === 'vendas' ? colors.cardForeground : colors.mutedForeground,
                                        fontWeight: selectedTab === 'vendas' ? 'bold' : 'normal'
                                    }}
                                >
                                    Vendas
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 py-3"
                                style={{ backgroundColor: selectedTab === 'lucro' ? colors.card : 'transparent' }}
                                onPress={() => setSelectedTab('lucro')}
                            >
                                <Text
                                    className="text-center"
                                    style={{
                                        color: selectedTab === 'lucro' ? colors.cardForeground : colors.mutedForeground,
                                        fontWeight: selectedTab === 'lucro' ? 'bold' : 'normal'
                                    }}
                                >
                                    Lucro
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 py-3"
                                style={{ backgroundColor: selectedTab === 'despesas' ? colors.card : 'transparent' }}
                                onPress={() => setSelectedTab('despesas')}
                            >
                                <Text
                                    className="text-center"
                                    style={{
                                        color: selectedTab === 'despesas' ? colors.cardForeground : colors.mutedForeground,
                                        fontWeight: selectedTab === 'despesas' ? 'bold' : 'normal'
                                    }}
                                >
                                    Despesas
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Conteúdo dinâmico baseado na aba selecionada */}
                        <View className="p-5">

                            {selectedTab === 'lucro' && (
                                <>
                                    <View className="flex-row items-start mb-2">
                                        {isBalanceVisible ? (
                                            <>
                                                <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                    {formatCurrency(metrics?.estimatedProfit || 0).split(',')[0]}
                                                </Text>
                                                <Text className="text-lg font-bold mt-1" style={{ color: colors.cardForeground }}>
                                                    ,{formatCurrency(metrics?.estimatedProfit || 0).split(',')[1]}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                R$ ••••
                                            </Text>
                                        )}
                                        <TouchableOpacity className="ml-3 mt-2" onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                                            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color={colors.mutedForeground} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center mb-4" style={{ opacity: isBalanceVisible ? 1 : 0 }}>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                            {metrics?.percentageChange.profit && metrics.percentageChange.profit > 0 ? 'Cresceu ' : 'Reduziu '}
                                        </Text>
                                        <Ionicons
                                            name={metrics?.percentageChange.profit && metrics.percentageChange.profit > 0 ? "trending-up" : "trending-down"}
                                            size={12}
                                            color={metrics?.percentageChange.profit && metrics.percentageChange.profit > 0 ? "#34A853" : "#EA4335"}
                                        />
                                        <Text className={metrics?.percentageChange.profit && metrics.percentageChange.profit > 0 ? "text-green-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                                            {' '}{formatCurrency(Math.abs(metrics?.percentageChange.profit || 0))}
                                        </Text>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}> no último mês</Text>
                                    </View>
                                </>
                            )}

                            {selectedTab === 'vendas' && (
                                <>
                                    <View className="flex-row items-start mb-2">
                                        {isBalanceVisible ? (
                                            <>
                                                <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                    {formatCurrency(metrics?.totalRevenue || 0).split(',')[0]}
                                                </Text>
                                                <Text className="text-lg font-bold mt-1" style={{ color: colors.cardForeground }}>
                                                    ,{formatCurrency(metrics?.totalRevenue || 0).split(',')[1]}
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                R$ ••••
                                            </Text>
                                        )}
                                        <TouchableOpacity className="ml-3 mt-2" onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                                            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color={colors.mutedForeground} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center mb-4" style={{ opacity: isBalanceVisible ? 1 : 0 }}>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                            {metrics?.percentageChange.revenue && metrics.percentageChange.revenue > 0 ? 'Cresceu ' : 'Reduziu '}
                                        </Text>
                                        <Ionicons
                                            name={metrics?.percentageChange.revenue && metrics.percentageChange.revenue > 0 ? "trending-up" : "trending-down"}
                                            size={12}
                                            color={metrics?.percentageChange.revenue && metrics.percentageChange.revenue > 0 ? "#34A853" : "#EA4335"}
                                        />
                                        <Text className={metrics?.percentageChange.revenue && metrics.percentageChange.revenue > 0 ? "text-green-600 text-sm font-semibold" : "text-red-600 text-sm font-semibold"}>
                                            {' '}{formatCurrency(Math.abs(metrics?.percentageChange.revenue || 0))}
                                        </Text>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}> no último mês</Text>
                                    </View>
                                </>
                            )}

                            {selectedTab === 'despesas' && (
                                <>
                                    <View className="flex-row items-start mb-2">
                                        {isBalanceVisible ? (
                                            <>
                                                <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                    R$ 3.152
                                                </Text>
                                                <Text className="text-lg font-bold mt-1" style={{ color: colors.cardForeground }}>
                                                    ,80
                                                </Text>
                                            </>
                                        ) : (
                                            <Text className="text-4xl font-bold" style={{ color: colors.cardForeground }}>
                                                R$ ••••
                                            </Text>
                                        )}
                                        <TouchableOpacity className="ml-3 mt-2" onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                                            <Ionicons name={isBalanceVisible ? "eye-outline" : "eye-off-outline"} size={20} color={colors.mutedForeground} />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-center mb-4" style={{ opacity: isBalanceVisible ? 1 : 0 }}>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}>Reduziu </Text>
                                        <Ionicons name="trending-down" size={12} color="#34A853" />
                                        <Text className="text-green-600 text-sm font-semibold"> 8%</Text>
                                        <Text className="text-sm" style={{ color: colors.mutedForeground }}> no último mês</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View className='px-4 mt-4 relative z-10'>
                    <View className="mb-4">
                        <Text className="font-bold text-xl" style={{ color: colors.foreground }}>
                            Últimas vendas
                        </Text>
                        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/sales/sales")}>
                            <Text className=" text-sm font-semibold mr-1" style={{ color: colors.primary }} >
                                Conferir todas
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Lista de Vendas */}
                    <View className="space-y-3">
                        {sales?.map((sale) => (
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
                                                    {sale.customerName}
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
                                            +{formatCurrency(sale.total)}
                                        </Text>
                                        <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                            {formatDate(sale.createdAt)}
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
