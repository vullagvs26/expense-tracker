import { User } from "@/types/firestore";
import { uploadToCloudinary } from "@/utils/cloudinary";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileTab() {
  const [user, setUser] = useState<User | null>({
    name: "Test User",
    email: "test@example.com",
    avatar: "https://ui-avatars.com/api/?name=Test+User",
  });

  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      try {
        setUploading(true);
        const url = await uploadToCloudinary(result.assets[0].uri);
        setUser((prev) => (prev ? { ...prev, avatar: url } : prev));
      } catch (e) {
        Alert.alert("Upload failed", "Could not upload image.");
      } finally {
        setUploading(false);
      }
    }
  };

  const signOut = async () => {
    Alert.alert("Sign out", "Sign out is disabled in test mode.");
  };

  return (
    <ScrollView style={s.screen}>
      {/* HEADER */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
        <Text style={s.headerSub}>Manage your account and preferences</Text>

        {/* AVATAR */}
        <View style={s.avatarSection}>
          <TouchableOpacity
            onPress={pickImage}
            disabled={uploading}
            style={s.avatarWrapper}
          >
            <Image
              source={{
                uri: user?.avatar || "https://ui-avatars.com/api/?name=User",
              }}
              style={s.avatar}
            />
            {uploading && (
              <View style={s.avatarOverlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {/* Camera badge */}
          <View style={s.cameraBadge}>
            <Text style={{ color: "#fff", fontSize: 12 }}>📷</Text>
          </View>

          <Text style={s.userName}>{user?.name}</Text>
          <Text style={s.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* STATS */}
      <View style={s.statsRow}>
        <View style={[s.statCard, { marginRight: 8 }]}>
          <Text style={s.statLabel}>Total Expenses</Text>
          <Text style={s.statValue}>₱0.00</Text>
          <Text style={s.statSub}>This month</Text>
        </View>
        <View style={[s.statCard, { marginLeft: 8 }]}>
          <Text style={s.statLabel}>Balance</Text>
          <Text style={[s.statValue, { color: "#22c55e" }]}>₱0.00</Text>
          <Text style={s.statSub}>Available</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={s.section}>
        <Text style={s.sectionTitle}>Account</Text>

        {[
          { label: "✏️  Edit Profile", onPress: () => {} },
          { label: "🔔  Notifications", onPress: () => {} },
          { label: "⚙️  Settings", onPress: () => {} },
          { label: "🔒  Privacy & Security", onPress: () => {} },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={s.menuItem} onPress={item.onPress}>
            <Text style={s.menuLabel}>{item.label}</Text>
            <Text style={s.menuChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* SIGN OUT */}
      <View style={s.section}>
        <TouchableOpacity onPress={signOut} style={s.signOutBtn}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const PURPLE = "#7c3aed";
const LIGHT_PURPLE = "#ede9fe";

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f3ff",
  },
  header: {
    backgroundColor: PURPLE,
    paddingTop: 64,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  headerSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 2,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 48,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 32,
    right: "32%",
    backgroundColor: PURPLE,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
  },
  userEmail: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 4,
  },
  statSub: {
    fontSize: 11,
    color: "#d1d5db",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuLabel: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
  },
  menuChevron: {
    fontSize: 22,
    color: "#d1d5db",
    fontWeight: "300",
  },
  signOutBtn: {
    backgroundColor: "#fee2e2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  signOutText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 15,
  },
});
