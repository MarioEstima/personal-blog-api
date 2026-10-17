import "dotenv/config";
import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
import { prisma } from "./shared/prisma/prisma.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.admin.count();
    res.json({ status: "ok", database: "up" });
  } catch {
    res.status(503).json({ status: "degraded", database: "down" });
  }
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Blog API is running on http://localhost:${port}`);
});
