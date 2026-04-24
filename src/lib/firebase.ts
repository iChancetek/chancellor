/* ───────────────────────────────────────────────────────────
 *  Firebase Client SDK Configuration
 * ─────────────────────────────────────────────────────────── */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Support both individual env vars and the consolidated JSON config from Firebase App Hosting
const webAppConfig = process.env.FIREBASE_WEBAPP_CONFIG 
  ? JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG) 
  : {};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || webAppConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || webAppConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || webAppConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || webAppConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || webAppConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || webAppConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || webAppConfig.measurementId,
};

// Don't initialize Firebase if the API key is missing (e.g. during static build phase)
const isFirebaseConfigured = !!firebaseConfig.apiKey;

const app = (getApps().length || !isFirebaseConfigured) 
  ? (getApps()[0] || null) 
  : initializeApp(firebaseConfig);

export const auth = isFirebaseConfigured ? getAuth(app!) : null as any;
export const db = isFirebaseConfigured ? getFirestore(app!) : null as any;
export const storage = isFirebaseConfigured ? getStorage(app!) : null as any;
export const googleProvider = new GoogleAuthProvider();

export default app;
