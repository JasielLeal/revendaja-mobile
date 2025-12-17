import { Stack } from 'expo-router';
import { createContext, useContext, useState } from 'react';

interface StoreData {
    name: string;
    phone: string;
    address: string;
    primaryColor: string;
}

interface StoreContextType {
    data: StoreData;
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
    setAddress: (address: string) => void;
    setPrimaryColor: (color: string) => void;
    reset: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => {
    const context = useContext(StoreContext);
    if (!context) {
        throw new Error('useStoreContext must be used within CreateStoreLayout');
    }
    return context;
};

export default function CreateStoreLayout() {
    const [data, setData] = useState<StoreData>({
        name: '',
        phone: '',
        address: '',
        primaryColor: '#85338F',
    });

    const setName = (name: string) => setData(prev => ({ ...prev, name }));
    const setPhone = (phone: string) => setData(prev => ({ ...prev, phone }));
    const setAddress = (address: string) => setData(prev => ({ ...prev, address }));
    const setPrimaryColor = (color: string) => setData(prev => ({ ...prev, primaryColor: color }));
    const reset = () => setData({ name: '', phone: '', address: '', primaryColor: '#85338F' });

    return (
        <StoreContext.Provider value={{ data, setName, setPhone, setAddress, setPrimaryColor, reset }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="details" />
            </Stack>
        </StoreContext.Provider>
    );
}
