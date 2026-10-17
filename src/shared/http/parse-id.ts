import { AppError } from "../errors/app-error.js";

export function parseId(value: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError(400, "ID inválido");
  }
  return id;
}
