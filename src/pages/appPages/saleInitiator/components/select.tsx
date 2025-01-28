import { Button } from "@/components/buttton";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";

type SelectPaymentMethodModalProps = {
  open: boolean;
  onSelectPaymentMethod: (method: string) => void; // Função de callback para passar a opção para o pai
};

export function SelectPaymentMethod({
  open,
  onSelectPaymentMethod,
}: SelectPaymentMethodModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["34%"], []);
  const [isOpen, setIsOpen] = useState(open);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Controlando o fechamento e abertura do BottomSheet
  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.expand();
      setIsOpen(true);
    } else {
      bottomSheetRef.current?.close();
      setIsOpen(false);
    }
  }, [open]);

  // Função chamada quando uma opção é selecionada
  const handleSelect = (method: string) => {

    bottomSheetRef.current?.close();
    setIsOpen(false);
    setSelectedMethod(method); 
    onSelectPaymentMethod(method); 
  
  };

  // Quando o BottomSheet é fechado pelo deslizamento ou outro meio
  const handleSheetChanges = (index: number) => {
    if (index === -1) {
      setIsOpen(false); // Fecha o overlay quando o BottomSheet é fechado
    }
  };

  return (
    <>
      {/* Overlay para os 70% da tela */}
      {isOpen && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Overlay semi-transparente
            zIndex: 0, // Mantém o overlay atrás do BottomSheet
          }}
        />
      )}

      
     

      <BottomSheet
        ref={bottomSheetRef}
        index={open ? 1 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose
        handleStyle={{
          backgroundColor: "#202020",
        }}
        handleIndicatorStyle={{
          backgroundColor: "#fff",
        }}
        onChange={handleSheetChanges} // Detecta quando o BottomSheet é fechado
      >
        <BottomSheetView className="flex-1 px-5 bg-forenground w-full">
          <View className="w-full h-screen-safe">
            <View className="mb-10 flex gap-3">
              <TouchableOpacity onPress={() => handleSelect("Pix")}>
                <Text className="text-white mb-2 bg-bg p-4 rounded-xl">Pix</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect("Cartão")}>
                <Text className="text-white mb-2 bg-bg p-4 rounded-xl">Cartão</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelect("Dinheiro")}>
                <Text className="text-white mb-2 bg-bg p-4 rounded-xl">Dinheiro</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
