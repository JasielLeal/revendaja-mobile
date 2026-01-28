import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData } from "../schemas/schema";

interface StoreInformation {
  name: string;
  subdomain: string;
  phone: string;
  address: string;
  primaryColor: string;
}


interface LoginResponse {
  id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
  firstAccess: boolean;
  token: string;
  store: boolean;
  storeInformation?: StoreInformation;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<LoginResponse>("/signin", data);
      return response.data;
    },
  });
};
