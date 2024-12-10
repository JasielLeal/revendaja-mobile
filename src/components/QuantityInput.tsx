import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export function QuantityInput() {
    const [quantity, setQuantity] = useState<number>(1); // Estado para controlar a quantidade

    // Função para incrementar a quantidade
    const incrementQuantity = () => {
        setQuantity((prevQuantity) => prevQuantity + 1);
    };

    // Função para decrementar a quantidade
    const decrementQuantity = () => {
        if (quantity > 1) { // Evita que a quantidade seja menor que 1
            setQuantity((prevQuantity) => prevQuantity - 1);
        }
    };

    return (
        <View className="flex-row items-center justify-between mt-5 mb-5">
            <TouchableOpacity
                onPress={decrementQuantity}
                className="bg-white rounded-xl h-10 w-10 flex items-center justify-center"
            >
                <Text className="text-lg text-black">-</Text>
            </TouchableOpacity>

            <TextInput
                value={String(quantity)} // O valor é uma string, para ser exibido no input
                onChangeText={(text) => setQuantity(Number(text))}
                keyboardType="numeric" // Só permite entrada numérica
                className=" text-center text-white justify-center flex items-center w-12 h-12 border border-gray-300 rounded-md"
            />

            <TouchableOpacity
                onPress={incrementQuantity}
                className="bg-white rounded-xl h-10 w-10 flex items-center justify-center"
            >
                <Text className="text-lg text-black text-center">+</Text>
            </TouchableOpacity>
        </View>
    );
}
