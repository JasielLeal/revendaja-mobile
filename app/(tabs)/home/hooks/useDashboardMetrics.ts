import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  estimatedProfit: number;
  percentageChange: {
    orders: number;
    revenue: number;
    profit: number;
  };
}

export const useDashboardMetrics = () => {
  return useQuery<DashboardMetrics>({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const response = await api.get<DashboardMetrics>("/dashboard/metrics");
      return response.data;
    },
  });
};
