import React, { useEffect, useMemo, useRef } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';  // Assumindo que você está usando a biblioteca 'gorhom/bottom-sheet'
import { Button } from '@/components/buttton';
import { QuantityInput } from '@/components/QuantityInput';

type FilterModalProps = {
    open: boolean;
    onClose: () => void;
    product: any;  // Novo prop para receber os dados do produto
};

export function DetailsProduct({ open, onClose, product }: FilterModalProps) {

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["90%"], []);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [open]);

    if (!product) {
        return null; // Não renderiza o modal se não houver produto
    }

    const handleSheetChange = (index: number) => {
        // Se o índice for -1, chama a função onClose
        if (index === -1) {
            onClose();
        }
    };

    return (
        <>
            {open && (
                <View style={styles.overlay} />
            )}
            <BottomSheet
                ref={bottomSheetRef}
                index={open ? 0 : -1}
                snapPoints={snapPoints}
                enablePanDownToClose
                onChange={handleSheetChange}
                style={styles.bottomSheet}
                handleStyle={{
                    backgroundColor: "#202020",
                }}
                handleIndicatorStyle={{
                    backgroundColor: "#fff",
                }}
            >
                <BottomSheetView className='px-5 bg-forenground w-full flex-1'>
                    <View className='flex items-center mt-10'>
                        <Image
                            source={product.imgUrl ? { uri: product.imgUrl } : require("@/assets/kaiak.jpg")}
                            className="w-[200px] h-[200px] rounded-xl"
                        />

                    </View>
                    <View>
                        <Text className='font-medium text-2xl text-white mt-5'>{product.name}</Text>
                        <Text className='text-white'>{product.company}</Text>

                        <Text className='font-medium mt-5 text-white'>De: R$ {(Number(product.normalPrice) / 100).toFixed(2).replace('.', ',')}</Text>
                        <Text className='font-medium text-lg text-primaryPrimary'>Sugerido: R$ {(Number(product.suggestedPrice) / 100).toFixed(2).replace('.', ',')}</Text>
                    </View>

                    <TextInput className='bg-bg text-white p-3 rounded-xl mt-5' placeholder='Adicione seu valor de venda' placeholderTextColor={'#7D7D7D'} keyboardType='name-phone-pad' />
                    {
                        Platform.OS == 'ios' ?
                            <Text className='text-textForenground text-sm mt-2 mb-5' >
                                Obs: se não adicionar valor ao produto ele ira com o valor sugerido.
                            </Text>

                            :
                            <Text className='text-textForenground text-xs mt-2 mb-5' >
                                Obs: se não adicionar valor ao produto ele ira com o valor sugerido.
                            </Text>
                    }

                    <QuantityInput />

                    <View className='mb-10'>
                        <Button name='Adicionar' />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </>


    );
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
