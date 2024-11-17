import AuthContext from "@/context/authContext";
import { useContext, useState } from "react";
import { Text, View } from "react-native";
import { Notifications } from "./components/notifications";
import { Menu } from "./components/menu";
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from "react-native";
import { ForEveryDayLife } from "./components/forEveryDayLife";
import { RecentSales } from "./components/recentSales";

export function Home() {

    const { user } = useContext(AuthContext)

    const [hiddenMoney, setHiddenMoney] = useState(true)

    const toggleHiddenMoney = () => {
        setHiddenMoney(!hiddenMoney)
    }

    return (
        <>
            <View className="bg-[#121212] h-screen w-full">
                <View className="pt-16 px-7 bg-primaryPrimary pb-5 rounded-b-3xl ">
                    <View className="flex flex-row justify-between items-center w-full">
                        <View className="flex flex-row items-center gap-2">
                            
                            <View>
                                <Text className="text-white font-semibold">
                                    {user?.name} {user?.secondName}
                                </Text>
                                <Text className="text-white text-xs">
                                    {user?.email}
                                </Text>
                            </View>
                        </View>
                        <View className="flex flex-row items-center gap-5">
                            <Notifications />
                            <Menu />
                        </View>
                    </View>
                    <View className="mt-10">
                        <Text className="text-white font-semibold text-lg">
                            Saldo em conta
                        </Text>
                        {
                            hiddenMoney ?
                                <View className="flex flex-row items-center justify-between w-full">
                                    <Text className="text-white font-semibold text-lg">
                                        R$ 0,00
                                    </Text>
                                    <TouchableOpacity onPress={toggleHiddenMoney}>
                                        <Icon name="eye" size={25} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <View className="flex flex-row items-center justify-between w-full">
                                    <Text className="text-white font-semibold text-lg">
                                        R$ ***
                                    </Text>
                                    <TouchableOpacity onPress={toggleHiddenMoney}>
                                        <Icon name="eye-off" size={25} color={'#fff'} />
                                    </TouchableOpacity>
                                </View>
                        }

                    </View>
                    <View className="mt-5 bg-secondarySecondary w-[200px] p-2 rounded-full">
                        <Text className="text-center text-white font-medium">
                            Ver Extrato
                        </Text>
                    </View>
                </View>
                <ForEveryDayLife />
                <RecentSales />
            </View>
        </>
    )
}