import { z } from "zod";
import { POST_STATUSES } from "../enums/post.enums.js";

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (letras minúsculas, números e hífens)");

export const createPostSchema = z.object({
  title: z.string().trim().min(1, "Título é obrigatório").max(180),
  slug: slugSchema,
  excerpt: z.string().trim().max(300).nullish(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  coverImage: z.url("URL inválida").max(500).nullish(),
  status: z.enum(POST_STATUSES).default("DRAFT"),
  publishedAt: z.coerce.date().nullish(),
  categoryId: z.number().int().positive().nullish(),
  tagIds: z.array(z.number().int().positive()).max(20).default([]),
});
export type CreatePostDto = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial().extend({
  status: z.enum(POST_STATUSES).optional(),
  tagIds: z.array(z.number().int().positive()).max(20).optional(),
});
export type UpdatePostDto = z.infer<typeof updatePostSchema>;

export const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().min(1).optional(),
  status: z.enum(POST_STATUSES).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  tagId: z.coerce.number().int().positive().optional(),
});
export type ListPostsQueryDto = z.infer<typeof listPostsQuerySchema>;
