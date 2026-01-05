import { Dialog } from '@/components/ui/Dialog';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAddProductToStore } from '../hooks/useAddProductToStore';
import { CatalogProduct } from '../hooks/useInfiniteCatalogProducts';

interface AddProductSheetProps {
    visible: boolean;
    product: CatalogProduct | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddProductSheet = ({
    visible,
    product,
    onClose,
    onSuccess,
}: AddProductSheetProps) => {
    const colors = useThemeColors();
    const { mutate: addProduct, isPending } = useAddProductToStore();

    const [showDialog, setShowDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);

    const handleCancelDialog = () => {
        setShowDialog(false);
    };

    const [formData, setFormData] = useState({
        price: '',
        quantity: '1',
        validityDate: '',
        costPrice: '',
    });

    // Reset form when product changes
    useEffect(() => {
        if (product) {
            setFormData({
                price: product.price ? (product.price / 100).toFixed(2) : '',
                quantity: '1',
                validityDate: '',
                costPrice: '',
            });
        }
    }, [product]);

    const queryClient = useQueryClient();

    const handleAddProduct = () => {
        if (!product) return;

        // Validações
        if (!formData.price || parseFloat(formData.price) <= 0) {
            Alert.alert('Erro', 'Por favor, insira um preço válido');
            return;
        }

        if (!formData.quantity || parseInt(formData.quantity) < 0) {
            Alert.alert('Erro', 'Por favor, insira uma quantidade válida');
            return;
        }

        addProduct(
            {
                catalogId: product.id,
                price: parseFloat(formData.price) * 100,
                quantity: parseInt(formData.quantity),
                validityDate: formData.validityDate ? convertDateToISO(formData.validityDate) : '2099-12-31',
                costPrice: formData.costPrice ? parseFloat(formData.costPrice) * 100 : 0,
            },
            {
                onSuccess: () => {
                    Alert.alert('Sucesso', 'Produto adicionado à sua loja!');
                    queryClient.invalidateQueries({ queryKey: ["store-products"] });
                    onClose();
                    onSuccess?.();
                },
                onError: (error) => {

                    const err = error as AxiosError<{
                        error: string;
                        code?: string;
                    }>;

                    const code = err.response?.status;

                    if (code === 403) {
                        setShowDialog(true);
                        return;
                    }
                    Alert.alert(
                        'Erro',
                        'Não foi possível adicionar o produto. Tente novamente.'
                    );
                    console.error('Erro ao adicionar produto:', error);
                },
            }
        );
    };

    const incrementQuantity = () => {
        const current = parseInt(formData.quantity) || 0;
        setFormData({ ...formData, quantity: (current + 1).toString() });
    };

    const decrementQuantity = () => {
        const current = parseInt(formData.quantity) || 0;
        if (current > 0) {
            setFormData({ ...formData, quantity: (current - 1).toString() });
        }
    };

    const formatCurrency = (value: string) => {
        // Remove tudo exceto números
        const numbers = value.replace(/[^0-9]/g, '');
        if (!numbers) return '';

        // Converte para número e formata com 2 casas decimais
        const amount = parseInt(numbers) / 100;
        return amount.toFixed(2);
    };

    const formatDate = (value: string) => {
        // Remove tudo exceto números
        const numbers = value.replace(/[^0-9]/g, '');

        // Aplica a máscara DD/MM/AAAA
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 4) {
            return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
        } else {
            return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
        }
    };

    const convertDateToISO = (date: string) => {
        // Converte DD/MM/AAAA para AAAA-MM-DD
        const parts = date.split('/');
        if (parts.length === 3 && parts[2].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return '';
    };

    const router = useRouter();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Backdrop */}
                <Pressable
                    className="flex-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                    onPress={onClose}
                />

                {/* Sheet Content */}
                <View
                    className="rounded-t-3xl"
                    style={{
                        backgroundColor: colors.card,
                        maxHeight: '85%',
                    }}
                >
                    {/* Handle Bar */}
                    <View className="items-center pt-3 pb-2">
                        <View
                            className="w-10 h-1 rounded-full"
                            style={{ backgroundColor: colors.border }}
                        />
                    </View>

                    {/* Header */}
                    <View className="flex-row items-center justify-between px-5 pb-4">
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.muted }}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>
                        <Text
                            className="text-lg font-bold"
                            allowFontScaling={false}
                            style={{ color: colors.foreground }}
                        >
                            Adicionar à Loja
                        </Text>
                        <View className="w-10" />
                    </View>

                    <ScrollView
                        className="px-5"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}
                    >
                        {/* Product Card */}
                        {product && (
                            <View
                                className="rounded-2xl overflow-hidden mb-6 flex-row"
                                style={{
                                    backgroundColor: colors.background,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                {/* Product Image - Square */}
                                <View
                                    className="w-28 h-28 items-center justify-center overflow-hidden"
                                    style={{
                                        backgroundColor: colors.muted,
                                        borderBottomLeftRadius: 16,
                                    }}
                                >
                                    {product.image ? (
                                        <Image
                                            source={{ uri: product.image }}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Ionicons
                                            name="cube-outline"
                                            size={40}
                                            color={colors.mutedForeground}
                                        />
                                    )}
                                </View>

                                {/* Product Info */}
                                <View className="flex-1 p-3 justify-center">
                                    <View className="flex-row items-center gap-2 mb-1">
                                        <View
                                            className="px-2 py-0.5 rounded"
                                            style={{ backgroundColor: `${colors.primary}20` }}
                                        >
                                            <Text
                                                className="text-xs font-semibold"
                                                allowFontScaling={false}
                                                style={{ color: colors.primary }}
                                            >
                                                {product.brand}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text
                                        className="text-base font-bold"
                                        allowFontScaling={false}
                                        numberOfLines={2}
                                        style={{ color: colors.foreground }}
                                    >
                                        {product.name}
                                    </Text>
                                    {product.price > 0 && (
                                        <Text
                                            className="text-sm mt-1"
                                            style={{ color: colors.mutedForeground }}
                                            allowFontScaling={false}
                                        >
                                            Preço sugerido:{' '}
                                            <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                                R$ {(product.price / 100).toFixed(2)}
                                            </Text>
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {/* Form Section */}
                        <View className="gap-4">
                            {/* Preço de Venda - Highlighted */}
                            <View
                                className="rounded-2xl"
                            >
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons
                                            name="pricetag"
                                            size={18}
                                            color={colors.primary}
                                        />
                                        <Text
                                            className="text-sm font-bold"
                                            style={{ color: colors.primary }}
                                            allowFontScaling={false}
                                        >
                                            Preço de Venda
                                        </Text>
                                    </View>
                                    <Text
                                        className="text-xs"
                                        style={{ color: colors.mutedForeground }}
                                        allowFontScaling={false}
                                    >
                                        toque para alterar
                                    </Text>
                                </View>
                                <View
                                    className="flex-row items-center rounded-xl px-4"
                                    style={{
                                        backgroundColor: colors.card,
                                        height: 56,
                                        borderWidth: 1,
                                        borderColor: colors.primary,
                                    }}
                                >
                                    <Text
                                        className="text-xl font-bold mr-2"
                                        style={{ color: colors.primary }}
                                        allowFontScaling={false}
                                    >
                                        R$
                                    </Text>
                                    <TextInput
                                        className="flex-1 text-2xl font-bold"
                                        allowFontScaling={false}
                                        style={{ color: colors.foreground }}
                                        placeholder="0,00"
                                        placeholderTextColor={colors.mutedForeground}
                                        keyboardType="decimal-pad"
                                        value={formData.price}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, price: formatCurrency(text) })
                                        }
                                    />
                                </View>
                            </View>

                            {/* Quantidade - Com controles */}
                            <View
                                className="rounded-2xl p-4"
                                style={{
                                    backgroundColor: colors.background,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View className="flex-row items-center gap-2 mb-3">
                                    <Ionicons
                                        name="layers-outline"
                                        size={18}
                                        color={colors.foreground}
                                    />
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: colors.foreground }}
                                        allowFontScaling={false}
                                    >
                                        Quantidade em Estoque
                                    </Text>
                                </View>
                                <View className="flex-row items-center justify-between">
                                    <TouchableOpacity
                                        onPress={decrementQuantity}
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: colors.muted }}
                                    >
                                        <Ionicons
                                            name="remove"
                                            size={24}
                                            color={colors.foreground}
                                        />
                                    </TouchableOpacity>
                                    <TextInput
                                        className="text-3xl font-bold text-center w-24"
                                        allowFontScaling={false}
                                        style={{ color: colors.foreground }}
                                        keyboardType="number-pad"
                                        value={formData.quantity}
                                        onChangeText={(text) =>
                                            setFormData({ ...formData, quantity: text.replace(/[^0-9]/g, '') })
                                        }
                                    />
                                    <TouchableOpacity
                                        onPress={incrementQuantity}
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: colors.primary }}
                                    >
                                        <Ionicons
                                            name="add"
                                            size={24}
                                            color={colors.primaryForeground}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Campos Opcionais - Collapsible Style */}
                            <View
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: colors.background,
                                    borderWidth: 1,
                                    borderColor: colors.border,
                                }}
                            >
                                <View className="p-4 flex-row items-center gap-2">
                                    <Ionicons
                                        name="options-outline"
                                        size={18}
                                        color={colors.mutedForeground}
                                    />
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: colors.mutedForeground }}
                                        allowFontScaling={false}
                                    >
                                        Campos Opcionais
                                    </Text>
                                </View>

                                <View
                                    className="px-4 pb-4 gap-4"
                                    style={{ borderTopWidth: 1, borderTopColor: colors.border }}
                                >
                                    {/* Preço de Custo */}
                                    <View className="pt-4">
                                        <Text
                                            className="text-xs font-medium mb-2"
                                            style={{ color: colors.mutedForeground }}
                                            allowFontScaling={false}
                                        >
                                            Preço de Custo
                                        </Text>
                                        <View
                                            className="flex-row items-center rounded-xl px-4 bg-background"
                                            style={{                                               
                                                height: 48,
                                            }}
                                        >
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.mutedForeground }}
                                                allowFontScaling={false}
                                            >
                                                R$
                                            </Text>
                                            <TextInput
                                                className="flex-1 ml-2 text-base"
                                                allowFontScaling={false}
                                                style={{ color: colors.foreground }}
                                                placeholder="0,00"
                                                placeholderTextColor={colors.mutedForeground}
                                                keyboardType="decimal-pad"
                                                value={formData.costPrice}
                                                onChangeText={(text) =>
                                                    setFormData({ ...formData, costPrice: formatCurrency(text) })
                                                }
                                            />
                                        </View>
                                    </View>

                                    {/* Data de Validade */}
                                    <View>
                                        <Text
                                            className="text-xs font-medium mb-2"
                                            allowFontScaling={false}
                                            style={{ color: colors.mutedForeground }}
                                        >
                                            Data de Validade
                                        </Text>
                                        <View
                                            className="flex-row items-center rounded-xl px-4 bg-background"
                                            style={{                                               
                                                height: 48,
                                            }}
                                        >
                                            <Ionicons
                                                name="calendar-outline"
                                                size={18}
                                                color={colors.mutedForeground}
                                            />
                                            <TextInput
                                                className="flex-1 ml-3 text-base "
                                                allowFontScaling={false}
                                                style={{ color: colors.foreground }}
                                                placeholder="DD/MM/AAAA"
                                                placeholderTextColor={colors.mutedForeground}
                                                keyboardType="number-pad"
                                                maxLength={10}
                                                value={formData.validityDate}
                                                onChangeText={(text) =>
                                                    setFormData({ ...formData, validityDate: formatDate(text) })
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom Actions */}
                    <View
                        className="px-5 pb-8 pt-4 flex-row gap-3"
                        style={{
                            borderTopWidth: 1,
                            borderTopColor: colors.border,
                        }}
                    >
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 rounded-xl py-4 items-center justify-center"
                            style={{
                                backgroundColor: colors.muted,
                            }}
                        >
                            <Text
                                className="text-base font-semibold"
                                 allowFontScaling={false}
                                style={{ color: colors.foreground }}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleAddProduct}
                            disabled={isPending}
                            className="flex-[2] rounded-xl py-4 flex-row items-center justify-center gap-2"
                            style={{
                                backgroundColor: colors.primary,
                                opacity: isPending ? 0.6 : 1,
                            }}
                        >
                            {isPending ? (
                                <Ionicons
                                    name="hourglass"
                                    size={20}
                                    color={colors.primaryForeground}
                                />
                            ) : (
                                <Ionicons
                                    name="add-circle"
                                    size={20}
                                    color={colors.primaryForeground}
                                />
                            )}
                            <Text
                                className="text-base font-bold"
                                style={{ color: colors.primaryForeground }}
                                 allowFontScaling={false}
                            >
                                {isPending ? 'Adicionando...' : 'Adicionar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            <Dialog
                visible={showDialog}
                title="Limite atingido"
                description="Você chegou ao limite de produtos do seu plano atual. Para continuar adicionando novos produtos, é só fazer um upgrade quando quiser."
                onCancel={() => {
                    if (!dialogLoading) setShowDialog(false);
                }}
                onConfirm={() => {
                    setDialogLoading(true);
                    setTimeout(() => {
                        setDialogLoading(false);
                        setShowDialog(false);
                        router.push("/more/components/plans-screen");
                        setTimeout(() => {
                            onClose();
                        }, 200);
                    }, 500);
                }}
                cancelText='Voltar'
                confirmText='Fazer Upgrade'
                isLoading={dialogLoading}
            />
        </Modal>
    );
};
