import { z } from "zod";

export const ChangePasswordSchema = z.object({
  newPassword: z.string(),
  repeatNewPassword: z.string(),
});
