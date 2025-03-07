import { StatusBar } from "expo-status-bar";
import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "@/routes";
import { AuthProvider } from "@/context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-gesture-handler';
import { SuccessProvider } from "@/context/successContext";
import React, { useEffect, useState, useCallback } from "react";
import { SocketProvider } from "@/context/SocketContext";
import { ExpoTokenProvider } from "@/context/expoTokenContext";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Toast, { BaseToast } from 'react-native-toast-message';
import { backend } from "@/api/backend";
import { StripeProvider } from '@stripe/stripe-react-native';
import * as SplashScreen from 'expo-splash-screen';
import { toastConfig } from "@/utils/toastConfig";
import { NotificationsProvider } from "@/context/notificationsContext";

export default function App() {
  const client = new QueryClient();
  const [publishableKey, setPublishableKey] = useState('');
  const [appIsReady, setAppIsReady] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    if (Platform.OS === "ios") {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Mantenha a splash screen visível enquanto carrega os recursos
        await SplashScreen.preventAutoHideAsync();
        await fetchPublishableKey();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const fetchPublishableKey = async () => {
    const response = await backend.get("/stripe/FetchPublishableKey"); // fetch key from your server here
    setPublishableKey(response.data);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView onLayout={onLayoutRootView}>
      <StripeProvider publishableKey={publishableKey} urlScheme="revendaja" >
        <QueryClientProvider client={client}>
          <NavigationContainer>
            <SuccessProvider>
              <AuthProvider>
                <ExpoTokenProvider>
                  <NotificationsProvider>
                    <SocketProvider>
                      <StatusBar backgroundColor="#000" style="light" />
                      <Routes />
                      <Toast
                        config={toastConfig}
                      />
                    </SocketProvider>
                  </NotificationsProvider>
                </ExpoTokenProvider>
              </AuthProvider>
            </SuccessProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
