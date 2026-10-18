import { z } from "zod";
import { slugSchema } from "../../../shared/dtos/slug.dtos.js";
import { POST_STATUSES } from "../enums/post.enums.js";

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(180, "Título deve ter no máximo 180 caracteres"),
  slug: slugSchema(200),
  excerpt: z.string().trim().max(300, "Resumo deve ter no máximo 300 caracteres").nullish(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  coverImage: z.url("URL inválida").max(500, "URL demasiado longa (máx. 500)").nullish(),
  status: z.enum(POST_STATUSES, "Status inválido (DRAFT ou PUBLISHED)").default("DRAFT"),
  publishedAt: z.coerce.date({ error: "Data de publicação inválida" }).nullish(),
  categoryId: z
    .number({ error: "Categoria inválida" })
    .int("Categoria inválida")
    .positive("Categoria inválida")
    .nullish(),
  tagIds: z
    .array(z.number({ error: "Tag inválida" }).int("Tag inválida").positive("Tag inválida"), {
      error: "Tags inválidas",
    })
    .max(20, "Máximo de 20 tags")
    .default([]),
});
export type CreatePostDto = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial().extend({
  status: z.enum(POST_STATUSES, "Status inválido (DRAFT ou PUBLISHED)").optional(),
  tagIds: z
    .array(z.number({ error: "Tag inválida" }).int("Tag inválida").positive("Tag inválida"), {
      error: "Tags inválidas",
    })
    .max(20, "Máximo de 20 tags")
    .optional(),
});
export type UpdatePostDto = z.infer<typeof updatePostSchema>;

export const listPostsQuerySchema = z.object({
  page: z.coerce
    .number({ error: "Página inválida" })
    .int("Página inválida")
    .min(1, "Página inválida")
    .default(1),
  limit: z.coerce
    .number({ error: "Limite inválido" })
    .int("Limite inválido")
    .min(1, "Limite inválido")
    .max(100, "Limite máximo é 100")
    .default(12),
  search: z.string().trim().min(1, "Pesquisa vazia").optional(),
  status: z.enum(POST_STATUSES, "Status inválido (DRAFT ou PUBLISHED)").optional(),
  categoryId: z.coerce
    .number({ error: "Categoria inválida" })
    .int("Categoria inválida")
    .positive("Categoria inválida")
    .optional(),
  tagId: z.coerce
    .number({ error: "Tag inválida" })
    .int("Tag inválida")
    .positive("Tag inválida")
    .optional(),
});
export type ListPostsQueryDto = z.infer<typeof listPostsQuerySchema>;
