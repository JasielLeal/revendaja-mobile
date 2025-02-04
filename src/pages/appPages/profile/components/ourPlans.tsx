import { backend } from "@/api/backend";
import { Button } from "@/components/buttton";
import AuthContext from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Alert, Platform, ScrollView, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UpdatePlan } from "../services/UpdatePlan";

export function OurPlans() {
    const navigation = useNavigation();
    const { user, setUser } = useContext(AuthContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const queryClient = useQueryClient();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const plans = [
        { name: "Starter", price: "29,90", priceId: "price_1QoO4D2M4f5OsxL2ZS0QMXQx", customProducts: "10", stock: "250", tickets: "20" },
        { name: "Premium", price: "49,90", priceId: "price_1QoO5E...", customProducts: "40", stock: "500", tickets: "40" },
    ];

    const { mutateAsync: UpdatePlanFn } = useMutation({
        mutationFn: UpdatePlan,
    })

    async function fetchPaymentIntent(priceId: string, planName: string) {
        try {
            const response = await backend.post("/stripe/CreatePaymentIntent", { priceId });

            console.log("Resposta da API:", response.data); // DEBUG

            if (!response.data) {
                Alert.alert("Erro", "clientSecret não recebido da API.");
                return;
            }

            setClientSecret(response.data);
            openPaymentSheet(response.data, planName); // Chamar diretamente após obter o clientSecret
        } catch (error) {
            console.error("Erro ao buscar clientSecret:", error);
            Alert.alert("Erro", "Não foi possível iniciar o pagamento.");
        }
    }

    async function openPaymentSheet(clientSecret: string, planName: string) {

        const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Revendaja',
        });

        if (error) {
            console.error("Erro ao inicializar PaymentSheet:", error);
            Alert.alert("Erro", error.message);
            return;
        }

        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
            console.error("Erro ao apresentar PaymentSheet:", paymentError);
            Alert.alert("Erro", paymentError.message);
        } else {
            await UpdatePlanFn(planName); // Atualiza o plano no backend

            setUser((prevUser) => {
                if (prevUser) {
                    return { ...prevUser, plan: planName }; // Atualiza o plano do usuário
                }
                return prevUser;
            });

            Alert.alert("Pagamento realizado com sucesso!", "Em alguns minutos sua loja já estará online.");
        }
    }

    return (
        <View className="flex-1 bg-bg px-5">
            {/* Header */}
            <View className="flex flex-row justify-between pt-16">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={20} color={"#fff"} />
                </TouchableOpacity>
                <Text className="text-white font-semibold text-xl">Nossos Planos</Text>
                <TouchableOpacity>
                    <Icon name="help-circle" size={25} color={"#FF7100"} />
                </TouchableOpacity>
            </View>

            {/* Plano Atual */}
            <Text className="text-white font-medium mt-10">Seu plano</Text>
            <View className="bg-forenground p-4 rounded-xl mt-5">
                <View className="flex flex-row items-center">
                    <Text className="text-white text-xl">{user?.plan} -</Text>
                    <Text className="text-primaryPrimary"> Atualmente</Text>
                </View>

                <View className="flex flex-row gap-2 items-center">
                    <Text className="text-white font-medium text-2xl">R$ 00,00</Text>
                    <Text className="text-textForenground">/ Gratuito</Text>
                </View>

                <Text className="text-textForenground mt-5 text-sm">
                    O ponto de partida perfeito para explorar tudo o que nossa aplicação tem a oferecer!
                </Text>
            </View>

            {/* Título dos Planos */}
            <Text className="text-textForenground mt-10 text-sm">Nossos planos</Text>
            <Text className="text-white font-medium text-base">Opções ideais para você</Text>

            {/* Lista de Planos */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", gap: 16 }}>
                {plans.map((plan) => (
                    <View key={plan.name} className="bg-forenground p-4 rounded-xl shadow-lg mt-5" style={{ width: 340, height: 340 }}>
                        <Text className="text-primaryPrimary text-xl font-semibold">{plan.name}</Text>
                        <View className="flex flex-row gap-2 items-center">
                            <Text className="text-white font-medium text-2xl">R$ {plan.price}</Text>
                            <Text className="text-textForenground text-lg">/ mês</Text>
                        </View>
                        <Text className="text-textForenground mt-3 text-sm">
                            O plano perfeito se você está apenas começando a usar nosso produto
                        </Text>

                        {/* Benefícios do Plano */}
                        <View className="mt-5">
                            {plan.customProducts && (
                                <View className="flex flex-row items-center gap-2">
                                    <Icon name="checkmark" size={25} color="#FF7100" />
                                    <Text className="text-white">{plan.customProducts} Produtos personalizados</Text>
                                </View>
                            )}
                            {plan.stock && (
                                <View className="flex flex-row items-center gap-2">
                                    <Icon name="checkmark" size={25} color="#FF7100" />
                                    <Text className="text-white">{plan.stock} Produtos no estoque</Text>
                                </View>
                            )}
                            {plan.tickets && (
                                <View className="flex flex-row items-center gap-2">
                                    <Icon name="checkmark" size={25} color="#FF7100" />
                                    <Text className="text-white">{plan.tickets} boletos</Text>
                                </View>
                            )}
                            <View className="flex flex-row items-center gap-2 mb-10">
                                <Icon name="checkmark" size={25} color="#FF7100" />
                                <Text className="text-white">Adicionar Metas</Text>
                            </View>

                            {/* Botão de Pagamento */}
                            <Button name="Adquirir" onPress={() => fetchPaymentIntent(plan.priceId, plan.name)} disabled={loading} />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
