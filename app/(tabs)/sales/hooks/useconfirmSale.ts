import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useConfirmSale = () => {
  return useMutation({
    mutationFn: async (saleData: { id: string; status: string }) => {
      const response = await api.patch(
        `/orders/${saleData.id}/status`,
        saleData
      );
      return response.data;
    },
  });
};
