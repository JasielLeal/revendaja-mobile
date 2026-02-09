import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";

export interface MonthlySummaryBrand {
  name: string;
  value: number;
}

export interface MonthlySummaryItem {
  label: string;
  fullLabel: string;
  value: number;
  brands: MonthlySummaryBrand[];
}

export const useMonthlySummary = (year: number) => {
  return useQuery({
    queryKey: ["monthly-summary", year],
    queryFn: async () => {
      const response = await api.get<MonthlySummaryItem[]>(
        "/dashboard/monthly-summary",
        {
          params: { year },
        }
      );
      return response.data;
    },
    enabled: Number.isFinite(year),
    staleTime: 1000 * 60,
    retry: false,
  });
};
