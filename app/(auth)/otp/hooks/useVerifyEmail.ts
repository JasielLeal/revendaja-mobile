import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface VerifyEmailData {
  email: string;
  code: string;
}

interface VerifyEmailResponse {
  message: string;
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: async (data: VerifyEmailData) => {
      const response = await api.put<VerifyEmailResponse>(
        "/verify-email",
        data
      );
      return response.data;
    },
  });
};
