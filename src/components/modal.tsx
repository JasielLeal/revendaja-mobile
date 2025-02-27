import React, { useEffect } from 'react';
import { Modal, View, Text, GestureResponderEvent, TouchableOpacity, Platform } from 'react-native';

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
    const handleConfirm = (event: GestureResponderEvent) => {
        if (onConfirm) {
            onConfirm(event);
        }
        onClose();
    };
    ;

    useEffect(() => {
        console.log("Estado recebido no CustomModal:", visible, title, confirmText);
    }, [visible]);

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/50 px-5">
                <View className="bg-forenground rounded-lg p-5 w-11/12 max-w-md">
                    <Text
                        className={Platform.OS == "ios" ?
                            "text-lg font-bold text-white text-center"
                            :
                            "text-sm font-bold text-white text-center"}>
                        {title}
                    </Text>
                    <View className="my-2">{children}</View>
                    <View className="flex-row justify-between mt-5 gap-3">
                        <TouchableOpacity
                            className={Platform.OS == "ios" ? "flex-1 px-4 py-3 bg-gray-300 rounded-md" : "flex-1 px-4 py-3 bg-gray-300 rounded-md"}
                            onPress={onClose}
                        >
                            <Text className={Platform.OS == "ios" ? "text-center" : "text-center text-sm"}>Cancelar</Text>
                        </TouchableOpacity>
                        {onConfirm && (
                            <TouchableOpacity
                                className="flex-1 px-4 py-3 bg-primaryPrimary rounded-md"
                                onPress={handleConfirm}
                            >
                                <Text className={Platform.OS == "ios" ? "text-center text-white" : "text-center text-sm text-white"}>{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;