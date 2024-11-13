import { createContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Ajuste caso seja necessário
import { ActivityIndicator, Alert, View } from "react-native";
import { Session } from "@/pages/authPages/login/services/Session";
import { jwtDecode } from "jwt-decode";

interface AuthContextData {
  signed: boolean;
  user: User | null;
  singInFc(data: FieldValues): Promise<void>;
  logoutFc(): Promise<void>;
  updateUserHasStore(hasStore: boolean): void;
  loading: boolean;
}

interface User {
  id: string;
  name: string;
  secondName: string;
  role: string;
  email: string;
  token: string;
  avatar: string;
  userHasStore: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      try {
        
        const storagedToken = await AsyncStorage.getItem('token');
        const storagedUser = await AsyncStorage.getItem('user');

        if (storagedToken && storagedUser) {
          const decodedToken = jwtDecode(storagedToken);

          if (!decodedToken?.exp) {
            return console.error('Erro ao carregar os dados do armazenamento');
          }

          const currentDate = new Date();
          const expirationDate = new Date(decodedToken?.exp * 1000);

          if (expirationDate < currentDate) {
            setUser(null);
            await AsyncStorage.clear();
          } else {
            setUser(JSON.parse(storagedUser));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do armazenamento:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  async function singInFc(dataValue: FieldValues) {
    try {
      
      setLoading(true);
      const response = await Session(dataValue);
      const { data } = response;
      setUser(data.user);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
    } catch (e) {
      Alert.alert("Erro no Login", "Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function logoutFc() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setUser(null);
  }

  function updateUserHasStore(hasStore: boolean) {
    if (user) {
      const updatedUser = { ...user, userHasStore: hasStore };
      setUser(updatedUser);
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, singInFc, loading, logoutFc, updateUserHasStore }}>
      {loading ? (
        <View className="flex items-center justify-center h-screen w-full bg-[#121212]">
          <ActivityIndicator size="large" color={"#FF7100"} />
        </View>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export default AuthContext;
