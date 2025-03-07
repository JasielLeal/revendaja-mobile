import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import logo from "@/assets/logo.png"
import { useMutation } from "@tanstack/react-query";
import { ForgetPassword } from "./services/ForgetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgepasswordSchema } from "./schemas/Forgetpassword";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useState } from "react";
export function Forget() {


    const [email, setEmail] = useState()

    const { mutateAsync: ForgetPasswordFn, isPending } = useMutation({
        mutationFn: ForgetPassword,
        onSuccess: () => {
            if (email) {
                navigate.navigate("VerifyCode", { email: email })
            }
        },
        onError: (e) => {
            console.log(e)
            console.log(e)
            console.log(JSON.stringify(e, null, 4))
        }
    })

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ForgepasswordSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
    });

    async function onSub(data: FieldValues) {
        setEmail(data.email)
        await ForgetPasswordFn(data)
    }

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    return (
        <>
            <View className="bg-bg w-full flex-1 px-5 items-center justify-center">
                <Image source={logo} alt="logo do site" className="w-[150px] h-[35px]" />
                <Text className="text-white mb-10">Por favor, insira seu e-mail registrado abaixo</Text>
                <View className="w-full">

                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <TextInput
                                    className="bg-[#202020] py-3 px-3 rounded-xl w-full text-white"
                                    placeholder="seuemail@gmail.com"
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

                    <View className="flex flex-row  justify-center my-5 gap-1">
                        <Text className=" text-white">
                            Quer voltar ao login?
                        </Text>
                        <TouchableOpacity className="flex flex-row items-center gap-2" onPress={() => navigate.navigate('login')}>
                            <Text className="text-end text-primaryPrimary font-medium">
                                Clique aqui
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </>
    )
}