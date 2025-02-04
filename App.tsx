import { StatusBar } from "expo-status-bar";
import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "@/routes";
import { AuthProvider } from "@/context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-gesture-handler';
import { SuccessProvider } from "@/context/successContext";
import React, { useEffect, useState } from "react";
import { SocketProvider } from "@/context/SocketContext";
import { ExpoTokenProvider } from "@/context/expoTokenContext";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Toast, { BaseToast } from 'react-native-toast-message';
import { NotificationProvider } from "@/context/NotificationContext";
import { backend } from "@/api/backend";
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App() {

  const client = new QueryClient();
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

  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    const response = await backend.get("/stripe/FetchPublishableKey"); // fetch key from your server here
    setPublishableKey(response.data);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <>
      <GestureHandlerRootView>
        <StripeProvider publishableKey={publishableKey} urlScheme="revendaja" > 
          <QueryClientProvider client={client}>
            <NavigationContainer>
              <SuccessProvider>
                <NotificationProvider>
                  <AuthProvider>
                    <ExpoTokenProvider>
                      <SocketProvider>
                        <StatusBar backgroundColor="#000" style="light" />
                        <Routes />
                        <Toast
                          config={{
                            error: (props) => (
                              <BaseToast
                                {...props}
                                style={{ borderLeftColor: '#000', width: 'auto', marginHorizontal: 20, borderRadius: 15 }}
                                text1Style={{ fontSize: 16, fontWeight: 'bold', }}
                                text2Style={{ fontSize: 14, color: 'gray' }}
                              />
                            ),
                          }}
                        />
                      </SocketProvider>
                    </ExpoTokenProvider>
                  </AuthProvider>
                </NotificationProvider>
              </SuccessProvider>
            </NavigationContainer>
          </QueryClientProvider>
        </StripeProvider>
      </GestureHandlerRootView>
    </>
  );
}
