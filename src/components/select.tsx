import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

interface Option {
  label: string;
  value: string; // mantemos o valor como string para representar os números, se necessário
}

interface CustomSelectProps {
  options: Option[];
  label: string;
  onSelect: (value: string) => void;
}

export default function Select({ options, label, onSelect }: CustomSelectProps) {
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
        className="bg-bg rounded-full py-2 px-4 w-[150px]"
      >
        <Text className="text-white text-center text-sm">{selectedValue || label}</Text>
      </TouchableOpacity>

      {/* Modal de Opções */}
      {isModalVisible && (
        <Modal transparent={true} animationType="fade" visible={isModalVisible} onRequestClose={toggleModal}>
          <TouchableOpacity
            className="flex-1 justify-center items-center bg-black opacity-50 w-[150px]"
            onPress={toggleModal}
          />
          <View className="absolute top-20 bg-white border border-gray-300 rounded-lg w-80">
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
