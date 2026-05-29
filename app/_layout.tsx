import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    auth,
    firebaseConfigError,
    isFirebaseConfigured,
} from "@/utils/firebase";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  if (!isFirebaseConfigured) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: "#0b1020",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Build Configuration Missing
        </Text>
        <Text style={{ color: "#cbd5e1", fontSize: 14, textAlign: "center" }}>
          {firebaseConfigError}
        </Text>
      </View>
    );
  }

  useEffect(() => {
    if (!auth) {
      setReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, () => {
      setReady(true);
    });

    return unsubscribe;
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction-modal"
          options={{ presentation: "modal", title: "Add Transaction" }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
