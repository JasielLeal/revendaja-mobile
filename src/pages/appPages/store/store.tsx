import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { ReactNode, useContext } from "react";
import AuthContext from "@/context/authContext";
import { Button } from "@/components/buttton";

// Definindo as rotas para o TypeScript (adicione ou remova conforme necessário)
type RootStackParamList = {
    Overview: undefined;
    Stock: undefined;
    Report: undefined;
    Promotions: undefined;
};

type StoreProps = {
    children: ReactNode;
};

export function Store({ children }: StoreProps) {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList>>();



    // Função para verificar se a rota está ativa
    const isActive = (routeName: keyof RootStackParamList) => route.name === routeName;
    const { user } = useContext(AuthContext)
    return (
        <View className="bg-bg h-screen w-full px-5">
            <View>
                <Text className="text-white font-medium mt-16 text-lg text-center">
                    Minha Loja
                </Text>
            </View>
            {
                user?.userHasStore ?

                    <>
                        <Text className="text-primaryPrimary text-sm text-center mb-5">
                            www.lealperfumaria.revendaja.com
                        </Text>
                        <View className="flex flex-row items-center justify-between">
                            <TouchableOpacity onPress={() => navigation.navigate("Overview")}>
                                <Text
                                    className={`text-sm ${isActive("Overview") ? "border-b-2 border-primaryPrimary" : ""} text-white`}
                                >
                                    Overview
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Stock")}>
                                <Text
                                    className={`text-sm ${isActive("Stock") ? "border-b-2 border-primaryPrimary" : ""} text-white`}
                                >
                                    Estoque
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Report")}>
                                <Text
                                    className={`text-sm ${isActive("Report") ? "border-b-2 border-primaryPrimary" : ""} text-white`}
                                >
                                    Relatório
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Promotions")}>
                                <Text
                                    className={`text-sm ${isActive("Promotions") ? "border-b-2 border-primaryPrimary" : ""} text-white`}
                                >
                                    Promoções
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* Renderiza o conteúdo da rota ativa */}
                        {children}
                    </>

                    :

                    <>
                        <View className="h-screen w-full flex justify-center ">
                            <Text className="text-textForenground text-center -mt-40">
                                Você ainda não tem uma loja :(
                            </Text>
                            <Button name={"Criar Loja"} />
                        </View>
                    </>
            }
        </View>
    );
}
