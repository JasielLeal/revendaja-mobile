import { RootStackParamList } from "@/types/navigation";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Alert, Image, View } from "react-native";
import logo from "@/assets/logo.png"
import { Text } from "react-native";
import { Input } from "@/components/input";
import { Button } from "@/components/buttton";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema } from "./schemas/ChangePasswordSchema";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ChangePassword } from "./services/changePassword";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";

export function UpdatePassword() {

    type updatePasswordProp = RouteProp<RootStackParamList, "UpdatePassword">
    const route = useRoute<updatePasswordProp>()
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()
    const { email } = route.params;

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ChangePasswordSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
    });

    const { mutateAsync: ChangePasswordFn, isSuccess } = useMutation({
        mutationFn: ChangePassword,
        onSuccess: () => {
            navigate.navigate('login')
        },
        onError: () => {
            Alert.alert("Aconteceu algum error, contate um administrador")
        }
    })

    async function onSub(data: FieldValues) {
        if (data.newPassword != data.repeatNewPassword) {
            Alert.alert("Senhas não coincidem")
        }

        const newPassword = data.newPassword

        const newData = { newPassword, email }

        await ChangePasswordFn(newData)
    }

    return (
        <>
            {
                isSuccess ?

                    <View className="bg-bg w-full flex-1 px-5">
                        <View className="flex justify-center items-center h-screen">
                            <Image source={logo} alt="logo do site" className="w-[150px] h-[35px]" />
                            <Text className="text-white mt-3 font-medium">
                                Parabéns! A senha foi alterada com sucesso.
                            </Text>
                            <TouchableOpacity onPress={() => navigate.navigate("login")}>
                                <Text className="text-primaryPrimary mt-3">
                                    Voltar para o login
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    :
                    <View className="bg-bg w-full flex-1 px-5">
                        <View className="flex justify-center items-center h-screen">
                            <Image source={logo} alt="logo do site" className="w-[150px] h-[35px]" />
                            <Text className="text-white text-sm font-normal my-5">
                                Digite sua nova senha
                            </Text>

                            <Controller
                                control={control}
                                name='newPassword'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        name="Nova senha"
                                        placeholder="Nova senha"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name='repeatNewPassword'
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="my-5 w-full">
                                        <Input
                                            name="Nova senha"
                                            placeholder="Digite Novamente"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                )}
                            />
                            <View className="w-full">
                                <Button name="Enviar" onPress={handleSubmit(onSub)} />
                            </View>
                        </View>

                    </View>



            }
        </>
    )
}