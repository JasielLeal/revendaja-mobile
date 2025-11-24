import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import {
    CustomDatePicker,
    DateFilterDropdown,
    OrderDetailsModal,
    SalesHeader,
    SalesItem,
    SalesStatsCards,
    SearchBar,
    StatusFilters
} from './components';
import { useSalesPagination } from './hooks/useSalesPagination';

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
    storeId: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

interface SalesPageProps {
    navigation?: any;
}

export default function SalesPage({ navigation }: SalesPageProps) {
    const colors = useThemeColors();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [selectedDateFilter, setSelectedDateFilter] = useState('Este mês');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    // Debounce para busca - aguarda 500ms após parar de digitar
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Calcular datas com base no filtro selecionado
    const dateRange = useMemo(() => {
        const now = new Date();
        let from = '';
        let to = '';

        switch (selectedDateFilter) {
            case 'Todos':
                from = '';
                to = '';
                break;
            case 'Hoje':
                from = now.toISOString().split('T')[0];
                to = from;
                break;
            case 'Esta semana':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay());
                from = startOfWeek.toISOString().split('T')[0];
                to = now.toISOString().split('T')[0];
                break;
            case 'Este mês':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                from = startOfMonth.toISOString().split('T')[0];
                to = now.toISOString().split('T')[0];
                break;
            default:
                // Personalizado
                if (selectedStartDate && selectedEndDate) {
                    from = selectedStartDate;
                    to = selectedEndDate;
                } else if (selectedStartDate) {
                    from = selectedStartDate;
                    to = selectedStartDate;
                }
                break;
        }

        return { from, to };
    }, [selectedDateFilter, selectedStartDate, selectedEndDate]);

    // Hook de paginação com filtros (incluindo status)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
        isRefetching
    } = useSalesPagination({
        from: dateRange.from,
        to: dateRange.to,
        search: debouncedSearch,
        status: selectedFilter === 'Todos' ? undefined : selectedFilter,
        limit: 20
    });

    // Uma única requisição para obter todas as vendas e fazer contagens
    const { data: allSalesData } = useSalesPagination({
        from: dateRange.from,
        to: dateRange.to,
        search: '',
        status: undefined,
        limit: 9999
    });

    // Combinar todas as páginas em uma lista única
    const allOrders = useMemo(() => {
        return data?.pages.flatMap(page => page.orders) ?? [];
    }, [data]);

    // Pega todas as vendas para fazer as contagens
    const allSalesForCounting = useMemo(() => {
        return allSalesData?.pages.flatMap(page => page.orders) ?? [];
    }, [allSalesData]);

    // Estatísticas sempre sem filtro de status
    const stats = useMemo(() => {
        if (!allSalesData?.pages[0]) return { totalOrders: 0, totalRevenue: 0, estimatedProfit: 0 };
        return {
            totalOrders: allSalesData.pages[0].totalOrders,
            totalRevenue: allSalesData.pages[0].totalRevenue,
            estimatedProfit: allSalesData.pages[0].estimatedProfit
        };
    }, [allSalesData]);

    // Contar vendas por status baseado nas vendas carregadas
    const ordersByStatus = useMemo(() => {
        const approved = allSalesForCounting.filter(order => order.status === 'approved').length;
        const pending = allSalesForCounting.filter(order => order.status === 'pending').length;

        return {
            total: allSalesForCounting.length,
            approved,
            pending
        };
    }, [allSalesForCounting]);

    // Função para lidar com seleção de datas no calendário
    const onDayPress = (day: any) => {
        const dateString = day.dateString;

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(dateString);
            setSelectedEndDate('');
            setMarkedDates({
                [dateString]: {
                    selected: true,
                    startingDay: true,
                    color: '#3b82f6',
                    textColor: 'white'
                }
            });
        } else if (selectedStartDate && !selectedEndDate) {
            const start = new Date(selectedStartDate);
            const end = new Date(dateString);

            if (end < start) {
                setSelectedStartDate(dateString);
                setSelectedEndDate(selectedStartDate);
            } else {
                setSelectedEndDate(dateString);
            }

            // Marcar intervalo
            const newMarkedDates: any = {};
            const startDate = end < start ? end : start;
            const endDate = end < start ? start : end;

            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const currentDateString = currentDate.toISOString().split('T')[0];

                if (currentDate.getTime() === startDate.getTime()) {
                    newMarkedDates[currentDateString] = {
                        selected: true,
                        startingDay: true,
                        color: '#3b82f6',
                        textColor: 'white'
                    };
                } else if (currentDate.getTime() === endDate.getTime()) {
                    newMarkedDates[currentDateString] = {
                        selected: true,
                        endingDay: true,
                        color: '#3b82f6',
                        textColor: 'white'
                    };
                } else {
                    newMarkedDates[currentDateString] = {
                        selected: true,
                        color: '#3b82f620',
                        textColor: '#3b82f6'
                    };
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            setMarkedDates(newMarkedDates);
        }
    };

    // Função para confirmar seleção de datas
    const confirmDateRange = () => {
        if (selectedStartDate && selectedEndDate) {
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);

            const formatDateLabel = (date: Date) => {
                return date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                }).replace('.', '');
            };

            const finalStart = startDate < endDate ? startDate : endDate;
            const finalEnd = startDate < endDate ? endDate : startDate;

            setSelectedDateFilter(`${formatDateLabel(finalStart)} - ${formatDateLabel(finalEnd)}`);
        } else if (selectedStartDate) {
            const date = new Date(selectedStartDate);
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short'
            }).replace('.', '');
            setSelectedDateFilter(formattedDate);
        }
        setShowCalendar(false);
    };

    const cancelDateSelection = () => {
        setShowCalendar(false);
        setSelectedStartDate('');
        setSelectedEndDate('');
        setMarkedDates({});
    };

    const filters = ['Todos', 'approved', 'pending'];
    const dateFilters = ['Todos', 'Hoje', 'Esta semana', 'Este mês', 'Personalizado'];

    // Funções helper
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

    return (
        <View className="flex-1">
            {/* Background principal */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background primário que vai até metade do card */}
            <View
                className="absolute top-0 left-0 right-0"
                style={{ height: 200, backgroundColor: colors.primary }}
            />

            {/* Ondinha de transição com shadow */}
            <View
                className="absolute"
                style={{
                    top: 160,
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

            {/* Conteúdo fixo (header, cards, search, filters) */}
            <View>
                <SalesHeader
                    selectedDateFilter={selectedDateFilter}
                    showDatePicker={showDatePicker}
                    onToggleDatePicker={() => setShowDatePicker(!showDatePicker)}
                />

                <SalesStatsCards
                    totalRevenue={stats.totalRevenue}
                    totalOrders={stats.totalOrders}
                    selectedDateFilter={selectedDateFilter}
                />

                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                <StatusFilters
                    filters={filters}
                    selectedFilter={selectedFilter}
                    ordersByStatus={ordersByStatus}
                    onFilterSelect={setSelectedFilter}
                    getStatusLabel={getStatusLabel}
                />
            </View>

            <DateFilterDropdown
                visible={showDatePicker}
                dateFilters={dateFilters}
                selectedDateFilter={selectedDateFilter}
                onClose={() => setShowDatePicker(false)}
                onFilterSelect={(filter) => {
                    setSelectedDateFilter(filter);
                    setShowDatePicker(false);
                }}
                onCustomDatePress={() => {
                    setShowCalendar(true);
                    setShowDatePicker(false);
                }}
            />

            <CustomDatePicker
                visible={showCalendar}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
                markedDates={markedDates}
                onDayPress={onDayPress}
                onConfirm={confirmDateRange}
                onCancel={cancelDateSelection}
            />

            {/* Lista de vendas - SOMENTE isso scrolla */}
            <FlatList
                data={allOrders}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={() => refetch()}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        progressBackgroundColor={colors.background}
                    />
                }
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <ActivityIndicator size="small" color={colors.primary} />
                        </View>
                    ) : null
                )}
                ListEmptyComponent={() => (
                    !isLoading && allOrders.length === 0 && (
                        <View className="px-4 py-16 items-center">
                            <View
                                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                                style={{ backgroundColor: colors.muted + '40' }}
                            >
                                <Ionicons name="receipt-outline" size={48} color={colors.mutedForeground} />
                            </View>
                            <Text
                                className="text-xl font-bold mb-2 text-center"
                                style={{ color: colors.foreground }}
                            >
                                Nenhuma venda encontrada
                            </Text>
                            <Text
                                className="text-base text-center mb-6 px-8"
                                style={{ color: colors.mutedForeground }}
                            >
                                {searchQuery
                                    ? "Tente ajustar os filtros ou termo de busca"
                                    : "Que tal começar registrando sua primeira venda?"
                                }
                            </Text>
                            {!searchQuery && (
                                <TouchableOpacity
                                    className="flex-row items-center px-6 py-3 rounded-2xl"
                                    style={{ backgroundColor: colors.primary + '20', borderColor: colors.primary, borderWidth: 1 }}
                                    onPress={() => {/* Navegar para nova venda */ }}
                                >
                                    <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                                    <Text
                                        className="ml-2 font-semibold"
                                        style={{ color: colors.primary }}
                                    >
                                        Criar primeira venda
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )
                )}
                renderItem={({ item: order }) => (
                    <SalesItem
                        order={order}
                        onPress={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                        }}
                        getStatusLabel={getStatusLabel}
                        getStatusColor={getStatusColor}
                    />
                )}
            />

            <OrderDetailsModal
                visible={showOrderDetails}
                order={selectedOrder}
                onClose={() => setShowOrderDetails(false)}
                onRefresh={refetch}
                getStatusLabel={getStatusLabel}
                getStatusColor={getStatusColor}
            />
        </View>
    );
}
