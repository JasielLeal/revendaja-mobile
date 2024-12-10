import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListAllStoreByStore } from "./services/ListAllStoreByStore";
import { FlatList } from "react-native-gesture-handler";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

export function Tickets() {

    const [activeButton, setActiveButton] = useState<string>("Todos");

    const buttons = ["Todos", "A vencer", "Vencidos"];

    const pageSize = 10

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["ListAllStoreByStore"],
        queryFn: ({ pageParam = 0 }) => {
            return ListAllStoreByStore({ pageSize, page: pageParam + 1 })
        },
        getNextPageParam: (lastPage, allPages) => {
            const currentPage = allPages.length;

            if (currentPage < lastPage.data?.totalPages) {

                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página for atingida
            }
        },
        initialPageParam: 0
    })

    const allBankSlips = data?.pages.flatMap((page) => page.data.bankSlips) || []
    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    function handlePress(ticket: any) {
        navigate.navigate('TicketsDetails', { ticket })
    }

    return (
        <View className="bg-bg flex-1 w-full px-5">
            <View>
                <View className="flex flex-row items-center mt-16 mb-5 justify-between">
                    <TouchableOpacity onPress={() => navigate.navigate("appRoutes")}>
                        <Icon name="chevron-back" color={"#fff"} size={20} />
                    </TouchableOpacity>
                    <Text className="text-white font-medium text-lg text-center ">Boletos</Text>
                    <TouchableOpacity onPress={() => navigate.navigate('AddBankSlip')}>
                        <Icon name="add" color={"#fff"} size={20} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
                    {buttons.map((button) => (
                        <TouchableOpacity
                            key={button}
                            onPress={() => setActiveButton(button)}
                            style={{
                                padding: 10,
                                borderRadius: 10,
                                backgroundColor: activeButton === button ? "#FF7100" : "",
                                borderColor: activeButton === button ? "" : "#ADADAD",
                                borderWidth: 1,
                                width: 90,
                                height: 40,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <Text style={{ color: activeButton === button ? "#fff" : "#ADADAD" }}>
                                {button}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View>
                <FlatList
                    data={allBankSlips}
                    keyExtractor={(item) => item.id}
                    style={{ marginBottom: 180 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handlePress(item)}>
                            <View className="bg-forenground p-3 mt-5 rounded-xl">
                                <View className="flex flex-row">
                                    <Text className="text-white bg-primaryPrimary p-2 rounded-xl">
                                        {item.companyName}
                                    </Text>
                                    <Text>

                                    </Text>
                                </View>
                                <View className="flex flex-row items-center justify-between mt-3">
                                    <Text className="text-white font-semibold">
                                        Vencimento
                                    </Text>
                                    <Text className="text-textForenground font-medium">
                                        {formatDate(item.dueDate)}
                                    </Text>
                                </View>
                                <View className="flex flex-row items-center justify-between mt-4">
                                    <Text className="text-white font-semibold">
                                        Valor
                                    </Text>
                                    <Text className="text-textForenground font-medium">
                                        R$ {formatCurrency(String(item?.value))}
                                    </Text>
                                </View>
                                <View className="flex flex-row items-center justify-between mt-3">
                                    <Text className="text-white font-semibold">
                                        Status
                                    </Text>
                                    <Text className="bg-green-500 p-2 text-bg rounded-full">
                                        A vencer
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    onEndReached={() => {
                        if (hasNextPage) {
                            fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={1}
                    ListFooterComponent={() => {
                        if (isFetchingNextPage) {
                            return <ActivityIndicator size="small" color={"#FF7100"} />
                        } else {
                            return null;
                        }
                    }}
                />
            </View>
        </View>
    )
}