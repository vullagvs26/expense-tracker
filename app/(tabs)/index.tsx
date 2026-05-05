import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const USER_NAME = "Syed Noman";
const TOTAL_BALANCE = 504.0;
const INCOME = 2429.0;
const EXPENSE = 1925.0;

const TRANSACTIONS = [
  {
    id: "1",
    type: "income",
    category: "Income",
    note: "completed a project",
    amount: 50,
    date: "11 Dec",
    icon: "attach-money",
    color: "#22c55e",
  },
  {
    id: "2",
    type: "expense",
    category: "Entertainment",
    note: "watched a movie",
    amount: 30,
    date: "11 Dec",
    icon: "movie",
    color: "#3b82f6",
  },
  {
    id: "3",
    type: "expense",
    category: "Health",
    note: "checkup fee",
    amount: 25,
    date: "11 Dec",
    icon: "favorite",
    color: "#ef4444",
  },
  {
    id: "4",
    type: "income",
    category: "Income",
    note: "gift from Family",
    amount: 60,
    date: "10 Dec",
    icon: "attach-money",
    color: "#22c55e",
  },
  {
    id: "5",
    type: "expense",
    category: "Clothing",
    note: "Winter Clothing",
    amount: 40,
    date: "9 Dec",
    icon: "checkroom",
    color: "#8b5cf6",
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const renderTransaction = ({ item }: any) => (
    <View
      style={[
        styles.txnCard,
        { backgroundColor: colorScheme === "dark" ? "#23272e" : "#fff" },
      ]}
    >
      <View
        style={[styles.txnIconWrap, { backgroundColor: item.color + "22" }]}
      >
        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.txnCategory, { color: theme.text }]}>
          {item.category}
        </Text>
        <Text style={styles.txnNote}>{item.note}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={[
            styles.txnAmount,
            { color: item.type === "income" ? "#22c55e" : "#ef4444" },
          ]}
        >
          {item.type === "income" ? "+" : "-"}${item.amount}
        </Text>
        <Text style={styles.txnDate}>{item.date}</Text>
      </View>
    </View>
  );

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
          ${TOTAL_BALANCE.toLocaleString()}
        </Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceCol}>
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeValue}>${INCOME.toLocaleString()}</Text>
          </View>
          <View style={styles.balanceCol}>
            <Text style={styles.expenseLabel}>Expense</Text>
            <Text style={styles.expenseValue}>${EXPENSE.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Recent Transactions
      </Text>
      <FlatList
        data={TRANSACTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab}>
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
