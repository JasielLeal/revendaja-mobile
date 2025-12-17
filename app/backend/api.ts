import axios from "axios";
import { router } from "expo-router";
import { authService } from "../services/auth";

export const api = axios.create({
  // baseURL: "https://revendaja-backend-beta-production.up.railway.app/api",
  baseURL: "http://192.168.100.153:3333/api",
  timeout: 10000,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  async (config) => {
    const token = await authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || "";

    // Não redirecionar se for erro de login/registro (rotas públicas)
    const isAuthRoute =
      requestUrl.includes("/signin") ||
      requestUrl.includes("/signup") ||
      requestUrl.includes("/forgot-password") ||
      requestUrl.includes("/reset-password");

    if (error.response?.status === 401 && !isAuthRoute) {
      // Token inválido ou expirado, remover token e redirecionar
      await authService.removeToken();
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  }
);
