import { ImageBackground, View, Image, Text, TextInput,TouchableOpacity } from "react-native";
import bg from '@/assets/bg.png';
import logo from "@/assets/LogoWhite - Completa.png"

export function Login() {
    return (
        <>
            <ImageBackground
                source={bg}
                className="flex-1 justify-end h-screen items-center w-full"
                resizeMode="cover"
            >
                <View className="w-full items-center mb-28 px-5">
                    <Image source={logo} alt="logo do site" className="w-[285px] h-[55px]" />
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
                        <Text
                            className="text-base text-white font-normal mt-5 mb-2"
                        >
                            Senha
                        </Text>
                        <TextInput
                            className="bg-[#202020] py-3 px-3 rounded-xl w-full text-white"
                            placeholder="Sua senha"
                            placeholderTextColor={'#7D7D7D'}
                            keyboardType="default"
                            secureTextEntry
                        />

                        <View>
                            <TouchableOpacity className="flex items-end my-5 ">
                                <Text className="text-end text-primaryPrimary font-medium">
                                    Esqueceu a senha?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity className="bg-primaryPrimary py-3 px-3 rounded-xl mt-2">
                            <Text className="text-center font-medium text-white">
                                Entrar
                            </Text>
                        </TouchableOpacity>

                        <View className="flex  flex-row gap-1 justify-center my-5">
                            <Text className="text-white">
                                Não tem conta?
                            </Text>
                            <TouchableOpacity className="flex items-end ">
                                <Text className="text-end text-primaryPrimary font-medium">
                                    Criar gratuitamente
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
}
