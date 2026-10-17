import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  bio: z.string().trim().max(5000).nullish(),
  avatarUrl: z.url("URL inválida").max(500).nullish(),
  location: z.string().trim().max(150).nullish(),
  website: z.string().trim().max(255).nullish(),
  github: z.string().trim().max(255).nullish(),
  linkedin: z.string().trim().max(255).nullish(),
});

export const updateProfileSchema = profileSchema.partial();
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
