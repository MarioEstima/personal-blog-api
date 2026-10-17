import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import * as profileController from "../controllers/profile.controller.js";
import { updateProfileSchema } from "../dtos/profile.dtos.js";

const router = Router();

router.get("/", profileController.get);
router.put("/", requireAuth, validateBody(updateProfileSchema), profileController.update);

export default router;
