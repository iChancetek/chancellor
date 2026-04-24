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

const isServer = typeof window === 'undefined';
const isFirebaseConfigured = !!firebaseConfig.apiKey;

// On the server, we skip initialization if config is missing to prevent build crashes.
// On the client, we always try to initialize if there's a config, OR we check if already initialized.
let app;
if (getApps().length > 0) {
  app = getApp();
} else {
  if (isServer && !isFirebaseConfigured) {
    // During build/SSR without config, we just don't initialize
    app = null;
  } else {
    // On client (where we expect keys) or server WITH config, we initialize
    app = initializeApp(firebaseConfig);
  }
}

export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export const storage = app ? getStorage(app) : ({} as any);
export const googleProvider = new GoogleAuthProvider();

export default app;
