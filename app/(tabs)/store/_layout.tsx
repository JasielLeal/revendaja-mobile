import { Stack } from 'expo-router';

export default function StoreLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="store"
                options={{
                    headerShown: false,
                    title: 'Loja'
                }}
            />
            <Stack.Screen
                name="catalog"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}