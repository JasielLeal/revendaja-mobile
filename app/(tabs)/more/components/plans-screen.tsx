import { Dialog } from '@/components/ui/Dialog';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Plan {
    id: string;
    name: string;
    price: string;
    priceValue: number;
    description: string;
    popular?: boolean;
    features: string[];
}

const plans: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: 'R$ 24,99/mês',
        priceValue: 24.99,
        description: 'Perfeito para pequenos negócios que estão começando.',
        popular: true,
        features: [
            'Até 200 pedidos por mês',
            '200 produtos cadastrados',
            'Loja online ativa',
            'Integração WhatsApp',
        ],
    },
    {
        id: 'exclusive',
        name: 'Exclusive',
        price: 'R$ 49,99/mês',
        priceValue: 49.99,
        description: 'Ideal para negócios em crescimento.',
        features: [
            'Pedidos ilimitados',
            'Produtos ilimitados',
            'Loja online ativa',
            'Integração WhatsApp',
            'Exportar relatórios',
            'Suporte prioritário',
        ],
    },
];

export default function PlansScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
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

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
    };

    const handleSubscribe = () => {
        if (!selectedPlan) {
            showInfoDialog('Atenção', 'Selecione um plano para continuar');
            return;
        }

        const plan = plans.find(p => p.id === selectedPlan);

        if (plan?.id === 'free') {
            showInfoDialog('Plano Gratuito', 'Você já pode usar o plano gratuito!');
            return;
        }

        showConfirmDialog(
            'Assinar Plano',
            `Você será redirecionado para assinar o plano ${plan?.name}.`,
            () => {
                // TODO: Replace with actual subscription URL
                Linking.openURL(`https://revendaja.com/checkout?plan=${selectedPlan}`);
            }
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="px-5 pt-4 pb-6">
                        <TouchableOpacity
                            onPress={() => router.replace('/more/more')}
                            className="flex-row items-center mb-6"
                        >
                            <Ionicons
                                name="chevron-back"
                                size={28}
                                color={colors.foreground}
                            />
                        </TouchableOpacity>

                        <View>
                            <Text
                                className="text-3xl font-black"
                                style={{ color: colors.foreground }}
                            >
                                Nossos Planos
                            </Text>
                            <Text
                                className="text-base mt-2"
                                style={{ color: colors.mutedForeground }}
                            >
                                Escolha o plano ideal para o seu negócio
                            </Text>
                        </View>
                    </View>

                    {/* Cards de Planos */}
                    <View className="px-5">
                        {plans.map((plan) => {
                            const isSelected = selectedPlan === plan.id;

                            return (
                                <TouchableOpacity
                                    key={plan.id}
                                    onPress={() => handleSelectPlan(plan.id)}
                                    className="mb-3 rounded-2xl p-5"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderWidth: isSelected ? 2 : 1.5,
                                        borderColor: isSelected ? colors.primary : colors.border,
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center">
                                        {/* Radio Button */}
                                        <View
                                            className="w-5 h-5 rounded-full border-2 items-center justify-center mr-4"
                                            style={{
                                                borderColor: isSelected ? colors.primary : colors.border,
                                            }}
                                        >
                                            {isSelected && (
                                                <View
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: colors.primary }}
                                                />
                                            )}
                                        </View>

                                        {/* Conteúdo */}
                                        <View className="flex-1">
                                            <View className="flex-row items-center">
                                                <Text
                                                    className="text-sm font-bold mb-1"
                                                    style={{ color: colors.foreground }}
                                                >
                                                    {plan.name}
                                                </Text>
                                                {plan.popular && (
                                                    <View
                                                        className="ml-2 px-2 py-0.5 rounded-md"
                                                        style={{ backgroundColor: colors.primary }}
                                                    >
                                                        <Text
                                                            className="text-[10px] font-bold"
                                                            style={{ color: colors.primaryForeground }}
                                                        >
                                                            POPULAR
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text
                                                className="text-xs"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                {plan.description}
                                            </Text>
                                        </View>

                                        {/* Preço */}
                                        <View className="ml-4">
                                            <Text
                                                className="text-lg font-bold text-right"
                                                style={{ color: colors.foreground }}
                                            >
                                                {plan.price}
                                            </Text>
                                        </View>
                                    </View>

                                    {isSelected && (
                                        <View className="mt-4 gap-2">
                                            {plan.features.map((feature, idx) => (
                                                <View key={idx} className="flex-row items-center gap-2">
                                                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                                                    <Text className="text-xs" style={{ color: colors.foreground }}>
                                                        {feature}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Botões de Ação */}
                    <View className="px-5 mt-6 flex-row gap-3">
                        <TouchableOpacity
                            className="flex-1 py-4 rounded-xl items-center justify-center"
                            style={{
                                backgroundColor: colors.muted,
                                borderWidth: 1,
                                borderColor: colors.border,
                            }}
                            onPress={() => router.back()}
                        >
                            <Text
                                className="font-semibold text-base"
                                style={{ color: colors.foreground }}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 py-4 rounded-xl flex-row items-center justify-center gap-2"
                            style={{
                                backgroundColor: selectedPlan ? colors.primary : colors.muted,
                            }}
                            onPress={handleSubscribe}
                            disabled={!selectedPlan}
                        >
                            <Text
                                className="font-semibold text-base"
                                style={{
                                    color: selectedPlan ? colors.primaryForeground : colors.mutedForeground,
                                }}
                            >
                                Escolher plano
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={18}
                                color={selectedPlan ? colors.primaryForeground : colors.mutedForeground}
                            />
                        </TouchableOpacity>
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
