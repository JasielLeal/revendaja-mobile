import { api } from '@/app/backend/api';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Image, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

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
    onRefresh: () => void;
    getStatusLabel: (status: string) => string;
    getStatusColor: (status: string) => { bg: string; text: string };
}

export function OrderDetailsModal({
    visible,
    order,
    onClose,
    onRefresh,
    getStatusLabel,
    getStatusColor
}: OrderDetailsModalProps) {
    const colors = useThemeColors();

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
                            onRefresh();
                            Alert.alert('Sucesso', 'Venda confirmada!');
                        } catch {
                            Alert.alert('Erro', 'Erro ao confirmar venda');
                        }
                    }
                }
            ]
        );
    };

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
                        try {
                            await api.delete(`/orders/${order.id}`);
                            onClose();
                            onRefresh();
                            Alert.alert('Sucesso', 'Venda deletada com sucesso');
                        } catch {
                            Alert.alert('Erro', 'Erro ao deletar venda');
                        }
                    }
                }
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View
                    className="flex-1 mt-20 rounded-t-3xl"
                    style={{ backgroundColor: colors.background }}
                >
                    {/* Header do Modal */}
                    <View className="items-center pt-2 pb-6" style={{ backgroundColor: colors.primary }}>
                        <View className="flex-row items-center justify-between w-full px-4 mb-2 mt-4">
                            <View>
                                <Text className='uppercase' style={{ color: colors.primaryForeground + '90', fontSize: 12, fontWeight: '700' }}>
                                    Informações da Venda
                                </Text>
                                <Text
                                    className="text-xl font-black mb-1"
                                    style={{ color: colors.primaryForeground }}
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
                                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                                    Cliente
                                                </Text>
                                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                                    {order?.customerName}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center py-2">
                                            <Ionicons name="call-outline" size={20} color={colors.mutedForeground} />
                                            <View className="ml-3 flex-1">
                                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                                    Telefone
                                                </Text>
                                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                                    {order?.customerPhone ? order.customerPhone : 'Não informado'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View className="flex-1">
                                        <View className="flex-row items-center py-2">
                                            <Ionicons name="card-outline" size={20} color={colors.mutedForeground} />
                                            <View className="ml-3 flex-1">
                                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                                    Método de Pagamento
                                                </Text>
                                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                                    {order?.paymentMethod}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center py-2">
                                            <Ionicons name="calendar-outline" size={20} color={colors.mutedForeground} />
                                            <View className="ml-3 flex-1">
                                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>
                                                    Data da Venda
                                                </Text>
                                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
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
                            <Text className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: colors.mutedForeground }}>
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
                                            <Text className="text-base font-semibold mb-1" style={{ color: colors.foreground }}>
                                                {item.name}
                                            </Text>
                                            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                                {item.quantity}x {formatCurrency(item.price)}
                                            </Text>
                                        </View>
                                        <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
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
                                <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                                    Total
                                </Text>
                                <Text className="text-3xl font-black" style={{ color: order?.status === 'approved' ? '#10b981' : '#f59e0b' }}>
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

                                        <Text className="text-white font-bold ">
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
                                        onPress={handleWhatsApp}
                                    >
                                        <Ionicons name="logo-whatsapp" size={28} color="#fff" />
                                    </TouchableOpacity>
                                </>

                            )}






                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
