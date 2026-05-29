import { createTransaction, TransactionType } from "@/utils/transactions";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function TransactionModal() {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  const handleSave = async () => {
    if (!category.trim()) {
      Alert.alert("Missing category", "Please provide a category.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Amount should be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      await createTransaction({
        type,
        category: category.trim(),
        note: note.trim(),
        amount: parsedAmount,
      });
      router.back();
    } catch (error) {
      Alert.alert(
        "Save failed",
        error instanceof Error ? error.message : "Could not save transaction.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Add Transaction</Text>

      <View style={styles.segmentRow}>
        <TouchableOpacity
          onPress={() => setType("expense")}
          style={[
            styles.segmentBtn,
            type === "expense" && styles.segmentActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              type === "expense" && styles.segmentTextActive,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("income")}
          style={[styles.segmentBtn, type === "income" && styles.segmentActive]}
        >
          <Text
            style={[
              styles.segmentText,
              type === "income" && styles.segmentTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Category</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Food, Salary, Transport..."
        style={styles.input}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="0.00"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Short description"
        style={[styles.input, styles.noteInput]}
        multiline
      />

      <TouchableOpacity
        style={[styles.primaryBtn, saving && styles.btnDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.primaryBtnText}>
          {saving ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} disabled={saving}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  segmentRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: "#ffffff",
  },
  segmentText: {
    color: "#6b7280",
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#111827",
  },
  label: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  noteInput: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelText: {
    textAlign: "center",
    marginTop: 14,
    color: "#6b7280",
    fontSize: 14,
  },
});
