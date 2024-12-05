import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function UserCreation(data: FieldValues) {
    const response = await backend.post("/user/create", {
        email: data.email,
        name: data.name,
        secondName: data.secondName,
        password: data.password
    })

    return response
}