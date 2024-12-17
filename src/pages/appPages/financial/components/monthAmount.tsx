import { useQuery } from "@tanstack/react-query"
import { CalculateMonthlyBalance } from "../services/calculateMonthlyBalance"
import { Platform, View } from "react-native"
import { Text } from "react-native"
import { formatCurrency } from "@/utils/formatCurrency"
import { useState } from "react"
import React from "react"

interface MonthAmountProps {
    month: string
}

export function MonthAmount({ month }: MonthAmountProps) {

    const { data: monthAmount } = useQuery({
        queryKey: ["CalculateMonthlyBalance", month],
        queryFn: () => CalculateMonthlyBalance(month)
    })

    return (
        <>
            <View>
                {
                    Platform.OS == 'ios' ?
                        <Text className="text-white font-semibold text-xl">
                            R$ {formatCurrency(String(monthAmount))}
                        </Text>
                        :
                        <Text className="text-white font-semibold text-sm">
                            R$ {formatCurrency(String(monthAmount))}
                        </Text>
                }
            </View>
        </>
    )
}