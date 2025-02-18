import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { ReactNode, useContext, useState } from "react";
import AuthContext from "@/context/authContext";
import { Button } from "@/components/buttton";
import CreateStoreModal from "./components/createStoreModal";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FindStoreNameByUser } from "./services/FindStoreNameByUser";
import { RootStackParamList } from "@/types/navigation";

type StoreProps = {
    children: ReactNode;
};

export function Store({ children }: StoreProps) {

    
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList>>();
    const { user } = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isActive = (routeName: string) => {
        const screen = route.params?.screen || "Overview";
        return screen === routeName;
    };
    
    const { data: subdomain } = useQuery({
        queryKey: ["FindStoreNameByUser"],
        queryFn: FindStoreNameByUser
    })

    return (
        <View className="bg-bg h-screen w-full">
            <View>
                <Text className="text-white font-medium mt-16 text-lg text-center">
                    Minha Loja
                </Text>
            </View>
            {user?.userHasStore ? (
                <>
                    <Text className="text-primaryPrimary text-sm text-center mb-5 px-5">
                        {
                            subdomain ?
                                `${subdomain.data}.revendaja.com`
                                :
                                ''
                        }
                    </Text>
                    <View className="flex flex-row items-center justify-between px-5">
                        <TouchableOpacity onPress={() => navigation.navigate('appRoutes', {
                            screen: 'Store',
                            params: {
                                screen: 'Overview'
                            }
                        })}>
                            <Text className={`text-sm ${isActive("Overview") ? "border-b-2 border-primaryPrimary" : ""} text-white`}>
                                Overview
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('appRoutes', {
                            screen: 'Store',
                            params: {
                                screen: 'Stock'
                            }
                        })}>
                            <Text className={`text-sm ${isActive("Stock") ? "border-b-2 border-primaryPrimary" : ""} text-white`}>
                                Estoque
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('appRoutes', {
                            screen: 'Store',
                            params: {
                                screen: 'Report'
                            }
                        })}>
                            <Text className={`text-sm ${isActive("Report") ? "border-b-2 border-primaryPrimary" : ""} text-white`}>
                                Relatório
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('appRoutes', {
                            screen: 'Store',
                            params: {
                                screen: 'PedingSale'
                            }
                        })}>
                            <Text className={`text-sm ${isActive("PedingSale") ? "border-b-2 border-primaryPrimary" : ""} text-white`}>
                                Pendentes
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {children}
                </>
            ) : (
                <>
                    <View className="h-screen w-full flex justify-center px-5">
                        <Text className="text-textForenground text-center -mt-40">
                            Você ainda não tem uma loja :(
                        </Text>
                        <Button name="Criar Loja" onPress={() => setIsModalOpen(true)} />
                    </View>
                    <CreateStoreModal
                        open={isModalOpen} // Exibe animação ao criar loja
                    />
                </>
            )
            }
        </View >
    );
}
