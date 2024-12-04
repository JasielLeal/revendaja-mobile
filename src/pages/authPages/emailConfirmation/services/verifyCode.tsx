import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function VerifyCode(data: FieldValues) {
    const response = await backend.put("/user/verifyemail", {
        code: data.code,
        email: data.email
    })

    return response
}