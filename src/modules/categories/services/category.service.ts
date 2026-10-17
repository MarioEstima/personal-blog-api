import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dtos.js";

export class CategoryService {
  list() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  }

  async getById(id: number) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError(404, "Categoria não encontrada");
    return category;
  }

  create(dto: CreateCategoryDto) {
    return prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.getById(id);
    return prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<{ id: number }> {
    await this.getById(id);
    await prisma.category.delete({ where: { id } });
    return { id };
  }
}

export const categoryService = new CategoryService();
