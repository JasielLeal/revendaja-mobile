import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
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

  const modalClose = () =>setIsModalVisible(false);
  const modalOpen = () =>setIsModalVisible(true);


  const handleSelect = (value: string, label: string) => {
    setSelectedValue(label);  // Armazena o nome do mês (label)
    setIsModalVisible(false);
    onSelect(value);  // Envia o valor (mês numérico) para o componente pai
  };

  return (
    <View>
      {/* Campo de Seleção */}
      <TouchableOpacity className="bg-forenground p-2 rounded-xl" onPress={modalOpen}>
        <Icon name="filter" color={"#fff"} size={25} />
      </TouchableOpacity>

      {/* Modal de Opções */}
      {isModalVisible && (
        <Modal transparent={true} animationType="fade" visible={isModalVisible} onRequestClose={modalClose}>
          <TouchableOpacity
            className="flex-1 justify-center items-center bg-black opacity-50 "
            onPress={modalClose}
          />
          <View className="absolute top-60 right-10 bg-forenground rounded-xl w-80">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4"
                  onPress={() => handleSelect(item.value, item.label)}  // Passa o valor numérico e a label
                >
                  <Text className="text-textForenground">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>
      )}
    </View>
  );
}
