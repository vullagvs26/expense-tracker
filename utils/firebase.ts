import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

function waitForAuthUser() {
  return new Promise<string | null>((resolve, reject) => {
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
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* values.",
    );
  }

  const existingUid = await waitForAuthUser();

  if (existingUid) {
    return existingUid;
  }

  throw new Error("Please sign in to continue.");
}
