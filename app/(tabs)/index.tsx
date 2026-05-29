import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  AppTransaction,
  subscribeRecentTransactions,
} from "@/utils/transactions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USER_NAME = process.env.EXPO_PUBLIC_USER_NAME || "Demo User";

const CATEGORY_STYLES: Record<string, { icon: string; color: string }> = {
  income: { icon: "attach-money", color: "#22c55e" },
  entertainment: { icon: "movie", color: "#3b82f6" },
  health: { icon: "favorite", color: "#ef4444" },
  clothing: { icon: "checkroom", color: "#8b5cf6" },
  transport: { icon: "directions-car", color: "#0ea5e9" },
  food: { icon: "restaurant", color: "#f97316" },
  shopping: { icon: "shopping-bag", color: "#ec4899" },
  bills: { icon: "receipt", color: "#eab308" },
  other: { icon: "category", color: "#6b7280" },
};

function getCategoryStyle(category: string, type: "income" | "expense") {
  if (type === "income") return CATEGORY_STYLES.income;

  return CATEGORY_STYLES[category.toLowerCase()] || CATEGORY_STYLES.other;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const router = useRouter();

  const [transactions, setTransactions] = useState<AppTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeRecentTransactions(
      (items) => {
        setTransactions(items);
        setError(null);
        setLoading(false);
      },
      (subscriptionError) => {
        setError(subscriptionError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const { income, expense, totalBalance } = useMemo(() => {
    const incomeTotal = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);

    const expenseTotal = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      income: incomeTotal,
      expense: expenseTotal,
      totalBalance: incomeTotal - expenseTotal,
    };
  }, [transactions]);

  const renderTransaction = ({ item }: { item: AppTransaction }) => {
    const style = getCategoryStyle(item.category, item.type);

    return (
      <View
        style={[
          styles.txnCard,
          { backgroundColor: colorScheme === "dark" ? "#23272e" : "#fff" },
        ]}
      >
        <View
          style={[styles.txnIconWrap, { backgroundColor: style.color + "22" }]}
        >
          <MaterialIcons
            name={style.icon as any}
            size={28}
            color={style.color}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.txnCategory, { color: theme.text }]}>
            {item.category}
          </Text>
          <Text style={styles.txnNote}>{item.note || "No note"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={[
              styles.txnAmount,
              { color: item.type === "income" ? "#22c55e" : "#ef4444" },
            ]}
          >
            {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
          </Text>
          <Text style={styles.txnDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello,</Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {USER_NAME}
          </Text>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View
        style={[
          styles.balanceCard,
          { backgroundColor: colorScheme === "dark" ? "#23272e" : "#fff" },
        ]}
      >
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceValue}>
          ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceCol}>
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeValue}>
              ${income.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.balanceCol}>
            <Text style={styles.expenseLabel}>Expense</Text>
            <Text style={styles.expenseValue}>
              ${expense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Recent Transactions
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color="#22c55e" size="small" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : null}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              No transactions yet. Tap + to add your first record.
            </Text>
          ) : null
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/transaction-modal")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 32,
    marginBottom: 12,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchBtn: {
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    padding: 8,
  },
  balanceCard: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 2,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  balanceCol: {
    alignItems: "center",
  },
  incomeLabel: {
    color: "#22c55e",
    fontWeight: "600",
    fontSize: 13,
  },
  incomeValue: {
    color: "#22c55e",
    fontWeight: "bold",
    fontSize: 17,
  },
  expenseLabel: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 13,
  },
  expenseValue: {
    color: "#ef4444",
    fontWeight: "bold",
    fontSize: 17,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  txnCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  txnIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  txnCategory: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  txnNote: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 2,
  },
  txnAmount: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
  },
  txnDate: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "right",
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  loadingText: {
    color: "#6b7280",
    marginTop: 6,
    fontSize: 12,
  },
  errorText: {
    color: "#ef4444",
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 12,
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 80, // Move up to sit above the tab bar
    backgroundColor: "#22c55e",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
