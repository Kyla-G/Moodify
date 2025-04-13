import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsPage({ onClose }) {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center w-full px-4 pt-6 pb-4">
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-white">Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16 }}>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">Passcode</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">Manual Backup</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4">
          <Text className="text-white text-lg">About Moodify</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}