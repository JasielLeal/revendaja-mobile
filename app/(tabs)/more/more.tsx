import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
    id: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export default function MorePage() {
    const colors = useThemeColors();

    const menuSections: { title?: string; items: MenuItem[] }[] = [
        {
            items: [
                {
                    id: '1',
                    title: 'Minha Conta',
                    icon: 'person-outline',
                    onPress: () => Alert.alert('Minha Conta', 'Em desenvolvimento')
                },
                {
                    id: '2',
                    title: 'Configurações',
                    icon: 'settings-outline',
                    onPress: () => Alert.alert('Configurações', 'Em desenvolvimento')
                },
            ]
        },
        {
            title: 'Negócio',
            items: [
                {
                    id: '3',
                    title: 'Relatórios',
                    icon: 'stats-chart-outline',
                    onPress: () => Alert.alert('Relatórios', 'Em desenvolvimento')
                },
                {
                    id: '4',
                    title: 'Finanças',
                    icon: 'cash-outline',
                    onPress: () => Alert.alert('Finanças', 'Em desenvolvimento')
                },
                {
                    id: '5',
                    title: 'Clientes',
                    icon: 'people-outline',
                    onPress: () => Alert.alert('Clientes', 'Em desenvolvimento')
                },
            ]
        },
        {
            title: 'Suporte',
            items: [
                {
                    id: '6',
                    title: 'Central de Ajuda',
                    icon: 'help-circle-outline',
                    onPress: () => Alert.alert('Central de Ajuda', 'Em desenvolvimento')
                },
                {
                    id: '7',
                    title: 'Fale Conosco',
                    icon: 'chatbubble-outline',
                    onPress: () => Alert.alert('Fale Conosco', 'Em desenvolvimento')
                },
            ]
        },
        {
            items: [
                {
                    id: '8',
                    title: 'Sobre',
                    icon: 'information-circle-outline',
                    onPress: () => Alert.alert('Sobre', 'Leal Perfumaria v1.0.0')
                },
                {
                    id: '9',
                    title: 'Sair',
                    icon: 'log-out-outline',
                    onPress: () => Alert.alert('Sair', 'Deseja realmente sair?', [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'Sair', style: 'destructive' }
                    ])
                },
            ]
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            {/* Background principal */}
            <View className="absolute inset-0" style={{ backgroundColor: colors.background }} />

            {/* Background laranja */}
            <View
                className="absolute top-0 left-0 right-0"
                style={{ height: 180, backgroundColor: colors.primary }}
            />

            {/* Ondinha de transição */}
            <View
                className="absolute"
                style={{
                    top: 140,
                    left: 0,
                    right: 0,
                    height: 50,
                    backgroundColor: colors.background,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -5 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            />

            {/* Header */}
            <View className="px-5 pt-10 pb-4">
                <View className="mb-4 mt-4">
                    <Text
                        className="text-base font-medium mb-1"
                        style={{ color: colors.primaryForeground + '90' }}
                    >
                        Menu
                    </Text>
                    <Text
                        className="text-2xl font-black tracking-tight"
                        style={{ color: colors.primaryForeground }}
                    >
                        Mais Opções
                    </Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5 relative z-10" style={{ marginTop: -10 }}>
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} className="mb-4">
                        {section.title && (
                            <Text
                                className="text-sm font-semibold mb-2 px-1"
                                style={{ color: colors.mutedForeground }}
                            >
                                {section.title.toUpperCase()}
                            </Text>
                        )}
                        <View
                            className="rounded-xl overflow-hidden"
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
                            {section.items.map((item, itemIndex) => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={item.onPress}
                                    className="flex-row items-center justify-between px-4 py-4"
                                    style={{
                                        borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                                        borderBottomColor: colors.border + '30',
                                    }}
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                            style={{ backgroundColor: colors.primary + '15' }}
                                        >
                                            <Ionicons name={item.icon} size={20} color={colors.primary} />
                                        </View>
                                        <Text
                                            className="text-base font-medium"
                                            style={{ color: colors.foreground }}
                                        >
                                            {item.title}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Versão do App */}
                <View className="items-center py-6 mb-4">
                    <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                        Leal Perfumaria
                    </Text>
                    <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                        Versão 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}