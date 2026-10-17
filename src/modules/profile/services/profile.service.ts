import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { UpdateProfileDto } from "../dtos/profile.dtos.js";

const PROFILE_ID = 1;

export class ProfileService {
  get() {
    return prisma.profile.findUnique({ where: { id: PROFILE_ID } });
  }

  async update(dto: UpdateProfileDto) {
    const current = await this.get();

    if (current) {
      return prisma.profile.update({ where: { id: PROFILE_ID }, data: dto });
    }

    if (!dto.name) throw new AppError(400, "O nome é obrigatório para criar o perfil");
    return prisma.profile.create({ data: { ...dto, name: dto.name } });
  }
}

export const profileService = new ProfileService();
