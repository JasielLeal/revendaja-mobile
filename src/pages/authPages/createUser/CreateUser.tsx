import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { CreateUserSchema } from "./schemas/CreateUserSchema";
import { useMutation } from "@tanstack/react-query";
import { UserCreation } from "./service/UserCreation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Platform, TextInput, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { Image } from "react-native";
import logo from "@/assets/logo.png"
import { useState } from "react";
import React from "react";
import { InputHidden } from "@/components/inputHidden";


export function CreateUser() {

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(CreateUserSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
    });
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()
    const [routeEmail, setRouteEmail] = useState()

    const { mutateAsync: UserCreationFn, isPending } = useMutation({
        mutationFn: UserCreation,
        onSuccess: () => {
            if (routeEmail) {
                navigate.navigate("emailConfirmation", { email: routeEmail });
            }
        },
        onError: (e) => {
            console.log(e)
            console.log(e)
            console.log(JSON.stringify(e, null, 4))
        }
    })

    async function onSub(data: FieldValues) {
        setRouteEmail(data.email)
        await UserCreationFn(data)
    }


    return (

        <View className="bg-bg w-full flex-1 px-5 items-center justify-center">
            <Image source={logo} alt="logo do site" className="w-[150px] h-[35px]" />
            <Text className="text-white mb-5">Por favor, forneça as informações solicitadas abaixo</Text>
            <View className="w-full">

                <View className="mt-5">
                    <Text className="text-base text-white font-normal mb-1">
                        Nome
                    </Text>
                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    className={Platform.OS == 'ios' ? "bg-[#202020] py-4 px-4 rounded-xl w-full text-white" : "bg-[#202020] py-3 px-3 rounded-xl w-full text-white"}

                                    placeholderTextColor={'#7D7D7D'}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.email && <Text className="text-red-500">{errors.email.message as string}</Text>}
                            </>
                        )}
                    />
                </View>


                <View className="mt-5">
                    <Text className="text-base text-white font-normal mb-1">
                        Sobrenome
                    </Text>
                    <Controller
                        control={control}
                        name='secondName'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    className={Platform.OS == 'ios' ? "bg-[#202020] py-4 px-4 rounded-xl w-full text-white" : "bg-[#202020] py-3 px-3 rounded-xl w-full text-white"}

                                    placeholderTextColor={'#7D7D7D'}
                                    keyboardType="email-address"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.email && <Text className="text-red-500">{errors.email.message as string}</Text>}
                            </>
                        )}
                    />
                </View>

                <View className="mt-5">
                    <Text className="text-base text-white font-normal mb-1">
                        Email
                    </Text>
                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    className={Platform.OS == 'ios' ? "bg-[#202020] py-4 px-4 rounded-xl w-full text-white" : "bg-[#202020] py-3 px-3 rounded-xl w-full text-white"}

                                    placeholderTextColor={'#7D7D7D'}
                                    keyboardType="email-address"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.email && <Text className="text-red-500">{errors.email.message as string}</Text>}
                            </>
                        )}
                    />
                </View>

                <View className="mt-5">
                    <Text className="text-base text-white font-normal mb-1">
                        Senha
                    </Text>
                    <Controller
                        control={control}
                        name='password'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <InputHidden
                                    className={Platform.OS == 'ios' ? "bg-[#202020] py-4 px-4 rounded-xl w-full text-white" : "bg-[#202020] py-3 px-3 rounded-xl w-full text-white"}
                                    name="password"
                                    placeholderTextColor={'#7D7D7D'}
                                    keyboardType="default"
                                    secureTextEntry
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                                {errors.email && <Text className="text-red-500">{errors.email.message as string}</Text>}
                            </>
                        )}
                    />

                </View>


                <View className="mt-5 flex-row items-center">
                    <Controller
                        control={control}
                        name="acceptTerms"
                        render={({ field: { onChange, value } }) => (
                            <View className="flex w-full">
                                <TouchableOpacity
                                    onPress={() => onChange(!value)}
                                    className="flex-row items-center"
                                >
                                    <View
                                        className={`w-5 h-5 rounded-md border-2 ${value ? "bg-primaryPrimary border-primaryPrimary" : "border-gray-500"
                                            }`}
                                    />
                                    <Text className="ml-3 text-white">
                                        Eu li e aceito os{" "}
                                        <Text
                                            className="text-primaryPrimary underline"
                                            onPress={() => navigate.navigate("login")}
                                        >
                                            Termos e Condições
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                                {errors.acceptTerms && <Text className="text-red-500">{errors.acceptTerms.message as string}</Text>}
                            </View>
                        )}

                    />

                </View>

                {
                    isPending ?
                        <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5" onPress={handleSubmit(onSub)} disabled>
                            <ActivityIndicator size={17} color={"#fff"} />
                        </TouchableOpacity>

                        :

                        <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5" onPress={handleSubmit(onSub)}>
                            <Text className="text-center font-medium text-white">
                                Enviar
                            </Text>
                        </TouchableOpacity>


                }

                <View className="flex flex-row  justify-center my-5">
                    <TouchableOpacity className="flex flex-row items-center gap-2" >
                        <Text className=" text-white">
                            Quer voltar ao login?
                        </Text>
                        <Text className="text-end text-primaryPrimary font-medium">
                            Clique aqui
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View >

    )
}