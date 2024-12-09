import { backend } from "@/api/backend";

interface productsPropsRequest {
    barcode: string
    customPrice: string
    quantity: Number
}

export async function InsertProductToStock({ barcode, customPrice, quantity }: productsPropsRequest) {
    const response = await backend.post('/stock/create', {
        barcode,
        customPrice,
        quantity
    })

    return response
}