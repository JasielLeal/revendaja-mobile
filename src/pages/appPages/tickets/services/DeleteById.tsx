import { backend } from "@/api/backend";

export function DeleteById(bankSlipId: string) {
    const response = backend.delete(`bankslip/deleteById/${bankSlipId}`)

    return response
}