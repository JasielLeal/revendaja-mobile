import { backend } from "@/api/backend";

export interface GetStockRequest {
    pageSize: number;
    page: number;
    searchTerm: string
}

export async function GetStock({ pageSize, page, searchTerm }: GetStockRequest) {
    const response = await backend.get("/stock/getstock", {
        params: {
            pageSize,
            page,
            search: searchTerm
        }
    })

    return response
}