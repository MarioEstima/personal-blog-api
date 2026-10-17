import type { Prisma, Post } from "../../../generated/prisma/client.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { CreatePostDto, ListPostsQueryDto, UpdatePostDto } from "../dtos/post.dtos.js";
import type { PostStatus } from "../enums/post.enums.js";

type PostWithRelations = Post & {
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
};

const RELATIONS = { category: true, tags: true };

export class PostService {
  async list(query: ListPostsQueryDto, includeUnpublished = false) {
    const status = includeUnpublished ? query.status : "PUBLISHED";

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
      items,
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
      where: { slug, status: "PUBLISHED" },
      include: RELATIONS,
    });
    if (!post) throw new AppError(404, "Publicação não encontrada");
    return post as PostWithRelations;
  }

  async create(dto: CreatePostDto): Promise<PostWithRelations> {
    const { tagIds, categoryId, publishedAt, ...rest } = dto;

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
    await this.getById(id);

    const { tagIds, categoryId, publishedAt, status, ...rest } = dto;
    const data: Prisma.PostUncheckedUpdateInput = { ...rest };

    if (status !== undefined) {
      data.status = status;
      data.publishedAt = resolvePublishedAt(status, publishedAt);
    } else if (publishedAt !== undefined) {
      data.publishedAt = publishedAt;
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

function resolvePublishedAt(status: PostStatus, publishedAt?: Date | null): Date | null {
  if (status !== "PUBLISHED") return null;
  return publishedAt ?? new Date();
}

export const postService = new PostService();
