import type { Request, Response } from "express";
import { parseId } from "../../../shared/http/parse-id.js";
import type { CreateTagDto, UpdateTagDto } from "../dtos/tag.dtos.js";
import { tagService } from "../services/tag.service.js";

export async function list(_req: Request, res: Response): Promise<void> {
  res.json({ data: await tagService.list() });
}

export async function getById(req: Request, res: Response): Promise<void> {
  res.json({ data: await tagService.getById(parseId(String(req.params.id))) });
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = await tagService.create(req.body as CreateTagDto);
  res.status(201).json({ data });
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = await tagService.update(
    parseId(String(req.params.id)),
    req.body as UpdateTagDto,
  );
  res.json({ data });
}

export async function remove(req: Request, res: Response): Promise<void> {
  res.json({ data: await tagService.remove(parseId(String(req.params.id))) });
}
