import { backend } from "@/api/backend";

export async function DisableAccount() {
    const response = await backend.put("/user/DisableAccount")

    return response
}