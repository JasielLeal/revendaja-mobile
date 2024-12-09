import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { Text } from "react-native";

type FilterModalProps = {
    open: boolean; // Controla se o BottomSheet está aberto ou fechado
    onClose: () => void; // Callback para atualizar o estado do componente pai
};

export function DetailsProduct({ open, onClose }: FilterModalProps) {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    
    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    return (
        <>
            <BottomSheet 
                ref={bottomSheetRef}
                index={open ? 0 : -1}
                snapPoints={snapPoints}
                enablePanDownToClose
            >
            <BottomSheetView>
                <View>
                    <Text>
                        teste
                    </Text>
                </View>
            </BottomSheetView>
            </BottomSheet>
        </>
    )
}