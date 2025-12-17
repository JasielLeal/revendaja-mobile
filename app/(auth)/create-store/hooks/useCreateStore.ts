import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface CreateStoreData {
  name: string;
  address: string;
  phone: string;
  primaryColor: string;
}

interface CreateStoreResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  primaryColor: string;
}

export const useCreateStore = () => {
  return useMutation({
    mutationFn: async (data: CreateStoreData) => {
      const response = await api.post<CreateStoreResponse>("/stores", data);
      return response.data;
    },
  });
};
