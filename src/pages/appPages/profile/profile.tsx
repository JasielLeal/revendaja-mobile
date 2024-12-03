import CustomModal from "@/components/modal";
import AuthContext from "@/context/authContext";
import { useContext, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export function Profile() {

    const { user, logoutFc } = useContext(AuthContext)

    const [openModal, setOpenModal] = useState(false)

    const handleConfirm = () => {
        setOpenModal(false);
    };


    return (
        <>
            <View className="flex-1 bg-bg px-5">
                <View className='flex flex-row items-center justify-center mt-16 mb-5'>
                    <Text className='text-white font-semibold text-center'>Meu perfil</Text>
                </View>
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl">
                    <Image
                        source={{
                            uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a73f7931-dd45-46f1-8bb4-9175b0b4ede5/de6c4z0-5bdf4b63-e262-4af1-9a68-c0f924182d16.png/v1/fit/w_828,h_1038,q_70,strp/sung_jin_woo_by_dextrobluejay_de6c4z0-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI5NSIsInBhdGgiOiJcL2ZcL2E3M2Y3OTMxLWRkNDUtNDZmMS04YmI0LTkxNzViMGI0ZWRlNVwvZGU2YzR6MC01YmRmNGI2My1lMjYyLTRhZjEtOWE2OC1jMGY5MjQxODJkMTYucG5nIiwid2lkdGgiOiI8PTEwMzMifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Y6BzM4bVJOUP0kAnRr9gXOHMZHpVcpHMdFvJxZl8GFQ"
                        }}
                        width={60}
                        height={60}
                        className="rounded-full"
                    />
                    <View>
                        <View className="flex flex-row items-center gap-1">
                            <Text className="text-white font-medium">
                                {user?.name}
                            </Text>
                            <Text className="text-white font-medium">
                                {user?.secondName}
                            </Text>
                        </View>
                        <View>
                            <Text className="text-textForenground">
                                {user?.email}
                            </Text>
                        </View>
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
                <View className="flex flex-row items-center gap-3 bg-forenground p-4 rounded-xl mt-5 ">
                    <View className="flex items-center justify-between flex-row w-full">
                        <View className="flex flex-row items-center gap-1">
                            <Icon name="star" size={20} color={"#fff"} />
                            <Text className="text-white font-medium">
                                Meu plano
                            </Text>
                        </View>
                        <Icon name='chevron-forward' size={20} color={"#fff"} />
                    </View>
                </View>
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