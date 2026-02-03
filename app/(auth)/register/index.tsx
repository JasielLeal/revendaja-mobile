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
                <View className="mb-6 px-4 flex flex-row items-center justify-between gap-4" >
                    <TouchableOpacity style={{ marginBottom: 20, borderRadius: 15, padding: 6, borderColor: colors.border, borderWidth: 1 }}>
                        <Text className='text-white' onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
                        Crie sua conta
                    </Text>

                    <View style={{ width: 40, height: 40 }} />
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    {/* Título */}
                    <View className="mb-8">
                        <Text
                            style={{ color: colors.foreground }}
                            className="text-2xl font-bold"
                        >
                            Qual é o seu nome?
                        </Text>
                        <Text
                            style={{ color: colors.mutedForeground }}
                            className="text-base mt-2"
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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}