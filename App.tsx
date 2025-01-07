import { StatusBar } from "expo-status-bar";
import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Routes } from "@/routes";
import { AuthProvider } from "@/context/authContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-gesture-handler';
import { SuccessProvider } from "@/context/successContext";
import React, { useState } from "react";
import { SocketProvider } from "@/context/SocketContext";
import { ExpoTokenProvider } from "@/context/expoTokenContext";

export default function App() {

  const client = new QueryClient();

  return (
    <>
      <GestureHandlerRootView>

        <QueryClientProvider client={client}>
          <NavigationContainer>
            <SuccessProvider>
              <AuthProvider>
                <ExpoTokenProvider>
                  <SocketProvider>
                    <StatusBar backgroundColor="#000" style="light" />
                    <Routes />
                  </SocketProvider>
                </ExpoTokenProvider>
              </AuthProvider>
            </SuccessProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </>
  );
}
