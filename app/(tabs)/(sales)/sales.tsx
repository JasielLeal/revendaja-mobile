import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface SalesPageProps {
    navigation?: any;
}

// Dados mockados de vendas (fora do componente para evitar re-criação)
const salesData = [
    {
        id: 1,
        customerName: "Maria Silva",
        amount: 250.50,
        date: "13/nov",
        time: "14:30",
        status: "Concluída",
        paymentMethod: "Pix",
        products: ["Perfume Chanel", "Hidratante"]
    },
    {
        id: 2,
        customerName: "João Santos",
        amount: 180.00,
        date: "13/nov",
        time: "12:15",
        status: "Pendente",
        paymentMethod: "Cartão",
        products: ["Perfume Masculino"]
    },
    {
        id: 3,
        customerName: "Ana Costa",
        amount: 320.75,
        date: "12/nov",
        time: "16:45",
        status: "Concluída",
        paymentMethod: "Dinheiro",
        products: ["Kit Presente", "Perfume Importado"]
    },
    {
        id: 4,
        customerName: "Pedro Lima",
        amount: 95.00,
        date: "12/nov",
        time: "10:20",
        status: "Cancelada",
        paymentMethod: "Pix",
        products: ["Perfume Nacional"]
    },
];

export default function SalesPage({ navigation }: SalesPageProps) {
    const colors = useThemeColors();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Todos');
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState('Todos');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});

    const onRefresh = async () => {
        setRefreshing(true);
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRefreshing(false);
    };

    // Função para lidar com seleção de datas no calendário
    const onDayPress = (day: any) => {
        const dateString = day.dateString;

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Primeira seleção ou nova seleção
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

    const filters = ['Todos', 'Concluída', 'Pendente', 'Cancelada'];

    const dateFilters = ['Todos', 'Hoje', 'Esta semana', 'Este mês', 'Personalizado'];

    const filteredSales = useMemo(() => {
        return salesData.filter(sale => {
            const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sale.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesFilter = selectedFilter === 'Todos' || sale.status === selectedFilter;

            // Filtro de data aprimorado para intervalos
            let matchesDate = true;
            if (selectedDateFilter !== 'Todos') {
                const saleDate = sale.date;

                switch (selectedDateFilter) {
                    case 'Hoje':
                        matchesDate = saleDate === '13/nov';
                        break;
                    case 'Esta semana':
                        matchesDate = saleDate === '13/nov' || saleDate === '12/nov';
                        break;
                    case 'Este mês':
                        matchesDate = saleDate.includes('nov');
                        break;
                    default:
                        // Para intervalos de datas personalizadas
                        if (selectedDateFilter.includes(' - ')) {
                            // Formato: "dd/mmm - dd/mmm"
                            const [startStr, endStr] = selectedDateFilter.split(' - ');

                            // Função para converter "13/nov" para Date
                            const parseDate = (dateStr: string) => {
                                const [day, month] = dateStr.split('/');
                                const monthMap: { [key: string]: number } = {
                                    'jan': 0, 'fev': 1, 'mar': 2, 'abr': 3,
                                    'mai': 4, 'jun': 5, 'jul': 6, 'ago': 7,
                                    'set': 8, 'out': 9, 'nov': 10, 'dez': 11
                                };
                                return new Date(2024, monthMap[month], parseInt(day));
                            };

                            const startDate = parseDate(startStr);
                            const endDate = parseDate(endStr);
                            const saleDateObj = parseDate(saleDate);

                            matchesDate = saleDateObj >= startDate && saleDateObj <= endDate;
                        } else if (!selectedDateFilter.startsWith('Data:')) {
                            // Para data única personalizada
                            matchesDate = saleDate.includes(selectedDateFilter);
                        } else {
                            // Formato antigo "Data: dd/mmm"
                            const customDate = selectedDateFilter.replace('Data: ', '');
                            matchesDate = saleDate.includes(customDate);
                        }
                }
            }
            return matchesSearch && matchesFilter && matchesDate;
        });
    }, [searchQuery, selectedFilter, selectedDateFilter]);

    const totalSales = salesData.filter(s => s.status === 'Concluída').reduce((sum, s) => sum + s.amount, 0);
    const todaySales = salesData.filter(s => s.date === '13/nov' && s.status === 'Concluída').length;

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

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        progressBackgroundColor={colors.background}
                    />
                }
            >
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
                                R$ {totalSales.toFixed(2).replace('.', ',')}
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
                                    Hoje
                                </Text>
                            </View>
                            <Text
                                className="text-2xl font-black"
                                style={{ color: colors.foreground }}
                            >
                                {todaySales}
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                            {filters.map((filter) => {
                                const isSelected = selectedFilter === filter;
                                const filterCount = filter === 'Todos' ? salesData.length : salesData.filter(s => s.status === filter).length;

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
                                            {filter}
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
                    </ScrollView>
                </View>

                {/* Feedback para lista vazia */}
                {filteredSales.length === 0 && (
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
                )}

                {/* Lista de Vendas */}
                <View className="px-4 mb-6">
                    {filteredSales.map((sale) => (
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

            </ScrollView>
        </View>
    );
}