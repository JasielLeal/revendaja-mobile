import { View, Image, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import logo from "@/assets/logo.png"
import Icon from 'react-native-vector-icons/Ionicons'
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema } from "./schemas/VerifyEmailSchema ";
import { useMutation } from "@tanstack/react-query";
import { VerificationCode } from "./services/VerificationCode";
import { StackNavigationProp } from "@react-navigation/stack";


export function VerifyCode() {

    type verifyCode = RouteProp<RootStackParamList, "VerifyCode">
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()
    const route = useRoute<verifyCode>()

    const { email } = route.params;

    const setEmail = email


    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(VerifyEmailSchema),
        mode: 'onSubmit', // Validação será feita apenas no envio do formulário
    });

    const { mutateAsync: VerificationCodeFn } = useMutation({
        mutationFn: VerificationCode,
        onSuccess: () => {
            navigate.navigate('UpdatePassword', { email: setEmail })
        },
        onError: () => {

        }
    })

    async function onSub(data: FieldValues) {
        const newData = { ...data, email }
        await VerificationCodeFn(newData)
    }

    return (

        <View className="bg-bg w-full flex-1 px-5">
            <View className="flex justify-center items-center h-screen">
                <Image source={logo} alt="logo do site" className="w-[150px] h-[35px]" />

                <Text className="text-sm text-white font-normal mt-7">
                    Enviamos-te um codigo para
                </Text>
                <Text className="text-sm text-white font-medium">
                    {email}
                </Text>

                <Text className="text-white text-sm font-normal my-5">
                    Digite o codigo de 6 digitos que enviamos
                </Text>

                <Controller
                    control={control}
                    name='code'
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            className="bg-[#202020] py-3 px-3 rounded-xl w-full text-white"
                            placeholderTextColor={'#7D7D7D'}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />

                <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5 w-full" onPress={handleSubmit(onSub)}>
                    <Text className="text-center font-medium text-white">
                        Enviar
                    </Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity className="flex items-end my-5 justify-center flex-row gap-2">
                        <Text className="text-center text-primaryPrimary font-medium">
                            Enviar novamente o codigo
                        </Text>
                        <Text className="text-center text-primaryPrimary font-medium">
                            <Icon name="reload" size={15} />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}