import { z } from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  secondName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  acceptTerms: z.boolean().refine((value) => value, {
    message: "Você deve aceitar os termos e condições",
  }),
});
