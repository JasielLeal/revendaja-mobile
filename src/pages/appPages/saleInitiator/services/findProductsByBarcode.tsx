import { backend } from "@/api/backend";

export async function FindProductsByBarcode(code: string) {
    const response = await backend.post('/stock/findProductsByBarcode', {
        barcode: code
    })

    return response
}