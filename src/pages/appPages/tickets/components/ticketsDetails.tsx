import { Button } from "@/components/buttton";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DeleteById } from "../services/DeleteById";
import { useSuccess } from "@/context/successContext";
export function TicketsDetails({ route }: any) {

    const { ticket } = route.params;
    const navigation = useNavigation();
    const { displaySuccess } = useSuccess()
    const queryClient = useQueryClient();
    const { mutateAsync: DeleteByIdFn } = useMutation({
        mutationFn: () => DeleteById(ticket.id),
        onSuccess: () => {
            displaySuccess()
            queryClient.invalidateQueries(['ListAllStoreByStore'] as InvalidateQueryFilters);
            navigation.goBack()
        },
        onError: () => {
            Alert.alert("Error", "Ao deletar esse boleto")
        }
    })

    return (
        <>
            <View className='bg-bg w-full h-screen'>
                <View className='px-5 pt-16'>
                    <View className='flex flex-row justify-between'>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name='chevron-back' size={20} color={"#fff"} />
                        </TouchableOpacity>
                        <Text className='text-white font-semibold'>Detalhes do Boleto</Text>
                        <TouchableOpacity onPress={() => DeleteByIdFn(ticket.id)}>
                            <Icon name='trash' size={20} color={"#ff0000"} />
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-col justify-center items-center mt-7'>
                        <Text className="bg-[#303030] p-5 rounded-full">
                            <Icon name='receipt' size={20} color={"#FF7100"} />
                        </Text>
                        <Text className='text-white font-medium mt-5'>Natura</Text>
                        <Text className='text-white font-semibold text-xl'>
                            R$ {formatCurrency(String(ticket.value))}
                        </Text>
                    </View>
                    <View className='bg-[#303030] p-3 rounded-xl mt-5 flex justify-between h-[180px]'>
                        <View className="flex gap-2">
                            <View className='flex flex-row items-center justify-between'>
                                <Text className='text-white'>Vencimento</Text>
                                <Text className='text-textForenground capitalize'>{formatDate(ticket.dueDate)}</Text>
                            </View>
                            <View className='flex flex-row items-center justify-between'>
                                <Text className='text-white'>Status</Text>
                                <Text className='text-green-500 capitalize'>A vencer</Text>
                            </View>
                            <View className='flex flex-row items-center justify-between'>
                                <Text className='text-white'>Empresa</Text>
                                <Text className='text-textForenground capitalize'>{ticket.companyName}</Text>
                            </View>
                        </View>
                        <Button name="Dar Baixa" />
                    </View>
                </View>
            </View>
        </>
    )
}