import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
            <View style={styles.permissionContainer}>
                <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                >
                    <Text style={styles.permissionText}>Conceder Permissão</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
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
                            style={StyleSheet.absoluteFillObject}
                        >
                            {/* Texto auxiliar e linha central */}
                            <View style={styles.overlay}>
                                <Text style={styles.topText}>
                                    Alinhe o código de barras na linha central
                                </Text>

                                {/* Linha vermelha no centro */}
                                <View style={styles.redLine} />

                                <Text style={styles.bottomText}>
                                    A leitura será feita automaticamente
                                </Text>
                            </View>

                            {/* Botão para fechar a câmera */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsCameraVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </CameraView>
                    </View>
                </Modal>
            ) : (
                <View style={styles.scanButtonContainer}>
                    <TouchableOpacity onPress={() => setIsCameraVisible(true)}>
                        <Text style={styles.scanButtonText}>Scanear Código</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    permissionButton: {
        backgroundColor: "#4CAF50",
        padding: 12,
        borderRadius: 10,
    },
    permissionText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    overlay: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 100,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Fundo preto translúcido
    },
    redLine: {
        width: "90%",
        height: 2,
        backgroundColor: "#FF0000",
    },
    topText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
    },
    bottomText: {
        color: "#fff",
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
    },
    closeButton: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    scanButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    scanButtonText: {
        fontSize: Platform.OS == 'ios' ? 14 : 10,
        color: "#FF7100",
        fontWeight: "bold",
    },
});
