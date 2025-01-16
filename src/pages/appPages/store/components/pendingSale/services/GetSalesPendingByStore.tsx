import { backend } from "@/api/backend";

interface getSalesPendingByStoreProps {
    page: number,
    pageSize: number
}

export async function GetSalesPendingByStore({ page, pageSize }: getSalesPendingByStoreProps) {
    const response = await backend.get("/sale/getSalesPendingByStore", {
        params: {
            page, pageSize
        }
    })

    return response
}