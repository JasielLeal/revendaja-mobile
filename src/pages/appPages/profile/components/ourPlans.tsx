import { Button } from "@/components/buttton";
import AuthContext from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { Platform, ScrollView, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export function OurPlans() {

    const navigation = useNavigation();
    const { user } = useContext(AuthContext)

    const plans = [
        { name: 'Starter', price: '29,90', customProducts: '10', stock: '250', tickets: '20' },
        { name: 'Premium', price: '49,90', customProducts: '40', stock: '500', tickets: '40' },
    ]

    return (
        <View className="flex-1 bg-bg px-5">
            <View className='flex flex-row justify-between pt-16'>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='chevron-back' size={20} color={"#fff"} />
                </TouchableOpacity>
                {
                    Platform.OS == 'ios' ?
                        <Text className='text-white font-semibold text-xl'>Nossos Planos</Text>
                        :
                        <Text className='text-white font-semibold'>Nossos Planos</Text>
                }
                <TouchableOpacity >
                    <Icon name='help-circle' size={25} color={"#FF7100"} />
                </TouchableOpacity>
            </View>

            {
                Platform.OS == 'ios' ?
                    <Text className="text-white font-medium mt-10 text-xl">Seu plano</Text>
                    :
                    <Text className="text-white font-medium mt-10">Seu plano</Text>
            }
            <View className="bg-forenground p-4 rounded-xl mt-5">
                <View className="flex flex-row items-center">
                    <Text className="text-white text-xl">{user?.plan} -</Text>
                    <Text className="text-primaryPrimary"> Atualmente</Text>
                </View>

                <View className="flex flex-row gap-2 items-center">
                    <Text className="text-white font-medium text-2xl">R$ 00,00</Text>
                    <Text className="text-textForenground">
                        / Gratuito
                    </Text>
                </View>
                {
                    Platform.OS === 'ios' ?

                        <Text className="text-textForenground mt-5">
                            O ponto de partida perfeito para explorar tudo o
                            que nossa aplicação tem a oferecer!
                        </Text>
                        :
                        <Text className="text-textForenground mt-5 text-sm">
                            O ponto de partida perfeito para explorar tudo o
                            que nossa aplicação tem a oferecer!
                        </Text>
                }
            </View>

            {
                Platform.OS == 'ios' ?

                    <>
                        <Text className="text-textForenground mt-10">
                            Nossos planos
                        </Text>
                        <Text className="text-white font-medium text-2xl">Opções ideais para você</Text>
                    </>

                    :

                    <>
                        <Text className="text-textForenground mt-10 text-sm">
                            Nossos planos
                        </Text>
                        <Text className="text-white font-medium text-base">Opções ideais para você</Text>
                    </>
            }

            <View className="mt-5">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 16 }}>
                    {
                        plans?.map((plan) => (
                            <View className="bg-forenground p-4 rounded-xl shadow-lg" style={{ width: 340 }}>
                                <Text className="text-primaryPrimary text-xl font-semibold">
                                    {plan.name}
                                </Text>
                                <View className="flex flex-row gap-2 items-center">
                                    <Text className="text-white font-medium text-2xl">
                                        R$ {plan.price}
                                    </Text>
                                    <Text className="text-textForenground text-lg">
                                        / mês
                                    </Text>
                                </View>
                                <Text className="text-textForenground mt-3 text-sm">
                                    O plano perfeito se você está apenas começando a usar nosso produto
                                </Text>

                                <View className="mt-5">
                                    {plan.customProducts && (
                                        <View className="flex flex-row items-center gap-2">
                                            <Icon name="checkmark" size={25} color="#FF7100" />
                                            <Text className="text-white">
                                                {plan.customProducts} Produtos personalizados
                                            </Text>
                                        </View>
                                    )}
                                    {plan.stock && (
                                        <View className="flex flex-row items-center gap-2">
                                            <Icon name="checkmark" size={25} color="#FF7100" />
                                            <Text className="text-white">
                                                {plan.stock} Produtos no estoque
                                            </Text>
                                        </View>
                                    )}
                                    {plan.tickets && (
                                        <View className="flex flex-row items-center gap-2">
                                            <Icon name="checkmark" size={25} color="#FF7100" />
                                            <Text className="text-white">
                                                {plan.tickets} boletos
                                            </Text>
                                        </View>
                                    )}
                                    <View className="flex flex-row items-center gap-2 mb-10">
                                        <Icon name="checkmark" size={25} color="#FF7100" />
                                        <Text className="text-white">
                                            Adicionar Metas
                                        </Text>
                                    </View>

                                    <Button name="Adquirir" />
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}