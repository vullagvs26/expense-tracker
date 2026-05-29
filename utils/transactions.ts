import { db, ensureSignedInUser, isFirebaseConfigured } from "@/utils/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
} from "firebase/firestore";

export type TransactionType = "income" | "expense";

export interface AppTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: Date;
}

interface TransactionPayload {
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date?: Date;
}

function userTransactionsCollection(userId: string) {
  return collection(db, "users", userId, "transactions");
}

function isTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}

function getTransactionDate(raw: Record<string, unknown>) {
  if (raw.date instanceof Date) return raw.date;
  if (isTimestamp(raw.date)) return raw.date.toDate();
  if (raw.createdAt instanceof Date) return raw.createdAt;
  if (isTimestamp(raw.createdAt)) return raw.createdAt.toDate();

  return new Date(0);
}

export function subscribeRecentTransactions(
  onData: (items: AppTransaction[]) => void,
  onError: (error: Error) => void,
) {
  if (!isFirebaseConfigured) {
    onError(
      new Error(
        "Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* values.",
      ),
    );
    return () => undefined;
  }

  let unsubscribeSnapshot: () => void = () => {};
  let cancelled = false;

  ensureSignedInUser()
    .then((uid) => {
      if (cancelled) return;

      const q = query(userTransactionsCollection(uid));

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const items = snapshot.docs
            .map((doc: QueryDocumentSnapshot<DocumentData>) => {
              const raw = doc.data() as Record<string, unknown>;
              return {
                id: doc.id,
                type: (raw.type as TransactionType) || "expense",
                amount: Number(raw.amount || 0),
                category: String(raw.category || "Other"),
                note: String(raw.note || ""),
                date: getTransactionDate(raw),
              };
            })
            .sort((left, right) => right.date.getTime() - left.date.getTime())
            .slice(0, 50);

          onData(items);
        },
        (error: Error) => {
          onError(error as Error);
        },
      );
    })
    .catch((error) => {
      onError(error as Error);
    });

  return () => {
    cancelled = true;
    unsubscribeSnapshot();
  };
}

export async function createTransaction(payload: TransactionPayload) {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add EXPO_PUBLIC_FIREBASE_* values.",
    );
  }

  const uid = await ensureSignedInUser();

  await addDoc(userTransactionsCollection(uid), {
    ...payload,
    date: Timestamp.fromDate(payload.date || new Date()),
    createdAt: serverTimestamp(),
  });
}
