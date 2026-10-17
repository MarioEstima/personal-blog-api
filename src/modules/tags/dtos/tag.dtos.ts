import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (letras minúsculas, números e hífens)");

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(80),
  slug: slugSchema,
});
export type CreateTagDto = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();
export type UpdateTagDto = z.infer<typeof updateTagSchema>;
