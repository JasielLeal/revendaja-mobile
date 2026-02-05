import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";

export interface StoreMeResponse {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo?: string | null;
  subdomain: string;
  primaryColor: string;
  userId: string;
}

export const useStoreMe = () => {
  return useQuery<StoreMeResponse>({
    queryKey: ["store-me"],
    queryFn: async () => {
      const response = await api.get<StoreMeResponse>("/stores/me");
      return response.data;
    },
    staleTime: 1000 * 60,
  });
};
