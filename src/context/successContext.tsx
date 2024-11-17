import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Modal } from 'react-native';
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
                transparent={true}
                visible={showSuccess}
                onRequestClose={() => setShowSuccess(false)}
            >
                <View className="flex-1 justify-center items-center bg-bg bg-opacity-50">
                    <View className="p-5 rounded-lg">
                        <LottieView
                            source={require('@/assets/AnimationSuccess.json')}
                            autoPlay
                            loop={false}
                            style={{ width: 200, height: 200 }}
                        />
                    </View>
                </View>
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
