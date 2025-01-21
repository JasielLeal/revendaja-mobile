import { Button } from "@/components/buttton";
import { Input } from "@/components/input";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertCustomProductToStockSchema } from "../schemas/InsertCustomProductToStockSchema";
import { QuantityInput } from "@/components/QuantityInput";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertCustomProductToStock } from "../services/insertCustomProductToStock";
import Toast from "react-native-toast-message";

export function AddCustomProductToStock() {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    useEffect(() => {
        const requestPermission = async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permissão para acessar a galeria é necessária!');
            }
        };

        requestPermission(); // Chama a função assíncrona
    }, []);

    const [image, setImage] = useState<string | null>(null);

    // Abrir a galeria para selecionar uma imagem
    async function openGallery() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Armazena o URI da imagem
        }
    }

    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(InsertCustomProductToStockSchema),
        mode: 'onSubmit',
    });


    const { mutateAsync: InserCustomProductToStockFn, isPending } = useMutation({
        mutationFn: InsertCustomProductToStock,
        onSuccess: (response) => {
            queryClient.invalidateQueries(["GetStock"] as InvalidateQueryFilters);
            navigation.navigate('appRoutes', {
                screen: 'Store',
                params: {
                    screen: 'Stock'
                }
            });
            Toast.show({
                type: 'error',
                text1: 'Sucesso',
                text2: response.data.message
            });
        },
        onError: () => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Houve algum problema em cadastra o produto'
            });
        }
    })

    async function onSub(data: FieldValues) {

        if (!image) {
            Alert.alert("Error", "Adicione uma imagem para seu produto.")
            return
        }

        const newData = { ...data, image }

        await InserCustomProductToStockFn(newData)
    }

    if (isPending) {
        return <View className="flex-1 bg-bg flex justify-center">
            <ActivityIndicator size="large" color={"#FF7100"} />
        </View>
    }

    return (

        <View className="bg-bg flex-1 w-full px-5 justify-between" >
            <View>
                <View className='flex flex-row justify-between mt-16'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-back' size={20} color={"#fff"} />
                    </TouchableOpacity>
                    <Text className='text-white font-semibold'>Adicionar Produto Customizado</Text>
                    <TouchableOpacity className="w-[30px]">
                    </TouchableOpacity>
                </View>

                <View className="mt-5">
                    <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-2 text-sm"}>
                        Nome
                    </Text>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                name="Nome do produto"
                                placeholder="Nome do produto"
                                placeholderTextColor="#7D7D7D"

                                onChangeText={onChange}
                                value={value}
                                returnKeyType="done"
                            />
                        )}
                    />
                    <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-4 mt-2 text-sm"}>
                        Descrição
                    </Text>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                name="Pequena descrição do produto"
                                placeholder="Pequena descrição do produto"
                                placeholderTextColor="#7D7D7D"
                                onChangeText={onChange}
                                value={value}
                                returnKeyType="done"
                            />
                        )}
                    />
                    <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-4 mt-2 text-sm"}>
                        Codigo de barras
                    </Text>

                    <Controller
                        control={control}
                        name="barcode"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                name="Adicione um codigo de barras "
                                placeholder="Adicione um codigo de barras"
                                placeholderTextColor="#7D7D7D"
                                onChangeText={onChange}
                                value={value}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        )}
                    />


                    <View className="mt-5 flex flex-row justify-between w-full">
                        <View className="w-2/5">
                            <View className="flex flex-row items-center justify-between mb-2 ">
                                <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-2 mt-2 text-sm"}>
                                    Preço Original
                                </Text>
                                <TouchableOpacity className="bg-primaryPrimary px-[9] py-1 rounded-full">
                                    <Text className="text-white text-sm">
                                        ?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Controller
                                control={control}
                                name="normalPrice"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        name="R$ 199,99"
                                        placeholder="R$ 199,99"
                                        placeholderTextColor="#7D7D7D"
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                    />
                                )}
                            />
                        </View>
                        <View className="w-2/5">
                            <View className="flex flex-row items-center justify-between mb-2 ">
                                <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-2 mt-2 text-sm"}>
                                    Preço Atual
                                </Text>
                                <TouchableOpacity className="bg-primaryPrimary px-[9] py-1 rounded-full">
                                    <Text className="text-white text-sm">
                                        ?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Controller
                                control={control}
                                name="suggestedPrice"
                                render={({ field: { onChange, value } }) => (
                                    <Input
                                        name="R$ 99,99"
                                        placeholder="R$ 99,99"
                                        placeholderTextColor="#7D7D7D"
                                        onChangeText={onChange}
                                        value={value}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                    />
                                )}
                            />
                        </View>
                    </View>

                    <View className="w-full">
                        <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-4 mt-4 text-sm"}>
                            Quantidade do estoque
                        </Text>
                        <Controller
                            control={control}
                            name="quantity"
                            render={({ field: { value, onChange } }) => (
                                <QuantityInput onQuantityChange={onChange} initialQuantity={value} />
                            )}
                        />

                    </View>

                    <View>
                        <Text className={Platform.OS == 'ios' ? "text-white font-medium mb-2 text-lg" : "text-white font-medium mb-4 mt-2 text-sm"}>
                            Adicione uma imagem
                        </Text>
                        <TouchableOpacity className="text-white font-medium text-lg bg-forenground p-4 rounded-xl flex items-center justify-center" onPress={openGallery}>
                            <Icon name='camera' size={20} color={"#fff"} />
                        </TouchableOpacity>

                    </View>

                </View>
            </View>

            <View className={Platform.OS === 'ios' ? `mb-16` : `mb-${insets.bottom + 10}`}>
                <Button name="Cadastrar" onPress={handleSubmit(onSub)} />
            </View>
        </View >

    )
}