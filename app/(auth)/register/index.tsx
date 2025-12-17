import logo from "@/assets/logo.png";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { useRegisterContext } from "./_layout";

const nameSchema = z.object({
    name: z
        .string()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100, "Nome muito longo"),
});

type NameFormData = z.infer<typeof nameSchema>;

export default function RegisterNameScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { setName } = useRegisterContext();

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<NameFormData>({
        resolver: zodResolver(nameSchema),
        defaultValues: {
            name: '',
        },
        mode: 'onChange',
    });

    const onSubmit = (data: NameFormData) => {
        setName(data.name);
        router.push('/(auth)/register/email');
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header com botão voltar */}
                <View className="px-4 py-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Logo */}
                    <View className="items-center mb-6">
                        <Image
                            source={logo}
                            style={{ width: 120, height: 40 }}
                            contentFit="contain"
                        />
                    </View>

                    {/* Título */}
                    <View className="mb-8">
                        <Text
                            style={{ color: colors.foreground }}
                            className="text-2xl font-bold text-center"
                        >
                            Qual é o seu nome?
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base text-center mt-2"
                        >
                            Digite seu nome completo para começar
                        </Text>
                    </View>

                    {/* Campo Nome */}
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                label="Nome Completo"
                                placeholder="Seu nome completo"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                autoCapitalize="words"
                                autoCorrect={false}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Botão Continuar */}
                    <View className="mb-8">
                        <Button
                            name="Continuar"
                            disabled={!isValid}
                            onPress={handleSubmit(onSubmit)}
                        />

                        {/* Link para Login */}
                        <View className='flex flex-row items-center mt-5 justify-center'>
                            <Text style={{ color: colors.mutedForeground }}>
                                Não tem conta?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/register')}
                            >
                                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                                    Cadastre-se
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}