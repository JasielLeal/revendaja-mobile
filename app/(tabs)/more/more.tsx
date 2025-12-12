import { useAuth } from '@/app/providers/AuthProvider';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function MorePage() {
    const colors = useThemeColors();
    const router = useRouter();

    const { signOut } = useAuth()

    const handleLogout = () => {
        signOut();
        router.replace('/(auth)/login');
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Background principal */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background laranja */}
            <View
                className="absolute top-0 left-0 right-0"
                style={{ height: 150, backgroundColor: colors.primary }}
            />

            {/* Ondinha de transição */}
            <View
                className="absolute"
                style={{
                    top: 130,
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

            <ScrollView
                className="flex-1 relative z-10"
                contentContainerStyle={{ paddingBottom: 30 }}
            >

                {/* Header */}
                <View className="px-4 pt-10 pb-6">
                    <View className="flex-row items-center justify-between mb-6 mt-5">
                        <View className="flex-1">
                            <Text
                                className="text-lg font-medium mb-1"
                                style={{ color: colors.primaryForeground + '80' }}
                            >
                                Menu
                            </Text>
                            <Text
                                className="text-3xl font-black tracking-tight"
                                style={{ color: colors.primaryForeground }}
                            >
                                Mais opções
                            </Text>
                        </View>


                    </View>
                </View>


                {/* Seção Adicional */}
                <View className="px-5 mb-6">
                    <Text
                        className="text-sm font-semibold mb-3"
                        style={{ color: colors.mutedForeground }}
                    >
                        APP
                    </Text>

                    <View
                        className="rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '20',
                            borderWidth: 1,
                        }}
                    >
                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border + '30',
                            }}
                            onPress={() => router.push("/(tabs)/more/components/account-screen")}
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: colors.primary + '15',
                                    }}
                                >
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: colors.foreground }}
                                    >
                                        Sua conta
                                    </Text>
                                    <Text
                                        className="text-xs mt-0.5"
                                        style={{
                                            color: colors.mutedForeground,
                                        }}
                                    >
                                        Gerencie suas informações
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border + '30',
                            }}
                            onPress={() => router.push("/(tabs)/more/components/plan-screen")}
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: colors.primary + '15',
                                    }}
                                >
                                    <Ionicons
                                        name="card-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: colors.foreground }}
                                    >
                                        Seu plano
                                    </Text>
                                    <Text
                                        className="text-xs mt-0.5"
                                        style={{
                                            color: colors.mutedForeground,
                                        }}
                                    >
                                        Informações do seu plano
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Seção Adicional */}
                <View className="px-5 mb-6">
                    <Text
                        className="text-sm font-semibold mb-3"
                        style={{ color: colors.mutedForeground }}
                    >
                        MAIS
                    </Text>

                    <View
                        className="rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '20',
                            borderWidth: 1,
                        }}
                    >
                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border + '30',
                            }}
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: colors.primary + '15',
                                    }}
                                >
                                    <Ionicons
                                        name="help-circle-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: colors.foreground }}
                                    >
                                        Central de Ajuda
                                    </Text>
                                    <Text
                                        className="text-xs mt-0.5"
                                        style={{
                                            color: colors.mutedForeground,
                                        }}
                                    >
                                        Dúvidas e suporte
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border + '30',
                            }}
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: colors.primary + '15',
                                    }}
                                >
                                    <Ionicons
                                        name="information-circle-outline"
                                        size={20}
                                        color={colors.primary}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: colors.foreground }}
                                    >
                                        Sobre
                                    </Text>
                                    <Text
                                        className="text-xs mt-0.5"
                                        style={{
                                            color: colors.mutedForeground,
                                        }}
                                    >
                                        Versão 1.0.0
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center justify-between px-4 py-4"
                        >
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: '#EF4444' + '15',
                                    }}
                                >
                                    <Ionicons
                                        name="log-out-outline"
                                        size={20}
                                        color="#EF4444"
                                    />
                                </View>
                                <View>
                                    <Text
                                        className="font-semibold text-base"
                                        style={{ color: '#EF4444' }}
                                    >
                                        Sair
                                    </Text>
                                    <Text
                                        className="text-xs mt-0.5"
                                        style={{
                                            color: colors.mutedForeground,
                                        }}
                                    >
                                        Fazer logout da conta
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.mutedForeground}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}