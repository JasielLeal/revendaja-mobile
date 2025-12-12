import { useAuth } from '@/app/providers/AuthProvider';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLogin } from './hooks/useLogin';
import { LoginFormData, loginSchema } from './schemas/schema';

export default function LoginScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { signIn } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const loginMutation = useLogin();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        return () => {
            loginMutation.reset();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async (data: LoginFormData) => {
        loginMutation.mutate(data, {
            onSuccess: async (response) => {
                // A API retorna os dados direto, sem propriedade .user
                const userData = {
                    id: response.id,
                    email: response.email,
                    name: response.name,
                    plan: response.plan,
                    createdAt: response.createdAt,
                };
                await signIn(response.tokenAcess, userData);
                router.replace('/(tabs)/home');
            },
        });
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
                    {/* Parte superior laranja */}
                    <View
                        className="pt-20 pb-32 px-6"
                        style={{ backgroundColor: colors.primary }}
                    >
                        <View className="items-center">
                            <Text
                                className="text-4xl font-bold mb-2 text-white"
                            >
                                Revendaja
                            </Text>
                            <Text
                                className="text-center text-base text-white/80"
                            >
                                Entre com seu e-mail e senha para acessar o sistema
                            </Text>
                        </View>
                    </View>

                    {/* Parte branca com onda */}
                    <View
                        className="flex-1 px-6 pt-8 pb-8"
                        style={{
                            backgroundColor: colors.background,
                            marginTop: -80,
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                        }}
                    >
                        {/* Mensagem de erro */}
                        {loginMutation.isError && (
                            <View
                                className="mb-5 rounded-2xl p-4 flex-row items-start"
                                style={{ backgroundColor: '#fee2e2' }}
                            >
                                <Ionicons name="alert-circle" size={20} color="#dc2626" />
                                <View className="flex-1 ml-3">
                                    <Text className="font-bold text-sm mb-1" style={{ color: '#dc2626' }}>
                                        Erro ao fazer login
                                    </Text>
                                    <Text className="text-sm" style={{ color: '#991b1b' }}>
                                        {(loginMutation.error as any)?.response?.data?.message ||
                                            'Não foi possível fazer login. Verifique suas credenciais e tente novamente.'}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Email */}
                        <View className="mb-5">
                            <Text
                                className="font-bold text-sm mb-2.5 ml-1"
                                style={{ color: colors.foreground }}
                            >
                                E-mail
                            </Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <View
                                            className="flex-row items-center rounded-2xl px-4 py-3"
                                            style={{
                                                backgroundColor: colors.muted,
                                                borderWidth: 1.5,
                                                borderColor: errors.email ? '#ef4444' : value ? colors.primary : colors.border,
                                            }}
                                        >
                                            <Ionicons
                                                name="mail"
                                                size={20}
                                                color={colors.mutedForeground}
                                            />
                                            <TextInput
                                                className="flex-1 ml-3 text-base"
                                                style={{ color: colors.foreground }}
                                                placeholder="seu@email.com"
                                                placeholderTextColor={colors.mutedForeground}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        </View>
                                        {errors.email && (
                                            <Text className="text-red-500 text-xs mt-1 ml-1">
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </>
                                )}
                            />
                        </View>

                        {/* Senha */}
                        <View className="mb-3">
                            <Text
                                className="font-bold text-sm mb-2.5 ml-1"
                                style={{ color: colors.foreground }}
                            >
                                Senha
                            </Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <>
                                        <View
                                            className="flex-row items-center rounded-2xl px-4 py-3"
                                            style={{
                                                backgroundColor: colors.muted,
                                                borderWidth: 1.5,
                                                borderColor: errors.password ? '#ef4444' : value ? colors.primary : colors.border,
                                            }}
                                        >
                                            <Ionicons
                                                name="lock-closed"
                                                size={20}
                                                color={colors.mutedForeground}
                                            />
                                            <TextInput
                                                className="flex-1 ml-3 text-base"
                                                style={{ color: colors.foreground }}
                                                placeholder="••••••••"
                                                placeholderTextColor={colors.mutedForeground}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                className="ml-2"
                                            >
                                                <Ionicons
                                                    name={showPassword ? 'eye' : 'eye-off'}
                                                    size={22}
                                                    color={colors.mutedForeground}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {errors.password && (
                                            <Text className="text-red-500 text-xs mt-1 ml-1">
                                                {errors.password.message}
                                            </Text>
                                        )}
                                    </>
                                )}
                            />
                        </View>

                        {/* Esqueci a senha */}
                        <Link href="/(auth)/forgot-password" asChild>
                            <TouchableOpacity className="mb-6 mt-1">
                                <Text
                                    className="text-sm font-bold text-right"
                                    style={{ color: colors.primary }}
                                >
                                    Esqueci minha senha
                                </Text>
                            </TouchableOpacity>
                        </Link>

                        {/* Botão de Login */}
                        <TouchableOpacity
                            className="rounded-2xl py-3 items-center mb-6 flex-row justify-center"
                            style={{
                                backgroundColor: loginMutation.isPending ? colors.muted : colors.primary,
                                shadowColor: colors.primary,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 12,
                                elevation: 8,
                            }}
                            onPress={handleSubmit(onSubmit)}
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending && (
                                <View className="mr-2">
                                    <Ionicons name="reload-circle" size={20} color="#fff" />
                                </View>
                            )}
                            <Text
                                className="font-bold text-lg text-white"
                            >
                                {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View
                                className="flex-1 h-px"
                                style={{ backgroundColor: colors.border }}
                            />
                            <Text
                                className="px-4 text-sm font-semibold"
                                style={{ color: colors.mutedForeground }}
                            >
                                ou continue com
                            </Text>
                            <View
                                className="flex-1 h-px"
                                style={{ backgroundColor: colors.border }}
                            />
                        </View>

                        {/* Login com Google */}
                        <TouchableOpacity
                            className="flex-row items-center justify-center rounded-2xl py-3"
                            style={{
                                backgroundColor: colors.muted,
                                borderWidth: 1.5,
                                borderColor: colors.border,
                            }}
                        >
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: '#fff' }}
                            >
                                <Ionicons
                                    name="logo-google"
                                    size={20}
                                    color="#EA4335"
                                />
                            </View>
                            <Text
                                className="font-bold text-base"
                                style={{ color: colors.foreground }}
                            >
                                Entrar com Google
                            </Text>
                        </TouchableOpacity>

                        {/* Link para Registro */}
                        <View className="flex-row justify-center items-center mt-8">
                            <Text
                                className="text-base"
                                style={{ color: colors.mutedForeground }}
                            >
                                Não tem uma conta?{' '}
                            </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text
                                        className="font-bold text-base"
                                        style={{ color: colors.primary }}
                                    >
                                        Criar conta
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
