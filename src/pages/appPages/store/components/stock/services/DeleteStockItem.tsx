import { backend } from "@/api/backend";

export async function DeleteStockItem(id: string) {
    
    const response = await backend.delete(`/stock/DeleteStockItem`, {
        params: {
            productId: id
        }
    });

    return response.data;
}