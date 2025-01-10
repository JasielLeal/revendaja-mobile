import { z } from "zod";

export const CreateStoreSchema = z.object({
    name: z.string(),
    description: z.string(),
});