import { backend } from "@/api/backend";

interface DeleteSaleProps {
    saleId: String 
}

export async function DeleteSale({ saleId }: DeleteSaleProps) {
    
    const response = await backend.delete(`/sale/deleteSale/?saleId=${saleId}`)

    return response
}