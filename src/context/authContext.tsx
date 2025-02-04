import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Ajuste caso seja necessário
import { ActivityIndicator, Alert, View } from "react-native";
import { Session } from "@/pages/authPages/login/services/Session";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPlan } from "@/pages/appPages/profile/services/GetPlan";

interface AuthContextData {
  signed: boolean;
  user: User | null;
  singInFc(data: FieldValues): Promise<void>;
  logoutFc(): Promise<void>;
  updateUserHasStore(hasStore: boolean): void;
  loading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>
}

interface User {
  id: string;
  name: string;
  secondName: string;
  role: string;
  email: string;
  token: string;
  image: string;
  status: string
  userHasStore: boolean;
  plan: string
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const navigate = useNavigation<StackNavigationProp<RootStackParamList>>()

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
      queryClient.invalidateQueries({ queryKey: ["GetPlan"] });
    } catch (e: any) {
      console.log(e);
      console.log(JSON.stringify(e, null, 4));

      if (e.response?.status === 401) {
        // Credenciais inválidas
        Alert.alert(
          "Credenciais inválidas",
          "O e-mail ou a senha fornecidos estão incorretos. Por favor, tente novamente."
        );
      } else if (e.response?.status === 403) {
        // E-mail não confirmado

        const email = dataValue.email;

        Alert.alert(
          "Confirmação pendente",
          "Seu e-mail ainda não foi confirmado. Vamos redirecioná-lo para a tela de confirmação.",
          [
            {
              text: "Confirmar Agora",
              onPress: () => navigate.navigate("emailConfirmation", { email }),
            },
          ]
        );
      } else {
        // Erro genérico
        Alert.alert(
          "Erro ao realizar o login",
          "Algo deu errado. Por favor, tente novamente mais tarde."
        );
      }
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

  const { data, isSuccess } = useQuery({
    queryKey: ["GetPlan"],
    queryFn: GetPlan,
  });

  useEffect(() => {

    if (isSuccess && data) {
      setUser((prevUser) => {
        if (prevUser) {
          const updatedUser = { ...prevUser, plan: data.plan };
          AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        }
        return prevUser;
      });
    }
  }, [isSuccess, data]);

  return (
    <AuthContext.Provider value={{ signed: !!user, user, setUser, singInFc, loading, logoutFc, updateUserHasStore }}>
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
