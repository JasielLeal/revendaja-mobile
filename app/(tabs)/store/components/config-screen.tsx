import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export function ConfigScreen() {

    const colors = useThemeColors();
    interface StoreConfig {
        storeName: string;
        storeDescription: string;
        phone: string;
        email: string;
        address: string;
        workingHours: string;
        notifications: boolean;
        lowStockAlert: boolean;
        autoBackup: boolean;
        currency: string;
        taxRate: string;
    }

    const [storeConfig, setStoreConfig] = useState<StoreConfig>({
        storeName: 'Leal Perfumaria',
        storeDescription: 'Perfumes e cosméticos de qualidade',
        phone: '+55 11 99999-9999',
        email: 'contato@lealperfumaria.com',
        address: 'Rua das Flores, 123 - São Paulo, SP',
        workingHours: '08:00 - 18:00',
        notifications: true,
        lowStockAlert: true,
        autoBackup: true,
        currency: 'BRL',
        taxRate: '0.00'
    });

    return (
        <>
            <ScrollView className="mb-4 mt-1">
                {/* Informações da Loja */}
                <View
                    className="p-4 rounded-xl mb-3"
                    style={{
                        backgroundColor: colors.card,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 4,
                        elevation: 2,
                        borderColor: colors.border + '20',
                        borderWidth: 1,
                    }}
                >
                    <View className="flex-row items-center mb-3">
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: colors.primary + '15' }}
                        >
                            <Ionicons name="storefront" size={20} color={colors.primary} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold" style={{ color: colors.foreground }}>
                                {storeConfig.storeName}
                            </Text>
                            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                {storeConfig.storeDescription}
                            </Text>
                        </View>
                        <TouchableOpacity
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: colors.primary + '10' }}
                        >
                            <Ionicons name="pencil" size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View className="space-y-2">
                        <View className="flex-row items-center py-1">
                            <Ionicons name="call" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                            <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.phone}</Text>
                        </View>
                        <View className="flex-row items-center py-1">
                            <Ionicons name="mail" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                            <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.email}</Text>
                        </View>
                        <View className="flex-row items-center py-1">
                            <Ionicons name="location" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                            <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.address}</Text>
                        </View>
                        <View className="flex-row items-center py-1">
                            <Ionicons name="time" size={16} color={colors.mutedForeground} style={{ marginRight: 10, width: 20 }} />
                            <Text className="text-sm" style={{ color: colors.foreground }}>{storeConfig.workingHours}</Text>
                        </View>
                    </View>
                </View>

                {/* Configurações do Sistema */}
                <View
                    className="p-4 rounded-xl mb-3"
                    style={{
                        backgroundColor: colors.card,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 4,
                        elevation: 2,
                        borderColor: colors.border + '20',
                        borderWidth: 1,
                    }}
                >
                    <Text className="text-lg font-bold mb-3" style={{ color: colors.foreground }}>
                        Configurações do Sistema
                    </Text>

                    {/* Notificações */}
                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                        <View className="flex-row items-center flex-1">
                            <Ionicons name="notifications" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                            <View>
                                <Text className="font-medium" style={{ color: colors.foreground }}>
                                    Notificações
                                </Text>
                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                    Receber alertas do sistema
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={`w-12 h-6 rounded-full ${storeConfig.notifications ? 'bg-green-500' : 'bg-gray-300'}`}
                            onPress={() => setStoreConfig({ ...storeConfig, notifications: !storeConfig.notifications })}
                            style={{ justifyContent: 'center' }}
                        >
                            <View
                                className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.notifications ? 'translate-x-6' : 'translate-x-1'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Alerta de Estoque Baixo */}
                    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                        <View className="flex-row items-center flex-1">
                            <Ionicons name="alert-circle" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                            <View>
                                <Text className="font-medium" style={{ color: colors.foreground }}>
                                    Alerta de Estoque Baixo
                                </Text>
                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                    Notificar quando estoque ≤ 5
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={`w-12 h-6 rounded-full ${storeConfig.lowStockAlert ? 'bg-green-500' : 'bg-gray-300'}`}
                            onPress={() => setStoreConfig({ ...storeConfig, lowStockAlert: !storeConfig.lowStockAlert })}
                            style={{ justifyContent: 'center' }}
                        >
                            <View
                                className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.lowStockAlert ? 'translate-x-6' : 'translate-x-1'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Backup Automático */}
                    <View className="flex-row items-center justify-between py-3">
                        <View className="flex-row items-center flex-1">
                            <Ionicons name="cloud-upload" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                            <View>
                                <Text className="font-medium" style={{ color: colors.foreground }}>
                                    Backup Automático
                                </Text>
                                <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                                    Sincronizar dados na nuvem
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            className={`w-12 h-6 rounded-full ${storeConfig.autoBackup ? 'bg-green-500' : 'bg-gray-300'}`}
                            onPress={() => setStoreConfig({ ...storeConfig, autoBackup: !storeConfig.autoBackup })}
                            style={{ justifyContent: 'center' }}
                        >
                            <View
                                className={`w-5 h-5 rounded-full bg-white transform ${storeConfig.autoBackup ? 'translate-x-6' : 'translate-x-1'}`}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 1 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 2,
                                    elevation: 2,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Ações Rápidas */}
                <View
                    className="p-4 rounded-xl"
                    style={{
                        backgroundColor: colors.card,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.06,
                        shadowRadius: 4,
                        elevation: 2,
                        borderColor: colors.border + '20',
                        borderWidth: 1,
                    }}
                >
                    <Text className="text-lg font-bold mb-3" style={{ color: colors.foreground }}>
                        Ações Rápidas
                    </Text>

                    <View className="flex-row space-x-2 mb-3">
                        <TouchableOpacity
                            className="flex-1 p-3 rounded-lg items-center"
                            style={{ backgroundColor: colors.primary + '10' }}
                            onPress={() => Alert.alert('Backup', 'Fazendo backup dos dados...')}
                        >
                            <Ionicons name="cloud-download" size={20} color={colors.primary} />
                            <Text className="text-xs font-semibold mt-1.5" style={{ color: colors.primary }}>
                                Backup
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 p-3 rounded-lg items-center"
                            style={{ backgroundColor: colors.primary + '10' }}
                            onPress={() => Alert.alert('Relatórios', 'Gerando relatórios...')}
                        >
                            <Ionicons name="bar-chart" size={20} color={colors.primary} />
                            <Text className="text-xs font-semibold mt-1.5" style={{ color: colors.primary }}>
                                Relatórios
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="p-3 rounded-lg items-center"
                        style={{ backgroundColor: '#ef444410' }}
                        onPress={() => Alert.alert('Limpar Dados', 'Esta ação não pode ser desfeita!', [
                            { text: 'Cancelar', style: 'cancel' },
                            { text: 'Confirmar', style: 'destructive' }
                        ])}
                    >
                        <Ionicons name="trash" size={20} color="#ef4444" />
                        <Text className="text-xs font-semibold mt-1.5" style={{ color: '#ef4444' }}>
                            Limpar Dados
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}