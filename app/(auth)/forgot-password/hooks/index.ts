import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post("/forgot-password", { email });
      return response.data;
    },
  });
};

interface VerifyOtpData {
  email: string;
  otpCode: string;
}

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      const response = await api.post("/verify-otp", data);
      return response.data;
    },
  });
};

interface ChangePasswordData {
  email: string;
  otpCode: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await api.post("/change-password", data);
      return response.data;
    },
  });
};
