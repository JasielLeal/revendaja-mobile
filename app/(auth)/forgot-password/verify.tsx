import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForgotPasswordContext } from "./_layout";
import { useForgotPassword, useVerifyOtp } from "./hooks";

export default function VerifyOtpScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data, setOtpCode } = useForgotPasswordContext();

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const verifyOtpMutation = useVerifyOtp();
    const resendMutation = useForgotPassword();

    const spinValue = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Timer de reenvio
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Focus no primeiro input
    useEffect(() => {
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
    }, []);

    // Animação de loading
    useEffect(() => {
        if (verifyOtpMutation.isPending) {
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
    }, [verifyOtpMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Shake quando erro
    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleCodeChange = (value: string, index: number) => {
        if (value.length > 1) {
            // Colar código completo
            const pastedCode = value.slice(0, 6).split('');
            const newCode = [...code];
            pastedCode.forEach((char, i) => {
                if (i < 6) newCode[i] = char;
            });
            setCode(newCode);
            if (pastedCode.length === 6) {
                inputRefs.current[5]?.focus();
            }
            return;
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-avançar para próximo input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = code.join('');
        if (otpCode.length !== 6) return;

        verifyOtpMutation.mutate(
            { email: data.email, otpCode },
            {
                onSuccess: () => {
                    setOtpCode(otpCode);
                    router.push('/(auth)/forgot-password/new-password');
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
        if (resendTimer > 0) return;

        resendMutation.mutate(data.email, {
            onSuccess: () => {
                setResendTimer(60);
            },
        });
    };

    const isCodeComplete = code.every(digit => digit !== '');

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header com botão voltar */}
                <View className="px-4 py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View className="items-center mb-6">
                        <Image
                            source={logo}
                            style={{ width: 120, height: 40 }}
                            contentFit="contain"
                        />
                    </View>

                    {/* Título */}
                    <View className="mb-8">
                        <Text
                            style={{ color: colors.foreground }}
                            className="text-2xl font-bold text-center"
                        >
                            Verifique seu e-mail
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base text-center mt-2"
                        >
                            Enviamos um código de 6 dígitos para{'\n'}
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                {data.email}
                            </Text>
                        </Text>
                    </View>

                    {/* Erro da API */}
                    {verifyOtpMutation.isError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-4"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                Código inválido. Tente novamente.
                            </Text>
                            <TouchableOpacity onPress={() => verifyOtpMutation.reset()}>
                                <Ionicons name="close" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Inputs de código */}
                    <Animated.View
                        className="flex-row justify-between mb-6"
                        style={{ transform: [{ translateX: shakeAnim }] }}
                    >
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => { inputRefs.current[index] = ref; }}
                                className="w-12 h-14 rounded-xl text-center text-xl font-bold"
                                style={{
                                    backgroundColor: colors.muted,
                                    borderWidth: 1.5,
                                    borderColor: digit ? colors.primary : colors.border,
                                    color: colors.foreground,
                                }}
                                value={digit}
                                onChangeText={(value) => handleCodeChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={6}
                                selectTextOnFocus
                            />
                        ))}
                    </Animated.View>

                    {/* Reenviar código */}
                    <View className="items-center mb-6">
                        {resendTimer > 0 ? (
                            <Text style={{ color: colors.mutedForeground }}>
                                Reenviar código em{' '}
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                    {resendTimer}s
                                </Text>
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={handleResend} disabled={resendMutation.isPending}>
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                    {resendMutation.isPending ? 'Enviando...' : 'Reenviar código'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Botão Verificar */}
                    <View className="mb-8">
                        <Button
                            name={
                                verifyOtpMutation.isPending ? (
                                    <View className="flex-row items-center">
                                        <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#ffffff" />
                                        </Animated.View>
                                        <Text className="font-bold text-white">Verificando...</Text>
                                    </View>
                                ) : (
                                    "Verificar código"
                                )
                            }
                            disabled={!isCodeComplete || verifyOtpMutation.isPending}
                            onPress={handleVerify}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
