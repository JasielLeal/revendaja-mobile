import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface CheckEmailResponse {
  available: boolean;
}

export const useCheckEmail = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<CheckEmailResponse>(
        "/users/check-email",
        { email }
      );
      return response.data;
    },
  });
};
