import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { UpdateProfileDto } from "../dtos/profile.dtos.js";

const PROFILE_ID = 1;

export class ProfileService {
  getMe() {
    return prisma.profile.findUnique({ where: { id: PROFILE_ID } });
  }

  async updateMe(dto: UpdateProfileDto) {
    const me = await this.getMe();

    if (me) {
      return prisma.profile.update({ where: { id: PROFILE_ID }, data: dto });
    }

    if (!dto.name) throw new AppError(400, "O nome é obrigatório para criar o perfil");
    return prisma.profile.create({ data: { ...dto, name: dto.name } });
  }
}

export const profileService = new ProfileService();
