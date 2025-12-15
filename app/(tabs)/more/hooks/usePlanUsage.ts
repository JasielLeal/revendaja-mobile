import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";

export interface PlanLimits {
  monthlyOrders: number;
  maxProducts: number;
  canUseOnlineStore: boolean;
  canUseWhatsappIntegration: boolean;
  canExportReports: boolean;
  prioritySupport: boolean;
}

export interface PlanUsage {
  monthlyOrders: number;
  totalProducts: number;
}

export interface PlanRemaining {
  monthlyOrders: number;
  products: number;
}

export interface PlanUsageResponse {
  plan: string;
  limits: PlanLimits;
  usage: PlanUsage;
  remaining: PlanRemaining;
}

export const usePlanUsage = () => {
  return useQuery<PlanUsageResponse>({
    queryKey: ["plan-usage"],
    queryFn: async () => {
      const response = await api.get<PlanUsageResponse>("/stores/plan-usage");
      return response.data;
    },
  });
};
