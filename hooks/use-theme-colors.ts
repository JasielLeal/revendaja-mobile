import { useColorScheme } from "react-native";

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

    

  return {
    // Background colors
    background: isDark ? "#0a0a0b" : "#f5f5f5",
    foreground: isDark ? "#fafafa" : "#171717",

    // Card colors
    card: isDark ? "#262626" : "#ffffff",
    cardForeground: isDark ? "#fafafa" : "#171717",

    // Primary colors (baseado no seu tema amarelo/laranja)
    primary: isDark ? "#FF6900" : "#FF6900",
    primaryForeground: "#fefce8",

    // Secondary colors
    secondary: isDark ? "#404040" : "#f4f4f5",
    secondaryForeground: isDark ? "#fafafa" : "#262626",

    // Muted colors
    muted: isDark ? "#404040" : "#f4f4f5",
    mutedForeground: isDark ? "#a3a3a3" : "#737373",

    // Accent colors
    accent: isDark ? "#404040" : "#f4f4f5",
    accentForeground: isDark ? "#fafafa" : "#262626",

    // Destructive
    destructive: isDark ? "#dc2626" : "#ef4444",
    destructiveForeground: "#ffffff",

    // Border and input
    border: isDark ? "#404040" : "#e4e4e7",
    input: isDark ? "#404040" : "#e4e4e7",

    // Ring
    ring: isDark ? "#fbbf24" : "#f59e0b",

    // Chart colors
    chart1: "#fb923c",
    chart2: "#fbbf24",
    chart3: "#f59e0b",
    chart4: "#d97706",
    chart5: "#b45309",

    // Helper properties
    isDark,
    colorScheme,
  };
};

// Função para obter cores específicas programaticamente
export const getColor = (colorName: string, isDark: boolean = false) => {
  const colors = {
    background: isDark ? "#0a0a0b" : "#ffffff",
    foreground: isDark ? "#fafafa" : "#171717",
    card: isDark ? "#262626" : "#ffffff",
    cardForeground: isDark ? "#fafafa" : "#171717",
    primary: isDark ? "#fbbf24" : "#f59e0b",
    primaryForeground: "#fefce8",
    secondary: isDark ? "#404040" : "#f4f4f5",
    secondaryForeground: isDark ? "#fafafa" : "#262626",
    muted: isDark ? "#404040" : "#f4f4f5",
    mutedForeground: isDark ? "#a3a3a3" : "#737373",
    accent: isDark ? "#404040" : "#f4f4f5",
    accentForeground: isDark ? "#fafafa" : "#262626",
    destructive: isDark ? "#dc2626" : "#ef4444",
    border: isDark ? "#404040" : "#e4e4e7",
    input: isDark ? "#404040" : "#e4e4e7",
    ring: isDark ? "#fbbf24" : "#f59e0b",
  };

  return colors[colorName as keyof typeof colors] || colorName;
};
