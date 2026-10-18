import { z } from "zod";

/**
 * Schema padrão de slug: trim + minúsculas + `[a-z0-9-]`.
 * Cada módulo define apenas o comprimento máximo.
 *
 * @example slugSchema(200) // posts
 * @example slugSchema(120) // categorias
 */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MESSAGE = "Slug inválido (letras minúsculas, números e hífens)";

export function slugSchema(maxLength: number) {
  return z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Slug é obrigatório")
    .max(maxLength, `Slug deve ter no máximo ${maxLength} caracteres`)
    .regex(SLUG_PATTERN, SLUG_MESSAGE);
}
