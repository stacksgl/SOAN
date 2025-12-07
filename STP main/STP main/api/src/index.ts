import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { sessionLogin, sessionLogout, requireSession } from "./sessionAuth";

const app = express();
app.use(express.json());
app.use(cookieParser());

const ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:8080";
app.use(cors({ origin: ORIGIN, credentials: true }));

// Auth routes
app.post("/api/auth/sessionLogin", sessionLogin);
app.post("/api/auth/sessionLogout", sessionLogout);

// Protected routes
app.get("/api/me", requireSession, (req, res) => {
  const user = (req as any).user;
  res.json({ 
    uid: user.uid, 
    email: user.email ?? null,
    displayName: user.name || user.display_name || null
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT ?? 8081);
app.listen(port, () => console.log(`API server running on http://localhost:${port}`));
