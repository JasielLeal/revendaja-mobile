import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export interface CreateStorePixPayload {
  pixKey: string;
  pixName: string;
}

export const useCreateStorePix = () => {
  return useMutation({
    mutationFn: async (payload: CreateStorePixPayload) => {
      const response = await api.post("/stores/me/settings/create-default", payload);
      return response.data;
    },
  });
};
