import { backend } from "@/api/backend";

export async function CalculateMonthlyBalance(month: any) {
    const response = await backend.get(`/sale/calculateMonthlyBalance/${month}`)

    return response.data
}