import { Separator } from "@/components/separator";
import AuthContext from "@/context/authContext";
import { useContext } from "react";
import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/Ionicons';
export function Profile() {

    const { user, logoutFc } = useContext(AuthContext)
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView className="flex-1 bg-bg">

            <View className="px-5">
                <Text className="text-white font-medium text-lg text-center mb-5">Perfil</Text>
                <View className="flex items-center gap-5 mt-5">
                    <Image
                        source={{
                            uri: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a73f7931-dd45-46f1-8bb4-9175b0b4ede5/de6c4z0-5bdf4b63-e262-4af1-9a68-c0f924182d16.png/v1/fit/w_828,h_1038,q_70,strp/sung_jin_woo_by_dextrobluejay_de6c4z0-414w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI5NSIsInBhdGgiOiJcL2ZcL2E3M2Y3OTMxLWRkNDUtNDZmMS04YmI0LTkxNzViMGI0ZWRlNVwvZGU2YzR6MC01YmRmNGI2My1lMjYyLTRhZjEtOWE2OC1jMGY5MjQxODJkMTYucG5nIiwid2lkdGgiOiI8PTEwMzMifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Y6BzM4bVJOUP0kAnRr9gXOHMZHpVcpHMdFvJxZl8GFQ"
                        }}
                        width={90}
                        height={90}
                        className="rounded-full"
                    />
                    <View >
                        <View className="flex flex-row items-center gap-1 justify-center">
                            <Text className="text-white font-medium ">{user?.name}</Text>
                            <Text className="text-white font-medium">{user?.secondName}</Text>
                        </View>
                        <View className="mt-1">
                            <Text className="bg-primaryPrimary px-10 py-2 rounded-full text-white text-center">{user?.paymentStatus}</Text>
                        </View>
                    </View>

                </View>

                <TouchableOpacity className="flex flex-row items-center justify-between mt-16">
                    <View className="flex flex-row items-center gap-3">
                        <Icon name="shield-checkmark-outline" color={"#fff"} size={30} />
                        <Text className="text-white font-medium">Meus dados</Text>
                    </View>
                    <Icon name="chevron-forward" color={"#fff"} size={20} />
                </TouchableOpacity>

                <View className="my-7">
                    <Separator height={2} color="#383838" />
                </View>

                <TouchableOpacity className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-3">
                        <Icon name="star-outline" color={"#fff"} size={30} />
                        <Text className="text-white font-medium">Meu Plano</Text>
                    </View>
                    <Icon name="chevron-forward" color={"#fff"} size={20} />
                </TouchableOpacity>

                <View className="my-7">
                    <Separator height={2} color="#383838" />
                </View>

                <TouchableOpacity className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-3">
                        <Icon name="lock-closed-outline" color={"#fff"} size={30} />
                        <Text className="text-white font-medium">Meu Plano</Text>
                    </View>
                    <Icon name="chevron-forward" color={"#fff"} size={20} />
                </TouchableOpacity>
            </View>
            <View className="mt-auto mb-3 px-5">
                <TouchableOpacity className="bg-forenground p-4 rounded-xl mt-auto" onPress={() => logoutFc()}>
                    <Text className="text-white text-center font-medium">
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
