import { backend } from "@/api/backend";

export async function CreateSubscription(priceId: string, paymentMethodId: string | undefined) {
    const response = await backend.post("/stripe/CreateSubscription", {
        priceId,
        paymentMethodId,
    })

    return response.data
}