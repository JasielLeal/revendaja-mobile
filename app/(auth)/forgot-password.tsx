import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendCode = async () => {
        setLoading(true);
        // Simular envio
        setTimeout(() => {
            setLoading(false);
            setSent(true);
            setTimeout(() => {
                router.push('/(auth)/otp');
            }, 2000);
        }, 1500);
    };

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View
                        className="pt-16 pb-10 px-6"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mb-6"
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>

                        <View className="items-center">
                            <View
                                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            >
                                <Ionicons name="key" size={40} color="#fff" />
                            </View>
                            <Text className="text-3xl font-bold text-white mb-2">
                                Esqueceu a senha?
                            </Text>
                            <Text className="text-white/80 text-center text-base px-8">
                                Não se preocupe, enviaremos instruções de recuperação
                            </Text>
                        </View>
                    </View>

                    {/* Conteúdo */}
                    <View className="flex-1 px-6 justify-center" style={{ marginTop: -30 }}>
                        <View
                            className="rounded-3xl p-6 shadow-lg"
                            style={{ backgroundColor: colors.card }}
                        >
                            {!sent ? (
                                <>
                                    {/* Email */}
                                    <View className="mb-6">
                                        <Text
                                            className="text-sm font-semibold mb-2"
                                            style={{ color: colors.foreground }}
                                        >
                                            E-mail cadastrado
                                        </Text>
                                        <View
                                            className="flex-row items-center rounded-xl px-4 py-3"
                                            style={{
                                                backgroundColor: colors.muted,
                                                borderWidth: 1,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <Ionicons
                                                name="mail-outline"
                                                size={20}
                                                color={colors.mutedForeground}
                                            />
                                            <TextInput
                                                className="flex-1 ml-3 text-base"
                                                style={{ color: colors.foreground }}
                                                placeholder="seu@email.com"
                                                placeholderTextColor={colors.mutedForeground}
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        </View>
                                    </View>

                                    {/* Botão de Enviar */}
                                    <TouchableOpacity
                                        className="rounded-xl py-4 items-center mb-4"
                                        style={{
                                            backgroundColor: loading ? colors.muted : colors.primary,
                                        }}
                                        onPress={handleSendCode}
                                        disabled={loading || !email}
                                    >
                                        <Text className="text-white font-bold text-base">
                                            {loading ? 'Enviando...' : 'Enviar código'}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Info */}
                                    <View
                                        className="rounded-xl p-4 flex-row"
                                        style={{ backgroundColor: colors.muted }}
                                    >
                                        <Ionicons
                                            name="information-circle"
                                            size={20}
                                            color={colors.primary}
                                            style={{ marginRight: 8, marginTop: 2 }}
                                        />
                                        <Text
                                            className="flex-1 text-sm"
                                            style={{ color: colors.mutedForeground }}
                                        >
                                            Enviaremos um código de verificação para o e-mail informado
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <>
                                    {/* Sucesso */}
                                    <View className="items-center py-8">
                                        <View
                                            className="w-16 h-16 rounded-full items-center justify-center mb-4"
                                            style={{ backgroundColor: colors.primary + '20' }}
                                        >
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={40}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <Text
                                            className="text-xl font-bold mb-2"
                                            style={{ color: colors.foreground }}
                                        >
                                            Código enviado!
                                        </Text>
                                        <Text
                                            className="text-center text-sm"
                                            style={{ color: colors.mutedForeground }}
                                        >
                                            Verifique sua caixa de entrada e spam
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {/* Voltar */}
                        <TouchableOpacity
                            className="items-center mt-6"
                            onPress={() => router.back()}
                        >
                            <Text
                                className="text-sm"
                                style={{ color: colors.mutedForeground }}
                            >
                                Voltar para{' '}
                                <Text className="font-bold" style={{ color: colors.primary }}>
                                    Login
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
