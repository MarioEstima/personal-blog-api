import type { Request, Response } from "express";
import type { UpdateProfileDto } from "../dtos/profile.dtos.js";
import { profileService } from "../services/profile.service.js";

export async function get(_req: Request, res: Response): Promise<void> {
  res.json({ data: await profileService.get() });
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = await profileService.update(req.body as UpdateProfileDto);
  res.json({ data });
}
