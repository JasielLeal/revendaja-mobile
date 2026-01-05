import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";


export interface StoreSummaryResponse {
    totalProducts: number,
    lowStockProducts: number
}



export const useStoreSummary = () => {
    return useQuery({
        queryKey: ["store-summary"],
        queryFn: async () => {
            const response = await api.get<StoreSummaryResponse>(
                "/store-product/stock/summary",
            )
            return response.data;
        },
    });
};
