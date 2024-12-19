import CustomModal from "@/components/modal";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export function OptionsSwipeable() {

    const [onDelete, setOnDelete] = useState(false)

    async function DeleteProduct() {
        console.log('opa')
    }

    return (
        <View className="flex flex-row  items-center justify-center h-full pt-5">
            <TouchableOpacity className="bg-forenground flex items-center justify-center w-20 h-full">
                <Icon name="pricetag" size={25} color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#dc2626] flex items-center justify-center w-20 h-full"  onPress={()=> setOnDelete(true)}>
                <Icon name="trash" size={25} color={"#fff"} />
            </TouchableOpacity>


            <CustomModal
                visible={onDelete}
                onClose={() => setOnDelete(false)}
                title="Deseja deletar sua conta?"
                onConfirm={DeleteProduct}
                confirmText="Confirmar"
            >
                <Text className="text-white">Essa ação não pode ser desfeita, mas você podera adicionar novamente ao seu estoque se quiser.</Text>
            </CustomModal>
        </View>
    )
}