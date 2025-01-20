import { z } from "zod";

export const InsertCustomProductToStockSchema = z.object({
  name: z.string(),
  normalPrice: z.string(),
  barcode: z.string(),
  suggestedPrice: z.string(),
  quantity: z.number(),
  description: z.string(),
});
