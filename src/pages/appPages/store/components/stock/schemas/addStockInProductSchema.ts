import { z } from "zod";

export const AddStockInProductSchema = z.object({
  quantity: z.number(),
});
