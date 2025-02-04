import { backend } from "@/api/backend";

export async function UpdatePlan(plan: string) {
    const response = await backend.put("/user/UpdatePlan", {
        plan: plan
    })

    return response.data
}