import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export interface UpdateBrandingPayload {
  primaryColor: string;
  storeName: string;
  imageUri?: string | null;
}

export const useUpdateBranding = () => {
  return useMutation({
    mutationFn: async ({ primaryColor, storeName, imageUri }: UpdateBrandingPayload) => {
      const formData = new FormData();
      formData.append("primaryColor", primaryColor);
      formData.append("storeName", storeName);

      if (imageUri) {
        const filename = imageUri.split("/").pop() || "logo.jpg";
        const fileExt = filename.split(".").pop() || "jpg";
        formData.append("image", {
          uri: imageUri,
          name: filename,
          type: `image/${fileExt}`,
        } as any);
      }

      console.log(formData)

      const response = await api.post("/stores/me/branding", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
};
