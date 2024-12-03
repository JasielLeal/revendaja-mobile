import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function ForgetPassword(data: FieldValues) {

    const response = await backend.put("/user/ForgetPassword", {
        email: data.email
    })

    return response;
}