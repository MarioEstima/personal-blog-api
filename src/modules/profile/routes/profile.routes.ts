import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import { getMe, updateMe } from "../controllers/profile.controller.js";
import { updateProfileSchema } from "../dtos/profile.dtos.js";

const router = Router();

router.get("/", getMe);
router.put("/", requireAuth, validateBody(updateProfileSchema), updateMe);

export default router;
