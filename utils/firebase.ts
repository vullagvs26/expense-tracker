import { initializeApp } from "firebase/app";
import { Auth, getAuth, onAuthStateChanged } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId,
);

export const firebaseConfigError =
  "Firebase is not configured for this build. Add EXPO_PUBLIC_FIREBASE_* values in EAS environment variables and rebuild.";

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

function waitForAuthUser() {
  return new Promise<string | null>((resolve, reject) => {
    if (!auth) {
      resolve(null);
      return;
    }

    if (auth.currentUser?.uid) {
      resolve(auth.currentUser.uid);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user?.uid ?? null);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });
}

export async function ensureSignedInUser() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(firebaseConfigError);
  }

  const existingUid = await waitForAuthUser();

  if (existingUid) {
    return existingUid;
  }

  throw new Error("Please sign in to continue.");
}
