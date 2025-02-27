import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text } from "react-native";
import { Dimensions } from "react-native";
import { View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { BestSellingCompany } from "../services/bestSellingCompany";

export function Graphic() {


    const { data: bestSelling } = useQuery({
        queryKey: ["bestSellingCompany"],
        queryFn: BestSellingCompany,
    });

    const colorPalette: Record<string, string> = {
        "Natura": "#4CAF50",
        "Oboticario": "#FFC107",
        "Avon": "#FF5722",
        "Eudora": "#03A9F4",
        "Jequiti": "#9C27B0"
    };

    if (!bestSelling) {
        return
    }

    // Garantir que bestSelling é um array antes de processar
    const formattedData = Array.isArray(bestSelling)
        ? bestSelling
            .filter(item => isNaN(Number(item.name))) // Remove entradas numéricas
            .map(item => ({
                name: item.name,
                population: item.population,
                color: colorPalette[item.name] || `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Usa cor fixa ou gera uma aleatória
                legendFontColor: "#fff",
                legendFontSize: 14,
            }))
        : [];

    const screenWidth = Dimensions.get("window").width;

    return (
        <>
            <>
                <View className="mt-5 rounded-lg">
                    <View className="bg-forenground rounded-t-lg p-4">
                        <Text className="text-white text-lg font-semibold  ">Gráficos de vendas</Text>
                        <Text className="text-textForenground">Distribuição de marcas mais vendidas</Text>
                    </View>
                    <PieChart
                        data={formattedData}
                        width={screenWidth * 0.916}
                        height={220}
                        chartConfig={{
                            color: () => `black`,
                            decimalPlaces: 2,
                        }}

                        accessor="population"
                        backgroundColor="#202020"
                        paddingLeft="10"
                        center={[10, 0]}
                    />

                </View>


                {
                    formattedData?.map((company: any) => (

                        <View className={`p-4 bg-forenground mt-5 rounded-lg`} key={company?.id}>
                            <Text className="text-white font-semibold">
                                {company.population} - {company.name}
                            </Text>
                        </View>
                    ))
                }
            </>
        </>
    )
}