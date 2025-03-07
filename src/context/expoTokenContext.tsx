import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { backend } from "@/api/backend";
import AuthContext from "./authContext";

type PushTokenContextType = {
    pushToken: string | null;
    registerPushToken: () => void;
};

const ExpoTokenContext = createContext<PushTokenContextType>({
    pushToken: null,
    registerPushToken: () => { },
});

export const ExpoTokenProvider = ({ children }: { children: React.ReactNode }) => {
    const [pushToken, setPushToken] = useState<string | null>(null);

    const registerPushToken = async () => {
        try {

            const currentToken = (await Notifications.getExpoPushTokenAsync()).data;
            const savedToken = await AsyncStorage.getItem("pushToken");

            console.log(`currentToken ${currentToken}`);
            console.log(`savedToken ${savedToken}`);

            // Verifica se o token atual é diferente do salvo
            if (currentToken !== savedToken) {
                // Envia o token para o backend (tanto para o primeiro envio quanto para atualizações)
                await backend.put("/user/UpdatedExpoToken", {
                    token: currentToken,
                });

                // Salva o novo token no AsyncStorage
                await AsyncStorage.setItem("pushToken", currentToken);

                // Atualiza o estado no contexto
                setPushToken(currentToken);
                console.log("Token registrado ou atualizado:", currentToken);
            } else {
                setPushToken(savedToken);
                console.log("Token já está atualizado:", savedToken);
            }
        } catch (error) {
            console.error("Erro ao registrar o push token:", error);
        }
    };

    // Verifica o token ao montar o contexto
    useEffect(() => {
        registerPushToken();
    }, []);

    return (
        <ExpoTokenContext.Provider value={{ pushToken, registerPushToken }}>
            {children}
        </ExpoTokenContext.Provider>
    );
};

// Hook para acessar o contexto
export const usePushToken = () => {
    return useContext(ExpoTokenContext);
};
