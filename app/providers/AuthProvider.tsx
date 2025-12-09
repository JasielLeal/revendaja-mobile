import { registerPushToken } from '@/lib/registerPushToken';
import { connectToStore, disconnectSocket } from '@/lib/socket/socket';
import { useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../backend/api';
import { authService } from '../services/auth';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (token: string, userData: User) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
    children: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        loadStorageData();
        requestNotificationPermissions();

        // Configurar como notificações devem ser exibidas quando app está em primeiro plano
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }, []);

    async function requestNotificationPermissions() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('⚠️ Permissão de notificação negada');
            return;
        }

        console.log('✅ Permissão de notificação concedida');
    }

    // Registrar token de push quando usuário estiver autenticado
    useEffect(() => {
        if (user?.id) {
            console.log('📱 Registrando token de push...');
            registerPushToken(user.id);
        }
    }, [user?.id]);

    // Conectar socket para receber eventos de venda online e invalidar queries
    useEffect(() => {
        if (!user?.id) return;

        console.log('Conectando socket para userId:', user.id);
        connectToStore(user.id, queryClient);

        return () => {
            console.log('Desconectando socket da loja:', user.id);
            disconnectSocket();
        };
    }, [user?.id, queryClient]);

    async function loadStorageData() {
        try {
            const token = await authService.getToken();
            console.log('Token carregado do storage:', token);

            if (!token) {
                // Não há token salvo
                console.log('Nenhum token encontrado no storage');
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                // Validar token e buscar dados do usuário
                const response = await api.get<{
                    valid: boolean;
                    user: {
                        id: string;
                        email: string;
                        name: string;
                        role: string;
                        plan: string;
                        firstAccess: boolean;
                    };
                }>('/verify-token');

                if (response.data.valid && response.data.user) {
                    setUser(response.data.user);
                } else {
                    // Token inválido
                    console.log('Token inválido segundo a API');
                    await authService.removeToken();
                    setUser(null);
                }
            } catch (error) {
                // Erro ao validar token (provavelmente 401)
                console.log('Erro ao validar token:', error);
                await authService.removeToken();
                setUser(null);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do storage:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    } async function signIn(token: string, userData: User) {
        try {
            console.log('Salvando token durante o login:', token);
            await authService.saveToken(token);
            setUser(userData);
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            throw error;
        }
    }

    async function signOut() {
        try {
            await authService.removeToken();
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
}
