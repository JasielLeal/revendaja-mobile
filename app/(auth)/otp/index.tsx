import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useResendCode, useVerifyEmail } from './hooks';

interface ApiErrorResponse {
    message: string;
    code?: string;
}

export default function OTPScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60);
    const [isSuccess, setIsSuccess] = useState(false);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const verifyMutation = useVerifyEmail();
    const resendMutation = useResendCode();

    // Animações
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const successScale = useRef(new Animated.Value(0)).current;
    const successOpacity = useRef(new Animated.Value(0)).current;

    const errorMessage = useMemo(() => {
        if (!verifyMutation.error) return null;
        const error = verifyMutation.error as AxiosError<ApiErrorResponse>;
        return error.response?.data?.message || 'Código inválido. Tente novamente.';
    }, [verifyMutation.error]);

    // Timer de reenvio
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Animação de entrada
    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Focus no primeiro input
        setTimeout(() => inputRefs.current[0]?.focus(), 500);
    }, [scaleAnim, fadeAnim, slideAnim]);

    // Animação de loading
    useEffect(() => {
        if (verifyMutation.isPending) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            spinValue.setValue(0);
        }
    }, [verifyMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Animação de shake quando erro
    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Animação de sucesso
    const triggerSuccess = () => {
        setIsSuccess(true);
        Animated.parallel([
            Animated.spring(successScale, {
                toValue: 1,
                friction: 4,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(successOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Redireciona após 2 segundos
        setTimeout(() => {
            router.replace('/(auth)/login');
        }, 2000);
    };

    const handleCodeChange = (text: string, index: number) => {
        // Limpa erro quando começa a digitar
        if (verifyMutation.isError) {
            verifyMutation.reset();
        }

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
        if (!email) return;

        verifyMutation.mutate(
            { email, code: fullCode },
            {
                onSuccess: () => {
                    triggerSuccess();
                },
                onError: () => {
                    triggerShake();
                    setCode(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                },
            }
        );
    };

    const handleResend = () => {
        if (!email || resendTimer > 0) return;

        resendMutation.mutate(email, {
            onSuccess: () => {
                setResendTimer(60);
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            },
        });
    };

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    // Mascara o email para privacidade
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : 'seu e-mail';

    const isCodeComplete = code.every(digit => digit !== '');

    // Tela de sucesso
    if (isSuccess) {
        return (
            <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: colors.background }}>
                <Animated.View
                    className="items-center"
                    style={{
                        transform: [{ scale: successScale }],
                        opacity: successOpacity,
                    }}
                >
                    <View
                        className="w-32 h-32 rounded-full items-center justify-center mb-6"
                        style={{ backgroundColor: '#22C55E' + '20' }}
                    >
                        <View
                            className="w-24 h-24 rounded-full items-center justify-center"
                            style={{ backgroundColor: '#22C55E' + '40' }}
                        >
                            <View
                                className="w-16 h-16 rounded-full items-center justify-center"
                                style={{ backgroundColor: '#22C55E' }}
                            >
                                <Ionicons name="checkmark" size={40} color="#fff" />
                            </View>
                        </View>
                    </View>

                    <Text
                        className="text-2xl font-bold text-center mb-2"
                        style={{ color: colors.foreground }}
                    >
                        E-mail verificado!
                    </Text>

                    <Text
                        className="text-base text-center mb-6"
                        style={{ color: colors.mutedForeground }}
                    >
                        Sua conta foi ativada com sucesso
                    </Text>

                    <View className="flex-row items-center">
                        <Ionicons name="arrow-forward" size={16} color={colors.mutedForeground} />
                        <Text
                            className="text-sm ml-2"
                            style={{ color: colors.mutedForeground }}
                        >
                            Redirecionando para o login...
                        </Text>
                    </View>
                </Animated.View>
            </View>
        );
    }

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
                        className="pt-16 pb-24 px-6"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="mb-4 w-10 h-10 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>

                        <Animated.View
                            className="items-center"
                            style={{ transform: [{ scale: scaleAnim }] }}
                        >
                            <View
                                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                            >
                                <Ionicons name="shield-checkmark" size={40} color="#fff" />
                            </View>
                            <Text className="text-3xl font-bold text-white mb-2">
                                Verificação
                            </Text>
                            <Text className="text-white/80 text-center text-base px-4">
                                Digite o código de 6 dígitos enviado para
                            </Text>
                            <Text className="text-white font-semibold text-base mt-1">
                                {maskedEmail}
                            </Text>
                        </Animated.View>
                    </View>

                    {/* Conteúdo */}
                    <Animated.View
                        className="flex-1 px-6"
                        style={{
                            marginTop: -50,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }}
                    >
                        <View
                            className="rounded-3xl p-6"
                            style={{ backgroundColor: colors.card }}
                        >
                            {/* Mensagem de erro */}
                            {verifyMutation.isError && errorMessage && (
                                <View
                                    className="mb-4 rounded-xl p-3 flex-row items-center"
                                    style={{ backgroundColor: '#fee2e2' }}
                                >
                                    <Ionicons name="alert-circle" size={20} color="#dc2626" />
                                    <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                        {errorMessage}
                                    </Text>
                                </View>
                            )}

                            {/* Campos de código */}
                            <Animated.View
                                className="flex-row justify-between mb-6"
                                style={{ transform: [{ translateX: shakeAnim }] }}
                            >
                                {code.map((digit, index) => (
                                    <View
                                        key={index}
                                        className="rounded-xl items-center justify-center"
                                        style={{
                                            width: 48,
                                            height: 56,
                                            backgroundColor: colors.muted,
                                            borderWidth: 2,
                                            borderColor: verifyMutation.isError
                                                ? '#ef4444'
                                                : digit
                                                    ? colors.primary
                                                    : colors.border,
                                        }}
                                    >
                                        <TextInput
                                            ref={(ref) => { inputRefs.current[index] = ref; }}
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
                            </Animated.View>

                            {/* Botão de Verificar */}
                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity
                                    className="rounded-xl py-4 items-center mb-4 flex-row justify-center"
                                    style={{
                                        backgroundColor: verifyMutation.isPending || !isCodeComplete
                                            ? colors.primary + 'AA'
                                            : colors.primary,
                                    }}
                                    onPress={() => handleVerify(code.join(''))}
                                    onPressIn={handlePressIn}
                                    onPressOut={handlePressOut}
                                    disabled={verifyMutation.isPending || !isCodeComplete}
                                    activeOpacity={0.9}
                                >
                                    {verifyMutation.isPending ? (
                                        <>
                                            <Animated.View
                                                className="mr-2"
                                                style={{ transform: [{ rotate: spin }] }}
                                            >
                                                <Ionicons name="sync" size={20} color="#fff" />
                                            </Animated.View>
                                            <Text className="text-white font-bold text-base">
                                                Verificando...
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                            <Text className="text-white font-bold text-base">
                                                Verificar código
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </Animated.View>

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
                                    <TouchableOpacity
                                        onPress={handleResend}
                                        disabled={resendMutation.isPending}
                                    >
                                        <Text
                                            className="text-sm font-bold"
                                            style={{ color: colors.primary }}
                                        >
                                            {resendMutation.isPending ? 'Enviando...' : 'Reenviar código'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
