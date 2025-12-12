import { api } from "@/app/backend/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface CatalogProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  brand: string;
  company: string;
}

interface CatalogResponse {
  products: CatalogProduct[];
  page: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

export const useInfiniteCatalogProducts = (
  pageSize: number = 10,
  searchQuery: string = ""
) => {
  return useInfiniteQuery({
    queryKey: ["catalogProducts", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<CatalogResponse>("/catalog/find-all", {
        params: {
          page: pageParam,
          pageSize: pageSize,
          query: searchQuery,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};
