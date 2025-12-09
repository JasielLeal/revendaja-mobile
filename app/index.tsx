import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './providers/AuthProvider';

export default function Index() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated) {
            router.replace('/(tabs)/home');
        } else {
            router.replace('/(auth)/login');
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}

