import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useSalesPagination } from './hooks/useSalesPagination';

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
                // Não define from/to para buscar todas as vendas
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
        limit: 9999 // Busca todas para contagem correta
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
            // Primeira seleção ou nova seleçãof
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
            // Segunda seleção - definir intervalo
            const start = new Date(selectedStartDate);
            const end = new Date(dateString);

            if (end < start) {
                // Se data final é anterior, inverter
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

            const formatDate = (date: Date) => {
                return date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short'
                }).replace('.', '');
            };

            const finalStart = startDate < endDate ? startDate : endDate;
            const finalEnd = startDate < endDate ? endDate : startDate;

            setSelectedDateFilter(`${formatDate(finalStart)} - ${formatDate(finalEnd)}`);
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

    const filters = ['Todos', 'approved', 'pending'];

    // Função para traduzir status
    const getStatusLabel = (status: string) => {
        const statusMap: { [key: string]: string } = {
            'approved': 'Aprovados',
            'pending': 'Pendentes',
            'Todos': 'Todos'
        };
        return statusMap[status] || status;
    };

    // Função para obter cor do status
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

    const dateFilters = ['Todos', 'Hoje', 'Esta semana', 'Este mês', 'Personalizado'];

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
                {/* Header */}
                <View className="px-4 pt-12 pb-6">
                    <View className="flex-row items-center justify-between mb-6 mt-5">
                        <View className="flex-1">
                            <Text
                                className="text-lg font-medium mb-1"
                                style={{ color: colors.primaryForeground + '80' }}
                            >
                                Gestão de vendas
                            </Text>
                            <Text
                                className="text-3xl font-black tracking-tight"
                                style={{ color: colors.primaryForeground }}
                            >
                                Vendas
                            </Text>
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center bg-white/20 rounded-2xl px-4 py-2"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                            onPress={() => setShowDatePicker(!showDatePicker)}
                        >
                            <Ionicons name="calendar" size={20} color={colors.primaryForeground} />
                            <Text
                                className="ml-2 text-sm font-semibold"
                                style={{ color: colors.primaryForeground }}
                            >
                                {selectedDateFilter}
                            </Text>
                            <Ionicons
                                name={showDatePicker ? "chevron-up" : "chevron-down"}
                                size={16}
                                color={colors.primaryForeground}
                                className="ml-1"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cards de Resumo */}
                <View className="px-4 mb-6 relative z-10" style={{ marginTop: -30 }}>
                    <View className="flex-row gap-3 mb-4">
                        {/* Total de Vendas */}
                        <View
                            className="flex-1 rounded-3xl p-5"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                borderWidth: 1,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View
                                    className="w-10 h-10 rounded-2xl items-center justify-center"
                                    style={{ backgroundColor: colors.primary + '20' }}
                                >
                                    <Ionicons name="trending-up" size={20} color={colors.primary} />
                                </View>
                                <Text
                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                    style={{
                                        backgroundColor: '#10b981' + '20',
                                        color: '#10b981'
                                    }}
                                >
                                    +12%
                                </Text>
                            </View>
                            <Text
                                className="text-2xl font-black"
                                style={{ color: colors.foreground }}
                            >
                                {formatCurrency(stats.totalRevenue)}
                            </Text>
                            <Text
                                className="text-sm font-medium"
                                style={{ color: colors.mutedForeground }}
                            >
                                Total em vendas
                            </Text>
                        </View>

                        {/* Vendas Hoje */}
                        <View
                            className="flex-1 rounded-3xl p-5"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                borderWidth: 1,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View
                                    className="w-10 h-10 rounded-2xl items-center justify-center"
                                    style={{ backgroundColor: '#3b82f6' + '20' }}
                                >
                                    <Ionicons name="calendar" size={20} color="#3b82f6" />
                                </View>
                                <Text
                                    className="text-xs font-semibold px-2 py-1 rounded-full"
                                    style={{
                                        backgroundColor: '#3b82f6' + '20',
                                        color: '#3b82f6'
                                    }}
                                >
                                    {selectedDateFilter}
                                </Text>
                            </View>
                            <Text
                                className="text-2xl font-black"
                                style={{ color: colors.foreground }}
                            >
                                {stats.totalOrders}
                            </Text>
                            <Text
                                className="text-sm font-medium"
                                style={{ color: colors.mutedForeground }}
                            >
                                Vendas realizadas
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Barra de Pesquisa */}
                <View className="px-4 mb-4">
                    <View
                        className="flex-row items-center rounded-2xl px-4 py-3"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderWidth: 1,
                        }}
                    >
                        <Ionicons name="search" size={20} color={colors.mutedForeground} />
                        <TextInput
                            className="flex-1 ml-3 text-base"
                            placeholder="Buscar por cliente ou produto..."
                            placeholderTextColor={colors.mutedForeground}
                            style={{ color: colors.foreground }}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Filtros */}
                <View className="px-4 mb-6">
                    <View className="flex-row justify-between">
                        {filters.map((filter) => {
                            const isSelected = selectedFilter === filter;
                            const filterCount = filter === 'Todos'
                                ? ordersByStatus.total
                                : filter === 'approved'
                                    ? ordersByStatus.approved
                                    : ordersByStatus.pending;

                            return (
                                <TouchableOpacity
                                    key={filter}
                                    className="flex-row items-center px-4 py-2 rounded-2xl"
                                    style={{
                                        backgroundColor: isSelected ? colors.primary : colors.card,
                                        borderColor: isSelected ? colors.primary : colors.border,
                                        borderWidth: 1,
                                    }}
                                    onPress={() => setSelectedFilter(filter)}
                                >
                                    <Text
                                        className="font-semibold"
                                        style={{
                                            color: isSelected ? colors.primaryForeground : colors.foreground,
                                        }}
                                    >
                                        {getStatusLabel(filter)}
                                    </Text>
                                    <View
                                        className="ml-2 px-2 py-1 rounded-full"
                                        style={{
                                            backgroundColor: isSelected ? colors.primaryForeground + '20' : colors.muted,
                                        }}
                                    >
                                        <Text
                                            className="text-xs font-bold"
                                            style={{
                                                color: isSelected ? colors.primaryForeground : colors.mutedForeground,
                                            }}
                                        >
                                            {filterCount}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Backdrop para fechar dropdown */}
            {showDatePicker && (
                <TouchableOpacity
                    className="absolute inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onPress={() => setShowDatePicker(false)}
                    activeOpacity={1}
                />
            )}

            {/* Dropdown de Filtro de Data */}
            {showDatePicker && (
                <View className="absolute top-[100px] left-4 right-4 z-20">
                    <View
                        className="rounded-3xl p-4"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderWidth: 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Text
                            className="text-lg font-bold mb-3"
                            style={{ color: colors.foreground }}
                        >
                            Filtrar por período
                        </Text>
                        {dateFilters.map((filter) => {
                            const isSelected = selectedDateFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    className="flex-row items-center justify-between py-3 px-2"
                                    onPress={() => {
                                        if (filter === 'Personalizado') {
                                            setShowCalendar(true);
                                            setShowDatePicker(false);
                                        } else {
                                            setSelectedDateFilter(filter);
                                            setShowDatePicker(false);
                                        }
                                    }}
                                    style={{
                                        backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
                                        borderRadius: 12,
                                    }}
                                >
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name={filter === 'Hoje' ? 'today' :
                                                filter === 'Esta semana' ? 'calendar' :
                                                    filter === 'Este mês' ? 'calendar-outline' :
                                                        filter === 'Personalizado' ? 'calendar-sharp' : 'time'}
                                            size={20}
                                            color={isSelected ? colors.primary : colors.mutedForeground}
                                        />
                                        <Text
                                            className="ml-3 text-base font-medium"
                                            style={{
                                                color: isSelected ? colors.primary : colors.foreground
                                            }}
                                        >
                                            {filter}
                                        </Text>
                                    </View>
                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Modal de Calendário para Seleção de Intervalo */}
            <Modal
                visible={showCalendar}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCalendar(false)}
            >
                <View
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <View
                        className="m-4 rounded-3xl p-6 max-w-md w-full"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            borderWidth: 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.15,
                            shadowRadius: 12,
                            elevation: 10,
                        }}
                    >
                        <Text
                            className="text-xl font-bold mb-4 text-center"
                            style={{ color: colors.foreground }}
                        >
                            Selecionar Período
                        </Text>

                        <Text
                            className="text-sm mb-4 text-center"
                            style={{ color: colors.mutedForeground }}
                        >
                            Toque para selecionar data inicial e final
                        </Text>

                        <Calendar
                            onDayPress={onDayPress}
                            markingType={'period'}
                            markedDates={markedDates}
                            theme={{
                                backgroundColor: colors.card,
                                calendarBackground: colors.card,
                                textSectionTitleColor: colors.foreground,
                                selectedDayBackgroundColor: '#3b82f6',
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: '#3b82f6',
                                dayTextColor: colors.foreground,
                                textDisabledColor: colors.mutedForeground,
                                dotColor: '#3b82f6',
                                selectedDotColor: '#ffffff',
                                arrowColor: colors.foreground,
                                monthTextColor: colors.foreground,
                                indicatorColor: '#3b82f6',
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '600',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14
                            }}
                        />

                        {(selectedStartDate || selectedEndDate) && (
                            <View className="mt-4 p-3 rounded-2xl" style={{ backgroundColor: colors.muted }}>
                                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                                    Selecionado:
                                </Text>
                                {selectedStartDate && (
                                    <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                        Início: {new Date(selectedStartDate).toLocaleDateString('pt-BR')}
                                    </Text>
                                )}
                                {selectedEndDate && (
                                    <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                        Fim: {new Date(selectedEndDate).toLocaleDateString('pt-BR')}
                                    </Text>
                                )}
                            </View>
                        )}

                        <View className="flex-row justify-between gap-3 mt-6">
                            <TouchableOpacity
                                className="flex-1 py-3 rounded-2xl"
                                style={{
                                    backgroundColor: colors.muted,
                                    borderColor: colors.border,
                                    borderWidth: 1,
                                }}
                                onPress={() => {
                                    setShowCalendar(false);
                                    setSelectedStartDate('');
                                    setSelectedEndDate('');
                                    setMarkedDates({});
                                }}
                            >
                                <Text
                                    className="text-center font-semibold"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 py-3 rounded-2xl"
                                style={{ backgroundColor: colors.primary }}
                                onPress={confirmDateRange}
                                disabled={!selectedStartDate}
                            >
                                <Text
                                    className="text-center font-bold"
                                    style={{ color: colors.primaryForeground }}
                                >
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
                    <View className="px-4 mb-4">
                        <TouchableOpacity
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
                                                {order.customerName}
                                            </Text>
                                            <Text
                                                className="text-sm mb-2"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                {order.paymentMethod}
                                            </Text>
                                            <View
                                                className="rounded-full px-3 py-1"
                                                style={{
                                                    backgroundColor: getStatusColor(order.status).bg,
                                                    alignSelf: 'flex-start'
                                                }}
                                            >
                                                <Text
                                                    className="text-xs font-medium"
                                                    style={{
                                                        color: getStatusColor(order.status).text
                                                    }}
                                                >
                                                    {getStatusLabel(order.status)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="items-end">
                                    <Text className={order.status === 'approved' ? "text-green-600 font-bold text-lg" : "text-yellow-600 font-bold text-lg"}>
                                        {
                                            order.status === 'approved' ? <Text>+{formatCurrency(order.total)}</Text> : <Text>{formatCurrency(order.total)}</Text>
                                        }
                                    </Text>
                                    <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                        {formatDate(order.createdAt)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}