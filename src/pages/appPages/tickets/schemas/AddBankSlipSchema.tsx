import { z } from "zod";

export const AddBankSlipSchema = z.object({
    barcode: z.string(),
    dueDate: z.string(),
    value: z.string(),
    companyName: z.string().nonempty('A empresa emissora é obrigatória'),
});