import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export interface UpdateStorePayload {
  name: string;
  address: string;
  phone: string;
}

export const useUpdateStore = () => {
  return useMutation({
    mutationFn: async (payload: UpdateStorePayload) => {
      const response = await api.patch("/stores/me", payload);
      return response.data;
    },
  });
};
