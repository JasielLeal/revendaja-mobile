import { useCreateStorePix } from "@/app/(tabs)/more/hooks/useCreateStorePix";
import { useStorePix } from "@/app/(tabs)/more/hooks/useStorePix";
import { useUpdateStorePix } from "@/app/(tabs)/more/hooks/useUpdateStorePix";
import { Dialog } from "@/components/ui/Dialog";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StorePixScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data, isLoading } = useStorePix();
    const { mutateAsync: createPix, isPending: isSaving } = useCreateStorePix();
    const { mutateAsync: updatePix, isPending: isUpdating } = useUpdateStorePix();
    const queryClient = useQueryClient();

    const [pixKey, setPixKey] = React.useState("");
    const [pixName, setPixName] = React.useState("");
    const [editingField, setEditingField] = React.useState<"pixKey" | "pixName" | null>(null);
    const [successDialogVisible, setSuccessDialogVisible] = React.useState(false);
    const [originalPixKey, setOriginalPixKey] = React.useState("");
    const [originalPixName, setOriginalPixName] = React.useState("");

    React.useEffect(() => {
        const nextKey = data?.pixKey ?? "";
        const nextName = data?.pixName ?? "";
        setPixKey(nextKey);
        setPixName(nextName);
        setOriginalPixKey(nextKey);
        setOriginalPixName(nextName);
    }, [data?.pixKey, data?.pixName]);

    const isConfigured = !!pixKey || !!pixName;
    const hasChanges =
        pixKey.trim() !== originalPixKey.trim() ||
        pixName.trim() !== originalPixName.trim();
    const canSave =
        pixKey.trim().length > 0 &&
        pixName.trim().length > 0 &&
        hasChanges;

    const handleSave = async () => {
        if (!canSave || isSaving || isUpdating) return;
        const payload = {
            pixKey: pixKey.trim(),
            pixName: pixName.trim(),
        };

        if (data?.pixKey || data?.pixName) {
            await updatePix(payload);
        } else {
            await createPix(payload);
        }
        await queryClient.invalidateQueries({ queryKey: ["store-pix"] });
        setOriginalPixKey(pixKey.trim());
        setOriginalPixName(pixName.trim());
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
                            Pix
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
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Status</Text>
                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                    {isLoading ? "Carregando..." : isConfigured ? "Configurado" : "Não configurado"}
                                </Text>
                            </View>
                            <Ionicons name="alert-circle-outline" size={20} color={colors.mutedForeground} />
                        </View>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={() => setEditingField("pixKey")}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Chave Pix</Text>
                                {editingField === "pixKey" ? (
                                    <TextInput
                                        value={pixKey}
                                        onChangeText={setPixKey}
                                        onBlur={() => setEditingField(null)}
                                        autoFocus
                                        placeholder="Digite a chave Pix"
                                        placeholderTextColor={colors.mutedForeground}
                                        style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}
                                    />
                                ) : (
                                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                        {pixKey || "Não informada"}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="pencil-outline" size={20} color={colors.mutedForeground} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={() => setEditingField("pixName")}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Nome do recebedor</Text>
                                {editingField === "pixName" ? (
                                    <TextInput
                                        value={pixName}
                                        onChangeText={setPixName}
                                        onBlur={() => setEditingField(null)}
                                        autoFocus
                                        placeholder="Digite o nome"
                                        placeholderTextColor={colors.mutedForeground}
                                        style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}
                                    />
                                ) : (
                                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                        {pixName || "Não informado"}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="pencil-outline" size={20} color={colors.mutedForeground} />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xs mt-4" style={{ color: colors.mutedForeground }}>
                        Configure o Pix para receber pagamentos rapidamente.
                    </Text>

                    <TouchableOpacity
                        className="mt-6 mb-10 py-4 rounded-xl items-center"
                        style={{
                            backgroundColor: canSave ? colors.primary : colors.border,
                            opacity: canSave ? 1 : 0.6,
                        }}
                        disabled={!canSave || isSaving || isUpdating}
                        onPress={handleSave}
                    >
                        <Text className="text-base font-semibold" style={{ color: colors.primaryForeground }}>
                            {isSaving || isUpdating ? "Salvando..." : "Salvar alterações"}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

                        <Dialog
                            visible={successDialogVisible}
                            title="Pix atualizado"
                            description="As informações do Pix foram salvas com sucesso."
                            confirmText="OK"
                            showCancel={false}
                            onConfirm={() => setSuccessDialogVisible(false)}
                        />
                    </View>
                );
            }
     