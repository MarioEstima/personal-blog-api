import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../shared/errors/app-error.js";

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: "Rota não encontrada" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(err.status).json({ message: err.message, fields: err.fields });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    const { fields } = ValidationError.fromZod(err);
    res.status(400).json({ message: "Dados inválidos", fields });
    return;
  }

  const code = getErrorCode(err);
  if (code === "P2002") {
    const target = getUniqueTarget(err);
    const fields = target
      ? Object.fromEntries(target.map((t) => [t, ["Já existe um registo com este valor"]]))
      : undefined;
    res.status(409).json({
      message: "Já existe um registo com estes dados",
      ...(fields ? { fields } : {}),
    });
    return;
  }
  if (code === "P2025") {
    res.status(404).json({ message: "Registo não encontrado" });
    return;
  }

  if (err instanceof SyntaxError && "status" in err) {
    res.status(400).json({ message: "JSON inválido" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const { code } = err as { code?: unknown };
    if (typeof code === "string") return code;
  }
  return undefined;
}

function getUniqueTarget(err: unknown): string[] | undefined {
  if (typeof err === "object" && err !== null && "meta" in err) {
    const { meta } = err as { meta?: { target?: unknown } };
    if (
      Array.isArray(meta?.target) &&
      meta.target.length > 0 &&
      meta.target.every((t) => typeof t === "string")
    ) {
      return meta.target as string[];
    }
  }
  return undefined;
}
