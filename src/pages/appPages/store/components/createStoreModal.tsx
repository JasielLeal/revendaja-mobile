import { Button } from '@/components/buttton';
import { Input } from '@/components/input';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { useMemo, useRef, useEffect, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { CreateStore } from '../services/createStore';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateStoreSchema } from '../schemas/createStoreSchema';
import AuthContext from '@/context/authContext';
import React from 'react';
import { phoneNumberMaskDynamic } from '@/utils/formatNumberPhone';

type CreateStoreModalProps = {
    open: boolean;// Função para chamar ao criar a loja com sucesso
};

export default function CreateStoreModal({ open }: CreateStoreModalProps) {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const [numberPhone, setNumberPhone] = useState('');
    const snapPoints = useMemo(() => ["30%", "80%"], []);
    const { updateUserHasStore } = useContext(AuthContext);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(CreateStoreSchema),
        mode: 'onSubmit',
    });

    const { mutateAsync: createStoreFn } = useMutation({
        mutationFn: CreateStore,
        onSuccess: () => {
           
            updateUserHasStore(true); 
        },
        onError: (error) => {
            console.log('Error creating store.');
            console.log(error)
        }
    });

    async function onSubmit(data: FieldValues) {
        try {
            const newData = {...data, numberPhone}
            await createStoreFn(newData)
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={open ? 1 : -1}
            snapPoints={snapPoints}
            enablePanDownToClose
            handleStyle={{
                backgroundColor: "#202020",
            }}
            handleIndicatorStyle={{
                backgroundColor: "#fff",
            }}
        >
            <BottomSheetView className="flex-1 px-5 bg-bg w-full">
                <View className="w-full h-screen-safe">
                    <Text className="text-2xl font-medium text-white mb-5 text-center mt-10">
                        Crie sua loja virtual
                    </Text>
                    <View className="mb-7">
                        <Text className="text-white mb-1">Nome da loja</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Input
                                        
                                        name="input"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.name && <Text className="text-red-500">{errors.name.message as string}</Text>}
                                </>
                            )}
                        />
                    </View>
                    <View className="mb-7">
                        <Text className="text-white mb-1">Descrição Pequena</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Input
                                        
                                        name="input"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                    {errors.description && <Text className="text-red-500">{errors.description.message as string}</Text>}
                                </>
                            )}
                        />
                    </View>
                    <View className="mb-7">
                        <Text className="text-white mb-1">Número De Contato</Text>
                        <Controller
                            control={control}
                            name="numberPhone"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <Input
                                       
                                        name="input"
                                        onBlur={onBlur}
                                        onChangeText={(text) => {
                                            const formattedText = phoneNumberMaskDynamic(text);
                                            setNumberPhone(formattedText);
                                            onChange(formattedText);
                                        }}
                                        value={numberPhone}
                                        keyboardType="numeric"
                                        returnKeyType='done'
                                        returnKeyLabel='Próximo'
                                    />
                                    {errors.numberPhone && <Text className="text-red-500">{errors.numberPhone.message as string}</Text>}
                                </>
                            )}
                        />
                    </View>

                    <Button name="Criar" onPress={handleSubmit(onSubmit)} />
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}
