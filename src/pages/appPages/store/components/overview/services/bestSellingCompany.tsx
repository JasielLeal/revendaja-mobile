import { backend } from "@/api/backend";

export async function BestSellingCompany() {
    const response = await backend.get("/sale/bestSellingCompany")

    return response.data
}