import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "../firebase-service-account.json" with { type: "json" };

// Initialize Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth();