import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export interface AddProductToStoreRequest {
  catalogId: number;
  price: number;
  quantity: number;
  validityDate: string;
  costPrice: number;
}

export interface AddProductToStoreResponse {
  id: number;
  catalogId: number;
  price: number;
  quantity: number;
  validityDate: string;
  costPrice: number;
}

export const useAddProductToStore = () => {
  return useMutation({
    mutationFn: async (data: AddProductToStoreRequest) => {
      const response = await api.post<AddProductToStoreResponse>(
        "/store-product",
        data
      );
      return response.data;
    },
  });
};
