import { Stack } from 'expo-router';
import { createContext, useContext, useState } from 'react';

interface ForgotPasswordData {
    email: string;
    otpCode: string;
}

interface ForgotPasswordContextType {
    data: ForgotPasswordData;
    setEmail: (email: string) => void;
    setOtpCode: (code: string) => void;
    reset: () => void;
}

const ForgotPasswordContext = createContext<ForgotPasswordContextType | null>(null);

export const useForgotPasswordContext = () => {
    const context = useContext(ForgotPasswordContext);
    if (!context) {
        throw new Error('useForgotPasswordContext must be used within ForgotPasswordLayout');
    }
    return context;
};

export default function ForgotPasswordLayout() {
    const [data, setData] = useState<ForgotPasswordData>({
        email: '',
        otpCode: '',
    });

    const setEmail = (email: string) => setData(prev => ({ ...prev, email }));
    const setOtpCode = (otpCode: string) => setData(prev => ({ ...prev, otpCode }));
    const reset = () => setData({ email: '', otpCode: '' });

    return (
        <ForgotPasswordContext.Provider value={{ data, setEmail, setOtpCode, reset }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="verify" />
                <Stack.Screen name="new-password" />
                <Stack.Screen name="success" />
            </Stack>
        </ForgotPasswordContext.Provider>
    );
}
