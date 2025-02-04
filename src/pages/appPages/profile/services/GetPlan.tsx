import { backend } from "@/api/backend";

export async function GetPlan() {
    const response = await backend.get("/user/GetPlan")

    return response.data
}