import CustomModal from "@/components/modal";
import { InvalidateQueryFilters, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DeleteStockItem } from "../services/DeleteStockItem";

interface OptionsSwipeableProps {
    id: string;
}

export function OptionsSwipeable({ id }: OptionsSwipeableProps) {

    const [onDelete, setOnDelete] = useState(false)
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

    return (
        <View className="flex flex-row  items-center justify-center h-full pt-5">
            <TouchableOpacity className="bg-forenground flex items-center justify-center w-20 h-full">
                <Icon name="pricetag" size={25} color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#dc2626] flex items-center justify-center w-20 h-full" onPress={() => setOnDelete(true)}>
                <Icon name="trash" size={25} color={"#fff"} />
            </TouchableOpacity>


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