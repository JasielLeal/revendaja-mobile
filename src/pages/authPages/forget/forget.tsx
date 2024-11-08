import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import logo from "@/assets/LogoWhite - Completa.png"
import Icon from 'react-native-vector-icons/Ionicons'
export function Forget() {
    return (
        <>
            <View className="bg-bg w-full h-screen px-5 items-center justify-center">
                <Image source={logo} alt="logo do site" className="w-[185px] h-[35px]" />
                <Text className="text-xl font-medium text-white text-center mt-5 ">Redefina sua senha</Text>
                <Text className="text-gray-200 text-sm mb-5">Por favor, insira seu e-mail para redefinir a senha</Text>
                <View className="w-full">
                    <Text
                        className="text-base text-white font-normal mt-7 mb-2"
                    >
                        Email
                    </Text>
                    <TextInput
                        className="bg-[#202020] py-3 px-3 rounded-xl w-full text-white"
                        placeholder="seuemail@gmail.com"
                        placeholderTextColor={'#7D7D7D'}
                    />
                    <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5">
                        <Text className="text-center font-medium text-white">
                            Entrar
                        </Text>
                    </TouchableOpacity>

                    <View className="flex flex-row  justify-center my-5">
                        <TouchableOpacity className="flex flex-row items-center gap-2">
                            <Text className=" text-primaryPrimary">
                                <Icon name="arrow-back"/>
                            </Text>
                            <Text className="text-end text-primaryPrimary font-medium">
                                Voltar para login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        </>
    )
}