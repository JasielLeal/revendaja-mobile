import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useDeleteSale = () => {
  return useMutation({
    mutationFn: async (saleId: string) => {
      const response = await api.delete(`orders/${saleId}`);
      return response.data;
    },
  });
};
