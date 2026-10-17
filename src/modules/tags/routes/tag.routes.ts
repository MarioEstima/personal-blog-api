import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import * as tagController from "../controllers/tag.controller.js";
import { createTagSchema, updateTagSchema } from "../dtos/tag.dtos.js";

const router = Router();

router.get("/", tagController.list);
router.get("/:id", tagController.getById);
router.post("/", requireAuth, validateBody(createTagSchema), tagController.create);
router.put("/:id", requireAuth, validateBody(updateTagSchema), tagController.update);
router.delete("/:id", requireAuth, tagController.remove);

export default router;
