import { useQuery } from "@tanstack/react-query";
import React from "react";
import { SubscriptionDetails } from "./services/SubscriptionDetails";
import { TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function MyPlan() {

    const { data } = useQuery({
        queryKey: ["SubscriptionDetails"],
        queryFn: SubscriptionDetails
    })

    const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

    if (!data) {
        return
    }

    const planName =
        data.amount == null
            ? "Free"
            : data.amount == "29.99"
                ? "Starter"
                : data.amount == "49.99"
                    ? "Exclusive"
                    : "Unknown";

    return (
        <View className="flex-1 bg-bg px-5">
            <View className="flex flex-row items-center mt-16 mb-5 justify-between">
                <TouchableOpacity onPress={() => navigate.goBack()}>
                    <Icon name="chevron-back" color={"#fff"} size={20} />
                </TouchableOpacity>
                <Text className="text-white font-medium text-lg text-center ">Minhas Assinaturas</Text>
                <TouchableOpacity className="w-[25px]">
                </TouchableOpacity>
            </View>


            <View className="bg-forenground p-4 rounded-lg">
                <View className='flex flex-row items-center gap-1'>
                    <Text className="text-primaryPrimary text-xl font-medium">
                        {planName}
                    </Text>
                    <Text className="text-white text-sm">
                        / Atual
                    </Text>
                </View>
                <View >
                    <Text className="text-textForenground mt-2">
                        O ponto de partida perfeito para explorar tudo o
                        que nossa aplicação tem a oferecer!
                    </Text>
                </View>
            </View>

            {
                data.length = 0 ?

                    ''
                    :
                    <>
                        <Text className="text-white font-medium my-7">
                            Detalhes do pagamento
                        </Text>

                        <View className="bg-forenground rounded-lg p-4">
                            <View className=" flex flex-row items-center gap-3">
                                <Text className="text-white font-medium">
                                    Cartão:
                                </Text>
                                <Text className="text-textForenground">**********{data?.last4}</Text>
                            </View>
                            <View className="flex flex-row items-center gap-3 mt-5">
                                <Text className="text-white font-medium">
                                    Renovação:
                                </Text>
                                <Text className="text-textForenground capitalize">
                                    {format(data.nextPaymentDate, "d 'de' MMMM, yyyy '", { locale: ptBR })}

                                </Text>
                            </View>
                            <View className="flex flex-row items-center gap-3">
                                <Text className="text-white font-medium">
                                    Preço:
                                </Text>
                                <Text className="text-textForenground">
                                    R$ {formatCurrency(data.amount)}
                                </Text>
                            </View>
                            {
                                data?.cancel_at ?

                                    <TouchableOpacity>
                                        <Text className="text-primaryPrimary mt-5">
                                            Reativar Assinatura
                                        </Text>
                                    </TouchableOpacity>

                                    :

                                    <TouchableOpacity>
                                        <Text className="text-red-500 mt-5">
                                            Cancelar Assinatura
                                        </Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </>
            }




        </View>
    )
}