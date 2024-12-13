import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function ChangePassword(data: FieldValues) {
    const response = await backend.put('/user/UpdatePassword', {
        email: data.email,
        newPassword: data.newPassword
    })

    return response
}