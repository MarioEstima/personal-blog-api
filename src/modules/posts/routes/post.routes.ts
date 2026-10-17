import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../../../middlewares/validate.middleware.js";
import * as postController from "../controllers/post.controller.js";
import { createPostSchema, listPostsQuerySchema, updatePostSchema } from "../dtos/post.dtos.js";

const router = Router();

router.get("/", validateQuery(listPostsQuerySchema), postController.list);
router.get("/admin", requireAuth, validateQuery(listPostsQuerySchema), postController.listAdmin);
router.get("/admin/:id", requireAuth, postController.getById);
router.get("/:slug", postController.getBySlug);
router.post("/", requireAuth, validateBody(createPostSchema), postController.create);
router.put("/:id", requireAuth, validateBody(updatePostSchema), postController.update);
router.delete("/:id", requireAuth, postController.remove);

export default router;
