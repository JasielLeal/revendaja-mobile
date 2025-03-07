import { NotificationsContext } from "@/context/notificationsContext";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useContext } from "react";
import { FlatList } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

export function Notifications() {

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()
    const { notifications, clearNotifications, markAsRead, } = useContext(NotificationsContext);

    return (
        <>
            <View className="flex-1 bg-[#121212] px-5">
                <View>
                    <View className="flex flex-row items-center mt-16 mb-5 justify-between">
                        <TouchableOpacity onPress={() => navigate.goBack()}>
                            <Icon name="chevron-back" color={"#fff"} size={20} />
                        </TouchableOpacity>
                        <Text className="text-white font-medium text-lg text-center ">Notificações</Text>
                        <TouchableOpacity onPress={clearNotifications} >
                            <Icon name="mail-open-outline" color={"#fff"} size={20} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id}
                        style={{ marginBottom: 80 }}
                        renderItem={({ item }) => (
                            <View className="bg-forenground p-3 rounded-xl mb-4">
                                <View className="flex flex-row items-center justify-between mb-4">
                                    <Text className="text-white font-semibold ">{item.title}</Text>
                                    <Text className="text-white">
                                        {new Date(item.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                    </Text>
                                </View>
                                <View>
                                    <Text className="text-textForenground">{item.body}</Text>
                                </View>
                                {!item.isRead && <Text className="text-primaryPrimary mt-2">• Não Lida</Text>}
                            </View>
                        )}
                    />
                </View>
            </View>
        </>
    )
}