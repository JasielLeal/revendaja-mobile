import { backend } from "@/api/backend"

interface ApprovedSaleProps {
    saleId: string
}

export async function ApprovedSale({ saleId }: ApprovedSaleProps) {
    const response = await backend.post('/sale/ConfirmSale', {
        saleId
    })

    return response
}