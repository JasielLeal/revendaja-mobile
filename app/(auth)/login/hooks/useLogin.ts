import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData } from "../schemas/schema";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post<LoginResponse>("/signin", data);
      return response.data;
    },
  });
};
