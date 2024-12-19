import { backend } from "@/api/backend";

export async function DeleteSale(saleId: string) {
    const response = await backend.delete('/sale/deleteSale', {
        params: {
            saleId
        }
    })

    return response;
}