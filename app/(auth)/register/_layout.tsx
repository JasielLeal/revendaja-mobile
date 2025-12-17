import { Stack } from 'expo-router';
import { createContext, useContext, useState } from 'react';

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface RegisterContextType {
    data: RegisterData;
    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    reset: () => void;
}

const RegisterContext = createContext<RegisterContextType | null>(null);

export const useRegisterContext = () => {
    const context = useContext(RegisterContext);
    if (!context) {
        throw new Error('useRegisterContext must be used within RegisterLayout');
    }
    return context;
};

export default function RegisterLayout() {
    const [data, setData] = useState<RegisterData>({
        name: '',
        email: '',
        password: '',
    });

    const setName = (name: string) => setData(prev => ({ ...prev, name }));
    const setEmail = (email: string) => setData(prev => ({ ...prev, email }));
    const setPassword = (password: string) => setData(prev => ({ ...prev, password }));
    const reset = () => setData({ name: '', email: '', password: '' });

    return (
        <RegisterContext.Provider value={{ data, setName, setEmail, setPassword, reset }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="email" />
                <Stack.Screen name="password" />
            </Stack>
        </RegisterContext.Provider>
    );
}
