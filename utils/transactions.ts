import {
    db,
    ensureAnonymousUser,
    isFirebaseConfigured,
} from "@/utils/firebase";
import {
    Timestamp,
    addDoc,
    collection,
    limit,
    onSnapshot,
    orderBy,
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

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return new Date();
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

  ensureAnonymousUser()
    .then((uid) => {
      if (cancelled) return;

      const q = query(
        userTransactionsCollection(uid),
        orderBy("date", "desc"),
        limit(50),
      );

      unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((doc) => {
            const raw = doc.data() as Record<string, unknown>;
            return {
              id: doc.id,
              type: (raw.type as TransactionType) || "expense",
              amount: Number(raw.amount || 0),
              category: String(raw.category || "Other"),
              note: String(raw.note || ""),
              date: toDate(raw.date),
            };
          });

          onData(items);
        },
        (error) => {
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

  const uid = await ensureAnonymousUser();

  await addDoc(userTransactionsCollection(uid), {
    ...payload,
    date: Timestamp.fromDate(payload.date || new Date()),
    createdAt: serverTimestamp(),
  });
}
