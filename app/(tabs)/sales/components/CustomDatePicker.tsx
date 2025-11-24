import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CustomDatePickerProps {
    visible: boolean;
    selectedStartDate: string;
    selectedEndDate: string;
    markedDates: any;
    onDayPress: (day: any) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export function CustomDatePicker({
    visible,
    selectedStartDate,
    selectedEndDate,
    markedDates,
    onDayPress,
    onConfirm,
    onCancel
}: CustomDatePickerProps) {
    const colors = useThemeColors();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <View
                    className="m-4 rounded-3xl p-6 max-w-md w-full"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        borderWidth: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 10,
                    }}
                >
                    <Text
                        className="text-xl font-bold mb-4 text-center"
                        style={{ color: colors.foreground }}
                    >
                        Selecionar Período
                    </Text>

                    <Text
                        className="text-sm mb-4 text-center"
                        style={{ color: colors.mutedForeground }}
                    >
                        Toque para selecionar data inicial e final
                    </Text>

                    <Calendar
                        onDayPress={onDayPress}
                        markingType={'period'}
                        markedDates={markedDates}
                        theme={{
                            backgroundColor: colors.card,
                            calendarBackground: colors.card,
                            textSectionTitleColor: colors.foreground,
                            selectedDayBackgroundColor: '#3b82f6',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#3b82f6',
                            dayTextColor: colors.foreground,
                            textDisabledColor: colors.mutedForeground,
                            dotColor: '#3b82f6',
                            selectedDotColor: '#ffffff',
                            arrowColor: colors.foreground,
                            monthTextColor: colors.foreground,
                            indicatorColor: '#3b82f6',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                            textDayFontSize: 16,
                            textMonthFontSize: 18,
                            textDayHeaderFontSize: 14
                        }}
                    />

                    {(selectedStartDate || selectedEndDate) && (
                        <View className="mt-4 p-3 rounded-2xl" style={{ backgroundColor: colors.muted }}>
                            <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                                Selecionado:
                            </Text>
                            {selectedStartDate && (
                                <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                    Início: {new Date(selectedStartDate).toLocaleDateString('pt-BR')}
                                </Text>
                            )}
                            {selectedEndDate && (
                                <Text className="text-xs mt-1" style={{ color: colors.mutedForeground }}>
                                    Fim: {new Date(selectedEndDate).toLocaleDateString('pt-BR')}
                                </Text>
                            )}
                        </View>
                    )}

                    <View className="flex-row justify-between gap-3 mt-6">
                        <TouchableOpacity
                            className="flex-1 py-3 rounded-2xl"
                            style={{
                                backgroundColor: colors.muted,
                                borderColor: colors.border,
                                borderWidth: 1,
                            }}
                            onPress={onCancel}
                        >
                            <Text
                                className="text-center font-semibold"
                                style={{ color: colors.mutedForeground }}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 py-3 rounded-2xl"
                            style={{ backgroundColor: colors.primary }}
                            onPress={onConfirm}
                            disabled={!selectedStartDate}
                        >
                            <Text
                                className="text-center font-bold"
                                style={{ color: colors.primaryForeground }}
                            >
                                Confirmar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
