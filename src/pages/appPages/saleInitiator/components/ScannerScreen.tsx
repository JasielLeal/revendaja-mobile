import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import React from "react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { TouchableOpacity, View, Text, StyleSheet, Modal, Dimensions, Platform } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

type ScannerProps = {
    onScan: (data: string) => void;
};

export function ScannerScreen({ onScan }: ScannerProps) {

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [scanned, setScanned] = useState(false);  // Esse estado vai controlar se o scan está sendo processado

    const { width, height } = Dimensions.get('window');

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (

            <View className="flex flex-row items-center">
                <TouchableOpacity onPress={requestPermission} className={Platform.OS === 'ios' ? "bg-primaryPrimary p-2 rounded-xl" : "bg-primaryPrimary p-3 rounded-xl"}>
                    <Icon name="scan" size={25} />
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: FieldValues) => {
        if (scanned) return; // Impede múltiplos scans antes de finalizar o processo

        setScanned(true); // Marca como escaneado, evitando múltiplos scans simultâneos
        onScan(data); // Chama a função de callback com o dado escaneado
        setIsCameraVisible(false); // Fecha a câmera

        // Resetar o estado de "scanned" após o scan ser concluído, por exemplo, após 1 segundo
        setTimeout(() => {
            setScanned(false); // Permite o próximo scan
        }, 1000);  // Ajuste esse tempo conforme necessário
    };

    return (
        <>
            {isCameraVisible ? (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isCameraVisible}
                    onRequestClose={() => setIsCameraVisible(false)}
                >
                    <View style={styles.cameraContainer}>
                        <CameraView
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={{ width, height }}
                        >
                            <TouchableOpacity style={styles.closeButton} onPress={() => setIsCameraVisible(false)}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </CameraView>
                    </View>
                </Modal>
            ) : (
                <View className="flex flex-row items-center">
                    <TouchableOpacity onPress={() => setIsCameraVisible(true)} className={Platform.OS === 'ios' ? "bg-primaryPrimary p-2 rounded-xl" : "bg-primaryPrimary p-3 rounded-xl"}>
                        <Icon name="scan" size={25} />
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
