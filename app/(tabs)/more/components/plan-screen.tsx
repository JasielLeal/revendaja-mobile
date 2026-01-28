import { Dialog } from '@/components/ui/Dialog';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePlanUsage } from '../hooks/usePlanUsage';

export default function PlanScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data: planData, isLoading, error, refetch } = usePlanUsage();
    const [dialog, setDialog] = useState({
        visible: false,
        title: '',
        description: '',
        confirmText: 'OK',
        cancelText: 'Cancelar',
        showCancel: false,
        onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
        onCancel: undefined as undefined | (() => void),
    });

    const showInfoDialog = (title: string, description: string) => {
        setDialog({
            visible: true,
            title,
            description,
            confirmText: 'OK',
            cancelText: 'Cancelar',
            showCancel: false,
            onConfirm: () => setDialog((prev) => ({ ...prev, visible: false })),
            onCancel: undefined,
        });
    };

    const showConfirmDialog = (title: string, description: string, onConfirm: () => void) => {
        setDialog({
            visible: true,
            title,
            description,
            confirmText: 'Continuar',
            cancelText: 'Cancelar',
            showCancel: true,
            onCancel: () => setDialog((prev) => ({ ...prev, visible: false })),
            onConfirm: () => {
                setDialog((prev) => ({ ...prev, visible: false }));
                onConfirm();
            },
        });
    };

    const handleUpgrade = () => {
        showConfirmDialog(
            'Fazer Upgrade',
            'Você será redirecionado para escolher seu plano Premium.',
            () => {
                // TODO: Replace with actual upgrade URL
                Linking.openURL('https://revendaja.com/upgrade');
            }
        );
    };

    const handleDowngrade = () => {
        setDialog({
            visible: true,
            title: 'Downgrade',
            description: 'Deseja fazer downgrade para o plano gratuito?',
            confirmText: 'Downgrade',
            cancelText: 'Cancelar',
            showCancel: true,
            onCancel: () => setDialog((prev) => ({ ...prev, visible: false })),
            onConfirm: () => {
                setDialog((prev) => ({ ...prev, visible: false }));
                showInfoDialog('Confirmação', 'Em desenvolvimento');
            },
        });
    };

    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === 0) return 0;
        return Math.min((used / limit) * 100, 100);
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return '#EF4444';
        if (percentage >= 70) return '#F59E0B';
        return colors.primary;
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !planData) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Ionicons name="alert-circle-outline" size={48} color={colors.mutedForeground} />
                <Text style={{ color: colors.foreground, fontSize: 16, marginTop: 16, textAlign: 'center' }}>
                    Erro ao carregar informações do plano
                </Text>
                <TouchableOpacity
                    onPress={() => refetch()}
                    className="mt-4 px-6 py-3 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                >
                    <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const ordersPercentage = getUsagePercentage(planData.usage.monthlyOrders, planData.limits.monthlyOrders);
    const productsPercentage = getUsagePercentage(planData.usage.totalProducts, planData.limits.maxProducts);

    return (
        <View style={{ flex: 1 }}>
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    {/* Header com botão de voltar e título */}
                    <View className="px-5 pt-4 pb-6 flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={28}
                                color={colors.foreground}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Plano atual */}
                    <View className="px-5 mb-6">
                        <Text
                            className="text-sm font-semibold mb-3"
                            style={{ color: colors.mutedForeground }}
                        >
                            Plano Atual
                        </Text>

                        <View
                            className="rounded-2xl p-6 overflow-hidden"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30',
                                borderWidth: 2,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-1">
                                    <Text
                                        className="text-3xl font-black"
                                        style={{ color: colors.foreground }}
                                    >
                                        {planData.plan}
                                    </Text>
                                    <Text
                                        className="text-sm mt-2"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        {`Plano ${planData.plan} ativo`}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={'sparkles-outline'}
                                    size={48}
                                    color={colors.mutedForeground}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Uso e Limites */}
                    <View className="px-5 mb-6">
                        <Text
                            className="text-sm font-semibold mb-3"
                            style={{ color: colors.mutedForeground }}
                        >
                            Uso do Plano
                        </Text>

                        {/* Pedidos do Mês */}
                        <View
                            className="rounded-xl p-4 mb-3"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="cart-outline" size={20} color={colors.foreground} />
                                    <Text className="font-semibold" style={{ color: colors.foreground }}>
                                        Pedidos do Mês
                                    </Text>
                                </View>
                                <Text className="font-bold" style={{ color: getUsageColor(ordersPercentage) }}>
                                    {planData.usage.monthlyOrders}/{planData.limits.monthlyOrders}
                                </Text>
                            </View>
                            <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        backgroundColor: getUsageColor(ordersPercentage),
                                        width: `${ordersPercentage}%`,
                                    }}
                                />
                            </View>
                            <Text className="text-xs mt-2" style={{ color: colors.mutedForeground }}>
                                {planData.remaining.monthlyOrders > 0
                                    ? `${planData.remaining.monthlyOrders} pedidos restantes`
                                    : 'Limite atingido'}
                            </Text>
                        </View>

                        {/* Produtos Cadastrados */}
                        <View
                            className="rounded-xl p-4"
                            style={{ backgroundColor: colors.card }}
                        >
                            <View className="flex-row items-center justify-between mb-2">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="cube-outline" size={20} color={colors.foreground} />
                                    <Text className="font-semibold" style={{ color: colors.foreground }}>
                                        Produtos Cadastrados
                                    </Text>
                                </View>
                                <Text className="font-bold" style={{ color: getUsageColor(productsPercentage) }}>
                                    {planData.usage.totalProducts}/{planData.limits.maxProducts}
                                </Text>
                            </View>
                            <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                                <View
                                    className="h-full rounded-full"
                                    style={{
                                        backgroundColor: getUsageColor(productsPercentage),
                                        width: `${productsPercentage}%`,
                                    }}
                                />
                            </View>
                            <Text className="text-xs mt-2" style={{ color: colors.mutedForeground }}>
                                {planData.remaining.products > 0
                                    ? `${planData.remaining.products} produtos restantes`
                                    : 'Limite atingido'}
                            </Text>
                        </View>
                    </View>

                    {/* Recursos */}
                    <View className="px-5 mb-6">
                        <Text
                            className="text-sm font-semibold mb-3"
                            style={{ color: colors.mutedForeground }}
                        >
                            Recursos do Plano
                        </Text>

                        <View className="space-y-2">
                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={planData.limits.canUseOnlineStore ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={planData.limits.canUseOnlineStore ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: planData.limits.canUseOnlineStore ? colors.foreground : colors.mutedForeground }} className="font-medium flex-1">
                                    Loja Online
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={planData.limits.canUseWhatsappIntegration ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={planData.limits.canUseWhatsappIntegration ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: planData.limits.canUseWhatsappIntegration ? colors.foreground : colors.mutedForeground }} className="font-medium flex-1">
                                    Integração WhatsApp
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={planData.limits.canExportReports ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={planData.limits.canExportReports ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: planData.limits.canExportReports ? colors.foreground : colors.mutedForeground }} className="font-medium flex-1">
                                    Exportar Relatórios
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={planData.limits.prioritySupport ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={planData.limits.prioritySupport ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: planData.limits.prioritySupport ? colors.foreground : colors.mutedForeground }} className="font-medium flex-1">
                                    Suporte Prioritário
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Ações */}
                    <View className="px-5">
                        <>
                            {/* Alert de limite se estiver próximo */}
                            {(ordersPercentage >= 80 || productsPercentage >= 80) && (
                                <View
                                    className="rounded-xl p-4 mb-4 flex-row items-center gap-3"
                                    style={{ backgroundColor: '#F59E0B' + '20', borderColor: '#F59E0B', borderWidth: 1 }}
                                >
                                    <Ionicons name="warning" size={24} color="#F59E0B" />
                                    <View className="flex-1">
                                        <Text className="font-semibold" style={{ color: colors.foreground }}>
                                            Você está chegando no limite!
                                        </Text>
                                        <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                            Faça upgrade para continuar crescendo seu negócio.
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {planData.plan === "Exclusive" ? (
                                <Text
                                    className="text-xs text-center mt-3"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    Você está no plano Exclusive, nosso melhor plano.
                                </Text>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        className="p-4 rounded-xl flex-row items-center justify-center gap-2"
                                        style={{ backgroundColor: colors.primary }}
                                        onPress={handleUpgrade}
                                    >
                                        <Ionicons name="rocket" size={20} color={colors.primaryForeground} />
                                        <Text
                                            className="font-semibold text-base"
                                            style={{ color: colors.primaryForeground }}
                                        >
                                            {planData.plan === "Free"
                                                ? "Fazer upgrade para Starter"
                                                : "Fazer upgrade para Exclusive"}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text
                                        className="text-xs text-center mt-3"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        {planData.plan === "Free"
                                            ? "Comece com recursos essenciais para vender mais"
                                            : "Desbloqueie todos os recursos e limites ilimitados"}
                                    </Text>
                                </>
                            )}

                        </>

                    </View>
                </ScrollView>
                <Dialog
                    visible={dialog.visible}
                    title={dialog.title}
                    description={dialog.description}
                    confirmText={dialog.confirmText}
                    cancelText={dialog.cancelText}
                    onConfirm={dialog.onConfirm}
                    onCancel={dialog.onCancel}
                    showCancel={dialog.showCancel}
                />
            </SafeAreaView>
        </View>
    );
}
