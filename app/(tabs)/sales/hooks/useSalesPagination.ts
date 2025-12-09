import { api } from "@/app/backend/api";
import { useInfiniteQuery } from "@tanstack/react-query";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  imgUrl: string;
  price: number;
  storeProductId: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface SalesPaginationResponse {
  totalOrders: number;
  totalRevenue: number;
  estimatedProfit: number;
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface UseSalesPaginationParams {
  from?: string;
  to?: string;
  search?: string;
  status?: string;
  limit?: number;
}

export function useSalesPagination({
  from,
  to,
  search,
  status,
  limit = 10,
}: UseSalesPaginationParams = {}) {
  return useInfiniteQuery({
    queryKey: ["sales-pagination", from, to, search, status, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();

      if (from) params.append("from", from);
      if (to) params.append("to", to);
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      params.append("page", pageParam.toString());
      params.append("limit", limit.toString());

      const response = await api.get<SalesPaginationResponse>(
        `/dashboard/pagination?${params.toString()}`
      );

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
