import { Stack } from 'expo-router';

export default function NewSaleLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="new-sale"
                options={{
                    headerShown: false,
                    title: 'Nova venda'
                }}
            />
        </Stack>
    );
}