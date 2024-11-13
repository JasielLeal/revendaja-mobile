import { StatusBar } from "expo-status-bar";
import "./global.css";
import { GluestackUIProvider } from "@/components/gluestack-ui-provider";
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "@/routes";
import { AuthProvider } from "@/context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'react-native-gesture-handler';
import { SuccessProvider } from "@/context/successContext";

export default function App() {

  const client = new QueryClient()

  return (
    <>
      <GestureHandlerRootView>
        <GluestackUIProvider>
          <QueryClientProvider client={client}>
            <NavigationContainer>
              <SuccessProvider>
                <AuthProvider>
                  <StatusBar backgroundColor="#000" style="light" />
                  <Routes />
                </AuthProvider>
              </SuccessProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </GluestackUIProvider>
      </GestureHandlerRootView>

    </>
  );
}


