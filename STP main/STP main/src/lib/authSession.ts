import { auth } from "./firebase";
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";

// Google Authentication
export async function loginWithGoogleSession() {
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  const idToken = await cred.user.getIdToken(true);
  const r = await fetch("/api/auth/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!r.ok) throw new Error(await r.text());
  return cred.user;
}

// Email/Password Authentication
export async function loginWithEmailSession(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken(true);
  const r = await fetch("/api/auth/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!r.ok) throw new Error(await r.text());
  return cred.user;
}

// User Registration
export async function registerWithEmailSession(name: string, email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update user profile with name
  await updateProfile(cred.user, { displayName: name });
  
  // Create session
  const idToken = await cred.user.getIdToken(true);
  const r = await fetch("/api/auth/sessionLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  if (!r.ok) throw new Error(await r.text());
  return cred.user;
}

// Logout
export async function logoutSession() {
  await signOut(auth).catch(() => {});
  await fetch("/api/auth/sessionLogout", { method: "POST", credentials: "include" });
}

// Get current user from session
export async function fetchMe() {
  const r = await fetch("/api/me", { credentials: "include" });
  if (!r.ok) return null;
  return r.json(); // { uid, email?, displayName? }
}
