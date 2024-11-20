import { backend } from "@/api/backend";

export interface ListAllStoreByStoreRequest {
    pageSize: number;
    page: number;
}

export async function ListAllStoreByStore({ pageSize, page }: ListAllStoreByStoreRequest) {
    const response = await backend.get("/bankslip/listAllStoreByStore", {
        params: {
            page,
            pageSize
        }
    })

    return response
}