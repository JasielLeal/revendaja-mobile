import CustomModal from "@/components/modal";
import AuthContext from "@/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DisableAccount } from "./services/DisabledAccount";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Avatar } from "@/components/avatart";

export function Profile() {

    const { user, logoutFc } = useContext(AuthContext)

    const [openModal, setOpenModal] = useState(false)

    async function handleConfirm() {
        await DisableAccountFn()
        setOpenModal(false);
    };

    const { mutateAsync: DisableAccountFn } = useMutation({
        mutationFn: DisableAccount,
        onSuccess: () => {
            logoutFc()
        },
        onError: () => {
            console.log("Deu algum error")
        }
    })

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

    return (
        <>
            <View className="flex-1 bg-bg px-5">
                <View className='flex flex-row items-center justify-center mt-16 mb-5'>
                    <Text className='text-white font-semibold text-center'>Meu perfil</Text>
                </View>
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl">
                    <Avatar/>
                    <View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="text-white font-medium">
                                {user?.name}
                            </Text>
                            <Text className="text-white font-medium">
                                {user?.secondName}
                            </Text>
                        </View>
                        <Text className="text-primaryPrimary">
                            {user?.plan}
                        </Text>
                    </View>
                </View>
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl mt-5 ">
                    <View className="flex items-center justify-between flex-row w-full">
                        <View className="flex flex-row items-center gap-1">
                            <Icon name="extension-puzzle" size={20} color={"#fff"} />
                            <Text className="text-white font-medium">
                                Suporte
                            </Text>
                        </View>
                        <Icon name='chevron-forward' size={20} color={"#fff"} />
                    </View>
                </View>
                <TouchableOpacity className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl mt-5 " onPress={() => navigation.navigate('OurPlans')}>
                    <View className="flex items-center justify-between flex-row w-full">
                        <View className="flex flex-row items-center gap-1">
                            <Icon name="star" size={20} color={"#fff"} />
                            <Text className="text-white font-medium">
                                Nossos Planos
                            </Text>
                        </View>
                        <Icon name='chevron-forward' size={20} color={"#fff"} />
                    </View>
                </TouchableOpacity>
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl mt-5 ">
                    <View className="flex items-center justify-between flex-row w-full">
                        <View className="flex flex-row items-center gap-1">
                            <Icon name="document-attach" size={20} color={"#fff"} />
                            <Text className="text-white font-medium">
                                Termos de Uso e Privacidade
                            </Text>
                        </View>
                        <Icon name='chevron-forward' size={20} color={"#fff"} />
                    </View>
                </View>
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl mt-5 ">
                    <TouchableOpacity className="flex items-center justify-between flex-row w-full" onPress={() => setOpenModal(true)}>
                        <View className="flex flex-row items-center gap-1">
                            <Icon name="trash" size={20} color={"#dc2626"} />
                            <Text className="text-red-600 font-medium">
                                Deletar conta
                            </Text>
                        </View>
                        <Icon name='chevron-forward' size={20} color={"#dc2626"} />
                    </TouchableOpacity>
                </View>

                <CustomModal
                    visible={openModal}
                    onClose={() => setOpenModal(false)}
                    title="Deseja deletar sua conta?"
                    onConfirm={handleConfirm}
                    confirmText="Confirmar"
                >
                    <Text className="text-white">Essa ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.</Text>
                </CustomModal>

                <View className="mt-auto mb-5">
                    <TouchableOpacity className="bg-forenground p-4 rounded-xl mt-auto" onPress={() => logoutFc()}>
                        <Text className="text-white text-center font-medium">
                            Sair
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}