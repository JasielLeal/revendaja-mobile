import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@revendaja:token";

export const authService = {
  async saveToken(tokenAccess: string) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, tokenAccess);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
  },

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
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
