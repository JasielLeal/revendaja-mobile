import { useAuth } from '@/app/providers/AuthProvider';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PlanScreen() {
    const colors = useThemeColors();
    const { user } = useAuth();
    const router = useRouter();

    const isPremium = user?.plan !== 'Premium';

    const handleUpgrade = () => {
        Alert.alert('Upgrade', 'Em desenvolvimento');
    };

    const handleDowngrade = () => {
        Alert.alert(
            'Downgrade',
            'Deseja fazer downgrade para o plano gratuito?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Downgrade',
                    style: 'destructive',
                    onPress: () => Alert.alert('Confirmação', 'Em desenvolvimento'),
                },
            ]
        );
    };

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
                                backgroundColor: isPremium ? colors.primary + '20' : colors.card,
                                borderColor: isPremium ? colors.primary : colors.border + '30',
                                borderWidth: 2,
                            }}
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-1">
                                    <Text
                                        className="text-3xl font-black"
                                        style={{ color: colors.foreground }}
                                    >
                                        {isPremium ? 'Premium' : 'Gratuito'}
                                    </Text>
                                    <Text
                                        className="text-sm mt-2"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        {isPremium ? 'Plano Premium ativo' : 'Plano gratuito ativo'}
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isPremium ? 'star' : 'infinite'}
                                    size={48}
                                    color={isPremium ? colors.primary : colors.mutedForeground}
                                />
                            </View>

                            {isPremium && (
                                <View className="mt-4 pt-4" style={{ borderTopColor: colors.border + '30', borderTopWidth: 1 }}>
                                    <Text className="text-xs font-semibold mb-2" style={{ color: colors.mutedForeground }}>
                                        RENOVAÇÃO
                                    </Text>
                                    <Text className="text-sm font-semibold" style={{ color: colors.foreground }}>
                                        Próxima cobrança em 15 dias
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Recursos */}
                    <View className="px-5 mb-6">
                        <Text
                            className="text-sm font-semibold mb-3"
                            style={{ color: colors.mutedForeground }}
                        >
                            Recursos Inclusos
                        </Text>

                        <View className="space-y-2">
                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={isPremium ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={isPremium ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: colors.foreground }} className="font-medium flex-1">
                                    Vendas ilimitadas
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={isPremium ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={isPremium ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: colors.foreground }} className="font-medium flex-1">
                                    Relatórios avançados
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={isPremium ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={isPremium ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: colors.foreground }} className="font-medium flex-1">
                                    Suporte prioritário
                                </Text>
                            </View>

                            <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                <Ionicons
                                    name={isPremium ? 'checkmark-circle' : 'close-circle'}
                                    size={20}
                                    color={isPremium ? colors.primary : colors.mutedForeground}
                                />
                                <Text style={{ color: colors.foreground }} className="font-medium flex-1">
                                    Integração com APIs
                                </Text>
                            </View>

                            {!isPremium && (
                                <View className="flex-row items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: colors.card + '50' }}>
                                    <Ionicons
                                        name="lock-closed"
                                        size={20}
                                        color={colors.mutedForeground}
                                    />
                                    <Text style={{ color: colors.mutedForeground }} className="font-medium flex-1">
                                        Análise de tendências
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Ações */}
                    <View className="px-5">
                        {!isPremium ? (
                            <TouchableOpacity
                                className="p-4 rounded-lg flex-row items-center justify-center gap-2"
                                style={{ backgroundColor: colors.primary }}
                                onPress={handleUpgrade}
                            >
                                <Ionicons name="arrow-up" size={20} color={colors.primaryForeground} />
                                <Text className="font-semibold text-base" style={{ color: colors.primaryForeground }}>
                                    Fazer upgrade
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="p-4 rounded-lg flex-row items-center justify-center gap-2 border"
                                style={{ borderColor: '#EF4444', backgroundColor: '#EF4444' + '10' }}
                                onPress={handleDowngrade}
                            >
                                <Ionicons name="arrow-down" size={20} color="#EF4444" />
                                <Text className="font-semibold text-base" style={{ color: '#EF4444' }}>
                                    Fazer downgrade
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
