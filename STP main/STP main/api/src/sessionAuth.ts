import dotenv from "dotenv";
dotenv.config();

import * as admin from "firebase-admin";
import type { Request, Response, NextFunction } from "express";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountPath) {
    throw new Error("GOOGLE_APPLICATION_CREDENTIALS environment variable is required");
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "spotifaj-a3766"
  });
}

const COOKIE_NAME = process.env.COOKIE_NAME ?? "fb_session";
const MAX_AGE = Number(process.env.COOKIE_MAX_AGE_MS ?? 7*24*60*60*1000);

export async function sessionLogin(req: Request, res: Response) {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "idToken required" });
    
    const decoded = await admin.auth().verifyIdToken(idToken);
    const cookie = await admin.auth().createSessionCookie(idToken, { expiresIn: MAX_AGE });

    const isProd = process.env.NODE_ENV === "production";
    res.cookie(COOKIE_NAME, cookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });
    res.json({ ok: true, uid: decoded.uid });
  } catch (error) {
    console.error("Session login error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function sessionLogout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
}

export async function requireSession(req: Request, res: Response, next: NextFunction) {
  const cookie = req.cookies?.[process.env.COOKIE_NAME ?? "fb_session"];
  if (!cookie) return res.status(401).json({ error: "No session" });
  
  try {
    const decoded = await admin.auth().verifySessionCookie(cookie, true);
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error("Session verification error:", error);
    res.status(401).json({ error: "Invalid session" });
  }
}
