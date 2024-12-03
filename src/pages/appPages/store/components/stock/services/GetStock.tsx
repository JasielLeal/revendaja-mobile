import { backend } from "@/api/backend";

export interface GetStockRequest {
    pageSize: number;
    page: number;
    searchTerm: string
    filter: string | null
}



export async function GetStock({ pageSize, page, searchTerm, filter }: GetStockRequest) {

    const response = await backend.get("/stock/getstock", {
        params: {
            pageSize,
            page,
            search: searchTerm,
            filter
        }
    })

    return response
}