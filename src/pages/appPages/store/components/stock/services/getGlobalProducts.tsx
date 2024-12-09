import { backend } from "@/api/backend";

export interface GetGlobalProductsRequest {
    pageSize: number;
    page: number;
    searchTerm: string
    filter: string | null
}

export async function GetGlobalProducts({ filter, page, pageSize, searchTerm }: GetGlobalProductsRequest) {
    const response = await backend.get('/products/getall', {
        params: {
            page,
            pageSize,
            search: searchTerm,
            filter
        }
    })

    return response
}