import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import * as categoryController from "../controllers/category.controller.js";
import { createCategorySchema, updateCategorySchema } from "../dtos/category.dtos.js";

const router = Router();

router.get("/", categoryController.list);
router.get("/:id", categoryController.getById);
router.post("/", requireAuth, validateBody(createCategorySchema), categoryController.create);
router.put("/:id", requireAuth, validateBody(updateCategorySchema), categoryController.update);
router.delete("/:id", requireAuth, categoryController.remove);

export default router;
