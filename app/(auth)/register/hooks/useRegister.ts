import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<RegisterResponse>("/users", data);
      return response.data;
    },
  });
};
