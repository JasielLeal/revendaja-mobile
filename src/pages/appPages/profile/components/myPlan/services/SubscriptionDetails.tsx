import { backend } from "@/api/backend";

export async function SubscriptionDetails() {
    const response = await backend.get("/stripe/SubscriptionDetails")

    return response.data
}