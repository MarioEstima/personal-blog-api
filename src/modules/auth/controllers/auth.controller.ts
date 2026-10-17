import type { Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error.js";
import type { LoginDto, RegisterDto } from "../dtos/auth.dtos.js";
import { authService } from "../services/auth.service.js";

export async function register(req: Request, res: Response): Promise<void> {
  const session = await authService.register(req.body as RegisterDto);
  res.status(201).json({ data: session });
}

export async function login(req: Request, res: Response): Promise<void> {
  const session = await authService.login(req.body as LoginDto);
  res.json({ data: session });
}

export async function me(req: Request, res: Response): Promise<void> {
  const auth = req.auth;
  if (!auth) throw new AppError(401, "Autenticação necessária");

  const data = await authService.me(auth.adminId);
  res.json({ data });
}
