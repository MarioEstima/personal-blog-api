import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../../shared/errors/app-error.js";
import { prisma } from "../../../shared/prisma/prisma.js";
import type { LoginDto, RegisterDto } from "../dtos/auth.dtos.js";

const SALT_ROUNDS = 10;
const TOKEN_EXPIRES_IN = "7d";

type AdminRow = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
};

export interface Session {
  admin: { id: number; name: string; email: string };
  token: string;
}

export class AuthService {
  async register(data: RegisterDto): Promise<Session> {
    const existing = await prisma.admin.findFirst();
    if (existing) throw new AppError(409, "Já existe um admin registado — faça login");
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const admin = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      },
    });

    return this.toSession(admin);
  }

  async login(data: LoginDto): Promise<Session> {
    const admin = await prisma.admin.findUnique({ where: { email: data.email } });
    const valid = admin !== null && (await bcrypt.compare(data.password, admin.passwordHash));
    if (!admin || !valid) throw new AppError(401, "Email ou senha inválidos");

    return this.toSession(admin);
  }

  async me(adminId: number) {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new AppError(404, "Admin não encontrado");
    return toPublic(admin);
  }

  private toSession(admin: AdminRow): Session {
    const secret = process.env.JWT_TOKEN;
    if (!secret) throw new AppError(500, "JWT_TOKEN não configurado");

    const token = jwt.sign(
      { sub: String(admin.id), email: admin.email },
      secret,
      { expiresIn: TOKEN_EXPIRES_IN },
    );

    return { admin: toPublic(admin), token };
  }
}

function toPublic(admin: { id: number; name: string; email: string }) {
  return { id: admin.id, name: admin.name, email: admin.email };
}

export const authService = new AuthService();
