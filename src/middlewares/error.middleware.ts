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
    const message =
      target?.length === 1
        ? "Já existe um registo com este valor"
        : "Já existe um registo com estes dados";
    res.status(409).json({
      message,
      ...(target?.length
        ? { fields: Object.fromEntries(target.map((field) => [field, ["Valor já utilizado"]])) }
        : {}),
    });
    return;
  }

  if (code === "P2003") {
    const target = getForeignKeys(err);
    res.status(400).json({
      message: "Referência inexistente",
      ...(target?.length
        ? { fields: Object.fromEntries(target.map((field) => [field, ["Registo inexistente"]])) }
        : {}),
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

type PrismaMeta = {
  target?: unknown;
  modelName?: unknown;
  driverAdapterError?: {
    cause?: {
      constraint?: { index?: unknown; table?: unknown; fields?: unknown };
    };
  };
};

function getMeta(err: unknown): PrismaMeta | undefined {
  if (typeof err !== "object" || err === null || !("meta" in err)) return undefined;
  const { meta } = err as { meta?: unknown };
  if (typeof meta !== "object" || meta === null) return undefined;
  return meta as PrismaMeta;
}

function getErrorCode(err: unknown): string | undefined {
  if (typeof err === "object" && err !== null && "code" in err) {
    const { code } = err as { code?: unknown };
    if (typeof code === "string") return code;
  }
  return undefined;
}

/**
 * Campos que violaram uma unicidade.
 * O Prisma entrega isto de formas diferentes consoante o caminho
 * (`meta.target` ou `meta.driverAdapterError.cause.constraint`), por isso
 * temos de ler as duas.
 */
function getUniqueTarget(err: unknown): string[] | undefined {
  const meta = getMeta(err);
  if (!meta) return undefined;

  const target = meta.target;
  if (typeof target === "string" && target.length > 0) return [target];
  if (
    Array.isArray(target) &&
    target.length > 0 &&
    target.every((entry): entry is string => typeof entry === "string")
  ) {
    return target;
  }

  const constraint = meta.driverAdapterError?.cause?.constraint;
  const index = constraint?.index;
  if (typeof index !== "string" || index.length === 0) return undefined;

  // `Post_slug_key` -> `slug`; `Post_title_slug_key` -> `title` + `slug`
  let name = index.endsWith("_key") ? index.slice(0, -"_key".length) : index;
  const prefix =
    (typeof constraint?.table === "string" && constraint.table) ||
    (typeof meta.modelName === "string" && meta.modelName) ||
    undefined;

  if (prefix && name.startsWith(`${prefix}_`)) {
    name = name.slice(prefix.length + 1);
  } else {
    const separator = name.indexOf("_");
    if (separator > 0) name = name.slice(separator + 1);
  }

  const fields = name.split("_").filter(Boolean);
  return fields.length > 0 ? fields : undefined;
}

/** Campos que violaram uma foreign key (`meta.driverAdapterError...fields`). */
function getForeignKeys(err: unknown): string[] | undefined {
  const fields = getMeta(err)?.driverAdapterError?.cause?.constraint?.fields;
  if (!Array.isArray(fields) || fields.length === 0) return undefined;
  const names = fields.filter((entry): entry is string => typeof entry === "string");
  return names.length > 0 ? names : undefined;
}
