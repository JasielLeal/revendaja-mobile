import { Redirect } from 'expo-router';

export default function Index() {
    // Aqui você pode adicionar lógica para verificar se o usuário está logado
    // Por enquanto, vamos sempre redirecionar para login
    const isLoggedIn = false;

    if (isLoggedIn) {
        return <Redirect href="/(tabs)/home/home" />;
    }

    return <Redirect href="/(auth)/login" />;
}
