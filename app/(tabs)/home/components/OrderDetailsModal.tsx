import { api } from '@/app/backend/api';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDeleteSale } from '../hooks/useDeleteSale';
import { useAuth } from '@/app/providers/AuthProvider';
import { Dialog } from '@/components/ui/Dialog';
import { useRouter } from 'expo-router';
import { set } from 'zod';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    imgUrl: string;
    price: number;
}

interface Order {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    paymentMethod: string;
    customerName: string;
    customerPhone: string;
    createdAt: string;
    items: OrderItem[];
}

interface OrderDetailsModalProps {
    visible: boolean;
    order: Order | null;
    onClose: () => void;
    getStatusLabel: (status: string) => string;
    getStatusColor: (status: string) => { bg: string; text: string };
}

export function OrderDetailsModal({
    visible,
    order,
    onClose,
    getStatusLabel,
    getStatusColor
}: OrderDetailsModalProps) {
    const colors = useThemeColors();
    const [showDialog, setShowDialog] = useState(false);

    const handleWhatsApp = () => {
        if (!order) return;

        const phone = order.customerPhone.replace(/\D/g, '');
        let message = `Olá ${order.customerName}! 👋\n\n`;
        message += `Aqui está o resumo do seu pedido #${order.orderNumber}:\n\n`;

        order.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Qtd: ${item.quantity}x - ${formatCurrency(item.price * item.quantity)}\n`;
        });

        message += `\n💰 *Total: ${formatCurrency(order.total)}*\n`;
        message += `💳 Pagamento: ${order.paymentMethod}\n`;
        message += `📅 Data: ${formatDate(order.createdAt)}\n\n`;
        message += `Status: ${getStatusLabel(order.status)}\n\n`;
        message += `Obrigado pela preferência! 🎉`;

        const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        Linking.openURL(url);
    };

    const handleConfirmSale = async () => {
        if (!order) return;

        Alert.alert(
            'Confirmar Venda',
            'Deseja confirmar esta venda?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            await api.patch(`/orders/${order.id}/status`, { status: 'approved' });
                            onClose();
                            Alert.alert('Sucesso', 'Venda confirmada!');
                        } catch {
                            Alert.alert('Erro', 'Erro ao confirmar venda');
                        }
                    }
                }
            ]
        );
    };

    const queryClient = useQueryClient();
    const { user } = useAuth()
    const router = useRouter()

    const handleDeleteSale = () => {
        if (!order) return;

        Alert.alert(
            'Deletar Venda',
            'Tem certeza que deseja deletar esta venda? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: async () => {
                        deleteSale(order.id, {
                            onSuccess: () => {
                                queryClient.invalidateQueries({ queryKey: ["orders"] });
                                queryClient.invalidateQueries({ queryKey: ["sales-pagination"] });
                                queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
                                queryClient.invalidateQueries({ queryKey: ["recent-sales"] });
                                onClose();
                                Alert.alert('Sucesso', 'Venda deletada!');
                            },
                            onError: () => {
                                Alert.alert('Erro', 'Erro ao deletar venda');
                            }
                        });
                    }
                }
            ]
        );
    };

    const { mutate: deleteSale, isPending } = useDeleteSale()

    return (
        <>
            <Modal
                visible={visible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                {isPending ?
                    <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View
                            className="rounded-3xl p-6"

                        >
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    </View>
                    :

                    <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <View
                            className="flex-1 mt-20 rounded-t-3xl"
                            style={{ backgroundColor: colors.background }}
                        >
                            {/* Header do Modal */}
                            <View className="items-center pt-2 pb-6" style={{ backgroundColor: colors.primary }}>
                                <View className="flex-row items-center justify-between w-full px-4 mb-2 mt-4">
                                    <View>
                                        <Text className='uppercase' style={{ color: colors.primaryForeground + '90', fontSize: 12, fontWeight: '700' }} maxFontSizeMultiplier={1}>
                                            Informações da Venda
                                        </Text>
                                        <Text
                                            className="text-xl font-black mb-1"
                                            style={{ color: colors.primaryForeground }}
                                            maxFontSizeMultiplier={1}
                                        >
                                            #{order?.orderNumber}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={onClose}
                                        className="w-10 h-10 rounded-full items-center justify-center"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    >
                                        <Ionicons name="close" size={24} color={colors.primaryForeground} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <ScrollView className="flex-1 px-6">
                                {/* Informações do Cliente */}


                                <View>
                                    <View className="my-6">
                                        <View className='flex flex-row justify-between items-center mb-4'>
                                            <View
                                                className="rounded-full px-4 py-1.5 mt-2"
                                                style={{
                                                    backgroundColor: getStatusColor(order?.status || '').bg,
                                                }}
                                            >
                                                <Text
                                                    className="text-sm font-bold"
                                                    style={{
                                                        color: getStatusColor(order?.status || '').text
                                                    }}
                                                    maxFontSizeMultiplier={1}
                                                >
                                                    {getStatusLabel(order?.status || '')}
                                                </Text>
                                            </View>
                                            {/* Deletar */}
                                            <TouchableOpacity
                                                onPress={handleDeleteSale}
                                            >
                                                <Ionicons name="trash" size={25} color="#f20c0f" />
                                            </TouchableOpacity>
                                        </View>
                                        <View className="flex-row justify-between">
                                            <View className="flex-1">
                                                <View className="flex-row items-center py-2">
                                                    <Ionicons name="person-outline" size={20} color={colors.mutedForeground} />
                                                    <View className="ml-3 flex-1">
                                                        <Text className="text-xs" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                                            Cliente
                                                        </Text>
                                                        <Text className="text-base font-semibold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                            {order?.customerName}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View className="flex-row items-center py-2">
                                                    <Ionicons name="call-outline" size={20} color={colors.mutedForeground} />
                                                    <View className="ml-3 flex-1">
                                                        <Text className="text-xs" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                                            Telefone
                                                        </Text>
                                                        <Text className="text-base font-semibold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                            {order?.customerPhone ? order.customerPhone : 'Não informado'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="flex-1">
                                                <View className="flex-row items-center py-2">
                                                    <Ionicons name="card-outline" size={20} color={colors.mutedForeground} />
                                                    <View className="ml-3 flex-1">
                                                        <Text className="text-xs" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                                            Método de Pagamento
                                                        </Text>
                                                        <Text className="text-base font-semibold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                            {order?.paymentMethod}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <View className="flex-row items-center py-2">
                                                    <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
                                                    <View className="ml-3 flex-1">
                                                        <Text className="text-xs" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                                            Data da Venda
                                                        </Text>
                                                        <Text className="text-base font-semibold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                            {order?.createdAt ? formatDate(order.createdAt) : ''}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                    </View>
                                </View>

                                {/* Produtos */}
                                <View className="mb-6">
                                    <Text className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                        Produtos ({order?.items.length})
                                    </Text>

                                    {order?.items.map((item, index) => (
                                        <View key={item.id}>
                                            <View className="flex-row items-center py-3">
                                                <Image
                                                    source={{ uri: item.imgUrl }}
                                                    className="w-14 h-14 rounded-xl mr-3"
                                                    style={{ backgroundColor: colors.muted }}
                                                />
                                                <View className="flex-1">
                                                    <Text className="text-base font-semibold mb-1" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                        {item.name}
                                                    </Text>
                                                    <Text className="text-sm" style={{ color: colors.mutedForeground }} maxFontSizeMultiplier={1}>
                                                        {item.quantity}x {formatCurrency(item.price)}
                                                    </Text>
                                                </View>
                                                <Text className="text-lg font-bold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                                    {formatCurrency(item.price * item.quantity)}
                                                </Text>
                                            </View>
                                            {index < (order?.items.length || 0) - 1 && (
                                                <View style={{ height: 1, backgroundColor: colors.border }} />
                                            )}
                                        </View>
                                    ))}

                                    <View style={{ height: 1, backgroundColor: colors.border, marginTop: 16, marginBottom: 16 }} />

                                    <View className="flex-row items-center justify-between py-2">
                                        <Text className="text-lg font-bold" style={{ color: colors.foreground }} maxFontSizeMultiplier={1}>
                                            Total
                                        </Text>
                                        <Text className="text-3xl font-black" style={{ color: order?.status === 'approved' ? '#10b981' : '#f59e0b' }} maxFontSizeMultiplier={1}>
                                            {formatCurrency(order?.total || 0)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Ações */}
                                <View className="flex-row justify-center gap-4 mb-8">

                                    {/* Confirmar Venda (se pending) */}
                                    {order?.status === 'pending' && (
                                        <>
                                            <TouchableOpacity
                                                onPress={handleConfirmSale}
                                                activeOpacity={0.85}
                                                className="flex-row items-center justify-center rounded-2xl py-4 flex-1 gap-2"
                                                style={{
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 3 },
                                                    shadowOpacity: 0.15,
                                                    shadowRadius: 6,
                                                    elevation: 4,
                                                    backgroundColor: colors.primary,
                                                }}
                                            >

                                                <Text className="text-white font-bold " maxFontSizeMultiplier={1}>
                                                    Confirmar venda
                                                </Text>
                                                <Ionicons name="checkmark-circle" size={26} color="#fff" />
                                            </TouchableOpacity>

                                            {/* WhatsApp */}
                                            <TouchableOpacity
                                                className="w-16 h-16 rounded-2xl items-center justify-center"
                                                style={{
                                                    backgroundColor: '#25D366',
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.1,
                                                    shadowRadius: 4,
                                                    elevation: 3,
                                                }}
                                                onPress={
                                                    user?.plan !== "Free" ? handleWhatsApp : () => setShowDialog(true)
                                                }
                                            >
                                                <Ionicons name="logo-whatsapp" size={28} color="#fff" />
                                            </TouchableOpacity>

                                            <Dialog
                                                visible={showDialog}
                                                title="Funcionalidade indisponível"
                                                description="Essa funcionalidade só está disponível apartir do plano Starter."
                                                onCancel={() => setShowDialog(false)}
                                                onConfirm={async () => {
                                                    setShowDialog(false);
                                                    setTimeout(() => {
                                                        router.push('/more/components/plans-screen');
                                                        setTimeout(onClose, 200); // fecha o modal principal depois de navegar
                                                    }, 300);
                                                }}
                                                cancelText='Voltar'
                                                confirmText='Fazer upgrade'
                                            />
                                        </>



                                    )}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                }
            </Modal>
        </>
    );
}
