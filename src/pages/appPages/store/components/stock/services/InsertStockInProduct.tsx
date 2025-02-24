import { backend } from "@/api/backend";

export async function InsertStockInProduct(data: { productId: string, quantity: number }) {

    console.log("console aqui", data)

    const response = await backend.put('/stock/AddQuantityToProductInStock', {
        productId: data.productId,
        quantity: data.quantity
    })
    return response;
}