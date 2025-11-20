import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OTPScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleCodeChange = (text: string, index: number) => {
        if (text.length > 1) {
            text = text[text.length - 1];
        }

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Auto focus no próximo campo
        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Verificar automaticamente quando preencher todos
        if (newCode.every(digit => digit !== '') && index === 5) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (fullCode: string) => {
        setLoading(true);
        // Simular verificação
        setTimeout(() => {
            setLoading(false);
            router.replace('/(tabs)/home');
        }, 1500);
    };

    const handleResend = () => {
        setResendTimer(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
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
                                <Ionicons name="shield-checkmark" size={40} color="#fff" />
                            </View>
                            <Text className="text-3xl font-bold text-white mb-2">
                                Verificação
                            </Text>
                            <Text className="text-white/80 text-center text-base px-8">
                                Digite o código de 6 dígitos enviado para seu e-mail
                            </Text>
                        </View>
                    </View>

                    {/* Conteúdo */}
                    <View className="flex-1 px-6 justify-center" style={{ marginTop: -30 }}>
                        <View
                            className="rounded-3xl p-6 shadow-lg"
                            style={{ backgroundColor: colors.card }}
                        >
                            {/* Campos de código */}
                            <View className="flex-row justify-between mb-8">
                                {code.map((digit, index) => (
                                    <View
                                        key={index}
                                        className="rounded-xl items-center justify-center"
                                        style={{
                                            width: 50,
                                            height: 60,
                                            backgroundColor: colors.muted,
                                            borderWidth: 2,
                                            borderColor: digit ? colors.primary : colors.border,
                                        }}
                                    >
                                        <TextInput
                                            ref={(ref) => (inputRefs.current[index] = ref)}
                                            className="text-center text-2xl font-bold"
                                            style={{ color: colors.foreground, width: '100%' }}
                                            value={digit}
                                            onChangeText={(text) => handleCodeChange(text, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            selectTextOnFocus
                                        />
                                    </View>
                                ))}
                            </View>

                            {/* Botão de Verificar */}
                            <TouchableOpacity
                                className="rounded-xl py-4 items-center mb-4"
                                style={{
                                    backgroundColor: loading ? colors.muted : colors.primary,
                                }}
                                onPress={() => handleVerify(code.join(''))}
                                disabled={loading || code.some(digit => !digit)}
                            >
                                <Text className="text-white font-bold text-base">
                                    {loading ? 'Verificando...' : 'Verificar código'}
                                </Text>
                            </TouchableOpacity>

                            {/* Reenviar código */}
                            <View className="items-center">
                                <Text
                                    className="text-sm mb-2"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    Não recebeu o código?
                                </Text>
                                {resendTimer > 0 ? (
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        Reenviar em {resendTimer}s
                                    </Text>
                                ) : (
                                    <TouchableOpacity onPress={handleResend}>
                                        <Text
                                            className="text-sm font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            Reenviar código
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Info de segurança */}
                            <View
                                className="rounded-xl p-4 flex-row mt-6"
                                style={{ backgroundColor: colors.muted }}
                            >
                                <Ionicons
                                    name="lock-closed"
                                    size={18}
                                    color={colors.primary}
                                    style={{ marginRight: 8, marginTop: 2 }}
                                />
                                <Text
                                    className="flex-1 text-xs"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    Seus dados estão protegidos com criptografia de ponta a ponta
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
