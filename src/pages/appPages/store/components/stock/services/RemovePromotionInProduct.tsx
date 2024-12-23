import { backend } from "@/api/backend";

export async function RemovePromotionInProduct(productId: string) {
    const response = await backend.put('/stock/removePromotionInProductUse', {
        productId
    })

    return response.data;
}