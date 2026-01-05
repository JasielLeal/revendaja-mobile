import Button from "@/components/ui/button";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateCustomProduct } from "./hooks/useCreateCustomProduct";
import { useQueryClient } from "@tanstack/react-query";

/* ================== helpers ================== */
function formatToBRL(value: string) {
    const onlyNumbers = value.replace(/\D/g, "");
    const numberValue = Number(onlyNumbers) / 100;
    return numberValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function parseCurrency(value: string) {
    if (!value) return 0;
    return Number(value.replace(/\D/g, "")) / 100;
}

/* ================== component ================== */
export default function CustomProductScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const mutation = useCreateCustomProduct();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [priceStr, setPriceStr] = useState("R$ 0,00");
    const [costPriceStr, setCostPriceStr] = useState("R$ 0,00");
    const [quantityStr, setQuantityStr] = useState("0");

    // 🔥 IMAGEM COMO URI (NÃO base64)
    const [imageUri, setImageUri] = useState<string | null>(null);

    const price = useMemo(() => parseCurrency(priceStr), [priceStr]);
    const costPrice = useMemo(
        () => parseCurrency(costPriceStr),
        [costPriceStr]
    );
    const quantity = useMemo(
        () => Number(quantityStr.replace(/\D/g, "")) || 0,
        [quantityStr]
    );

    const isValid =
        name.trim().length > 0 && price > 0 && costPrice >= 0 && quantity >= 0;

    /* ================== Image Picker ================== */
    const pickImage = async () => {
        Alert.alert("Selecionar imagem", "Escolha uma opção", [
            {
                text: "Câmera",
                onPress: async () => {
                    const { status } =
                        await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert(
                            "Permissão negada",
                            "Precisamos de permissão para acessar a câmera."
                        );
                        return;
                    }

                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                    });

                    if (!result.canceled) {
                        setImageUri(result.assets[0].uri);
                    }
                },
            },
            {
                text: "Galeria",
                onPress: async () => {
                    const { status } =
                        await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== "granted") {
                        Alert.alert(
                            "Permissão negada",
                            "Precisamos de permissão para acessar a galeria."
                        );
                        return;
                    }

                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                    });

                    if (!result.canceled) {
                        setImageUri(result.assets[0].uri);
                    }
                },
            },
            { text: "Cancelar", style: "cancel" },
        ]);
    };

    const queryClient = useQueryClient();

    /* ================== Submit ================== */
    const handleSubmit = () => {
        if (!isValid || mutation.isPending) return;

        mutation.mutate(
            {
                name: name.trim(),
                price: Math.round(price * 100), // Converte para centavos
                quantity,
                costPrice: Math.round(costPrice * 100), // Converte para centavos
                imgUrl: imageUri ?? undefined,
            },
            {
                onSuccess: () => {
                    Alert.alert("Sucesso", "Produto criado com sucesso!");
                    queryClient.invalidateQueries({ queryKey: ["store-products"] });
                    // router.back();
                },
                onError: (error: any) => {
                    Alert.alert(
                        "Erro",
                        error.response?.data?.message || "Erro ao criar produto"
                    );
                },
            }
        );
    };

    /* ================== UI ================== */
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View className="px-5 pb-4 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name="chevron-back"
                            size={28}
                            color={colors.foreground}
                        />
                    </TouchableOpacity>

                    <Text
                        className="text-xl font-bold flex-1 ml-4"
                        style={{ color: colors.foreground }}
                    >
                        Novo produto
                    </Text>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    >
                        {/* Nome */}
                        <View className="mb-4">
                            <Text style={{ color: colors.foreground }}>
                                Nome do produto
                            </Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder="Ex: Kit presente"
                                placeholderTextColor={colors.mutedForeground}
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            />
                        </View>

                        {/* Preço */}
                        <View className="mb-4">
                            <Text style={{ color: colors.foreground }}>
                                Preço de venda
                            </Text>
                            <TextInput
                                keyboardType="numeric"
                                value={priceStr}
                                onChangeText={(t) => setPriceStr(formatToBRL(t))}
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            />
                        </View>

                        {/* Custo */}
                        <View className="mb-4">
                            <Text style={{ color: colors.foreground }}>
                                Preço de custo
                            </Text>
                            <TextInput
                                keyboardType="numeric"
                                value={costPriceStr}
                                onChangeText={(t) => setCostPriceStr(formatToBRL(t))}
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            />
                        </View>

                        {/* Quantidade */}
                        <View className="mb-4">
                            <Text style={{ color: colors.foreground }}>
                                Quantidade em estoque
                            </Text>
                            <TextInput
                                keyboardType="numeric"
                                value={quantityStr}
                                onChangeText={(t) => setQuantityStr(t.replace(/\D/g, ""))}
                                style={{
                                    backgroundColor: colors.card,
                                    color: colors.foreground,
                                    borderRadius: 12,
                                    padding: 16,
                                }}
                            />
                        </View>

                        {/* Imagem */}
                        <View className="mb-6">
                            <Text style={{ color: colors.foreground }}>
                                Foto do produto
                            </Text>

                            {imageUri && (
                                <View className="mb-3">
                                    <Image
                                        source={{ uri: imageUri }}
                                        style={{
                                            width: "100%",
                                            height: 200,
                                            borderRadius: 12,
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setImageUri(null)}
                                        className="mt-2 py-2 rounded-lg items-center"
                                        style={{ backgroundColor: "#ef444415" }}
                                    >
                                        <Text style={{ color: "#ef4444", fontWeight: "600" }}>
                                            Remover foto
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={pickImage}
                                className="py-3 rounded-lg border-2 items-center border-dashed"
                                style={{ borderColor: colors.primary }}
                            >
                                <Ionicons
                                    name="camera"
                                    size={24}
                                    color={colors.primary}
                                />
                                <Text style={{ color: colors.primary, marginTop: 6 }}>
                                    Tirar foto ou escolher da galeria
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            name={mutation.isPending ? "Salvando..." : "Salvar produto"}
                            onPress={handleSubmit}
                            disabled={!isValid || mutation.isPending}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
