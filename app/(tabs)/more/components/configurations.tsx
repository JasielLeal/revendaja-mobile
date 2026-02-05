import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigurationsScreen() {

    const colors = useThemeColors();
    const router = useRouter();

    return (
        <>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView className="px-6">
                        <View className=" flex flex-row items-center justify-between gap-4" >
                            <TouchableOpacity style={{ marginBottom: 20, borderRadius: 15, padding: 6, borderColor: colors.border, borderWidth: 1 }}>
                                <Text className='text-white' onPress={() => router.back()}>
                                    <Ionicons name="chevron-back" size={24} color={colors.foreground} />
                                </Text>
                            </TouchableOpacity>

                            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Configurar loja</Text>

                            <View style={{ width: 40, height: 40 }} />
                        </View>

                        <View>
                            <View
                                className="rounded-xl overflow-hidden"
                            >
                                <TouchableOpacity
                                    className="flex-row items-center justify-between py-4"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border + '30',
                                    }}
                                    onPress={() => router.push("/(tabs)/more/components/store-info")}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center"
                                            style={{
                                                backgroundColor: colors.primary + '15',
                                            }}
                                        >
                                            <Ionicons
                                                name="information-circle-outline"
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="font-semibold text-base"
                                                style={{ color: colors.foreground }}
                                            >
                                                Informações da loja
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={colors.mutedForeground}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                className="rounded-xl overflow-hidden"
                            >
                                <TouchableOpacity
                                    className="flex-row items-center justify-between py-4"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border + '30',
                                    }}
                                    onPress={() => router.push("/(tabs)/more/components/store-appearance")}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center"
                                            style={{
                                                backgroundColor: colors.primary + '15',
                                            }}
                                        >
                                            <Ionicons
                                                name="color-palette-outline"
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="font-semibold text-base"
                                                style={{ color: colors.foreground }}
                                            >
                                               Aparência
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={colors.mutedForeground}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                className="rounded-xl overflow-hidden"
                            >
                                <TouchableOpacity
                                    className="flex-row items-center justify-between py-4"
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: colors.border + '30',
                                    }}
                                    onPress={() => router.push("/(tabs)/more/components/store-pix")}
                                >
                                    <View className="flex-row items-center gap-3">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center"
                                            style={{
                                                backgroundColor: colors.primary + '15',
                                            }}
                                        >
                                            <Ionicons
                                                name="cash-outline"
                                                size={20}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="font-semibold text-base"
                                                style={{ color: colors.foreground }}
                                            >
                                               Pix
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={colors.mutedForeground}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </>
    )
}