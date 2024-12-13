import { z } from "zod";

export const VerifyEmailSchema = z.object({
  code: z.string(),
});
