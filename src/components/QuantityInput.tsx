import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface QuantityInputProps {
    onQuantityChange: (quantity: number) => void; // Callback para enviar o valor ao componente pai
    initialQuantity?: number; // Valor inicial opcional
}

export function QuantityInput({ onQuantityChange, initialQuantity = 1 }: QuantityInputProps) {
    const [quantity, setQuantity] = useState<number>(initialQuantity);

    const updateQuantity = (newQuantity: number) => {
        setQuantity(newQuantity);
        onQuantityChange(newQuantity); // Envia o valor atualizado para o pai
    };

    const incrementQuantity = () => {
        updateQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            updateQuantity(quantity - 1);
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
                value={String(quantity)}
                onChangeText={(text) => updateQuantity(Number(text) || 1)}
                keyboardType="numeric"
                className="text-center text-white justify-center flex items-center w-12 h-12 border border-gray-300 rounded-md"
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
