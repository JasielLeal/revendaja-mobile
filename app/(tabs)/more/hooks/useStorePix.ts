import { api } from "@/app/backend/api";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export interface StorePixResponse {
  pixKey: string;
  pixName: string;
}

const NOT_FOUND_ERROR = "Store settings not found";

export const useStorePix = () => {
  return useQuery<StorePixResponse>({
    queryKey: ["store-pix"],
    queryFn: async () => {
      try {
        const response = await api.get<StorePixResponse>("/stores/me/settings");
        return response.data;
      } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        if (error.response?.data?.error === NOT_FOUND_ERROR) {
          return { pixKey: "", pixName: "" };
        }
        throw err;
      }
    },
    retry: false,
    staleTime: 1000 * 60,
  });
};
