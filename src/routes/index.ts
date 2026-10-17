import { Router } from "express";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import categoryRoutes from "../modules/categories/routes/category.routes.js";
import postRoutes from "../modules/posts/routes/post.routes.js";
import profileRoutes from "../modules/profile/routes/profile.routes.js";
import tagRoutes from "../modules/tags/routes/tag.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/posts", postRoutes);
apiRouter.use("/categories", categoryRoutes);
apiRouter.use("/tags", tagRoutes);
apiRouter.use("/profile", profileRoutes);

export default apiRouter;
