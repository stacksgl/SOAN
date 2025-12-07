import "dotenv/config";
import "./firebase";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import healthRouter from "./health";
import scraperRouter from "./spotify/scraperRouter";
import devAuthRouter from "./devAuth";
import { swaggerSpec } from "./swagger";
import path from "node:path";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(healthRouter);
app.use(scraperRouter);
app.use(devAuthRouter);

const FRONTEND_DIR = path.resolve(process.cwd(), "STP main");
app.use(express.static(FRONTEND_DIR));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
});
