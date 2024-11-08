import { View, Image, Text, TextInput, TouchableOpacity } from "react-native";
import logo from "@/assets/LogoWhite - Completa.png"
import Icon from 'react-native-vector-icons/Ionicons'

export function VerifyCode() {
    return (
        <>
            <View className="bg-bg w-full h-screen px-5">
                <View className="flex justify-center items-center h-screen">
                    <Image source={logo} alt="logo do site" className="w-[185px] h-[35px]" />

                    <Text className="text-sm text-white font-normal mt-7">
                        Enviamos-te um codigo para
                    </Text>
                    <Text className="text-sm text-white font-medium">
                        jasieloficial@hotmail.com
                    </Text>

                    <Text className="text-white text-sm font-normal my-5">
                        Digite o codigo de 6 digitos que enviamos
                    </Text>
                    <TextInput
                        className="bg-[#202020] py-3 px-3 rounded-xl w-full text-white"
                        placeholderTextColor={'#7D7D7D'}
                        keyboardType="number-pad"
                    />

                    <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-5 w-full">
                        <Text className="text-center font-medium text-white">
                            Entrar
                        </Text>
                    </TouchableOpacity>

                    <View>
                        <TouchableOpacity className="flex items-end my-5 justify-center flex-row gap-2">
                            <Text className="text-center text-primaryPrimary font-medium">
                                Enviar novamente o codigo
                            </Text>
                            <Text className="text-center text-primaryPrimary font-medium">
                                <Icon name="reload" size={15}/>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}