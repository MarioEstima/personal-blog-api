import type { Prisma, Post } from "../../../generated/prisma/client.js";
import { AppError, ValidationError } from "../../../shared/errors/app-error.js";
import type { PaginationDto } from "../../../shared/dtos/pagination.dtos.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { CreatePostDto, ListPostsQueryDto, UpdatePostDto } from "../dtos/post.dtos.js";
import { PostStatus } from "../enums/post.enums.js";

type PostWithRelations = Post & {
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
};

const RELATIONS = { category: true, tags: true };

export class PostService {
  async list(
    query: ListPostsQueryDto,
    includeUnpublished = false,
  ): Promise<PaginationDto<PostWithRelations>> {
    // A lista pública é sempre só de publicados; o admin é que escolhe o estado.
    const status = includeUnpublished ? query.status : PostStatus.PUBLISHED;

    const where: Prisma.PostWhereInput = {
      ...(status ? { status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.tagId ? { tags: { some: { id: query.tagId } } } : {}),
      ...(query.search ? { title: { contains: query.search } } : {}),
    };

    const [total, items] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: RELATIONS,
      }),
    ]);

    return {
      items: items as PostWithRelations[],
      total,
      page: query.page,
      pages: Math.max(1, Math.ceil(total / query.limit)),
    };
  }

  async getById(id: number): Promise<PostWithRelations> {
    const post = await prisma.post.findUnique({ where: { id }, include: RELATIONS });
    if (!post) throw new AppError(404, "Publicação não encontrada");
    return post as PostWithRelations;
  }

  async getBySlug(slug: string): Promise<PostWithRelations> {
    const post = await prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: RELATIONS,
    });
    if (!post) throw new AppError(404, "Publicação não encontrada");
    return post as PostWithRelations;
  }

  async create(dto: CreatePostDto): Promise<PostWithRelations> {
    const { tagIds, categoryId, publishedAt, ...rest } = dto;
    await assertRelations(categoryId, tagIds);

    const post = await prisma.post.create({
      data: {
        ...rest,
        publishedAt: resolvePublishedAt(rest.status, publishedAt),
        categoryId: categoryId ?? null,
        tags: tagIds.length > 0 ? { connect: tagIds.map((id) => ({ id })) } : undefined,
      },
      include: RELATIONS,
    });

    return post as PostWithRelations;
  }

  async update(id: number, dto: UpdatePostDto): Promise<PostWithRelations> {
    const current = await this.getById(id);

    const { tagIds, categoryId, publishedAt, status, ...rest } = dto;
    await assertRelations(categoryId, tagIds);

    const data: Prisma.PostUncheckedUpdateInput = { ...rest };

    if (status !== undefined) {
      data.status = status;
      data.publishedAt = resolvePublishedAt(status, publishedAt, current.publishedAt);
    } else if (publishedAt !== undefined) {
      data.publishedAt = resolvePublishedAt(current.status, publishedAt, current.publishedAt);
    }
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (tagIds !== undefined) data.tags = { set: tagIds.map((tagId) => ({ id: tagId })) };

    const post = await prisma.post.update({ where: { id }, data, include: RELATIONS });
    return post as PostWithRelations;
  }

  async remove(id: number): Promise<{ id: number }> {
    await this.getById(id);
    await prisma.post.delete({ where: { id } });
    return { id };
  }
}

/**
 * Verifica as relações antes de tocar na BD.
 * Sem isto, um `categoryId`/`tagId` inexistente rebenta no Prisma
 * e o cliente recebe um 500 ou um 404 sem sentido.
 */
async function assertRelations(
  categoryId?: number | null,
  tagIds?: number[],
): Promise<void> {
  const fields: Record<string, string[]> = {};

  if (categoryId != null) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) fields.categoryId = [`Categoria ${categoryId} não existe`];
  }

  if (tagIds && tagIds.length > 0) {
    const unique = [...new Set(tagIds)];
    const found = await prisma.tag.findMany({
      where: { id: { in: unique } },
      select: { id: true },
    });
    const foundIds = new Set(found.map((tag) => tag.id));
    const missing = unique.filter((tagId) => !foundIds.has(tagId));
    if (missing.length > 0) fields.tagIds = [`Tags inexistentes: ${missing.join(", ")}`];
  }

  if (Object.keys(fields).length > 0) throw new ValidationError(fields);
}

/**
 * Um post só tem data de publicação se estiver publicado.
 * - `publishedAt` explícita e publicado → usa-a;
 * - publicado sem data → usa a data actual (ou "agora" na criação);
 * - rascunho → `null`.
 */
function resolvePublishedAt(
  status: PostStatus,
  publishedAt?: Date | null,
  current?: Date | null,
): Date | null {
  if (status !== PostStatus.PUBLISHED) return null;
  return publishedAt ?? current ?? new Date();
}

export const postService = new PostService();
