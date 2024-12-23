import CustomModal from "@/components/modal";
import { InvalidateQueryFilters, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DeleteStockItem } from "../services/DeleteStockItem";
import { AddPromotionInProduct } from "../services/AddPromotionInProduct";
import { RemovePromotionInProduct } from "../services/RemovePromotionInProduct";

interface OptionsSwipeableProps {
    id: string;
    discount?: number;
}

export function OptionsSwipeable({ id, discount }: OptionsSwipeableProps) {

    const [onDelete, setOnDelete] = useState(false)
    const [onPriceTag, setOnPriceTag] = useState(false);
    const [price, setPrice] = useState("");

    const queryClient = useQueryClient();

    const { mutateAsync: DeleteStockItemFn } = useMutation({
        mutationFn: DeleteStockItem,
        onSuccess: () => {
            queryClient.invalidateQueries(['GetStock'] as InvalidateQueryFilters);
        }
    })

    async function DeleteProduct() {
        DeleteStockItemFn(id)
    }

    const { mutateAsync: AddPromotionInProductFn } = useMutation({
        mutationFn: AddPromotionInProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['GetStock'] as InvalidateQueryFilters);
        }
    })

    const { mutateAsync: RemovePromotionInProductFn } = useMutation({
        mutationFn: RemovePromotionInProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['GetStock'] as InvalidateQueryFilters);
        }
    })

    console.log(discount)

    async function onSubAddPromotionInProduct() {

        if (price === "") return;

        if (price === "R$ 0,00") return;

        const formatPrice = parseFloat(price.replace("R$", "").replace(/\./g, "").replace(",", "."));

        const discountValue = Number(formatPrice.toFixed(2).replace(/\./g, ""))

        const productId = String(id);
        await AddPromotionInProductFn({ productId, discountValue });
    }

    function formatCurrency(value: string) {
        const formattedValue = value
            .replace(/\D/g, "")
            .replace(/(\d)(\d{2})$/, "$1,$2")
            .replace(/(?=(\d{3})+(\D))\B/g, ".");
        return `R$ ${formattedValue}`;
    }

    return (
        <View className="flex flex-row  items-center justify-center h-full pt-5">
            <TouchableOpacity className="bg-forenground flex items-center justify-center w-20 h-full" onPress={() => setOnPriceTag(true)}>
                <Icon name="pricetag" size={25} color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#dc2626] flex items-center justify-center w-20 h-full" onPress={() => setOnDelete(true)}>
                <Icon name="trash" size={25} color={"#fff"} />
            </TouchableOpacity>


            {/* Modal para adicionar valor */}
            <CustomModal
                visible={onPriceTag}
                onClose={() => {
                    setOnPriceTag(false);
                    setPrice(""); // Resetar o valor quando o modal for fechado
                }}
                title={discount ? "Excluir desconto" : "Adicionar desconto"}
                onConfirm={() => {

                    if (discount) {
                        RemovePromotionInProductFn(id)
                    }

                    onSubAddPromotionInProduct();
                    setOnPriceTag(false);
                    setPrice(""); // Resetar o valor quando o modal for fechado
                }}
                confirmText="Confirmar"
            >
                {
                    discount ?
                        ''
                        :
                        <Text className="text-white">Digite o valor de desconto do produto. Esse valor será refletido na sua loja. Não se preocupe você pode remover se quiser</Text>
                }
                {
                    discount ?
                        <Text className="text-white">O produto possui um desconto de R$ {formatCurrency(String(discount))}</Text>
                        :
                        <TextInput
                            className="bg-bg text-white p-3 rounded-xl mt-5"
                            placeholder="Digite o valor"
                            placeholderTextColor="#7D7D7D"
                            keyboardType="numeric"
                            value={price}
                            onChangeText={(value) => setPrice(formatCurrency(value))}
                            returnKeyType="done"
                            onSubmitEditing={Keyboard.dismiss}
                        />
                }
            </CustomModal>

            <CustomModal
                visible={onDelete}
                onClose={() => setOnDelete(false)}
                title="Deseja deletar esse produto?"
                onConfirm={DeleteProduct}
                confirmText="Confirmar"
            >
                <Text className="text-white">Essa ação não pode ser desfeita, você podera adicionar novamente esse item no seu estoque se quiser.</Text>
            </CustomModal>

        </View>
    )
}