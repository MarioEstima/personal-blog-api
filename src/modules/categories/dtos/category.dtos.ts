import { z } from "zod";
import { slugSchema } from "../../../shared/dtos/slug.dtos.js";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Máximo de 100 caracteres"),
  slug: slugSchema(120),
});
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
