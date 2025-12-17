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
import { useChangePassword } from "./hooks";

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Mínimo 8 caracteres")
            .regex(/[a-z]/, "Deve ter letra minúscula")
            .regex(/[A-Z]/, "Deve ter letra maiúscula")
            .regex(/[0-9]/, "Deve ter número"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

// Componente de validação de senha em tempo real
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
    const colors = useThemeColors();
    return (
        <View className="flex-row items-center mb-2">
            <Ionicons
                name={met ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={met ? "#22c55e" : colors.mutedForeground}
            />
            <Text
                className="ml-2 text-sm"
                style={{ color: met ? "#22c55e" : colors.mutedForeground }}
            >
                {text}
            </Text>
        </View>
    );
}

export default function NewPasswordScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data, reset } = useForgotPasswordContext();
    const changePasswordMutation = useChangePassword();
    const spinValue = useRef(new Animated.Value(0)).current;

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const password = watch('password');

    // Validações em tempo real
    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const allValid = hasMinLength && hasLowercase && hasUppercase && hasNumber;

    // Animação de loading
    React.useEffect(() => {
        if (changePasswordMutation.isPending) {
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
    }, [changePasswordMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const onSubmit = (formData: PasswordFormData) => {
        changePasswordMutation.mutate(
            {
                email: data.email,
                otpCode: data.otpCode,
                newPassword: formData.password,
            },
            {
                onSuccess: () => {
                    reset();
                    router.replace('/(auth)/forgot-password/success');
                },
            }
        );
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
                            Crie uma nova senha
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base text-center mt-2"
                        >
                            Sua nova senha deve ser diferente da anterior
                        </Text>
                    </View>

                    {/* Erro da API */}
                    {changePasswordMutation.isError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-4"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                Erro ao alterar senha. Tente novamente.
                            </Text>
                            <TouchableOpacity onPress={() => changePasswordMutation.reset()}>
                                <Ionicons name="close" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Campo Senha */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Nova senha"
                                placeholder="••••••••"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isPassword
                                error={errors.password?.message}
                            />
                        )}
                    />

                    {/* Requisitos de senha */}
                    <View className="mb-4">
                        <PasswordRequirement met={hasMinLength} text="Mínimo 8 caracteres" />
                        <PasswordRequirement met={hasLowercase} text="1 letra minúscula" />
                        <PasswordRequirement met={hasUppercase} text="1 letra maiúscula" />
                        <PasswordRequirement met={hasNumber} text="1 número" />
                    </View>

                    {/* Campo Confirmar Senha */}
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirme sua nova senha"
                                placeholder="••••••••"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isPassword
                                error={errors.confirmPassword?.message}
                            />
                        )}
                    />

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Botão Alterar Senha */}
                    <View className="mb-8">
                        <Button
                            name={
                                changePasswordMutation.isPending ? (
                                    <View className="flex-row items-center">
                                        <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#ffffff" />
                                        </Animated.View>
                                        <Text className="font-bold text-white">Alterando...</Text>
                                    </View>
                                ) : (
                                    "Alterar senha"
                                )
                            }
                            disabled={!allValid || changePasswordMutation.isPending}
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
