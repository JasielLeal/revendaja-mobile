import { backend } from "@/api/backend";

interface AddPromotionInProductProps {
    productId: string;
    discountValue: number;
}

export async function AddPromotionInProduct({productId, discountValue}:AddPromotionInProductProps) {

    const response = await backend.put(`/stock/addPromotionInProduct`, {
        productId,
        discountValue
    })

    return response.data;
}