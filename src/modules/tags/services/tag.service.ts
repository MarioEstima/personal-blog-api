import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { CreateTagDto, UpdateTagDto } from "../dtos/tag.dtos.js";

export class TagService {
  list() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  }

  async getById(id: number) {
    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new AppError(404, "Tag não encontrada");
    return tag;
  }

  create(dto: CreateTagDto) {
    return prisma.tag.create({ data: dto });
  }

  async update(id: number, dto: UpdateTagDto) {
    await this.getById(id);
    return prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<{ id: number }> {
    await this.getById(id);
    await prisma.tag.delete({ where: { id } });
    return { id };
  }
}

export const tagService = new TagService();
