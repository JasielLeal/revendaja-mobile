import { api } from "@/app/backend/api";
import { authService } from "@/app/services/auth";
import { useQuery } from "@tanstack/react-query";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imgUrl: string;
}

export interface RecentSale {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export const useRecentSales = () => {
  return useQuery<RecentSale[]>({
    queryKey: ["recent-sales"],
    queryFn: async () => {
      const response = await api.get<RecentSale[]>("/orders/recent-sales");
   
      return response.data;
    },
  });
};
