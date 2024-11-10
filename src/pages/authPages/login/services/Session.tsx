import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function Session(data: FieldValues) {
    
    const response = await backend.post("/user/session", {
        email: data.email,
        password: data.password,
    });
    return response
}
