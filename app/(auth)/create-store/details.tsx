import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useStoreContext } from './_layout';
import { useCreateStore } from './hooks/useCreateStore';

const COLORS = [
    '#85338F', // Roxo (padrão)
    '#E91E63', // Rosa
    '#F44336', // Vermelho
    '#FF9800', // Laranja
    '#4CAF50', // Verde
    '#2196F3', // Azul
    '#9C27B0', // Roxo claro
    '#00BCD4', // Ciano
];

const storeDetailsSchema = z.object({
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
});

type StoreDetailsFormData = z.infer<typeof storeDetailsSchema>;

export default function CreateStoreDetailsScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data, setAddress, setPrimaryColor, reset } = useStoreContext();
    const createStoreMutation = useCreateStore();
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<StoreDetailsFormData>({
        resolver: zodResolver(storeDetailsSchema),
        defaultValues: {
            address: '',
        },
        mode: 'onChange',
    });

    const handleColorSelect = (color: string) => {
        setSelectedColor(color);
        setPrimaryColor(color);
    };

    const onSubmit = async (formData: StoreDetailsFormData) => {
        createStoreMutation.mutate(
            {
                name: data.name,
                phone: data.phone,
                address: formData.address,
                primaryColor: selectedColor,
            },
            {
                onSuccess: () => {
                    reset();
                    router.replace('/(tabs)/home');
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
                    {/* Header */}
                    <View className="mb-6">
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                            style={{ backgroundColor: selectedColor + '20' }}
                        >
                            <Ionicons name="color-palette" size={32} color={selectedColor} />
                        </View>
                        <Text
                            className="text-2xl font-bold mb-2"
                            style={{ color: colors.foreground }}
                        >
                            Onde fica sua loja?
                        </Text>
                        <Text
                            className="text-base"
                            style={{ color: colors.mutedForeground }}
                        >
                            Digite o endereço e escolha a cor da sua loja
                        </Text>
                    </View>

                    {/* Erro da API */}
                    {createStoreMutation.isError && (
                        <View
                            className="rounded-xl p-3 flex-row items-center mb-6"
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Ionicons name="alert-circle" size={20} color="#dc2626" />
                            <Text className="flex-1 ml-2 text-sm" style={{ color: '#991b1b' }}>
                                Erro ao criar loja. Tente novamente.
                            </Text>
                        </View>
                    )}

                    {/* Form */}
                    <View className="gap-4">
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Endereço"
                                    placeholder="Ex: Rua das Flores, 123"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    error={errors.address?.message}
                                    leftIcon="location-outline"
                                />
                            )}
                        />

                        {/* Color Picker */}
                        <View className="mt-2">
                            <Text
                                className="text-sm font-medium mb-3"
                                style={{ color: colors.foreground }}
                            >
                                Cor principal
                            </Text>
                            <View className="flex-row flex-wrap gap-3">
                                {COLORS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => handleColorSelect(color)}
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{
                                            backgroundColor: color,
                                            borderWidth: selectedColor === color ? 3 : 0,
                                            borderColor: colors.foreground,
                                        }}
                                    >
                                        {selectedColor === color && (
                                            <Ionicons name="checkmark" size={24} color="#fff" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Spacer */}
                    <View className="flex-1 min-h-8" />

                    {/* Button */}
                    <View className="pb-6">
                        <Button
                            onPress={handleSubmit(onSubmit)}
                            isLoading={createStoreMutation.isPending}
                            disabled={!isValid || createStoreMutation.isPending}
                            name="Criar loja"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
