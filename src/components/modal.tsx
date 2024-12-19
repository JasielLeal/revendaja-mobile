import React from 'react';
import { Modal, View, Text, GestureResponderEvent, TouchableOpacity } from 'react-native';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    onConfirm?: (event: GestureResponderEvent) => void;
    confirmText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
    visible,
    onClose,
    title = 'Modal',
    children,
    onConfirm,
    confirmText = 'Confirmar',
    
}) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View className=" bg-forenground rounded-lg p-5">
                    <Text className="text-lg font-bold text-white">{title}</Text>
                    <View className="my-2 text-white">{children}</View>
                    <View className="flex-row justify-between space-x-3 mt-5 gap-5 w-full">
                        <TouchableOpacity
                            className="flex-1 px-4 py-3 bg-gray-300 rounded-md"
                            onPress={onClose}
                        >
                            <Text className="w-full text-center">Cancelar</Text>
                        </TouchableOpacity>
                        {onConfirm && (
                            <TouchableOpacity
                                className="flex-1 px-4 py-3 bg-primaryPrimary rounded-md"
                                onPress={onConfirm}
                            >
                                <Text className="text-white text-center">{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;
