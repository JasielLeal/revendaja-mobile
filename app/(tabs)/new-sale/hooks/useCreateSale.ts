import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useCreateSale = () => {
  return useMutation({
    mutationFn: async (saleData: {
      customerName: string;
      status: string;
      paymentMethod: string;
      items: {
        storeProductId: string;
        quantity: number;
      }[];
    }) => {
      const response = await api.post("/orders", saleData);
      return response.data;
    },
  });
};
