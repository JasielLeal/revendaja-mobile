import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
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
import { useForgotPasswordContext } from "./_layout";
import { useForgotPassword } from "./hooks";

const emailSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function ForgotPasswordScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { setEmail } = useForgotPasswordContext();
    const forgotPasswordMutation = useForgotPassword();
    const spinValue = useRef(new Animated.Value(0)).current;

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

    // Animação de loading
    React.useEffect(() => {
        if (forgotPasswordMutation.isPending) {
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
    }, [forgotPasswordMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const onSubmit = (data: EmailFormData) => {
        forgotPasswordMutation.mutate(data.email, {
            onSuccess: () => {
                setEmail(data.email);
                router.push('/(auth)/forgot-password/verify');
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
                            Esqueceu sua senha?
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base text-center mt-2"
                        >
                            Digite seu e-mail e enviaremos um código para redefinir sua senha
                        </Text>
                    </View>

                    {/* Erro da API */}
                    {forgotPasswordMutation.isError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-4"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                E-mail não encontrado. Verifique e tente novamente.
                            </Text>
                            <TouchableOpacity onPress={() => forgotPasswordMutation.reset()}>
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
                                label="E-mail"
                                placeholder="seu@email.com"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={errors.email?.message}
                            />
                        )}
                    />

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Botão Enviar Código */}
                    <View className="mb-8">
                        <Button
                            name={
                                forgotPasswordMutation.isPending ? (
                                    <View className="flex-row items-center">
                                        <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#ffffff" />
                                        </Animated.View>
                                        <Text className="font-bold text-white">Enviando...</Text>
                                    </View>
                                ) : (
                                    "Enviar código"
                                )
                            }
                            disabled={!isValid || forgotPasswordMutation.isPending}
                            onPress={handleSubmit(onSubmit)}
                        />

                        {/* Link para Login */}
                        <TouchableOpacity
                            className="items-center mt-5"
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={{ color: colors.mutedForeground }}>
                                Lembrou a senha?{' '}
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                    Entrar
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
