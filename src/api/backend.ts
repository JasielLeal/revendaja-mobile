import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const backend = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_DEV,
});

backend.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
