import { backend } from "@/api/backend";
import { FieldValues } from "react-hook-form";

export async function CreateBankSlip(data:FieldValues) {
    const response = await backend.post("/bankslip/create", {
        barcode: data.barcode,
        companyName: data.companyName,
        dueDate: data.dueDate,
        value: data.value
    })

    return response.data
}