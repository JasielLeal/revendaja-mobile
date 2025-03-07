import { View, Image, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import logo from "@/assets/logo.png"
import Icon from 'react-native-vector-icons/Ionicons'
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { useMutation } from "@tanstack/react-query";
import { VerifyCode } from "./services/verifyCode";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { VerifyEmailSchema } from "./schemas/VerifyEmailSchema ";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import InputOPT from "@/components/inputOPT";

export function EmailConfirmation() {


    type EmailConfirmationRouteProp = RouteProp<RootStackParamList, "emailConfirmation">;
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    const route = useRoute<EmailConfirmationRouteProp>();
    const { email } = route.params;

    const { mutateAsync: VerifyCodeFn } = useMutation({
        mutationFn: VerifyCode,
        onSuccess: () => {
            Alert.alert(
                "Sucesso",
                "O e-mail foi confirmado com sucesso.",
                [
                    {
                        text: "Voltar para login",
                        onPress: () => navigate.navigate("login"),
                    },
                ]
            );
        },
        onError: () => {

        }
    })

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(VerifyEmailSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
    });

    async function onSub(data: FieldValues) {

        const newData = { ...data, email }
        await VerifyCodeFn(newData)

    }

    return (
        <>
            <View className="bg-bg w-full h-screen px-5 flex-1">
                <View className="flex justify-center items-center h-screen">
                    <Image source={logo} alt="logo do site" className="w-[150px] h-[35px] " />

                    <Text className="text-sm text-white font-normal mt-7">
                        Enviamos-te um codigo para
                    </Text>
                    <Text className="text-sm text-white font-medium">
                        {email}
                    </Text>

                    <Text className="text-white text-sm font-normal ">
                        Digite o codigo de 6 digitos que enviamos
                    </Text>

                    <Controller
                        control={control}
                        name='code'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputOPT
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                    />



                    <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5 w-full" onPress={handleSubmit(onSub)}>
                        <Text className="text-center font-medium text-white">
                            Entrar
                        </Text>
                    </TouchableOpacity>


                </View>
            </View>
        </>
    )
}