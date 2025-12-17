import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

interface ResendCodeResponse {
  message: string;
}

export const useResendCode = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post<ResendCodeResponse>(
        "/users/resend-code",
        { email }
      );
      return response.data;
    },
  });
};
