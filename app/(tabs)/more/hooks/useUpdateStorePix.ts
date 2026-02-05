import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export interface UpdateStorePixPayload {
  pixKey: string;
  pixName: string;
}

export const useUpdateStorePix = () => {
  return useMutation({
    mutationFn: async (payload: UpdateStorePixPayload) => {
      const response = await api.patch("/stores/me/settings", payload);
      return response.data;
    },
  });
};
