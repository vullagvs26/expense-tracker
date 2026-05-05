import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const PURPLE = "#7c3aed";
const PURPLE_LIGHT = "#ede9fe";
const PURPLE_MID = "#a78bfa";

const WALLET_TYPES = [
  { type: "Cash", icon: "💵", color: "#22c55e", gradient: "#bbf7d0" },
  { type: "Bank", icon: "🏦", color: "#3b82f6", gradient: "#bfdbfe" },
  { type: "Crypto", icon: "₿", color: "#f59e0b", gradient: "#fde68a" },
  { type: "Credit Card", icon: "💳", color: "#ec4899", gradient: "#fce7f3" },
  { type: "Savings", icon: "🐖", color: "#8b5cf6", gradient: "#ede9fe" },
  { type: "E-Wallet", icon: "📱", color: "#06b6d4", gradient: "#cffafe" },
];

const INITIAL_WALLETS = [
  {
    id: "1",
    name: "Cash",
    type: "Cash",
    icon: "💵",
    color: "#22c55e",
    gradient: "#bbf7d0",
    balance: 1200.5,
    currency: "₱",
  },
  {
    id: "2",
    name: "BDO Savings",
    type: "Bank",
    icon: "🏦",
    color: "#3b82f6",
    gradient: "#bfdbfe",
    balance: 25000.0,
    currency: "₱",
  },
  {
    id: "3",
    name: "Bitcoin",
    type: "Crypto",
    icon: "₿",
    color: "#f59e0b",
    gradient: "#fde68a",
    balance: 0.0075,
    currency: "₿",
  },
  {
    id: "4",
    name: "GCash",
    type: "E-Wallet",
    icon: "📱",
    color: "#06b6d4",
    gradient: "#cffafe",
    balance: 3400.0,
    currency: "₱",
  },
];

type Wallet = (typeof INITIAL_WALLETS)[0];

function TotalBalanceCard({ wallets }: { wallets: Wallet[] }) {
  const total = wallets
    .filter((w) => w.currency === "₱")
    .reduce((s, w) => s + w.balance, 0);

  return (
    <View style={s.totalCard}>
      <View style={s.totalCardInner}>
        <Text style={s.totalLabel}>Total Balance</Text>
        <Text style={s.totalAmount}>
          ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Text>
        <Text style={s.totalSub}>{wallets.length} wallets connected</Text>
      </View>
      {/* Decorative circles */}
      <View style={s.decCircle1} />
      <View style={s.decCircle2} />
      <View style={s.decCircle3} />
    </View>
  );
}

function WalletCard({ item, onPress }: { item: Wallet; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={s.walletCard}
    >
      {/* Colored left accent */}
      <View style={[s.walletAccent, { backgroundColor: item.color }]} />

      <View style={[s.walletIconWrap, { backgroundColor: item.gradient }]}>
        <Text style={{ fontSize: 22 }}>{item.icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={s.walletName}>{item.name}</Text>
        <Text style={s.walletType}>{item.type}</Text>
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={[s.walletBalance, { color: item.color }]}>
          {item.currency}
          {item.balance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Text>
        <View style={[s.walletChip, { backgroundColor: item.gradient }]}>
          <Text style={[s.walletChipText, { color: item.color }]}>Active</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function AddWalletModal({
  visible,
  onClose,
  onAdd,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (w: Wallet) => void;
}) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [selected, setSelected] = useState(WALLET_TYPES[0]);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now().toString(),
      name: name.trim(),
      type: selected.type,
      icon: selected.icon,
      color: selected.color,
      gradient: selected.gradient,
      balance: parseFloat(balance) || 0,
      currency: "₱",
    });
    setName("");
    setBalance("");
    setSelected(WALLET_TYPES[0]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={s.modalOverlay}>
        <View style={s.modalSheet}>
          <View style={s.modalHandle} />
          <Text style={s.modalTitle}>Add New Wallet</Text>
          <Text style={s.modalSub}>Choose a type and enter details</Text>

          {/* Type Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginVertical: 16 }}
          >
            {WALLET_TYPES.map((wt) => (
              <TouchableOpacity
                key={wt.type}
                onPress={() => setSelected(wt)}
                style={[
                  s.typeChip,
                  {
                    backgroundColor:
                      selected.type === wt.type ? wt.color : "#f3f4f6",
                  },
                ]}
              >
                <Text style={{ fontSize: 18 }}>{wt.icon}</Text>
                <Text
                  style={[
                    s.typeChipText,
                    { color: selected.type === wt.type ? "#fff" : "#6b7280" },
                  ]}
                >
                  {wt.type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Inputs */}
          <Text style={s.inputLabel}>Wallet Name</Text>
          <TextInput
            style={s.input}
            placeholder="e.g. BPI Savings"
            placeholderTextColor="#d1d5db"
            value={name}
            onChangeText={setName}
          />

          <Text style={s.inputLabel}>Initial Balance (₱)</Text>
          <TextInput
            style={s.input}
            placeholder="0.00"
            placeholderTextColor="#d1d5db"
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
          />

          {/* Preview */}
          <View style={[s.previewCard, { backgroundColor: selected.gradient }]}>
            <Text style={{ fontSize: 28 }}>{selected.icon}</Text>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontWeight: "800",
                  color: selected.color,
                  fontSize: 16,
                }}
              >
                {name || "Wallet Name"}
              </Text>
              <Text
                style={{ color: selected.color, opacity: 0.75, fontSize: 13 }}
              >
                ₱
                {parseFloat(balance || "0").toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[s.addBtn, { backgroundColor: selected.color }]}
            onPress={handleAdd}
          >
            <Text style={s.addBtnText}>Add Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function WalletTab() {
  const [wallets, setWallets] = useState(INITIAL_WALLETS);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = (w: Wallet) => setWallets((prev) => [...prev, w]);

  return (
    <View style={s.screen}>
      {/* HEADER */}
      <View style={s.header}>
        <View>
          <Text style={s.headerSub}>My Finances</Text>
          <Text style={s.headerTitle}>Wallets</Text>
        </View>
        <TouchableOpacity
          style={s.headerAddBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={s.headerAddBtnText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <TotalBalanceCard wallets={wallets} />

            {/* Quick Stats */}
            <View style={s.quickStats}>
              <View style={s.quickStat}>
                <Text style={s.quickStatIcon}>📈</Text>
                <Text style={s.quickStatVal}>₱1,200</Text>
                <Text style={s.quickStatLabel}>Income</Text>
              </View>
              <View style={s.quickStatDivider} />
              <View style={s.quickStat}>
                <Text style={s.quickStatIcon}>📉</Text>
                <Text style={[s.quickStatVal, { color: "#ef4444" }]}>₱800</Text>
                <Text style={s.quickStatLabel}>Expenses</Text>
              </View>
              <View style={s.quickStatDivider} />
              <View style={s.quickStat}>
                <Text style={s.quickStatIcon}>💰</Text>
                <Text style={[s.quickStatVal, { color: "#22c55e" }]}>₱400</Text>
                <Text style={s.quickStatLabel}>Saved</Text>
              </View>
            </View>

            <Text style={s.sectionTitle}>All Wallets</Text>
          </>
        }
        renderItem={({ item }) => <WalletCard item={item} onPress={() => {}} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />

      <AddWalletModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f3ff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerSub: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 2,
  },
  headerAddBtn: {
    backgroundColor: PURPLE,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  headerAddBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Total card
  totalCard: {
    backgroundColor: PURPLE,
    borderRadius: 28,
    padding: 28,
    marginBottom: 16,
    marginTop: 4,
    overflow: "hidden",
    position: "relative",
    shadowColor: PURPLE,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  totalCardInner: { zIndex: 2 },
  totalLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalAmount: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
    marginTop: 4,
    letterSpacing: -1,
  },
  totalSub: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6 },
  decCircle1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: -40,
    right: -30,
  },
  decCircle2: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.07)",
    bottom: -20,
    right: 60,
  },
  decCircle3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: 20,
    right: 80,
  },

  // Quick stats
  quickStats: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickStat: { alignItems: "center", flex: 1 },
  quickStatIcon: { fontSize: 20, marginBottom: 4 },
  quickStatVal: { fontSize: 16, fontWeight: "800", color: "#1f2937" },
  quickStatLabel: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 2,
    fontWeight: "500",
  },
  quickStatDivider: { width: 1, height: 40, backgroundColor: "#f3f4f6" },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },

  // Wallet card
  walletCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#7c3aed",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
  walletAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  walletIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  walletName: { fontSize: 15, fontWeight: "700", color: "#1f2937" },
  walletType: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
    fontWeight: "500",
  },
  walletBalance: { fontSize: 17, fontWeight: "800" },
  walletChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
  },
  walletChipText: { fontSize: 10, fontWeight: "700" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#1f2937" },
  modalSub: { fontSize: 13, color: "#9ca3af", marginTop: 4 },

  typeChip: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 10,
  },
  typeChipText: { fontSize: 12, fontWeight: "600", marginTop: 4 },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1f2937",
  },

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  addBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  addBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  cancelBtn: { paddingVertical: 12, alignItems: "center" },
  cancelText: { color: "#9ca3af", fontWeight: "600", fontSize: 14 },
});
