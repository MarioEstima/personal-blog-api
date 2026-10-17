import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});
export type LoginDto = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nome demasiado curto").max(100),
  email: z.string().trim().toLowerCase().email("Email inválido").max(191),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").max(72),
});
export type RegisterDto = z.infer<typeof registerSchema>;
