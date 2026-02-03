import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import backgroundImage from "../../../assets/background.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { useRouter } from "expo-router";

export default function OnboardingPage() {

    const colors = useThemeColors();
    const router = useRouter();

    return (
        <ImageBackground
            source={backgroundImage}
            resizeMode="cover"
            style={styles.background}
            imageStyle={styles.image}
        >
            <LinearGradient
                colors={["rgba(0,0,0,0.68)", "rgba(0,0,0,0.35)"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                style={styles.gradient}
            />
            <SafeAreaView style={styles.container} className="justify-end px-5">
                <Text className="text-white text-3xl font-bold mb-4">
                    Seja bem-vindo ao Revendaja
                </Text>
                <Text className="text-white text-base mb-8">
                    Leve seu negócio ao próximo nível com uma gestão profissional feita para facilitar sua rotina e aumentar seus resultados.
                </Text>
                <Button name="Começar agora" onPress={()=> router.push("/(auth)/register")}/>
                <View className='flex flex-row items-center mt-5 justify-center'>
                    <Text className="text-white">
                        Já tem conta?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={{ color: colors.primary, fontWeight: '600' }}>
                            Fazer login
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
    },
});
