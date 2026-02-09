import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface UpdateOrderDatePayload {
  id: string;
  newDate: string;
}

export const useUpdateOrderDate = () => {
  return useMutation({
    mutationFn: async ({ id, newDate }: UpdateOrderDatePayload) => {
      const response = await api.patch(`/orders/${id}/date`, { newDate });
      return response.data;
    },
  });
};
