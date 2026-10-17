import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/errors/app-error.js";

export interface AuthPayload {
  adminId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
    }
  }
}

function jwtSecret(): string {
  const secret = process.env.JWT_TOKEN;
  if (!secret) throw new AppError(500, "JWT_TOKEN não configurado");
  return secret;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new AppError(401, "Token de autenticação não fornecido"));
    return;
  }

  const secret = jwtSecret();

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === "string" || !payload.sub) {
      next(new AppError(401, "Token inválido"));
      return;
    }
    req.auth = {
      adminId: Number(payload.sub),
      email: String(payload.email ?? ""),
    };
    next();
  } catch {
    next(new AppError(401, "Token inválido ou expirado"));
  }
}
