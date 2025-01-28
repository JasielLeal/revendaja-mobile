import { Button } from "@/components/buttton";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { useNavigation } from "@react-navigation/native";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DeleteById } from "../services/DeleteById";
import { useSuccess } from "@/context/successContext";
import React from "react";
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

    function dateSelece(date: Date) {
        if (date == new Date()) {
            return 'Vence Hoje'
        }
        if (date > new Date) {
            return formatDate(String(date))
        } else {
            return 'Vencido'
        }
    }

    return (
        <>
            <View className='bg-bg w-full h-screen'>
                <View className='px-5 pt-16'>
                    <View>
                        <View className='flex flex-row justify-between'>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Icon name='chevron-back' size={20} color={"#fff"} />
                            </TouchableOpacity>
                            <Text className='text-white font-semibold'>Detalhes do Boleto</Text>
                            <TouchableOpacity onPress={() => DeleteByIdFn(ticket.id)}>
                                <Icon name='trash' size={20} color={"#ff0000"} />
                            </TouchableOpacity>
                        </View>
                        {
                            Platform.OS === 'ios' ?

                                <>
                                    <View className='flex flex-col justify-center items-center mt-7'>
                                        <Text className="bg-[#303030] p-5 rounded-full">
                                            <Icon name='receipt' size={20} color={"#FF7100"} />
                                        </Text>
                                        <Text className='text-white font-medium mt-5'>{ticket.companyName}</Text>
                                        <Text className='text-white font-semibold text-xl'>
                                            R$ {formatCurrency(String(ticket.value))}
                                        </Text>
                                    </View>
                                    <View className='p-3 rounded-xl mt-5 flex justify-between h-[180px]'>
                                        <View className="flex gap-2">
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white'>Vencimento</Text>
                                                <Text className='text-textForenground capitalize'>{formatDate(ticket.dueDate)}</Text>
                                            </View>
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white'>Status</Text>
                                                {
                                                    dateSelece(ticket.dueDate) === 'Vencido' ?
                                                        <Text className='text-red-500 capitalize'>Vencido</Text>
                                                        :
                                                        <Text className='text-green-500 capitalize'>A vencer</Text>
                                                }
                                            </View>
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white'>Empresa</Text>
                                                <Text className='text-textForenground capitalize'>{ticket.companyName}</Text>
                                            </View>
                                        </View>

                                    </View>
                                </>
                                :

                                <>
                                    <View className='flex flex-col justify-center items-center mt-7'>
                                        <Text className="bg-[#303030] p-5 rounded-full">
                                            <Icon name='receipt' size={20} color={"#FF7100"} />
                                        </Text>
                                        <Text className='text-white font-medium mt-5 text-xs'>{ticket.companyName}</Text>
                                        <Text className='text-white font-semibold'>
                                            R$ {formatCurrency(String(ticket.value))}
                                        </Text>
                                    </View>
                                    <View className='p-3 rounded-xl mt-5 flex justify-between h-[180px]'>
                                        <View className="flex gap-2">
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white text-sm'>Vencimento</Text>
                                                <Text className='text-textForenground capitalize text-sm'>{formatDate(ticket.dueDate)}</Text>
                                            </View>
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white'>Status</Text>
                                                {
                                                    dateSelece(ticket.dueDate) === 'Vencido' ?
                                                        <Text className='text-red-500 capitalize text-sm'>Vencido</Text>
                                                        :
                                                        <Text className='text-green-500 capitalizetext-sm'>{dateSelece(ticket.dueDate)}</Text>
                                                }
                                            </View>
                                            <View className='flex flex-row items-center justify-between'>
                                                <Text className='text-white text-sm'>Empresa</Text>
                                                <Text className='text-textForenground capitalize text-sm'>{ticket.companyName}</Text>
                                            </View>
                                        </View>

                                    </View>
                                </>
                        }
                    </View>
                    <Button name="Dar Baixa" />
                </View>

            </View>
        </>
    )
}