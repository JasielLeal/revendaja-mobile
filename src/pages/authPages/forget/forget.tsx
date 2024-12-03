import { View, Image, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import logo from "@/assets/logo.png"
import { useMutation } from "@tanstack/react-query";
import { ForgetPassword } from "./services/ForgetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgepasswordSchema } from "./schemas/Forgetpassword";
import { Controller, FieldValues, useForm } from "react-hook-form";
export function Forget() {

    const { mutateAsync: ForgetPasswordFn, isPending } = useMutation({
        mutationFn: ForgetPassword,
        onSuccess: () => {

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
        await ForgetPasswordFn(data)
    }


    return (
        <>
            <View className="bg-bg w-full h-screen px-5 items-center justify-center">
                <Image source={logo} alt="logo do site" className="w-[185px] h-[35px]" />
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
        </>
    )
}