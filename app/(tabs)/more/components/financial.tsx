import { useThemeColors } from "@/hooks/use-theme-colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMonthlySummary } from "../hooks/useMonthlySummary";

export default function Financial() {
  const colors = useThemeColors();
  const router = useRouter();

  const chartBg = colors.background;
  const axisTextColor = colors.mutedForeground;
  const lineColor = colors.primary;
  const areaStart = colors.primary + "40";
  const areaEnd = colors.background + "00";
  const gridColor = colors.border;

  const [selectedPoint, setSelectedPoint] = useState<{
    label: string;
    value: number;
    fullLabel: string;
  } | null>(null);

  const minYear = 2025;
  const currentYear = new Date().getFullYear();
  const availableYears = useMemo(() => {
    const previousYear = Math.max(minYear, currentYear - 1);
    return previousYear === currentYear
      ? [currentYear]
      : [previousYear, currentYear];
  }, [currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  useEffect(() => {
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(currentYear);
    }
  }, [availableYears, selectedYear, currentYear]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [selectedYear]);

  const brandKeyOrder = [
    "natura",
    "eudora",
    "avon",
    "boticario",
    "personalizada",
  ] as const;
  type BrandKey = (typeof brandKeyOrder)[number];

  const brandLabels: Record<BrandKey, string> = {
    natura: "Natura",
    eudora: "Eudora",
    avon: "Avon",
    boticario: "Boticario",
    personalizada: "Personalizada",
  };

  const brandColors: Record<BrandKey, string> = {
    natura: "#16a34a",
    eudora: "#f97316",
    avon: "#0ea5e9",
    boticario: "#eab308",
    personalizada: "#64748b",
  };

  const normalizeBrandKey = (name: string): BrandKey | null => {
    const key = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    return brandKeyOrder.includes(key as BrandKey) ? (key as BrandKey) : null;
  };

  const { data: monthlySummary = [], isLoading } =
    useMonthlySummary(selectedYear);

  const monthlyBreakdown = useMemo(() => monthlySummary, [monthlySummary]);

  const annualSummary = useMemo(() => {
    const total = monthlyBreakdown.reduce((sum: any, item: { value: any; }) => sum + item.value, 0);

    const brandTotals = brandKeyOrder.reduce(
      (acc, brandKey) => {
        acc[brandKey] = 0;
        return acc;
      },
      {} as Record<BrandKey, number>,
    );

    monthlyBreakdown.forEach((item: typeof monthlyBreakdown[number]) => {
      item.brands.forEach((brand: { name: string; value: number; }) => {
        const key = normalizeBrandKey(brand.name);
        if (key) {
          brandTotals[key] += brand.value;
        }
      });
    });

    return { total, brandTotals };
  }, [monthlyBreakdown]);

  const chartData = useMemo(
    () =>
      monthlyBreakdown.map((item: { value: any; label: any; fullLabel: any; }) => ({
        value: item.value,
        label: item.label,
        onPress: () =>
          setSelectedPoint({
            label: item.label,
            value: item.value,
            fullLabel: item.fullLabel,
          }),
      })),
    [monthlyBreakdown],
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 15,
                  padding: 6,
                  borderColor: colors.border,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text onPress={() => router.back()}>
                  <Ionicons
                    name="chevron-back"
                    size={24}
                    color={colors.foreground}
                  />
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: colors.foreground,
                fontSize: 18,
                fontWeight: "bold",
                flex: 1,
                textAlign: "center",
              }}
            >
              Financeiro
            </Text>

            <View
              style={{ flex: 1, alignItems: "flex-end", position: "relative" }}
            >
              <TouchableOpacity
                onPress={() => setIsYearDropdownOpen((prev) => !prev)}
                style={{
                  borderRadius: 12,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: colors.card,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {selectedYear}
                </Text>
                <Ionicons
                  name={isYearDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.mutedForeground}
                />
              </TouchableOpacity>

              {isYearDropdownOpen && (
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 40,
                    minWidth: 120,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.card,
                    overflow: "hidden",
                    zIndex: 10,
                  }}
                >
                  {availableYears.map((year) => {
                    const isSelected = year === selectedYear;
                    return (
                      <TouchableOpacity
                        key={year}
                        onPress={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          backgroundColor: isSelected
                            ? colors.primary + "20"
                            : "transparent",
                        }}
                      >
                        <Text
                          style={{
                            color: isSelected
                              ? colors.primary
                              : colors.foreground,
                            fontWeight: isSelected ? "700" : "500",
                          }}
                        >
                          {year}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              backgroundColor: chartBg,
              borderRadius: 16,
              paddingVertical: 12,
              paddingHorizontal: 6,
              borderColor: colors.border,
              borderWidth: 1,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingBottom: 6,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Receita mensal
                </Text>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  {selectedYear}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: colors.primary + "18",
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  12 meses
                </Text>
              </View>
            </View>
            <LineChart
              adjustToWidth
              data={chartData}
              initialSpacing={8}
              endSpacing={-35}
              thickness={4}
              color={lineColor}
              dataPointsColor={lineColor}
              textColor={axisTextColor}
              yAxisTextStyle={{ color: axisTextColor, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: axisTextColor, fontSize: 11 }}
              yAxisColor={gridColor}
              xAxisColor={gridColor}
              rulesColor={gridColor}
              hideDataPoints={false}
              dataPointsRadius={10}
              dataPointsWidth={24}
              dataPointsHeight={24}
              focusedDataPointRadius={14}
              focusedDataPointColor={colors.primary}
              noOfSections={4}
              yAxisLabelWidth={36}
              spacing={44}
              areaChart
              startFillColor={areaStart}
              endFillColor={areaEnd}
              startOpacity={0.8}
              endOpacity={0.05}
              curved
            />
            {isLoading && (
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontSize: 12,
                  fontWeight: "500",
                  paddingHorizontal: 10,
                  paddingTop: 6,
                }}
              >
                Carregando dados do ano...
              </Text>
            )}
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 12,
                fontWeight: "500",
                paddingHorizontal: 10,
                paddingTop: 6,
              }}
            >
              Toque em um mês para ver detalhes
            </Text>
          </View>

          {selectedPoint && (
            <View
              style={{
                marginTop: 16,
                padding: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    style={{
                      color: colors.mutedForeground,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Relatório do mês
                  </Text>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    {selectedPoint.fullLabel}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.primary + "18",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {selectedYear}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 10,
                }}
              />
              <View className="flex-row items-center justify-between">
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  Total do mês
                </Text>
                <Text
                  style={{
                    color: colors.foreground,
                    fontSize: 20,
                    fontWeight: "800",
                  }}
                >
                  R${" "}
                  {selectedPoint.value.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <View
              style={{
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.card,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    style={{
                      color: colors.mutedForeground,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Resumo anual
                  </Text>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontSize: 18,
                      fontWeight: "800",
                    }}
                  >
                    R${" "}
                    {annualSummary.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.primary + "18",
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {selectedYear}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 10,
                }}
              />
              {brandKeyOrder.map((brandKey) => (
                <View
                  key={`annual-${brandKey}`}
                  className="flex-row items-center justify-between"
                  style={{ paddingVertical: 5 }}
                >
                  <View className="flex-row items-center" style={{ gap: 8 }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: brandColors[brandKey],
                      }}
                    />
                    <Text
                      style={{
                        color: colors.mutedForeground,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {brandLabels[brandKey]}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.foreground,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    R${" "}
                    {annualSummary.brandTotals[brandKey].toLocaleString(
                      "pt-BR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
