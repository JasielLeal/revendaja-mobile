import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { Dimensions, Modal } from "react-native";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

type ScannerProps = {
    onScan: (data: string) => void;
};

export function ScannerScreen({ onScan }: ScannerProps) {

    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [scanned, setScanned] = useState(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View>
                <TouchableOpacity className="bg-blue-300 p-3 rounded-xl" onPress={requestPermission}>
                    <Text className="text-white text-center font-semibold">
                        Conceder Permissão
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { width, height } = Dimensions.get('window');

    const handleBarCodeScanned = ({ type, data }: FieldValues) => {
        setScanned(true);
        setIsCameraVisible(false);
        onScan(data);
        setTimeout(() => setScanned(false), 500);
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
                    <TouchableOpacity onPress={() => setIsCameraVisible(true)} className="bg-[#e0e0e0] dark:bg-white p-3 rounded-xl w-[270px]">
                        <Text className="font-semibold text-background text-center w-full">Scanear Produto</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
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