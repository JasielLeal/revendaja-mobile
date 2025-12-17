import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useStoreContext } from './_layout';
import { formatDomain, useCheckDomain } from './hooks/useCheckDomain';

const storeNameSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phone: z.string().min(14, 'Telefone inválido'),
});

type StoreNameFormData = z.infer<typeof storeNameSchema>;

export default function CreateStoreNameScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { setName, setPhone } = useStoreContext();
    const [debouncedDomain, setDebouncedDomain] = useState('');

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<StoreNameFormData>({
        resolver: zodResolver(storeNameSchema),
        defaultValues: {
            name: '',
            phone: '',
        },
        mode: 'onChange',
    });

    const storeName = watch('name');
    const domain = formatDomain(storeName);

    // Debounce para verificar domínio
    useEffect(() => {
        const timer = setTimeout(() => {
            if (domain.length >= 3) {
                setDebouncedDomain(domain);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [domain]);

    const { data: domainData, isLoading: isCheckingDomain } = useCheckDomain(debouncedDomain);

    const isDomainAvailable = domainData?.available;
    const showDomainStatus = domain.length >= 3;

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    };

    const onSubmit = (data: StoreNameFormData) => {
        setName(data.name);
        setPhone(data.phone.replace(/\D/g, ''));
        router.push('/(auth)/create-store/details');
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="mt-8 mb-6">
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                            style={{ backgroundColor: '#85338F20' }}
                        >
                            <Ionicons name="storefront" size={32} color="#85338F" />
                        </View>
                        <Text
                            className="text-2xl font-bold mb-2"
                            style={{ color: colors.foreground }}
                        >
                            Como se chama sua loja?
                        </Text>
                        <Text
                            className="text-base"
                            style={{ color: colors.mutedForeground }}
                        >
                            Digite o nome e telefone da sua loja
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="gap-4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View>
                                    <Input
                                        label="Nome da loja"
                                        placeholder="Ex: Minha Perfumaria"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.name?.message}
                                        leftIcon="storefront-outline"
                                    />
                                    {showDomainStatus && (
                                        <View
                                            className="flex-row items-center px-3 py-2 rounded-lg -mt-2 mb-2"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                Seu domínio será:{' '}
                                            </Text>
                                            <Text
                                                className="text-sm font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                {domain}
                                            </Text>
                                            <View className="ml-auto flex-row items-center">
                                                {isCheckingDomain ? (
                                                    <ActivityIndicator size="small" color="#85338F" />
                                                ) : isDomainAvailable ? (
                                                    <View className="flex-row items-center">
                                                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                                                        <Text className="text-xs ml-1" style={{ color: '#22c55e' }}>
                                                            Disponível
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <View className="flex-row items-center">
                                                        <Ionicons name="close-circle" size={16} color="#ef4444" />
                                                        <Text className="text-xs ml-1" style={{ color: '#ef4444' }}>
                                                            Indisponível
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Telefone"
                                    placeholder="(00) 00000-0000"
                                    value={value}
                                    onChangeText={(text) => onChange(formatPhone(text))}
                                    onBlur={onBlur}
                                    error={errors.phone?.message}
                                    keyboardType="phone-pad"
                                    leftIcon="call-outline"
                                />
                            )}
                        />
                    </View>

                    {/* Spacer */}
                    <View className="flex-1 min-h-8" />

                    {/* Button */}
                    <View className="pb-6">
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            disabled={!isValid || (showDomainStatus && !isDomainAvailable)}
                            name="Continuar"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
