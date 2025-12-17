import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuccessScreen() {
    const colors = useThemeColors();
    const router = useRouter();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const checkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animação de entrada
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(checkAnim, {
                    toValue: 1,
                    friction: 3,
                    tension: 100,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleGoToLogin = () => {
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <View className="flex-1 px-6 justify-center items-center">
                {/* Logo */}
                <View className="items-center mb-8">
                    <Image
                        source={logo}
                        style={{ width: 120, height: 40 }}
                        contentFit="contain"
                    />
                </View>

                {/* Ícone de sucesso */}
                <Animated.View
                    className="w-24 h-24 rounded-full items-center justify-center mb-8"
                    style={{
                        backgroundColor: '#22c55e20',
                        transform: [{ scale: scaleAnim }],
                    }}
                >
                    <Animated.View style={{ transform: [{ scale: checkAnim }] }}>
                        <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
                    </Animated.View>
                </Animated.View>

                {/* Título */}
                <Animated.View style={{ opacity: opacityAnim }} className="items-center">
                    <Text
                        style={{ color: colors.foreground }}
                        className="text-2xl font-bold text-center"
                    >
                        Senha redefinida!
                    </Text>
                    <Text
                        style={{ color: colors.mutedForeground }}
                        className="text-base text-center mt-3 px-4"
                    >
                        Sua senha foi alterada com sucesso.{'\n'}
                        Agora você pode fazer login com sua nova senha.
                    </Text>
                </Animated.View>

                {/* Spacer */}
                <View className="flex-1" />

                {/* Botão */}
                <View className="w-full mb-8">
                    <Button
                        name="Ir para login"
                        onPress={handleGoToLogin}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
