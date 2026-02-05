import { useStoreMe } from "@/app/(tabs)/more/hooks/useStoreMe";
import { useUpdateBranding } from "@/app/(tabs)/more/hooks/useUpdateBranding";
import { Dialog } from "@/components/ui/Dialog";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StoreAppearanceScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data: store } = useStoreMe();
    const queryClient = useQueryClient();
    const { mutateAsync: updateBranding, isPending: isSaving } = useUpdateBranding();

    const [primaryColor, setPrimaryColor] = React.useState("#F59E0B");
    const [originalColor, setOriginalColor] = React.useState("#F59E0B");
    const [logoUri, setLogoUri] = React.useState<string | null>(null);
    const [originalLogo, setOriginalLogo] = React.useState<string | null>(null);
    const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
    const [successDialogVisible, setSuccessDialogVisible] = React.useState(false);

    const colorPalette = [
        "#F59E0B",
        "#F97316",
        "#EF4444",
        "#EC4899",
        "#8B5CF6",
        "#6366F1",
        "#3B82F6",
        "#0EA5E9",
        "#14B8A6",
        "#22C55E",
        "#84CC16",
        "#A3A3A3",
    ];

    const hasChanges = primaryColor !== originalColor || logoUri !== originalLogo;

    React.useEffect(() => {
        if (store?.primaryColor) {
            setPrimaryColor(store.primaryColor);
            setOriginalColor(store.primaryColor);
        }
        if (store?.logo) {
            setLogoUri(store.logo);
            setOriginalLogo(store.logo);
        }
    }, [store?.primaryColor]);

    const pickLogo = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permissão negada", "Precisamos de permissão para acessar a galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setLogoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;
        await updateBranding({
            primaryColor,
            storeName: store?.name ?? "",
            imageUri: logoUri ?? undefined,
        });
        await queryClient.invalidateQueries({ queryKey: ["store-me"] });
        setOriginalColor(primaryColor);
        setOriginalLogo(logoUri);
        setSuccessDialogVisible(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView className="px-6">
                    <View className="flex flex-row items-center justify-between gap-4">
                        <TouchableOpacity
                            style={{ marginBottom: 20, borderRadius: 15, padding: 6, borderColor: colors.border, borderWidth: 1 }}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                        </TouchableOpacity>

                        <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
                            Aparência
                        </Text>

                        <View style={{ width: 40, height: 40 }} />
                    </View>

                    <View
                        className="rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + "20",
                            borderWidth: 1,
                        }}
                    >
                        <View
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                        >
                            <View>
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Tema</Text>
                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Padrão</Text>
                            </View>
                            <Ionicons name="color-palette-outline" size={20} color={colors.mutedForeground} />
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={() => setColorPickerVisible(true)}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Cor primária</Text>
                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                    {primaryColor}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <View
                                    style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: primaryColor }}
                                />
                                <Ionicons name="color-palette-outline" size={20} color={colors.mutedForeground} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={pickLogo}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Logo</Text>
                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                    {logoUri ? "Logo selecionada" : "Selecionar logo"}
                                </Text>
                            </View>
                            {logoUri ? (
                                <Image
                                    source={{ uri: logoUri }}
                                    style={{ width: 32, height: 32, borderRadius: 6 }}
                                />
                            ) : (
                                <Ionicons name="image-outline" size={20} color={colors.mutedForeground} />
                            )}
                        </TouchableOpacity>

                    </View>

                    <Text className="text-xs mt-4" style={{ color: colors.mutedForeground }}>
                        Personalize o visual da sua loja para aumentar conversões.
                    </Text>

                    <TouchableOpacity
                        className="mt-6 mb-10 py-4 rounded-xl items-center"
                        style={{
                            backgroundColor: hasChanges ? colors.primary : colors.border,
                            opacity: hasChanges ? 1 : 0.6,
                        }}
                        disabled={!hasChanges || isSaving}
                        onPress={handleSave}
                    >
                        <Text className="text-base font-semibold" style={{ color: colors.primaryForeground }}>
                            {isSaving ? "Salvando..." : "Salvar alterações"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            <Dialog
                visible={successDialogVisible}
                title="Alterações salvas"
                description="A aparência da loja foi atualizada."
                confirmText="OK"
                showCancel={false}
                onConfirm={() => setSuccessDialogVisible(false)}
            />

            <Modal visible={colorPickerVisible} transparent animationType="fade">
                <View className="flex-1 items-center justify-center bg-black/60">
                    <View
                        className="w-4/5 rounded-2xl p-5"
                        style={{ backgroundColor: colors.card }}
                    >
                        <Text
                            className="text-lg font-semibold text-center mb-4"
                            style={{ color: colors.foreground }}
                        >
                            Escolha uma cor
                        </Text>

                        <View className="flex-row flex-wrap justify-between">
                            {colorPalette.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    className="mb-3"
                                    onPress={() => {
                                        setPrimaryColor(color);
                                        setColorPickerVisible(false);
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 22,
                                            backgroundColor: color,
                                            borderWidth: color === primaryColor ? 3 : 1,
                                            borderColor: color === primaryColor ? colors.foreground : colors.border + "40",
                                        }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            className="mt-2 py-3 rounded-full"
                            style={{ backgroundColor: colors.border + "40" }}
                            onPress={() => setColorPickerVisible(false)}
                        >
                            <Text className="text-center" style={{ color: colors.foreground }}>
                                Fechar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
