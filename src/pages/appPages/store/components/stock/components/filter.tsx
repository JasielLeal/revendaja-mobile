import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FilterModalProps = {
    open: boolean; // Controla se o BottomSheet está aberto ou fechado
    onSelectOption: (option: string) => void; // Callback para exportar a opção selecionada
    onClose: () => void; // Callback para atualizar o estado do componente pai
};

export function Filter({ open, onSelectOption, onClose }: FilterModalProps) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const options = [
        { label: "Todos", value: "" },
        { label: "Personalizado", value: "personalizados" },
        { label: "Com Estoque", value: "comEstoque" },
        { label: "Sem Estoque", value: "semEstoque" },
    ];

    // Sincroniza a abertura/fechamento do BottomSheet com o estado `open`
    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    const handleOptionSelect = (value: string) => {
        setSelectedOption(value);
        onSelectOption(value); // Passa o valor selecionado para o componente pai
        onClose();
    };

    const handleClose = () => {
        bottomSheetRef.current?.close(); // Fecha o BottomSheet
        onClose(); // Atualiza o estado no componente pai
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={open ? 0 : -1}
            snapPoints={snapPoints}
            enablePanDownToClose
            onClose={onClose} // Garante que o estado seja atualizado ao fechar via gesto
            handleStyle={{
                backgroundColor: "#202020",
            }}
            handleIndicatorStyle={{
                backgroundColor: "#fff",
            }}
        >
            <BottomSheetView className="flex-1 px-5 bg-forenground w-full">
                <View className="flex flex-row items-center justify-between mb-5">
                    <Text className="text-white text-xl font-semibold">
                        Filtros
                    </Text>
                    <TouchableOpacity onPress={handleClose}>
                        <Text className="text-primaryPrimary">Fechar</Text>
                    </TouchableOpacity>
                </View>
                <View className="space-y-4 flex gap-3">
                    {options.map(({ label, value }) => (
                        <TouchableOpacity
                            key={value}
                            className={`py-3 px-4 rounded-lg ${selectedOption === value ? "bg-primaryPrimary" : "bg-bg"
                                }`}
                            onPress={() => handleOptionSelect(value)}
                        >
                            <Text className="text-white text-lg">{label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}
