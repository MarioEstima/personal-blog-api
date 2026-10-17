import { Router } from "express";
import { requireAuth } from "../../../middlewares/auth.middleware.js";
import { validateBody } from "../../../middlewares/validate.middleware.js";
import * as authController from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../dtos/auth.dtos.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", requireAuth, authController.me);

export default router;
