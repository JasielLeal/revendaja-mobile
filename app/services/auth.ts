import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@revendaja:token";

export const authService = {
  async saveToken(tokenAccess: string) {
    try {
      console.log('Salvando token:', tokenAccess);
      await AsyncStorage.setItem(TOKEN_KEY, tokenAccess);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  },

  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('Token carregado do getToken:', token);
      return token;
    } catch (error) {
      console.error("Erro ao buscar token:", error);
      return null;
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Erro ao remover token:", error);
    }
  },
};
