import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useOrderDelete = () => {
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.delete(
        `/orders/${orderId}`,
      );
      return response.data;
    },
  });
};
