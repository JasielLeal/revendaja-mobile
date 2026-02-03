import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useRef } from "react";
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
import { useRegister } from "./hooks/useRegister";

interface ApiErrorResponse {
    message?: string;
    error?: string;
    code?: string;
}

const passwordSchema = z
    .object({
        password: z
            .string()
            .min(6, "Mínimo 6 caracteres"),

        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;


export default function RegisterPasswordScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data, setPassword, reset } = useRegisterContext();
    const registerMutation = useRegister();
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

    // Animação de loading
    React.useEffect(() => {
        if (registerMutation.isPending) {
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
    }, [registerMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const errorMessage = useMemo(() => {
        if (!registerMutation.error) return null;
        const error = registerMutation.error as AxiosError<ApiErrorResponse>;

        if (error.response?.data.error === 'User already exists') {
            return 'Este e-mail já está em uso. Tente outro.';
        }

        return error.response?.data.error || 'Erro ao criar conta. Tente novamente.';
    }, [registerMutation.error]);

    const onSubmit = (formData: PasswordFormData) => {
        setPassword(formData.password);

        registerMutation.mutate(
            {
                name: data.name,
                email: data.email,
                password: formData.password,
            },
            {
                onSuccess: () => {
                    reset();
                    router.push({
                        pathname: '/(auth)/otp',
                        params: { email: data.email },
                    });
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
                            Crie sua senha
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base mt-2"
                        >
                            Crie uma senha segura para sua conta
                        </Text>
                    </View>

                    {/* Erro da API */}
                    {registerMutation.isError && errorMessage && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-4"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                {errorMessage}
                            </Text>
                            <TouchableOpacity onPress={() => registerMutation.reset()}>
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
                                label="Senha"
                                placeholder="••••••••"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                isPassword
                                error={errors.password?.message}
                            />
                        )}
                    />

                    {/* Campo Confirmar Senha */}
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Confirme sua senha"
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

                    {/* Botão Criar Conta */}
                    <View className="mb-8">
                        <Button
                            name={
                                registerMutation.isPending ? (
                                    <View className="flex-row items-center">
                                        <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                            <Ionicons name="sync" size={18} color="#ffffff" />
                                        </Animated.View>
                                        <Text className="font-bold text-white">Criando conta...</Text>
                                    </View>
                                ) : (
                                    "Criar conta"
                                )
                            }
                            onPress={handleSubmit(onSubmit)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
