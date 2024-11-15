import { backend } from "@/api/backend";

export async function GetLatestThreePurchases() {
    const response = await backend.get("sale/getLatestThreePurchases")

    return response.data
}