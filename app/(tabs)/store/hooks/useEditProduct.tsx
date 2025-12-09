import { api } from "@/app/backend/api";
import { useMutation } from "@tanstack/react-query";

export const useEditProduct = () => {
    return useMutation({
        mutationFn: async (productData: {
            price: number;
            quantity: number;
            status: string;
            validityDate: string;
            costPrice: number;
            id: string;
        }) => {
            const response = await api.patch(`/store-product/${productData.id}`, productData);
            return response.data;
        },
    });
};
