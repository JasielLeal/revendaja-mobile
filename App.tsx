import { StatusBar } from "expo-status-bar";
import "./global.css";
import { GluestackUIProvider } from "@/components/gluestack-ui-provider";
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "@/routes";
import { AuthProvider } from "@/context/authContext";
export default function App() {
  return (
    <>
      <GluestackUIProvider>
        <NavigationContainer>
          <GestureHandlerRootView>
            <AuthProvider>
              <StatusBar backgroundColor="#000" style="light" />
              <Routes />
            </AuthProvider>
          </GestureHandlerRootView>
        </NavigationContainer>
      </GluestackUIProvider>
    </>
  );
}


