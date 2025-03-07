import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Modal, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

type SuccessContextProps = {
    displaySuccess: () => void;
};

const SuccessContext = createContext<SuccessContextProps | undefined>(undefined);

export const SuccessProvider = ({ children }: { children: ReactNode }) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const displaySuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000); // Duração da animação
    };

    return (
        <SuccessContext.Provider value={{ displaySuccess }}>
            {children}
            <Modal
                animationType="fade"
                visible={showSuccess}
                transparent={true} // Adicione este atributo para evitar problemas no Android
                onRequestClose={() => setShowSuccess(false)}
            >
                <SafeAreaView className="flex-1 flex justify-center items-center bg-[#121214] ">
                    <LottieView
                        source={require('@/assets/AnimationSuccess.json')}
                        autoPlay
                        loop={true}
                        style={{ width: 200, height: 200 }}
                    />
                </SafeAreaView>
            </Modal>
        </SuccessContext.Provider>
    );
};

export const useSuccess = () => {
    const context = useContext(SuccessContext);
    if (!context) {
        throw new Error('useSuccess deve ser usado dentro do SuccessProvider');
    }
    return context;
};
