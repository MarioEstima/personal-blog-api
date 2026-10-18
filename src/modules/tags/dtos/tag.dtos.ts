import { z } from "zod";
import { slugSchema } from "../../../shared/dtos/slug.dtos.js";

export const createTagSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(80, "Máximo de 80 caracteres"),
  slug: slugSchema(100),
});
export type CreateTagDto = z.infer<typeof createTagSchema>;

export const updateTagSchema = createTagSchema.partial();
export type UpdateTagDto = z.infer<typeof updateTagSchema>;
