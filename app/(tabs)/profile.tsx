import { User } from "@/types/firestore";
import { uploadToCloudinary } from "@/utils/cloudinary";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Removed Firestore user fetch and auth dependency

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
      <TouchableOpacity
        onPress={pickImage}
        disabled={uploading}
        className="mb-4"
      >
        <Image
          source={{
            uri: user?.avatar || "https://ui-avatars.com/api/?name=User",
          }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: "#eee",
          }}
        />
        {uploading && (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ffffffcc",
              borderRadius: 48,
            }}
          >
            <ActivityIndicator size="small" />
          </View>
        )}
      </TouchableOpacity>
      <Text className="text-xl font-bold mb-1">{user?.name || "No Name"}</Text>
      <Text className="text-base text-gray-500 mb-4">{user?.email}</Text>
      {/* Edit name button could open a modal for editing name (not implemented here) */}
      <TouchableOpacity
        onPress={signOut}
        className="mt-4 bg-red-500 px-6 py-2 rounded"
      >
        <Text className="text-white font-bold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
