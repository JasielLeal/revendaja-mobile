import { useAuth } from '@/app/providers/AuthProvider';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogin } from './hooks/useLogin';
import { LoginFormData, loginSchema } from './schemas/schema';

interface ApiErrorResponse {
    message?: string;
    error?: string;
    code?: string;
    statusCode?: number;
}

export default function LoginScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { signIn } = useAuth();
    const loginMutation = useLogin();
    const [showPassword, setShowPassword] = useState(false);

    const spinValue = useRef(new Animated.Value(0)).current;

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

    // Animação de loading
    React.useEffect(() => {
        if (loginMutation.isPending) {
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
    }, [loginMutation.isPending, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const getErrorMessage = () => {
        if (!loginMutation.error) return null;
        const error = loginMutation.error as AxiosError<ApiErrorResponse>;

        if (!error.response || error.code === 'ERR_NETWORK') {
            return 'Sem conexão com a internet.';
        }

        const statusCode = error.response?.status;
        if (statusCode === 401) {
            return 'E-mail ou senha incorretos.';
        }

        return error.response?.data?.message || error.response?.data?.error || 'Erro ao fazer login.';
    };

    const onSubmit = async (data: LoginFormData) => {
        loginMutation.mutate(data, {
            onSuccess: async (response) => {
                const userData = {
                    id: response.id,
                    email: response.email,
                    name: response.name,
                    plan: response.plan,
                    createdAt: response.createdAt,
                    firstAccess: response.firstAccess,
                    token: response.token,
                    store: response.store,
                    storeInformation: {
                        name: response.store ? response['storeInformation']?.name || '' : '',
                        subdomain: response.store ? response['storeInformation']?.subdomain || '' : '',
                        phone: response.store ? response['storeInformation']?.phone || '' : '',
                        address: response.store ? response['storeInformation']?.address || '' : '',
                        primaryColor: response.store ? response['storeInformation']?.primaryColor || '' : '',
                    }
                };
                await signIn(response.token, userData);

                // Verifica se o usuário tem loja
                if (!response.store) {
                    router.replace('/(auth)/create-store' as any);
                } else {
                    router.replace('/(tabs)/home');
                }
            },
        });
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="mb-6 flex flex-row items-center justify-between gap-4" >
                        <TouchableOpacity
                            style={{ marginBottom: 20, borderRadius: 15, padding: 6, borderColor: colors.border, borderWidth: 1 }}
                            onPress={() => {
                                if (router.canGoBack()) {
                                    router.back();
                                } else {
                                    router.replace('/(auth)/onboarding' as any);
                                }
                            }}
                        >
                            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                        </TouchableOpacity>

                        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Acesse sua conta</Text>

                        <View style={{ width: 40, height: 40 }} />
                    </View>

                    {/* Erro da API */}
                    {loginMutation.isError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-6"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                {getErrorMessage()}
                            </Text>
                            <TouchableOpacity onPress={() => loginMutation.reset()}>
                                <Ionicons name="close" size={18} color="#dc2626" />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Campo Email */}


                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View>
                                <Input
                                    label="E-mail"
                                    placeholder="E-mail"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.email?.message}
                                    rightIcon="mail-outline"
                                />
                            </View>
                        )}
                    />

                    {/* Campo Senha */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View>
                                <Input
                                    label="Senha"
                                    placeholder="Senha"
                                    isPassword
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.password?.message}
                                />
                            </View>
                        )}
                    />

                    {/* Esqueceu a senha */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/forgot-password')}
                        className="mb-8 self-start"
                        style={{ alignSelf: 'flex-start' }}
                    >
                        <Text style={{ color: colors.primary }} className="text-sm font-medium">
                            Esqueceu a senha?
                        </Text>
                    </TouchableOpacity>


                    <Button
                        name={loginMutation.isPending ?
                            (
                                <>
                                    <Animated.View className="mr-2" style={{ transform: [{ rotate: spin }] }}>
                                        <Ionicons name="sync" size={18} color={colors.mutedForeground} />
                                    </Animated.View>
                                    <Text className="font-semibold text-base" style={{ color: colors.mutedForeground }}>
                                        Entrando...
                                    </Text>
                                </>
                            )
                            :
                            (
                                <Text className="font-semibold text-base text-white" >
                                    Entrar
                                </Text>
                            )}
                        disabled={loginMutation.isPending}
                        onPress={handleSubmit(onSubmit)}
                    />

                    {/* Link para Cadastro */}

                    <View className='flex flex-row items-center mt-5 justify-center'>
                        <Text style={{ color: colors.mutedForeground }}>
                            Não tem conta?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/register')}
                        >
                            <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                Cadastre-se
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center my-8" style={{ color: colors.mutedForeground }}>Ou</Text>

                    <View className='flex flex-row items-center justify-center gap-4 mb-8'>
                        <TouchableOpacity  style={{borderColor: colors.border,   borderWidth: 1, padding: 10, borderRadius: 10}}>
                            <Ionicons name="logo-google" size={32} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity  style={{borderColor: colors.border, borderWidth: 1, padding: 10, borderRadius: 10}}>
                            <Ionicons name="logo-facebook" size={32} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity  style={{borderColor: colors.border, borderWidth: 1, padding: 10, borderRadius: 10}}>
                            <Ionicons name="logo-apple" size={32} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
