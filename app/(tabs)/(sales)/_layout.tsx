import { Stack } from 'expo-router';

export default function SalesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="sales"
                options={{
                    headerShown: false,
                    title: 'Vendas'
                }}
            />
        </Stack>
    );
}