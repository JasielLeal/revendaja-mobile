import axios from "axios";
import { router } from "expo-router";
import { authService } from "../services/auth";

export const api = axios.create({
  baseURL: "https://revendaja-backend-beta-production.up.railway.app/api", // coloque sua URL aqui
  timeout: 10000, // opcional: tempo máximo de resposta
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
    if (error.response?.status === 401) {
      // Token inválido ou expirado, remover token e redirecionar
      await authService.removeToken();
      router.replace("/(auth)/login");
    }
    return Promise.reject(error);
  }
);
