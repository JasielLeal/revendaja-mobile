import { Stack } from 'expo-router';

export default function MoreLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="more"
                options={{
                    headerShown: false,
                    title: 'Mais'
                }}
            />
            <Stack.Screen
                name="components/account-screen"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="components/plan-screen"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}