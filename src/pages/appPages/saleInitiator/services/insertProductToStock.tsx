import { backend } from "@/api/backend";

interface productsPropsRequest {
    barcode: string
    customPrice: string
    quantity: Number
}

export async function InsertProductToStock({ barcode, customPrice, quantity }: productsPropsRequest) {
    
    const formattedPrice = customPrice.replace(/,/g, '');

    const response = await backend.post('/stock/create', {
        barcode,
        customPrice: formattedPrice,
        quantity
    })

    return response
}