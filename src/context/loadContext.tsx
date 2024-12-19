import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useIsMutating } from "@tanstack/react-query";

type LoadContextProps = {
    toggleLoad: (isOpen: boolean) => void; // Controla abertura/fechamento do BottomSheet
    open: boolean; // Estado do BottomSheet
};

const LoadContext = createContext<LoadContextProps | undefined>(undefined);

export function LoadProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false); // Controla estado do BottomSheet

    const isMutating = useIsMutating(); // Monitorando apenas mutations em andamento

    const toggleLoad = (isOpen: boolean) => {
        setOpen(isOpen); // Define se o BottomSheet será aberto ou fechado
    };

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["20%"], []);

    // Monitora o estado de mutations para abrir ou fechar o load automaticamente
    useEffect(() => {
        if (isMutating > 0) {
            setOpen(true); // Mostra o BottomSheet se houver mutation
        } else {
            setOpen(false); // Fecha quando as mutations terminam
        }
    }, [isMutating]);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    return (
        <LoadContext.Provider value={{ toggleLoad, open }}>
            {children}
            {/* Overlay para bloquear ações do usuário */}
            {open && <View style={styles.overlay} />}
            {/* BottomSheet sobreposto à overlay */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1} // Inicialmente fechado
                snapPoints={snapPoints}
                enablePanDownToClose
                onClose={() => setOpen(false)} // Atualiza o estado quando o BottomSheet é fechado
                style={styles.bottomSheet}
                handleStyle={{
                    backgroundColor: "#202020",
                }}
                handleIndicatorStyle={{
                    backgroundColor: "#fff",
                }}
            >
                <BottomSheetView className="flex-1 px-5 bg-forenground w-full items-center">
                    <View className="mt-7">
                        <ActivityIndicator />
                    </View>
                    <Text className="text-white font-medium mt-5 mb-2">Processando sua ação</Text>
                    <Text className="text-textForenground mb-10">
                        Aguarde enquanto sua ação está sendo processada
                    </Text>
                </BottomSheetView>
            </BottomSheet>
        </LoadContext.Provider>
    );
}

export function useLoad() {
    const context = useContext(LoadContext);
    if (!context) {
        throw new Error("useLoad deve ser usado dentro do LoadProvider");
    }
    return context;
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo translúcido/ Overlay abaixo do BottomSheet
    },
    bottomSheet: {
        position: "absolute",
        zIndex: 10, // Garante que o BottomSheet fique acima da overlay
    },
});
