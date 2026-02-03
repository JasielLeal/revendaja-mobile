import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useRegisterContext } from "./_layout";
import { useCheckEmail } from "./hooks/useCheckEmail";

const emailSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function RegisterEmailScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { setEmail } = useRegisterContext();
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const checkScale = useRef(new Animated.Value(0)).current;
    const spinValue = useRef(new Animated.Value(0)).current;

    const checkEmailMutation = useCheckEmail();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onChange',
    });

    // Animação do checkbox
    useEffect(() => {
        Animated.spring(checkScale, {
            toValue: acceptTerms ? 1 : 0,
            useNativeDriver: true,
            friction: 5,
        }).start();
    }, [acceptTerms, checkScale]);

    // Animação de loading
    React.useEffect(() => {
        if (checkEmailMutation.isPending) {
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
    }, [checkEmailMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const onSubmit = (data: EmailFormData) => {
        if (!acceptTerms) return;
        setEmailError(null);

        checkEmailMutation.mutate(data.email, {
            onSuccess: (response) => {
                if (response.available) {
                    setEmail(data.email);
                    router.push('/(auth)/register/password');
                } else {
                    setEmailError('Este e-mail já está em uso. Tente outro.');
                }
            },
            onError: () => {
                setEmailError('Erro ao verificar e-mail. Tente novamente.');
            },
        });
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header com botão voltar */}
                <View className="mb-6 px-4 flex flex-row items-center justify-between gap-4" >
                    <TouchableOpacity style={{ marginBottom: 20, borderRadius: 15, padding: 6, borderColor: colors.border, borderWidth: 1 }}>
                        <Text className='text-white' onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
                        Crie sua conta
                    </Text>

                    <View style={{ width: 40, height: 40 }} />
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Título */}
                    <View className="mb-8">
                        <Text
                            style={{ color: colors.foreground }}
                            className="text-2xl font-bold"
                        >
                            Qual é o seu e-mail?
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base mt-2"
                        >
                            Digite seu e-mail para criar sua conta
                        </Text>
                    </View>

                    {/* Erro de email já em uso */}
                    {emailError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-4"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                {emailError}
                            </Text>
                            <TouchableOpacity onPress={() => setEmailError(null)}>
                                <Ionicons name="close" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Campo Email */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                placeholder="seu@email.com"
                                value={value}
                                onChangeText={(text) => {
                                    onChange(text);
                                    setEmailError(null);
                                }}
                                onBlur={onBlur}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    {/* Aceitar Termos */}
                    <TouchableOpacity
                        className="flex-row items-start mt-2"
                        onPress={() => setAcceptTerms(!acceptTerms)}
                        activeOpacity={0.7}
                    >
                        <View
                            className="w-5 h-5 rounded border items-center justify-center mr-3 mt-0.5"
                            style={{
                                backgroundColor: acceptTerms ? colors.primary : 'transparent',
                                borderColor: acceptTerms ? colors.primary : colors.border,
                            }}
                        >
                            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
                                <Ionicons name="checkmark" size={14} color="#fff" />
                            </Animated.View>
                        </View>
                        <Text className="flex-1 text-sm" style={{ color: colors.mutedForeground }}>
                            Li e aceito os{' '}
                            <Text style={{ color: colors.primary }}>Termos de Uso</Text>
                            {' '}e{' '}
                            <Text style={{ color: colors.primary }}>Política de Privacidade</Text>
                        </Text>
                    </TouchableOpacity>

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Botão Continuar */}
                    <View className="mb-8">
                        <Button
                            name={
                                checkEmailMutation.isPending ? (
                                    <View className="flex-row items-center">
                                        <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#ffffff" />
                                        </Animated.View>
                                        <Text className="font-bold text-white">Verificando...</Text>
                                    </View>
                                ) : (
                                    "Continuar"
                                )
                            }
                            disabled={!isValid || !acceptTerms || checkEmailMutation.isPending}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
