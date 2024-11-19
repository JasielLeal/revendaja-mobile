import { backend } from "@/api/backend"

export interface GetSalesRequest {
    month: string;
    pageSize: number;
    page: number;
}



export async function GetSales({ month, pageSize, page }: GetSalesRequest) {
    const response = await backend.get(`/sale/month/${month}`, {
        params: {
            page,
            pageSize,
        }
    })

    return response
}