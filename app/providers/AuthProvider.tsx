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

    useEffect(() => {
        loadStorageData();
    }, []);

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

                console.log("response.data", response.data);

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
