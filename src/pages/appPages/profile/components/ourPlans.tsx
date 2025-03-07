import { backend } from "@/api/backend";
import { Button } from "@/components/buttton";
import AuthContext from "@/context/authContext";
import { useNavigation } from "@react-navigation/native";
import { retrievePaymentIntent, useStripe } from "@stripe/stripe-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Alert, ScrollView, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { UpdatePlan } from "../services/UpdatePlan";
import { CreateSubscription } from "../services/CreateSubscription";
import { ActiveStore } from "./myPlan/services/activeStore";

export function OurPlans() {
    const navigation = useNavigation();
    const { user, setUser } = useContext(AuthContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const plans = [
        { name: "Starter", price: "29,99", priceId: "price_1QjiK12M4f5OsxL2WEwMqvxg", customProducts: "25", stock: "250", tickets: "20", description: "O plano ideal para quem está começando e deseja explorar funcionalidades essenciais com um preço acessível.", limitSale: "Sem limite" },
        { name: "Exclusive", price: "49,99", priceId: "price_1QoO4D2M4f5OsxL2ZS0QMXQx", customProducts: "100", stock: "500", tickets: "60", description: "Aproveite o máximo da nossa plataforma com recursos exclusivos e prioridade de atendimento para uma experiência completa", limitSale: "Sem limite" },
    ];

    const { mutateAsync: UpdatePlanFn } = useMutation({
        mutationFn: UpdatePlan,
    })

    async function fetchPaymentIntent(priceId: string, planName: string) {
        try {
            const response = await backend.post("/stripe/CreatePaymentIntent", { priceId });

            if (!response.data) {
                Alert.alert("Erro", "clientSecret não recebido da API.");
                return;
            }

            setClientSecret(response.data.client_secret);
            openPaymentSheet(response.data.client_secret, planName, priceId,); // Chamar diretamente após obter o clientSecret
        } catch (error) {
            Alert.alert("Erro", "Não foi possível iniciar o pagamento.");
        }
    }

    const queryClient = useQueryClient();

    async function openPaymentSheet(clientSecret: string, planName: string, priceId: string) {
        try {
            // Inicializa o PaymentSheet
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Revendaja',
            });

            if (error) {
                console.error("Erro ao inicializar PaymentSheet:", error);
                Alert.alert("Erro", error.message);
                return;
            }

            // Apresenta o PaymentSheet
            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) {
                console.error("Erro ao apresentar PaymentSheet:", paymentError);
                Alert.alert("Erro", paymentError.message);
                return;
            }

            // Recupera o PaymentIntent
            const paymentIntent = await retrievePaymentIntent(clientSecret);
            const paymentMethodId = paymentIntent?.paymentIntent?.paymentMethodId;

            if (!paymentMethodId) {
                throw new Error("Não foi possível recuperar o ID do método de pagamento.");
            }

            // Cria a assinatura e atualiza o plano
            await CreateSubscription(priceId, paymentMethodId);
            await ActiveStore();
            await UpdatePlanFn(planName); // Atualiza o plano no backend
            

            // Invalida a query para refetch
            queryClient.invalidateQueries({ queryKey: ["GetPlan"] });

            // Atualiza o estado local do usuário
            setUser((prevUser) => {
                if (prevUser) {
                    return { ...prevUser, plan: planName };
                }
                return prevUser;
            });

            // Exibe o alerta de sucesso
            Alert.alert("Pagamento realizado com sucesso!", "Em alguns minutos sua loja já estará online.");
        } catch (error) {
            console.error("Erro durante o processo de pagamento:", error);
            console.log(JSON.stringify(error, null, 4))
            Alert.alert("Erro", "Ocorreu um erro durante o processo de pagamento. Tente novamente.");
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
                    <Text className="text-white font-medium text-2xl">{user?.plan === "Free" ? "Gratuito" : user?.plan === "Starter" ? "R$ 29,99" : "R$ 49,99"}</Text>
                    <Text className="text-textForenground"> {user?.plan === "Free" ? "" : "/ Mês"}</Text>
                </View>

                <Text className="text-textForenground mt-5 text-sm">

                    {
                        user?.plan === "Free" ?
                            "O ponto de partida perfeito para explorar tudo o que nossa aplicação tem a oferecer!"
                            : user?.plan === "Starter" ?
                                "O plano ideal para quem está começando e deseja explorar funcionalidades essenciais com um preço acessível."
                                :
                                "Aproveite o máximo da nossa plataforma com recursos exclusivos e prioridade de atendimento para uma experiência completa"}
                </Text>
            </View>

            {/* Título dos Planos */}
            <Text className="text-textForenground mt-10 text-sm">Nossos planos</Text>
            <Text className="text-white font-medium text-base">Opções ideais para você</Text>

            {/* Lista de Planos */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: "row", gap: 16 }}>
                {plans.map((plan) => (
                    <View key={plan.name} className="bg-forenground p-4 rounded-xl shadow-lg mt-5 w-[300] h-[350] mb-10">
                        <Text className="text-primaryPrimary text-xl font-semibold">{plan.name}</Text>
                        <View className="flex flex-row gap-2 items-center">
                            <Text className="text-white font-medium text-2xl">R$ {plan.price}</Text>
                            <Text className="text-textForenground text-lg">/ mês</Text>
                        </View>
                        <Text className="text-textForenground mt-3 text-sm">
                            {plan.description}
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
                                <Text className="text-white">Sem limite de vendas</Text>
                            </View>

                            {/* Botão de Pagamento */}
                            {
                                user?.plan === plan.name ?

                                    <Button name="Seu plano atual" disabled={true} />

                                    :

                                    <Button name="Adquirir" onPress={() => fetchPaymentIntent(plan.priceId, plan.name)} disabled={loading} />
                            }
                        </View>

                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
