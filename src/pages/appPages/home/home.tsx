import AuthContext from "@/context/authContext";
import { useContext, useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from "react-native";
import { ForEveryDayLife } from "./components/forEveryDayLife";
import { RecentSales } from "./components/recentSales";
import { useQuery } from "@tanstack/react-query";
import { CalculateMonthlyBalance } from "./services/calculateMonthlyBalance";
import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";
import { NotificationsScreen } from "./components/notificationsScreen";
import { useNotification } from "@/context/NotificationContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { Avatar } from "@/components/avatart";

export function Home() {

    const { user } = useContext(AuthContext)

    const [hiddenMoney, setHiddenMoney] = useState(false)

    const toggleHiddenMoney = () => {
        setHiddenMoney(!hiddenMoney)
    }

    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');

    const { data: monthAmount } = useQuery({
        queryKey: ["CalculateMonthlyBalance", month],
        queryFn: () => CalculateMonthlyBalance(month)
    })

    const { clearNotifications } = useNotification()
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    return (
        <>
            <View className="bg-[#121212] h-screen w-full">
                <View className="pt-16 px-7 bg-primaryPrimary pb-5 rounded-b-3xl ">
                    <View className="flex flex-row justify-between items-center w-full">
                        <View className="flex flex-row items-center gap-2">
                            <Avatar/>
                            <View>
                                <Text className="text-white font-semibold">
                                    {user?.name} {user?.secondName}
                                </Text>
                                <Text className="text-white text-xs">
                                    {user?.email}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity className="flex flex-row items-center gap-5" onPress={clearNotifications}>
                            <NotificationsScreen />
                        </TouchableOpacity>
                    </View>
                    <View className="mt-10">
                        {
                            Platform.OS == 'ios' ?

                                <Text className="text-white font-semibold text-lg">
                                    Saldo em conta
                                </Text>
                                :
                                <Text className="text-white font-semibold text-sm">
                                    Saldo em conta
                                </Text>
                        }
                        {
                            hiddenMoney ?
                                Platform.OS == 'ios' ?

                                    <View className="flex flex-row items-center justify-between w-full">
                                        <Text className="text-white font-semibold text-lg">
                                            R$ {formatCurrency(String(monthAmount))}
                                        </Text>
                                        <TouchableOpacity onPress={toggleHiddenMoney}>
                                            <Icon name="eye" size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>

                                    :

                                    <View className="flex flex-row items-center justify-between w-full">
                                        <Text className="text-white font-semibold">
                                            R$ {formatCurrency(String(monthAmount))}
                                        </Text>
                                        <TouchableOpacity onPress={toggleHiddenMoney}>
                                            <Icon name="eye" size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>
                                :
                                Platform.OS == 'ios' ?

                                    <View className="flex flex-row items-center justify-between w-full">
                                        <Text className="text-white font-semibold text-lg">
                                            R$ ***
                                        </Text>
                                        <TouchableOpacity onPress={toggleHiddenMoney}>
                                            <Icon name="eye-off" size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View className="flex flex-row items-center justify-between w-full">
                                        <Text className="text-white font-semibold">
                                            R$ ***
                                        </Text>
                                        <TouchableOpacity onPress={toggleHiddenMoney}>
                                            <Icon name="eye-off" size={25} color={'#fff'} />
                                        </TouchableOpacity>
                                    </View>
                        }

                    </View>
                    {
                        Platform.OS == 'ios' ?
                            <View className="mt-5 bg-secondarySecondary w-[200px] p-2 rounded-full">
                                <Text className="text-center text-white font-medium" onPress={() => navigate.navigate("Extract")}>
                                    Ver Extrato
                                </Text>
                            </View>
                            :
                            <View className="mt-5 bg-secondarySecondary w-[180px] p-2 rounded-full">
                                <Text className="text-center text-white font-medium text-sm">
                                    Ver Extrato
                                </Text>
                            </View>
                    }
                </View>
                <ForEveryDayLife />
                <RecentSales />

            </View>
        </>
    )
}