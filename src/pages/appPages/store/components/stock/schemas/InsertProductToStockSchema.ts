import { z } from "zod";

export const InsertProductToStockSchema = z.object({
  customPrice: z.string(),
  quantity: z.number(),
});
