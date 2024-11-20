import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { ScannerScreen } from "./components/ScannerScreen";
import { ProcessBankSlip } from "./components/processBankSlip";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListAllStoreByStore } from "./services/ListAllStoreByStore";
import { FlatList } from "react-native-gesture-handler";
import { formatDate } from "@/utils/formatDate";
import { Button } from "@/components/buttton";
import { formatCurrency } from "@/utils/formatCurrency";


export function Tickets() {

    const handleScan = async (code: string) => {
        try {
            const { vencimento, valor } = ProcessBankSlip(code);
            console.log(`Data de vencimento: ${vencimento}`);
            console.log(`Valor: ${valor}`);
        } catch (error) {
            console.error("Erro ao processar o boleto");
        }
    };

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
            console.log(lastPage.data?.totalPages)

            if (currentPage < lastPage.data?.totalPages) {

                return currentPage;
            } else {
                return undefined; // Para a paginação quando a última página for atingida
            }
        },
        initialPageParam: 0
    })

    const allBankSlips = data?.pages.flatMap((page) => page.data.bankSlips) || [];

    return (
        <View className="bg-bg h-screen w-full px-5">
            <View>
                <Text className="text-white font-medium mt-16 text-lg text-center mb-5">Boletos</Text>
                
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
                        <>
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
                                <View className="flex flex-row items-center justify-between mt-3">
                                    <Text className="text-white font-semibold">
                                        Valor
                                    </Text>
                                    <Text className="text-textForenground font-medium">
                                        R$ {formatCurrency(String(item?.value))}
                                    </Text>
                                </View>
                                <View className="mt-5">
                                    <Button name="Copiar codigo de barras" />
                                </View>
                            </View>
                        </>
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