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
            <Stack.Screen
                name="components/plans-screen"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="components/store-screen"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="components/configurations"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="components/store-info"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="components/store-pix"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="components/store-appearance"
                options={{
                    headerShown: false,
                }}
            />
            
        </Stack>
    );
}