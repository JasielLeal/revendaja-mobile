import { useAuth } from '@/app/providers/AuthProvider';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { formatDateFull } from '@/lib/formatters';
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

export default function AccountScreen() {
    const colors = useThemeColors();
    const { user } = useAuth();
    const router = useRouter();

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

                    <View className='px-5 flex-row items-center mb-4'>
                        <Avatar
                            name={String(user?.name)}
                            size="md"
                            className="mr-3"
                            backgroundColor={colors.primary}
                            textColor={colors.foreground}
                        />
                        <View>
                            <Text
                                className="text-lg font-bold"
                                style={{ color: colors.foreground }}
                            >
                                {user?.name}
                            </Text>
                            <Text
                                className="text-sm"
                                style={{ color: colors.mutedForeground }}
                            >
                                {user?.plan === 'Free' ? 'Plano Gratuito' : `Plano ${user?.plan}`}
                            </Text>
                        </View>
                    </View>

                    {/* Seção de Informações */}
                    <View className="px-5 mb-6">
                        <View className="mb-4">
                            <View
                                className="rounded-xl overflow-hidden"

                            >
                                {/* Nome */}
                                <View className="p-4 border-b" style={{ borderBottomColor: colors.border + '30' }}>
                                    <Text
                                        className="text-xs font-semibold mb-2"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        NOME
                                    </Text>

                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            className="text-base font-semibold"
                                            style={{ color: colors.foreground }}
                                        >
                                            {user?.name}
                                        </Text>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={colors.primary}
                                        />
                                    </View>

                                </View>

                                {/* Email */}
                                <View className="p-4" style={{ borderBottomColor: colors.border + '30', borderBottomWidth: 1 }}>
                                    <Text
                                        className="text-xs font-semibold mb-2"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        EMAIL
                                    </Text>

                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            className="text-base font-semibold"
                                            style={{ color: colors.foreground }}
                                        >
                                            {user?.email}
                                        </Text>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={colors.primary}
                                        />
                                    </View>

                                </View>

                                {/* Data de cadastro */}
                                <View className="p-4">
                                    <Text
                                        className="text-xs font-semibold mb-2"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        Data de cadastro
                                    </Text>

                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            className="text-base font-semibold"
                                            style={{ color: colors.foreground }}
                                        >
                                            {formatDateFull(String(user?.createdAt))}
                                        </Text>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={20}
                                            color={colors.primary}
                                        />
                                    </View>

                                </View>
                            </View>
                        </View>

                        {/* Área Perigosa */}
                        <View className="mb-4">
                            <Text
                                className="text-sm font-semibold mb-3"
                                style={{
                                    color: '#EF4444',
                                }}
                            >
                                Área Perigosa
                            </Text>

                            <View
                            >
                                {/* Alterar Senha */}
                                <TouchableOpacity
                                    className="flex-row items-center justify-between px-4 py-4"
                                    onPress={() => Alert.alert('Alterar Senha', 'Em desenvolvimento')}
                                >
                                    <View className="flex-row items-center gap-3">

                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: '#EF4444' }}
                                            >
                                                Alterar Senha
                                            </Text>
                                            <Text
                                                className="text-xs mt-0.5"
                                                style={{
                                                    color: colors.mutedForeground,
                                                }}
                                            >
                                                Atualize sua senha regularmente
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#EF4444"
                                    />
                                </TouchableOpacity>

                                {/* Deletar Conta */}
                                <TouchableOpacity
                                    className="flex-row items-center justify-between px-4 py-4"
                                    onPress={() => Alert.alert(
                                        'Deletar Conta',
                                        'Essa ação é irreversível. Todos os seus dados serão permanentemente removidos.',
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            {
                                                text: 'Deletar',
                                                style: 'destructive',
                                                onPress: () => Alert.alert('Confirmação', 'Em desenvolvimento'),
                                            },
                                        ]
                                    )}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: '#EF4444' }}
                                            >
                                                Deletar Conta
                                            </Text>
                                            <Text
                                                className="text-xs mt-0.5"
                                                style={{
                                                    color: colors.mutedForeground,
                                                }}
                                            >
                                                Remover permanentemente sua conta
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color="#EF4444"
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Aviso */}
                            <View
                                className="mt-3 p-3 rounded-lg flex-row items-start gap-2"
                                style={{
                                    backgroundColor: '#EF4444' + '10',
                                }}
                            >
                                <Ionicons
                                    name="alert-circle"
                                    size={16}
                                    color="#EF4444"
                                    style={{ marginTop: 2 }}
                                />
                                <Text
                                    className="text-xs flex-1"
                                    style={{
                                        color: '#EF4444',
                                    }}
                                >
                                    As ações nesta seção são irreversíveis. Tenha cuidado ao prosseguir.
                                </Text>
                            </View>
                        </View>
                    </View>


                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
