import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ValidationError } from "../shared/errors/app-error.js";

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
    }
  }
}

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(ValidationError.fromZod(result.error));
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      next(ValidationError.fromZod(result.error));
      return;
    }
    req.validatedQuery = result.data;
    next();
  };
}

export function getValidatedQuery<T>(req: Request): T {
  return req.validatedQuery as T;
}
