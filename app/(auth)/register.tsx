import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
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

export default function RegisterScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }
        if (!acceptTerms) {
            alert('Você precisa aceitar os termos de uso');
            return;
        }

        setLoading(true);
        // Simular registro
        setTimeout(() => {
            setLoading(false);
            router.push('/(auth)/otp');
        }, 1500);
    };

    return (
        <View className="flex-1" style={{ backgroundColor: colors.primary }}>
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
                            <Text className="text-4xl font-bold mb-2 text-white">
                                Criar conta
                            </Text>
                            <Text className="text-center text-base text-white/80">
                                Preencha seus dados para começar
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
                            {/* Nome */}
                            <View className="mb-5">
                                <Text
                                    className="font-bold text-sm mb-2.5 ml-1"
                                    style={{ color: colors.foreground }}
                                >
                                    Nome completo
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: colors.muted,
                                        borderWidth: 1.5,
                                        borderColor: name ? colors.primary : colors.border,
                                    }}
                                >
                                    <Ionicons
                                        name="person"
                                        size={20}
                                        color={colors.mutedForeground}
                                    />
                                    <TextInput
                                        className="flex-1 ml-3 text-base"
                                        style={{ color: colors.foreground }}
                                        placeholder="Seu nome"
                                        placeholderTextColor={colors.mutedForeground}
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View className="mb-5">
                                <Text
                                    className="font-bold text-sm mb-2.5 ml-1"
                                    style={{ color: colors.foreground }}
                                >
                                    E-mail
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: colors.muted,
                                        borderWidth: 1.5,
                                        borderColor: email ? colors.primary : colors.border,
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
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>


                            {/* Senha */}
                            <View className="mb-5">
                                <Text
                                    className="font-bold text-sm mb-2.5 ml-1"
                                    style={{ color: colors.foreground }}
                                >
                                    Senha
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: colors.muted,
                                        borderWidth: 1.5,
                                        borderColor: password ? colors.primary : colors.border,
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
                                        placeholder="Mínimo 6 caracteres"
                                        placeholderTextColor={colors.mutedForeground}
                                        value={password}
                                        onChangeText={setPassword}
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
                            </View>

                            {/* Confirmar Senha */}
                            <View className="mb-3">
                                <Text
                                    className="font-bold text-sm mb-2.5 ml-1"
                                    style={{ color: colors.foreground }}
                                >
                                    Confirmar senha
                                </Text>
                                <View
                                    className="flex-row items-center rounded-2xl px-4 py-3"
                                    style={{
                                        backgroundColor: colors.muted,
                                        borderWidth: 1.5,
                                        borderColor: confirmPassword ? colors.primary : colors.border,
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
                                        placeholder="Repita sua senha"
                                        placeholderTextColor={colors.mutedForeground}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="ml-2"
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? 'eye' : 'eye-off'}
                                            size={22}
                                            color={colors.mutedForeground}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Termos de uso */}
                            <TouchableOpacity
                                className="flex-row items-start mb-6 mt-3"
                                onPress={() => setAcceptTerms(!acceptTerms)}
                            >
                                <View
                                    className="w-6 h-6 rounded-lg items-center justify-center mr-3 mt-0.5"
                                    style={{
                                        backgroundColor: acceptTerms ? colors.primary : colors.muted,
                                        borderWidth: 1.5,
                                        borderColor: acceptTerms ? colors.primary : colors.border,
                                    }}
                                >
                                    {acceptTerms && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </View>
                                <Text
                                    className="flex-1 text-sm leading-5"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    Aceito os{' '}
                                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>termos de uso</Text>
                                    {' '}e{' '}
                                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>política de privacidade</Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Botão de Registro */}
                            <TouchableOpacity
                                className="rounded-2xl py-3 items-center mb-6 flex-row justify-center"
                                style={{
                                    backgroundColor: loading ? colors.muted : colors.primary,
                                    shadowColor: colors.primary,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: loading ? 0 : 0.3,
                                    shadowRadius: 12,
                                    elevation: loading ? 0 : 8,
                                }}
                                onPress={handleRegister}
                                disabled={loading || !name || !email || !phone || !password || !confirmPassword || !acceptTerms}
                            >
                                {loading && (
                                    <View className="mr-2">
                                        <Ionicons name="reload-circle" size={20} color="#fff" />
                                    </View>
                                )}
                                <Text className="text-white font-bold text-lg">
                                    {loading ? 'Criando conta...' : 'Criar conta'}
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
                                className="flex-row items-center justify-center rounded-2xl py-3 mb-2"
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
                                    Continuar com Google
                                </Text>
                            </TouchableOpacity>

                        {/* Link para Login */}
                        <View className="flex-row justify-center items-center mt-8 mb-10">
                            <Text
                                className="text-base"
                                style={{ color: colors.mutedForeground }}
                            >
                                Já tem uma conta?{' '}
                            </Text>
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text
                                        className="font-bold text-base"
                                        style={{ color: colors.primary }}
                                    >
                                        Entrar
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
