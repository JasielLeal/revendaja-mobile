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

    const Links = [
        { id: 1, name: "Gerenciar Minha Assinatura", icon: "card", link: 'MyPlan' },
        { id: 2, name: "Assinaturas Disponíveis", icon: "star", link: 'OurPlans' },
        { id: 3, name: "Seus Dados", icon: "shield-checkmark", link: '/' },
        { id: 4, name: "Nossos Termos", icon: "reader", link: '/' },
        { id: 5, name: "Editar Loja", icon: "pencil", link: '/'},
    ]

    return (
        <>
            <View className="flex-1 bg-bg px-5">
                <View>
                    <View className='flex flex-row items-center justify-center mt-16 mb-5'>
                        <Text className='text-white font-semibold text-center'> Perfil</Text>
                    </View>
                    <View className="flex flex-row items-center gap-3  rounded-xl justify-between">
                        <View className="flex flex-row gap-3 items-center">
                            <Avatar />
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
                        <TouchableOpacity>
                            <Text className="text-red-600" onPress={() => logoutFc()}>
                                Sair
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View className="pt-5">
                    {
                        Links.map((link) => (
                            <TouchableOpacity 
                            key={link.id}
                            className="flex flex-row items-center justify-between border-b pb-4 border-[#ffffff17] pt-4"
                            onPress={()=> navigation.navigate(link.link)}
                            
                            >
                                <View className="flex flex-row items-center gap-3 ">
                                    <Icon name={link.icon} size={25} color={"#fff"} />
                                    <Text className="text-white font-medium">
                                        {link.name}
                                    </Text>
                                </View>
                                <Icon name="chevron-forward" size={20} color={"#fff"} />
                            </TouchableOpacity>
                        ))
                    }
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


            </View>
        </>
    )
}