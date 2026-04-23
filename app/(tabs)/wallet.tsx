import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const TEST_WALLETS = [
  {
    id: "1",
    name: "Cash",
    icon: "account-balance-wallet",
    balance: 120.5,
  },
  {
    id: "2",
    name: "Bank",
    icon: "account-balance",
    balance: 2500.0,
  },
  {
    id: "3",
    name: "Crypto",
    icon: "currency-bitcoin",
    balance: 0.75,
  },
];

export default function WalletTab() {
  const [wallets, setWallets] = useState(TEST_WALLETS);
  const colorScheme = useColorScheme() ?? "light";

  const renderWallet = ({ item }: any) => (
    <ThemedView style={styles.walletCard}>
      <View style={styles.walletIconWrap}>
        <IconSymbol
          name="house.fill"
          size={28}
          color={Colors[colorScheme].tint}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText type="subtitle">{item.name}</ThemedText>
        <ThemedText type="default">
          Balance: ${item.balance.toLocaleString()}
        </ThemedText>
      </View>
    </ThemedView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
      <View style={styles.header}>
        <ThemedText type="title">Wallets</ThemedText>
        <TouchableOpacity style={styles.addBtn} onPress={() => {}}>
          <IconSymbol
            name="chevron.left.forwardslash.chevron.right"
            size={24}
            color="#fff"
          />
          <Text style={styles.addBtnText}>Add Wallet</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={renderWallet}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 8,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a7ea4",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 16,
  },
  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  walletIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0e7ef",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
});
