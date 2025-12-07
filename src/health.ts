import { Router, Request, Response } from "express";

export type HealthResponse = {
  ok: true;
  service: string;
  version: string;
  uptimeMs: number;
  timestamp: string;
};

const router = Router();
const SERVICE = process.env.SERVICE_NAME ?? "tracker-backend";
const VERSION = process.env.npm_package_version ?? "0.0.0";

router.get(
  "/api/health",
  (_req: Request, res: Response<HealthResponse>) => {
    res.set("Cache-Control", "no-store");
    res.json({
      ok: true,
      service: SERVICE,
      version: VERSION,
      uptimeMs: Math.round(process.uptime() * 1000),
      timestamp: new Date().toISOString(),
    });
  }
);

export default router;
