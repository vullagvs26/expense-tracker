export interface User {
  name: string;
  email: string;
  avatar: string; // Cloudinary URL
}

export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balance: number;
  created: any; // Firestore Timestamp
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  note: string;
  date: any; // Firestore Timestamp
  walletId: string;
  created: any; // Firestore Timestamp
}
