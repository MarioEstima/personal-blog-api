import type { Request, Response } from "express";
import { getValidatedQuery } from "../../../middlewares/validate.middleware.js";
import { parseId } from "../../../shared/http/parse-id.js";
import type { CreatePostDto, ListPostsQueryDto, UpdatePostDto } from "../dtos/post.dtos.js";
import { postService } from "../services/post.service.js";

export async function list(req: Request, res: Response): Promise<void> {
  const query = getValidatedQuery<ListPostsQueryDto>(req);
  res.json({ data: await postService.list(query) });
}

export async function listAdmin(req: Request, res: Response): Promise<void> {
  const query = getValidatedQuery<ListPostsQueryDto>(req);
  res.json({ data: await postService.list(query, true) });
}

export async function getById(req: Request, res: Response): Promise<void> {
  res.json({ data: await postService.getById(parseId(String(req.params.id))) });
}

export async function getBySlug(req: Request, res: Response): Promise<void> {
  res.json({ data: await postService.getBySlug(String(req.params.slug)) });
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = await postService.create(req.body as CreatePostDto);
  res.status(201).json({ data });
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = await postService.update(
    parseId(String(req.params.id)),
    req.body as UpdatePostDto,
  );
  res.json({ data });
}

export async function remove(req: Request, res: Response): Promise<void> {
  res.json({ data: await postService.remove(parseId(String(req.params.id))) });
}
