import { api } from "@/app/backend/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  barcode: string;
  company: string;
  catalogPrice: number;
  catalogId: number;
  category: string;
  imgUrl: string;
  status: string;
  storeId: string;
  type: string;
  validityDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StoreProductResponse {
  data: StoreProduct[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  query?: string;
}

export function useInfiniteStoreProducts(pageSize: number = 20, query?: string) {

  return useInfiniteQuery<StoreProductResponse>({
    queryKey: ["store-products", query],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get<StoreProductResponse>(
        `/store-product?page=${pageParam}&pageSize=${pageSize}&query=${query || ""}`
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
