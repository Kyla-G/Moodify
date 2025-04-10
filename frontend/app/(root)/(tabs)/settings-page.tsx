import React from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function SettingsPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const nickname = params.nickname || "Friend";

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center w-full px-4 pt-6 pb-4">
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back-outline" size={28} color="#EEEED0" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-[#FF6B35]">Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Welcome message */}
      <View className="px-4 py-6 border-b border-gray-800">
        <Text 
          className="text-[#EEEED0] text-2xl font-LeagueSpartan-Bold"
          style={{ fontSize: width < 350 ? 20 : 24 }}
        >
          Hello, {nickname}
        </Text>
        <Text 
          className="text-gray-400 mt-1"
          style={{ fontSize: width < 350 ? 14 : 16 }}
        >
          Customize your Moodify experience
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-white text-lg">Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#545454" />
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-white text-lg">Passcode</Text>
          <Ionicons name="chevron-forward" size={20} color="#545454" />
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-white text-lg">Change Nickname</Text>
          <Ionicons name="chevron-forward" size={20} color="#545454" />
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-white text-lg">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#545454" />
        </TouchableOpacity>
        
        <TouchableOpacity className="bg-[#202020] p-4 rounded-lg mb-4 flex-row justify-between items-center">
          <Text className="text-white text-lg">About Moodify</Text>
          <Ionicons name="chevron-forward" size={20} color="#545454" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}