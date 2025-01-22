import { backend } from "@/api/backend"

export interface GetSalesRequest {
    month: string;
    pageSize: number;
    page: number;
    search: string
}



export async function GetSales({ month, pageSize, page, search }: GetSalesRequest) {
    const response = await backend.get(`/sale/month/${month}`, {
        params: {
            page,
            pageSize,
            search
        }
    })

    return response
}