import { useAuth } from '@/app/providers/AuthProvider';
import { useNotificationsContext } from '@/app/providers/NotificationsProvider';
import { authService } from '@/app/services/auth';
import { SaleItemSkeleton } from '@/components/skeletons';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MetricsCardSkeleton } from './components/MetricsCardSkeleton';
import { NotificationsCenter } from './components/NotificationsCenter';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { useDashboardMetrics } from './hooks/useDashboardMetrics';
import { useRecentSales } from './hooks/useRecentSales';

type TabType = 'lucro' | 'vendas' | 'despesas';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    imgUrl: string;
    price: number;
    storeProductId: string;
    createdAt: string;
    updatedAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    paymentMethod: string;
    customerName: string;
    customerPhone: string;
    storeId?: string;
    createdAt: string;
    updatedAt?: string;
    items: OrderItem[];
}

export default function HomePage() {
    const colors = useThemeColors();
    const { unreadCount } = useNotificationsContext();
    const [selectedTab, setSelectedTab] = useState<TabType>('vendas');
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { user } = useAuth()

    const categories: { id: number; name: string; icon: string; screen: Href }[] = [
        { id: 1, name: 'Iniciar uma venda', icon: 'storefront-outline', screen: '/(tabs)/new-sale/new-sale' },
        { id: 2, name: 'Gerenciar estoque', icon: 'cube-outline', screen: '/(tabs)/store/store' },
        { id: 3, name: 'Meus pedidos', icon: 'receipt-outline', screen: '/(tabs)/sales/sales' },
        { id: 5, name: 'Relatório financeiro', icon: 'bar-chart-outline', screen: '/(tabs)/sales/sales' },
        { id: 6, name: 'Mais', icon: 'apps-outline', screen: '/(tabs)/more/more' },
    ];

    const router = useRouter();

    const { data: sales, refetch: refetchSales, isLoading: isSalesLoading } = useRecentSales();
    const getStatusLabel = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'approved': 'Aprovados',
            'pending': 'Pendentes',
            'Todos': 'Todos'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: { [key: string]: { bg: string, text: string } } = {
            'approved': {
                bg: colors.isDark ? '#166534' : '#dcfce7',
                text: colors.isDark ? '#4ade80' : '#166534'
            },
            'pending': {
                bg: colors.isDark ? '#854d0e' : '#fef3c7',
                text: colors.isDark ? '#fbbf24' : '#854d0e'
            }
        };
        return colorMap[status] || colorMap['approved'];
    };

    const { data: metrics, isLoading: isMetricsLoading } = useDashboardMetrics();

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
                                    Olá, {user?.name}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className="bg-white/30 rounded-full p-2 ml-2 relative"
                            onPress={() => setShowNotifications(true)}
                        >
                            <Ionicons name="notifications" size={20} color="#fff" />
                            {unreadCount > 0 && (
                                <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                                    <Text className="text-white text-xs font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        {/* Botão temporário para testar expiração do token */}
                        <TouchableOpacity
                            className="bg-red-500 rounded-full p-2 ml-2"
                            onPress={async () => {
                                await authService.saveToken('token_invalido_teste');
                                alert('Token corrompido! Tente fazer uma requisição agora.');
                            }}
                        >
                            <Ionicons name="bug" size={20} color="#fff" />
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
                        </View>

                        {/* Conteúdo dinâmico baseado na aba selecionada */}
                        <View className="p-5">
                            {isMetricsLoading ? (
                                <MetricsCardSkeleton />
                            ) : (
                                <>
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

                                                <TouchableOpacity
                                                    className="ml-3 mt-2"
                                                    onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                                                >
                                                    <Ionicons
                                                        name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
                                                        size={20}
                                                        color={colors.mutedForeground}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <View
                                                className="flex-row items-center mb-4"
                                                style={{ opacity: isBalanceVisible ? 1 : 0 }}
                                            >
                                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                    {(metrics?.percentageChange.profit ?? 0) > 0 ? 'Cresceu ' : 'Reduziu '}
                                                </Text>
                                                <Ionicons
                                                    name={(metrics?.percentageChange.profit ?? 0) > 0 ? 'trending-up' : 'trending-down'}
                                                    size={12}
                                                    color={(metrics?.percentageChange.profit ?? 0) > 0 ? '#34A853' : '#EA4335'}
                                                />
                                                <Text
                                                    className={
                                                        (metrics?.percentageChange.profit ?? 0) > 0
                                                            ? 'text-green-600 text-sm font-semibold'
                                                            : 'text-red-600 text-sm font-semibold'
                                                    }
                                                >
                                                    {' '}
                                                    {formatCurrency(Math.abs(metrics?.percentageChange.profit || 0))}
                                                </Text>
                                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                    {' '}
                                                    no último mês
                                                </Text>
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

                                                <TouchableOpacity
                                                    className="ml-3 mt-2"
                                                    onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                                                >
                                                    <Ionicons
                                                        name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
                                                        size={20}
                                                        color={colors.mutedForeground}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <View
                                                className="flex-row items-center mb-4"
                                                style={{ opacity: isBalanceVisible ? 1 : 0 }}
                                            >
                                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                    {(metrics?.percentageChange.revenue ?? 0) > 0 ? 'Cresceu ' : 'Reduziu '}
                                                </Text>
                                                <Ionicons
                                                    name={(metrics?.percentageChange.revenue ?? 0) > 0 ? 'trending-up' : 'trending-down'}
                                                    size={12}
                                                    color={(metrics?.percentageChange.revenue ?? 0) > 0 ? '#34A853' : '#EA4335'}
                                                />
                                                <Text
                                                    className={
                                                        (metrics?.percentageChange.revenue ?? 0) > 0
                                                            ? 'text-green-600 text-sm font-semibold'
                                                            : 'text-red-600 text-sm font-semibold'
                                                    }
                                                >
                                                    {' '}
                                                    {formatCurrency(Math.abs(metrics?.percentageChange.revenue || 0))}
                                                </Text>
                                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                    {' '}
                                                    no último mês
                                                </Text>
                                            </View>
                                        </>
                                    )}


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

                    {isSalesLoading ?
                        <View className="gap-3">
                            {[...Array(3)].map((_, index) => (
                                <SaleItemSkeleton key={index} />
                            ))}
                        </View>
                        :
                        sales && sales.length > 0 ? (
                            <View className="gap-3">
                                {sales.slice(0, 3).map((sale) => (
                                    <TouchableOpacity
                                        key={sale.id}
                                        onPress={() => {
                                            setSelectedOrder({
                                                ...sale,
                                                items: sale.items.map(item => ({
                                                    ...item,
                                                    storeProductId: '',
                                                    createdAt: '',
                                                    updatedAt: ''
                                                }))
                                            });
                                            setShowOrderDetails(true);
                                        }}
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
                                                                backgroundColor: getStatusColor(sale.status).bg,
                                                                alignSelf: 'flex-start'
                                                            }}
                                                        >
                                                            <Text
                                                                className="text-xs font-medium"
                                                                style={{
                                                                    color: getStatusColor(sale.status).text
                                                                }}
                                                            >
                                                                {getStatusLabel(sale.status)}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="items-end">
                                                <Text className={sale.status === 'approved' ? "text-green-600 font-bold text-lg" : "text-yellow-600 font-bold text-lg"}>
                                                    {
                                                        sale.status === 'approved' ? <Text>+{formatCurrency(sale.total)}</Text> : <Text>{formatCurrency(sale.total)}</Text>
                                                    }
                                                </Text>
                                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                                    {formatDate(sale.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : (
                            <View className="rounded-xl p-8 items-center" style={{ backgroundColor: colors.card }}>
                                <Ionicons name="receipt-outline" size={48} color={colors.mutedForeground} style={{ marginBottom: 12 }} />
                                <Text className="text-base text-center" style={{ color: colors.mutedForeground }}>
                                    Nenhuma venda recente
                                </Text>
                            </View>
                        )}
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
                                onPress={() => router.push(category.screen)}
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

                <OrderDetailsModal
                    visible={showOrderDetails}
                    order={selectedOrder}
                    onClose={() => {
                        setShowOrderDetails(false);
                        refetchSales();
                    }}
                    getStatusLabel={getStatusLabel}
                    getStatusColor={getStatusColor}
                />

                <NotificationsCenter
                    visible={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            </ScrollView>
        </View>
    );
};
