import "dotenv/config";
import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

