import { backend } from "@/api/backend";

export async function ActiveStore() {
    const response = await backend.put("/store/activeStore")
    return response.data
}