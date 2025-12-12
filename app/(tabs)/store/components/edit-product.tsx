import Button from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    Image,
    Modal,
    Switch,
    Text,
    TextInput,
    TouchableOpacity, View
} from "react-native";
import { useEditProduct } from "../hooks/useEditProduct";
import { useQueryClient } from "@tanstack/react-query";

export interface productType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    brand: string;
    barcode: string;
    company: string;
    imgUrl: string;
    validity_date: string;
    cost_price: number;
    status: 'active' | 'inactive';
}

interface EditProductProps {
    product: productType | null;
    onClose: () => void;
    visible: boolean;
}

export function EditProduct(props: EditProductProps) {

    const colors = useThemeColors()

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    function formatToBRL(value: string) {
        // Remove tudo que não for número
        const onlyNumbers = value.replace(/\D/g, "");

        // Evita erro quando apagar tudo
        const numberValue = Number(onlyNumbers) / 100;

        return numberValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function formatDate(input: string) {
        const cleaned = input.replace(/\D/g, ""); // só números

        let day = cleaned.substring(0, 2);
        let month = cleaned.substring(2, 4);
        let year = cleaned.substring(4, 8);

        if (cleaned.length <= 2) {
            return day;
        } else if (cleaned.length <= 4) {
            return `${day}/${month}`;
        } else {
            return `${day}/${month}/${year}`;
        }
    }

    const [clientPrice, setClientPrice] = useState("R$ 0,00");
    const [costPrice, setCostPrice] = useState("R$ 0,00");
    const [validity, setValidity] = useState("");
    const [quantity, setQuantity] = useState("");

    function formatISOToBR(iso?: string) {
        if (!iso) return "";

        // Remove qualquer parte após o "T" ou espaço
        const clean = iso.split("T")[0].split(" ")[0]; // fica "2025-12-31"

        const [year, month, day] = clean.split("-");

        if (!year || !month || !day) return "";

        return `${day}/${month}/${year}`;
    }

    useEffect(() => {
        if (props.product) {
            setClientPrice(formatToBRL(String(props.product.price)));
            setCostPrice(formatToBRL(String(Math.round(props.product.cost_price))));
            setValidity(formatISOToBR(props.product.validity_date));
            setQuantity(String(props.product.quantity));
            setIsEnabled(props.product.status === 'inactive');
        }

    }, [props.product, props.visible]);

    const mutationEditProduct = useEditProduct();
    const queryClient = useQueryClient();

    async function ChangeProduct() {

        const parseCurrency = (value: string) => {
            if (!value) return 0;
            return Number(value.replace(/\D/g, ""));
        };

        const convertToISO = (dateStr: string | undefined) => {
            if (!dateStr) return null;

            const parts = dateStr.split("/");
            if (parts.length !== 3) return null;

            const [dayStr, monthStr, yearStr] = parts;

            if (dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4) return null;

            const day = Number(dayStr);
            const month = Number(monthStr);
            const year = Number(yearStr);

            // valida ranges reais
            if (day < 1 || day > 31) return null;
            if (month < 1 || month > 12) return null;
            if (year < 2000 || year > 2100) return null; // limite ajustável

            // montar string ISO
            return `${yearStr}-${monthStr}-${dayStr}`;
        };

        const isoDate = convertToISO(validity);

        // monta o payload
        const formatted: any = {
            id: props.product?.id || "",
            price: parseCurrency(clientPrice),
            costPrice: parseCurrency(costPrice),
            quantity: Number(quantity) || 0,
            status: isEnabled ? "inactive" : "active",
        };

        // só adiciona validityDate se for uma data válida
        if (isoDate) {
            formatted.validityDate = isoDate;
        }

        mutationEditProduct.mutate(formatted, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["store-products"] });
                props.onClose();
            },
            onError: (error) => {
                console.error("Erro ao atualizar o produto:", error);
            }
        });
    }



    return (
        <>
            <Modal
                visible={props.visible}
                onRequestClose={props.onClose}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View
                        className="flex-1 mt-20 rounded-t-3xl"
                        style={{ backgroundColor: colors.background }}
                    >
                        {/* Header do Modal */}
                        <View className="items-center pt-2 pb-6" style={{ backgroundColor: colors.primary }}>
                            <View className="flex-row items-center justify-between w-full px-4 mb-2 mt-4">
                                <View>
                                    <Text className='uppercase' style={{ color: colors.primaryForeground + '90', fontSize: 12, fontWeight: '700' }}>
                                        Informações do Produto
                                    </Text>
                                    <Text
                                        className="text-xl font-black mb-1"
                                        style={{ color: colors.primaryForeground }}
                                    >
                                        {props.product?.barcode}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={props.onClose}
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    <Ionicons name="close" size={24} color={colors.primaryForeground} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps="handled"
                            enableAutomaticScroll={true}
                            enableOnAndroid={true}

                            extraScrollHeight={20}   // 👈 espaço extra entre o teclado e o input
                            extraHeight={0}
                            keyboardOpeningTime={0}
                            viewIsInsideTabBar={false}

                            className="flex-1 px-4"
                        >
                            <View className="px-2">
                                {/* Conteúdo do Modal */}
                                <View className="">
                                    <View className="items-center my-6">

                                        {/* Imagem */}
                                        <Image
                                            source={{ uri: props.product?.imgUrl }}
                                            className="w-full h-96 rounded-xl"
                                            resizeMode="cover"
                                            style={{ backgroundColor: colors.muted }}
                                        />

                                        <View className="w-full mt-4">
                                            <Text style={{ color: colors.mutedForeground }}>
                                                {props.product?.brand}
                                            </Text>
                                            <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>
                                                {props.product?.name}
                                            </Text>
                                        </View>

                                        {/* Container com mesma largura da imagem */}
                                        <View className="w-full flex flex-row justify-between py-3 mt-4">
                                            <View>
                                                <Text style={{ color: colors.mutedForeground }}>
                                                    Preço para o cliente
                                                </Text>
                                                <View className="flex-row items-center justify-between rounded-lg mt-1 ">
                                                    <TextInput
                                                        className="flex-1 text-base font-semibold"
                                                        style={{ color: colors.foreground }}
                                                        keyboardType="numeric"
                                                        value={clientPrice}
                                                        onChangeText={(text) => {
                                                            const formatted = formatToBRL(text);
                                                            setClientPrice(formatted);
                                                        }}
                                                    />

                                                    <Ionicons
                                                        name="pencil"
                                                        size={18}
                                                        color={colors.primary}
                                                        style={{ opacity: 0.6, marginLeft: 8 }}
                                                    />
                                                </View>

                                            </View>

                                            <View>
                                                <Text style={{ color: colors.mutedForeground }}>
                                                    Preço de custo
                                                </Text>
                                                <View className="flex-row items-center justify-between rounded-lg mt-1">
                                                    <TextInput
                                                        className="text-base font-semibold"
                                                        style={{ color: colors.foreground }}
                                                        keyboardType="numeric"
                                                        value={costPrice}
                                                        onChangeText={(text) => {
                                                            const formatted = formatToBRL(text);
                                                            setCostPrice(formatted);
                                                        }}
                                                    />
                                                    <Ionicons
                                                        name="pencil"
                                                        size={18}
                                                        color={colors.primary}
                                                        style={{ opacity: 0.6, marginLeft: 8 }}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View className="w-full flex flex-row justify-between py-3">
                                            <View>
                                                <Text style={{ color: colors.mutedForeground }}>
                                                    Data de validade
                                                </Text>
                                                <View className="flex-row items-center justify-between rounded-lg mt-1 ">
                                                    <TextInput
                                                        className="text-base font-semibold"
                                                        style={{ color: colors.foreground }}
                                                        value={validity}
                                                        keyboardType="numeric"
                                                        placeholder="Não informada"
                                                        placeholderTextColor={colors.mutedForeground}
                                                        onChangeText={(text) => {
                                                            const formatted = formatDate(text);
                                                            setValidity(formatted);
                                                        }}
                                                    />
                                                    <Ionicons
                                                        name="pencil"
                                                        size={18}
                                                        color={colors.primary}
                                                        style={{ opacity: 0.6, marginLeft: 8 }}
                                                    />
                                                </View>
                                            </View>

                                            <View>
                                                <Text style={{ color: colors.mutedForeground }}>
                                                    Estoque
                                                </Text>
                                                <View className="flex-row items-center justify-between rounded-lg mt-1 ">
                                                    <TextInput
                                                        className="text-base font-semibold"
                                                        style={{ color: colors.foreground }}
                                                        keyboardType="numeric"
                                                        value={quantity}
                                                        onChangeText={(text) => {

                                                            setQuantity(text);
                                                        }}
                                                    />
                                                    <Ionicons
                                                        name="pencil"
                                                        size={18}
                                                        color={colors.primary}
                                                        style={{ opacity: 0.6, marginLeft: 8 }}
                                                    />
                                                </View>
                                            </View>
                                        </View>

                                        <View className="w-full flex flex-row justify-between py-3">
                                            <View>
                                                <Text style={{ color: colors.mutedForeground }}>
                                                    Desativar produto
                                                </Text>
                                            </View>

                                            <View>
                                                <Switch value={isEnabled} onValueChange={toggleSwitch} />
                                            </View>
                                        </View>

                                        {
                                            mutationEditProduct.isPending ?
                                                <Button name="Salvando..." disabled={true} />
                                                :
                                                <Button name="Salvar" onPress={ChangeProduct} />
                                        }
                                    </View>

                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        </>
    )
}

