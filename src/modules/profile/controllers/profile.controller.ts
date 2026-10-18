import type { Request, Response } from "express";
import type { UpdateProfileDto } from "../dtos/profile.dtos.js";
import { profileService } from "../services/profile.service.js";

export async function getMe(_req: Request, res: Response): Promise<void> {
  res.json({ data: await profileService.getMe() });
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const data = await profileService.updateMe(req.body as UpdateProfileDto);
  res.json({ data });
}
