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
        </Stack>
    );
}