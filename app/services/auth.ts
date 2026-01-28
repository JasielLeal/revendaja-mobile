import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@revendaja:token";
const USER_KEY = "@revendaja:user";

interface StoreInformation {
  name: string;
  subdomain: string;
  phone: string;
  address: string;
  primaryColor: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
  firstAccess: boolean;
  token: string;
  store: boolean;
  storeInformation?: StoreInformation;
}

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
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (e) {
      console.error("Erro ao carregar token:", e);
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

  async saveUser(user: User) {
    try {
      if (!user || !user.id || !user.email || !user.name) {
        console.error("Erro: user inválido para salvar", user);
        return;
      }
      console.log("Salvando user no AsyncStorage:", user);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar user:", error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson);
        console.log("User carregado do AsyncStorage:", user);
        return user;
      }
      return null;
    } catch (e) {
      console.error("Erro ao carregar user:", e);
      return null;
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Erro ao remover user:", error);
    }
  },

  async logout() {
    try {
      await this.removeToken();
      await this.removeUser();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  },
};
