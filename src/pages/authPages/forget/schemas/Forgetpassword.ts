import { z } from "zod";

export const ForgepasswordSchema = z.object({
  email: z.string().email({ message: "Email invalido" }),
});
