import type { Request, Response } from "express";
import { parseId } from "../../../shared/http/parse-id.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dtos.js";
import { categoryService } from "../services/category.service.js";

export async function list(_req: Request, res: Response): Promise<void> {
  res.json({ data: await categoryService.list() });
}

export async function getById(req: Request, res: Response): Promise<void> {
  res.json({ data: await categoryService.getById(parseId(String(req.params.id))) });
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = await categoryService.create(req.body as CreateCategoryDto);
  res.status(201).json({ data });
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = await categoryService.update(
    parseId(String(req.params.id)),
    req.body as UpdateCategoryDto,
  );
  res.json({ data });
}

export async function remove(req: Request, res: Response): Promise<void> {
  res.json({ data: await categoryService.remove(parseId(String(req.params.id))) });
}
