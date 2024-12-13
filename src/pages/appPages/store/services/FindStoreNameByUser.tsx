import { backend } from "@/api/backend";

export async function FindStoreNameByUser() {
    const response = await backend.get('/store/FindStoreNameByUser')

    return response;
}