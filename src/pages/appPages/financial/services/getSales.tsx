import { backend } from "@/api/backend"

export async function GetSales({month, pageSize, page}) {

    const response = await backend.get(`/sale/month/11`)

    return response
}