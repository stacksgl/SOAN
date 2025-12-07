import { Router, Request, Response } from "express";

const router = Router();

const SKIP_AUTH = (() => {
  const v = String(process.env.SKIP_AUTH || "").toLowerCase();
  return v === "1" || v === "true";
})();

if (SKIP_AUTH) {
  router.post("/api/auth/sessionLogin", (_req: Request, res: Response) => {
    res.json({ ok: true, mock: true });
  });

  router.post("/api/auth/sessionLogout", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  router.get("/api/me", (_req: Request, res: Response) => {
    res.json({ uid: "dev", email: "dev@example.com", displayName: "Dev User" });
  });
}

export default router;


