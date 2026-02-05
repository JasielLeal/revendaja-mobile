import { formatDomain, useDomainAvailability } from "@/app/(tabs)/more/hooks/useDomainAvailability";
import { useStoreMe } from "@/app/(tabs)/more/hooks/useStoreMe";
import { useUpdateStore } from "@/app/(tabs)/more/hooks/useUpdateStore";
import { Dialog } from "@/components/ui/Dialog";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StoreInfoScreen() {
    const colors = useThemeColors();
    const router = useRouter();
    const { data: store } = useStoreMe();
    const queryClient = useQueryClient();

    const [form, setForm] = React.useState({
        name: "",
        subdomain: "",
        phone: "",
        address: "",
    });
    const [editingField, setEditingField] = React.useState<"name" | "phone" | "address" | null>(null);
    const [debouncedDomain, setDebouncedDomain] = React.useState("");
    const [successDialogVisible, setSuccessDialogVisible] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");

    const original = React.useMemo(
        () => ({
            name: store?.name ?? "",
            subdomain: store?.subdomain ?? "",
            phone: store?.phone ?? "",
            address: store?.address ?? "",
        }),
        [store?.address, store?.name, store?.phone, store?.subdomain]
    );

    React.useEffect(() => {
        setForm(original);
    }, [original]);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedDomain(form.subdomain);
        }, 600);

        return () => clearTimeout(handler);
    }, [form.subdomain]);

    const hasChanges =
        form.name !== original.name ||
        form.subdomain !== original.subdomain ||
        form.phone !== original.phone ||
        form.address !== original.address;

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleNameChange = (value: string) => {
        const nextDomain = value ? formatDomain(value) : "";
        setForm((prev) => ({ ...prev, name: value, subdomain: nextDomain }));
    };

    const shouldCheckDomain = debouncedDomain.length >= 3 && debouncedDomain !== original.subdomain;
    const { data: domainAvailability, isFetching: isCheckingDomain, error: domainError } = useDomainAvailability(
        shouldCheckDomain ? debouncedDomain : ""
    );
    const showDomainStatus = shouldCheckDomain;
    const isDomainAvailable = shouldCheckDomain
        ? domainAvailability?.available === true
        : debouncedDomain === original.subdomain;
    const isDomainUnavailable = shouldCheckDomain
        ? domainAvailability?.available === false || !!domainError
        : false;

    console.log(isDomainAvailable)

    const { mutateAsync: updateStore, isPending: isSaving } = useUpdateStore();

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;
        const changedFields: string[] = [];
        if (form.name !== original.name) changedFields.push("Nome da loja");
        if (form.phone !== original.phone) changedFields.push("Contato");
        if (form.address !== original.address) changedFields.push("Endereço");

        await updateStore({
            name: form.name,
            address: form.address,
            phone: form.phone,
        });
        await queryClient.invalidateQueries({ queryKey: ["store-me"] });
        setEditingField(null);
        if (changedFields.length > 0) {
            setSuccessMessage(`Atualizado: ${changedFields.join(", ")}.`);
            setSuccessDialogVisible(true);
        }
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
                            Informações da loja
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
                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={() => setEditingField("name")}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Nome da loja</Text>
                                {editingField === "name" ? (
                                    <TextInput
                                        value={form.name}
                                        onChangeText={handleNameChange}
                                        onBlur={() => setEditingField(null)}
                                        autoFocus
                                        placeholder="Digite o nome"
                                        placeholderTextColor={colors.mutedForeground}
                                        style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}
                                    />
                                ) : (
                                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                        {form.name || "Não informado"}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="pencil-outline" size={20} color={colors.mutedForeground} />
                        </TouchableOpacity>

                        <View
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Subdomínio</Text>
                                <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                    {form.subdomain || "Não informado"}
                                </Text>
                            </View>
                            <Ionicons name="link-outline" size={20} color={colors.mutedForeground} />
                        </View>

                        {showDomainStatus && (
                            <View className="px-4 pb-3">
                                <Text
                                    className="text-xs"
                                    style={{
                                        color: isDomainAvailable
                                            ? "#16A34A"
                                            : isDomainUnavailable
                                                ? "#EF4444"
                                                : colors.mutedForeground,
                                    }}
                                >
                                    {isCheckingDomain
                                        ? "Verificando disponibilidade..."
                                        : isDomainAvailable
                                            ? "Nome válido e disponível"
                                            : isDomainUnavailable
                                                ? "Nome indisponível"
                                                : ""}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            style={{ borderBottomWidth: 1, borderBottomColor: colors.border + "30" }}
                            onPress={() => setEditingField("phone")}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Contato</Text>
                                {editingField === "phone" ? (
                                    <TextInput
                                        value={form.phone}
                                        onChangeText={(text) => handleChange("phone", text)}
                                        onBlur={() => setEditingField(null)}
                                        autoFocus
                                        placeholder="Digite o contato"
                                        placeholderTextColor={colors.mutedForeground}
                                        style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}
                                        keyboardType="phone-pad"
                                    />
                                ) : (
                                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                        {form.phone || "Não informado"}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="pencil-outline" size={20} color={colors.mutedForeground} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center justify-between px-4 py-4"
                            onPress={() => setEditingField("address")}
                            activeOpacity={0.8}
                        >
                            <View className="flex-1 pr-3">
                                <Text className="text-xs" style={{ color: colors.mutedForeground }}>Endereço</Text>
                                {editingField === "address" ? (
                                    <TextInput
                                        value={form.address}
                                        onChangeText={(text) => handleChange("address", text)}
                                        onBlur={() => setEditingField(null)}
                                        autoFocus
                                        placeholder="Digite o endereço"
                                        placeholderTextColor={colors.mutedForeground}
                                        style={{ color: colors.foreground, fontSize: 16, fontWeight: "600" }}
                                    />
                                ) : (
                                    <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                                        {form.address || "Não informado"}
                                    </Text>
                                )}
                            </View>
                            <Ionicons name="pencil-outline" size={20} color={colors.mutedForeground} />
                        </TouchableOpacity>
                    </View>

                    <Text className="text-xs mt-4" style={{ color: colors.mutedForeground }}>
                        Atualize essas informações para melhorar a confiança dos clientes.
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
                description={successMessage}
                confirmText="OK"
                showCancel={false}
                onConfirm={() => setSuccessDialogVisible(false)}
            />
        </View>
    );
}
