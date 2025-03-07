import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; // Assumindo que você está usando a biblioteca 'gorhom/bottom-sheet'
import { Button } from '@/components/buttton';
import { QuantityInput } from '@/components/QuantityInput';
import { InvalidateQueryFilters, useMutation, useQueryClient } from '@tanstack/react-query';
import { InsertProductToStock } from '../services/insertProductToStock';
import { useSuccess } from '@/context/successContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { InsertProductToStockSchema } from '../schemas/InsertProductToStockSchema';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { formatCurrency } from '@/utils/formatCurrency';
import Toast from 'react-native-toast-message';

type FilterModalProps = {
    open: boolean;
    onClose: () => void;
    product: any; // Novo prop para receber os dados do produto
};

export function DetailsProduct({ open, onClose, product }: FilterModalProps) {

    const queryClient = useQueryClient();
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    const { mutateAsync: InsertProductToStockFn } = useMutation({
        mutationFn: InsertProductToStock,
        onSuccess: () => {
            queryClient.invalidateQueries(['GetStock'] as InvalidateQueryFilters);
            Toast.show({
                type: 'success',
                text1: 'Sucesso',
                text2: 'Produto adicionado ao estoque',
            });
            navigate.goBack()
        },
        onError: () => {
            console.log('error');
        },
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(InsertProductToStockSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
        defaultValues: {
            quantity: 1, // Define o valor inicial da quantidade
            customPrice: '', // Adicione outros valores padrão aqui, se necessário
        },
    });

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['80%'], []);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    if (!product) {
        return null; // Não renderiza o modal se não houver produto
    }

    const handleSheetChange = (index: number) => {
        if (index === -1) {
            onClose(); // Fecha o modal ao deslizar para baixo
        }
    };

    async function onSubmit(data: any) {

        const barcode = product.barcode

        const newData = { ...data, barcode }

        await InsertProductToStockFn(newData)
        // Aqui você pode enviar os dados para a API

    }

    return (
        <>
            {open && <View style={styles.overlay} />}
            <BottomSheet
                ref={bottomSheetRef}
                index={open ? 0 : -1}
                snapPoints={snapPoints}
                enablePanDownToClose
                onChange={handleSheetChange}
                style={styles.bottomSheet}
                handleStyle={{
                    backgroundColor: '#202020',
                }}
                handleIndicatorStyle={{
                    backgroundColor: '#fff',
                }}
            >
                <BottomSheetView className="px-5 bg-forenground w-full flex-1">
                    <View className="flex items-center mt-10">
                        <Image
                            source={product.imgUrl ? { uri: product.imgUrl } : require('@/assets/kaiak.jpg')}
                            className="w-[200px] h-[200px] rounded-xl"
                        />
                    </View>
                    <View>

                        <Text className="text-textForenground mt-5">{product.company}</Text>
                        <Text className="font-medium text-2xl text-white">{product.name}</Text>

                        <Text className="font-medium mt-5 text-white">
                            De: R$ {(Number(product.normalPrice) / 100).toFixed(2).replace('.', ',')}
                        </Text>
                        <Text className="font-medium text-lg text-primaryPrimary">
                            Sugerido: R$ {(Number(product.suggestedPrice) / 100).toFixed(2).replace('.', ',')}
                        </Text>
                    </View>

                    {/* Input de preço personalizado */}
                    <Controller
                        control={control}
                        name="customPrice"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                className="bg-bg text-white p-3 rounded-xl mt-5"
                                placeholder="Adicione seu valor de venda"
                                placeholderTextColor="#7D7D7D"
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    const formattedValue = formatCurrency(text);
                                    onChange(formattedValue);
                                }}
                                value={value}
                                returnKeyType="done"
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        )}
                    />

                    <Text className="text-textForenground text-sm mt-2 mb-5">
                        {Platform.OS === 'ios'
                            ? 'Obs: se não adicionar valor ao produto ele irá com o valor sugerido.'
                            : 'Obs: se não adicionar valor ao produto ele irá com o valor sugerido.'}
                    </Text>

                    {/* Componente de Quantidade */}
                    <Controller
                        control={control}
                        name="quantity"
                        render={({ field: { value, onChange } }) => (
                            <QuantityInput onQuantityChange={onChange} initialQuantity={value} />
                        )}
                    />

                    <View className="mb-10">
                        <Button name="Adicionar" onPress={handleSubmit(onSubmit)} />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo translúcido/ Overlay abaixo do BottomSheet
    },
    bottomSheet: {
        position: 'absolute',
        zIndex: 10, // Garante que o BottomSheet fique acima da overlay
    },
});
