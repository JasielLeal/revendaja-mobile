import { api } from '@/app/backend/api';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useCreateSale } from './hooks/useCreateSale';

// Configurar localização PT-BR
LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    dayNames: [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';
interface Product {
    id: string;
    name: string;
    price: number;
    barcode: string;
    img: any; // Accept both require() and string
    quantity?: number; // Quantidade adicionada
}

export default function NewSalePage() {
    const colors = useThemeColors();
    const [customerName, setCustomerName] = useState('');
    const [barcode, setBarcode] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCamera, setShowCamera] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const lastScannedRef = useRef<string>('');
    const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { mutate: createSale, isPending } = useCreateSale();

    // Buscar produto quando atingir 13 dígitos
    useEffect(() => {
        if (barcode.length === 13) {
            searchProductByBarcode(barcode.trim());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [barcode]);

    const getCurrentDate = () => {
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const month = months[selectedDate.getMonth()];
        const year = selectedDate.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const paymentMethods = [
        { id: 'cash', label: 'Dinheiro', icon: 'cash-outline' },
        { id: 'credit', label: 'Cartão de Crédito', icon: 'card-outline' },
        { id: 'debit', label: 'Cartão de Débito', icon: 'card-outline' },
        { id: 'pix', label: 'PIX', icon: 'phone-portrait-outline' },
    ];

    const searchProductByBarcode = async (barcodeValue: string) => {
        if (!barcodeValue) return;

        setIsLoadingProduct(true);
        try {
            const response = await api.get(`/store-product/barcode/${barcodeValue}`);
            const productData = response.data;

            // Verificar se o produto tem estoque disponível
            if (productData.quantity <= 0) {
                Alert.alert('Produto sem estoque', `${productData.name} não tem unidades disponíveis`);
                setBarcode('');
                setIsLoadingProduct(false);
                return;
            }

            const product: Product = {
                id: productData.id,
                name: productData.name,
                price: productData.price,
                barcode: barcodeValue,
                img: productData.imgUrl,
                quantity: 1
            };

            const existingProductIndex = products.findIndex(p => p.id === product.id);
            if (existingProductIndex >= 0) {
                // Produto já existe, aumentar quantidade
                const currentQty = products[existingProductIndex].quantity || 1;
                if (currentQty >= productData.quantity) {
                    Alert.alert('Estoque insuficiente', `Apenas ${productData.quantity} unidades disponíveis`);
                } else {
                    const updatedProducts = [...products];
                    updatedProducts[existingProductIndex].quantity = currentQty + 1;
                    setProducts(updatedProducts);
                    Alert.alert('Sucesso', `Adicionada mais 1 unidade de ${product.name}`);
                }
            } else {
                // Novo produto, adicionar com quantidade 1
                setProducts([...products, product]);
                Alert.alert('Sucesso', `${product.name} adicionado à venda`);
            }
            setBarcode('');
        } catch (error: any) {
            if (error.response?.status === 404) {
                Alert.alert('Produto não encontrado', 'Código de barras não cadastrado no sistema');
            } else {
                Alert.alert('Erro', 'Erro ao buscar produto. Tente novamente.');
            }
            console.error('Error fetching product:', error);
        } finally {
            setIsLoadingProduct(false);
        }
    };

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        // Prevenir múltiplos scans do mesmo código
        if (isScanning || lastScannedRef.current === data) {
            return;
        }

        // Marca como escaneando e armazena o código
        setIsScanning(true);
        lastScannedRef.current = data;
        setShowCamera(false);

        // Faz a requisição
        searchProductByBarcode(data);

        // Limpa o timeout anterior se existir
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }

        // Reseta após 2 segundos
        scanTimeoutRef.current = setTimeout(() => {
            setIsScanning(false);
            lastScannedRef.current = '';
        }, 2000);
    }; const openCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) {
                Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera para escanear códigos de barras');
                return;
            }
        }
        // Reset todos os estados e refs ao abrir
        setIsScanning(false);
        lastScannedRef.current = '';
        if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
        }
        setShowCamera(true);
    };

    const getTotalAmount = () => {
        return products.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
    };

    const getTotalItems = () => {
        return products.reduce((sum, product) => sum + (product.quantity || 1), 0);
    };

    const queryClient = useQueryClient();

    const handleFinalizeSale = () => {
        if (!customerName.trim()) {
            Alert.alert('Erro', 'Digite o nome do cliente');
            return;
        }

        if (products.length === 0) {
            Alert.alert('Erro', 'Adicione pelo menos um produto');
            return;
        }

        const saleData = {
            customerName,
            status: "approved",
            paymentMethod,
            createdAt: selectedDate.toISOString(),
            items: products.map(p => ({
                storeProductId: p.id,
                quantity: p.quantity || 1
            }))
        };

        createSale(saleData, {
            onSuccess: () => {
                // Invalida todas as queries relacionadas
                queryClient.invalidateQueries({ queryKey: ["orders"] });
                queryClient.invalidateQueries({ queryKey: ["sales-pagination"] });
                queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
                queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
                queryClient.invalidateQueries({ queryKey: ["store-products"] });
                resetForm();
                // Feedback de sucesso
                Alert.alert(
                    'Sucesso! 🎉',
                    `Venda finalizada com sucesso!\n\nCliente: ${customerName}\nTotal: R$ ${getTotalAmount().toFixed(2).replace('.', ',')}\nItens: ${getTotalItems()}`,
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
            },
            onError: (error: any) => {
                Alert.alert(
                    'Erro ao finalizar venda',
                    error?.response?.data?.message || 'Ocorreu um erro ao processar a venda. Tente novamente.'
                );
            }
        });
    };

    const resetForm = () => {
        setCustomerName('');
        setBarcode('');
        setProducts([]);
        setPaymentMethod('Dinheiro');
        setSelectedDate(new Date());
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Background principal */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background laranja que vai até metade da tela */}
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
            {(showPaymentDropdown || showCalendar) && (
                <TouchableOpacity
                    className="absolute inset-0 z-10"
                    style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                    onPress={() => {
                        setShowPaymentDropdown(false);
                        setShowCalendar(false);
                    }}
                    activeOpacity={1}
                />
            )}

            {/* Modal do Calendário Real */}
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
                            Selecionar Data da Venda
                        </Text>

                        <Calendar
                            onDayPress={(day) => {
                                const newDate = new Date(day.dateString + 'T12:00:00.000Z'); // Fix timezone issue
                                setSelectedDate(newDate);
                            }}
                            markedDates={{
                                [selectedDate.toISOString().split('T')[0]]: {
                                    selected: true,
                                    selectedColor: colors.primary,
                                    selectedTextColor: 'white'
                                }
                            }}
                            theme={{
                                backgroundColor: colors.card,
                                calendarBackground: colors.card,
                                textSectionTitleColor: colors.foreground,
                                selectedDayBackgroundColor: colors.primary,
                                selectedDayTextColor: 'white',
                                todayTextColor: colors.primary,
                                dayTextColor: colors.foreground,
                                textDisabledColor: colors.mutedForeground,
                                dotColor: colors.primary,
                                selectedDotColor: 'white',
                                arrowColor: colors.foreground,
                                monthTextColor: colors.foreground,
                                indicatorColor: colors.primary,
                                textDayFontWeight: '500',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: '600',
                                textDayFontSize: 16,
                                textMonthFontSize: 18,
                                textDayHeaderFontSize: 14
                            }}
                            monthFormat={'MMMM yyyy'}
                            firstDay={0}
                            enableSwipeMonths={true}
                            minDate={'2020-01-01'}
                            maxDate={'2030-12-31'}
                        />

                        {/* Data Selecionada */}
                        <View
                            className="mt-4 p-3 rounded-2xl"
                            style={{ backgroundColor: colors.primary + '10' }}
                        >
                            <Text
                                className="text-sm font-medium text-center"
                                style={{ color: colors.foreground }}
                            >
                                Data selecionada:
                            </Text>
                            <Text
                                className="text-lg font-bold text-center mt-1"
                                style={{ color: colors.primary }}
                            >
                                {new Date(selectedDate.getTime() + (selectedDate.getTimezoneOffset() * 60000)).toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Text>
                        </View>

                        <View className="flex-row justify-between gap-3 mt-6">
                            <TouchableOpacity
                                className="flex-1 py-3 rounded-2xl"
                                style={{
                                    backgroundColor: colors.muted,
                                    borderColor: colors.border,
                                    borderWidth: 1,
                                }}
                                onPress={() => setShowCalendar(false)}
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
                                onPress={() => setShowCalendar(false)}
                            >
                                <Text
                                    className="text-center font-bold"
                                    style={{ color: 'white' }}
                                >
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Header */}
            <View className="px-4 pt-12 pb-6">
                <View className="flex-row items-center justify-between mb-6 mt-5">
                    <View className="flex-1">
                        <Text
                            className="text-lg font-medium mb-1"
                            style={{ color: colors.primaryForeground + '80' }}
                        >
                            Nova venda
                        </Text>
                        <Text
                            className="text-3xl font-black tracking-tight"
                            style={{ color: colors.primaryForeground }}
                        >
                            Iniciar
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
                        onPress={() => setShowCalendar(true)}
                    >
                        <Ionicons name="calendar" size={20} color={colors.primaryForeground} />
                        <Text
                            className="ml-2 text-sm font-semibold"
                            style={{ color: colors.primaryForeground }}
                        >
                            {getCurrentDate()}
                        </Text>
                        <Ionicons
                            name={showCalendar ? "chevron-up" : "chevron-down"}
                            size={16}
                            color={colors.primaryForeground}
                            className="ml-1"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Formulário Fixo */}
            <View className="px-4 relative z-10" style={{ marginTop: -30 }}>
                <View className="mb-6">
                    {/* Nome do Cliente */}
                    <TextInput
                        className="border rounded-xl px-4 py-4 text-base mb-4"
                        style={{
                            borderColor: colors.border,
                            backgroundColor: colors.card,
                            color: colors.foreground,
                            fontSize: 16,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                        placeholder="Nome do Cliente"
                        placeholderTextColor={colors.mutedForeground}
                        value={customerName}
                        onChangeText={setCustomerName}
                    />

                    {/* Forma de Pagamento */}
                    <View className="mb-4 relative">
                        <TouchableOpacity
                            className="flex-row items-center justify-between border rounded-xl px-4 py-4"
                            style={{
                                borderColor: colors.border,
                                backgroundColor: colors.card,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                elevation: 2,
                            }}
                            onPress={() => setShowPaymentDropdown(!showPaymentDropdown)}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name={paymentMethods.find(p => p.label === paymentMethod)?.icon as any || "cash-outline"}
                                    size={20}
                                    color={colors.primary}
                                    style={{ marginRight: 12 }}
                                />
                                <Text
                                    className="text-base font-medium"
                                    style={{ color: colors.foreground }}
                                >
                                    {paymentMethod}
                                </Text>
                            </View>
                            <Ionicons
                                name={showPaymentDropdown ? "chevron-up" : "chevron-down"}
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>

                        {showPaymentDropdown && (
                            <View
                                className="absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-50"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 8,
                                    elevation: 8,
                                }}
                            >
                                {paymentMethods.map((method) => (
                                    <TouchableOpacity
                                        key={method.id}
                                        className="flex-row items-center px-4 py-4"
                                        style={{
                                            backgroundColor: method.label === paymentMethod ? colors.primary + '10' : 'transparent',
                                            borderBottomWidth: method.id !== paymentMethods[paymentMethods.length - 1].id ? 1 : 0,
                                            borderBottomColor: colors.border,
                                        }}
                                        onPress={() => {
                                            setPaymentMethod(method.label);
                                            setShowPaymentDropdown(false);
                                        }}
                                    >
                                        <Ionicons
                                            name={method.icon as any}
                                            size={20}
                                            color={method.label === paymentMethod ? colors.primary : colors.mutedForeground}
                                            style={{ marginRight: 12 }}
                                        />
                                        <Text
                                            className="text-base font-medium"
                                            style={{
                                                color: method.label === paymentMethod ? colors.primary : colors.foreground
                                            }}
                                        >
                                            {method.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Código de Barras */}
                    <View className="flex-row">
                        <View className="flex-1 relative">
                            <TextInput
                                className="flex-1 border rounded-xl px-4 py-4 text-base mr-3"
                                style={{
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    fontSize: 16
                                }}
                                placeholder="Código de barras do produto"
                                placeholderTextColor={colors.mutedForeground}
                                value={barcode}
                                onChangeText={setBarcode}
                                editable={!isLoadingProduct}
                            />
                            {isLoadingProduct && (
                                <View className="absolute right-6 top-0 bottom-0 justify-center">
                                    <ActivityIndicator size="small" color={colors.primary} />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            className="rounded-xl px-4 py-4 justify-center"
                            style={{
                                backgroundColor: colors.primary,
                                shadowColor: colors.primary,
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.3,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                            onPress={openCamera}
                            disabled={isLoadingProduct}
                        >
                            <Ionicons name="camera" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Lista de Produtos Scrollável */}
            <ScrollView className="flex-1 px-4">
                <View
                    className="rounded-xl mb-6 min-h-[200px]"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 8,
                        elevation: 3,
                    }}
                >
                    {products.length === 0 ? (
                        <View className="flex-1 items-center justify-center py-12">
                            <Ionicons
                                name="basket-outline"
                                size={48}
                                color={colors.mutedForeground}
                                style={{ marginBottom: 16 }}
                            />
                            <Text
                                className="text-base text-center"
                                style={{ color: colors.mutedForeground }}
                            >
                                Nenhum produto adicionado{'\n'}
                                Escaneie ou digite o código de barras
                            </Text>
                        </View>
                    ) : (
                        <View>
                            {products.map((product, index) => (
                                <View
                                    key={product.id}
                                    className="flex-row items-center justify-between py-3"
                                    style={{
                                        borderBottomWidth: index < products.length - 1 ? 1 : 0,
                                        borderBottomColor: colors.border
                                    }}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center flex-1">
                                            <Image
                                                source={product.img}
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: 8,
                                                    marginRight: 12
                                                }}
                                                contentFit="cover"
                                            />
                                            <View className="flex-1">
                                                <Text
                                                    className="font-medium mb-1"
                                                    style={{ color: colors.foreground }}
                                                >
                                                    {product.name}
                                                </Text>
                                                <Text
                                                    className="text-base font-bold mb-1"
                                                    style={{ color: colors.primary }}
                                                >
                                                    {formatCurrency(product.price)}
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <Text
                                                        className="text-sm font-medium mr-2"
                                                        style={{ color: colors.mutedForeground }}
                                                    >
                                                        Quantidade:
                                                    </Text>
                                                    <View
                                                        className="px-2 py-1 rounded-md"
                                                        style={{ backgroundColor: colors.primary + '20' }}
                                                    >
                                                        <Text
                                                            className="text-sm font-bold"
                                                            style={{ color: colors.primary }}
                                                        >
                                                            {product.quantity || 1}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            className="p-2 rounded-lg"
                                            style={{
                                                backgroundColor: colors.muted + '40'
                                            }}
                                            onPress={() => setProducts(products.filter(p => p.id !== product.id))}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Área Inferior Fixa - Valor Total + Botão */}
            <View className="p-4 relative z-10">
                {/* Valor Total */}
                {products.length > 0 && (
                    <View
                        className="flex-row justify-between items-center p-4 rounded-xl mb-3"
                        style={{
                            backgroundColor: '#ff6b35' + '15',
                            borderColor: '#ff6b35' + '40',
                            borderWidth: 1,
                        }}
                    >
                        <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                            Total da Venda
                        </Text>
                        <Text className="text-xl font-bold" style={{ color: '#ff6b35' }}>
                            R$ {formatCurrency(getTotalAmount())}
                        </Text>
                    </View>
                )}
                <TouchableOpacity
                    className="rounded-xl py-4"
                    style={{
                        backgroundColor: customerName && products.length > 0 ? '#ff6b35' : colors.muted,
                        shadowColor: '#ff6b35',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: customerName && products.length > 0 ? 0.3 : 0,
                        shadowRadius: 8,
                        elevation: customerName && products.length > 0 ? 6 : 2,
                    }}
                    onPress={handleFinalizeSale}
                    disabled={!customerName || products.length === 0}
                >
                    {
                        isPending ?

                            <ActivityIndicator size={25} color="white" className='' />
                            :
                            <>

                                <Text
                                    className="text-center text-lg font-bold"
                                    style={{
                                        color: customerName && products.length > 0 ? 'white' : colors.mutedForeground
                                    }}
                                >
                                    Finalizar Venda {products.length > 0 && `• ${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'itens'}`}
                                </Text>
                            </>

                    }
                </TouchableOpacity>
            </View>

            {/* Modal da Câmera */}
            <Modal
                visible={showCamera}
                transparent={false}
                animationType="slide"
                onRequestClose={() => setShowCamera(false)}
            >
                <View className="flex-1" style={{ backgroundColor: '#000' }}>
                    <CameraView
                        className="flex-1"
                        facing="back"
                        onBarcodeScanned={isScanning ? undefined : handleBarcodeScanned}
                        barcodeScannerSettings={{
                            barcodeTypes: [
                                'ean13',
                                'ean8',
                                'upc_a',
                                'upc_e',
                                'code128',
                                'code39',
                                'code93',
                                'codabar',
                                'itf14',
                                'pdf417',
                            ],
                        }}
                    >
                        {/* Overlay com guia de scanner */}
                        <View className="flex justify-center items-center h-screen">
                            {/* Header com botão de fechar */}
                            <View className="absolute top-0 left-0 right-0  flex-row justify-between items-center z-10 mt-20 px-4">
                               <Ionicons name="help-circle" size={24} color="white" />
                                <Text className="text-white text-lg font-bold">Escanear Código de Barras</Text>
                                <TouchableOpacity
                                    onPress={() => setShowCamera(false)}
                                    className="w-15 h-15 rounded-full items-center justify-center"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Guia de scanner */}
                            <View className="relative">
                                <View
                                    className="border-2 border-white rounded-2xl"
                                    style={{
                                        width: 280,
                                        height: 180,
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }}
                                />
                                <View className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-xl" />
                                <View className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-xl" />
                                <View className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-xl" />
                                <View className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-xl" />
                            </View>

                            {/* Instrução */}
                            <Text className="text-white text-center mt-8 px-8 text-base">
                                {isScanning ? 'Processando...' : 'Posicione o código de barras dentro da área'}
                            </Text>

                            {isScanning && (
                                <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
                            )}
                        </View>
                    </CameraView>
                </View>
            </Modal>
        </View>
    );
}