import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

interface CustomSelectProps {
    label: string;
    options: { label: string; value: string }[];
    onSelect: (selectedValue: string) => void;
    value?: string; // Adicione esta linha para suportar o valor atual
}

export default function SelectCompany({ options, label, onSelect }: CustomSelectProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const toggleModal = () => setIsModalVisible(!isModalVisible);

    const handleSelect = (value: string, label: string) => {
        setSelectedValue(label);  // Armazena o nome do mês (label)
        setIsModalVisible(false);
        onSelect(value);  // Envia o valor (mês numérico) para o componente pai
    };

    return (
        <View>
            {/* Campo de Seleção */}
            <TouchableOpacity
                onPress={toggleModal}
                className="bg-forenground rounded-xl py-4 px-4"
            >
                <Text className="text-white text-center text-sm">{selectedValue || label}</Text>
            </TouchableOpacity>

            {/* Modal de Opções */}
            {isModalVisible && (
                <Modal transparent={true} animationType="fade" visible={isModalVisible} onRequestClose={toggleModal}>
                    <TouchableOpacity
                        className="flex-1 justify-center items-center bg-black opacity-50 px-5"
                        onPress={toggleModal}
                    />
                    <View className="absolute top-[450px] bg-white border border-gray-300 rounded-lg w-full">
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4"
                                    onPress={() => handleSelect(item.value, item.label)}  // Passa o valor numérico e a label
                                >
                                    <Text className="text-gray-700">{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            )}
        </View>
    );
}
