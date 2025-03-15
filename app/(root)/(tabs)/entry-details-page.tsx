import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function EntryDetailsPage({ route, navigation }) {
  const { mood, emotion, date, time } = route.params;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center w-full px-4 pt-6 pb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-white">Entry Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-white text-2xl font-bold mb-6">Mood: {mood}</Text>
        <Text className="text-white text-2xl font-bold mb-6">Emotion: {emotion}</Text>
        <Text className="text-white text-2xl font-bold mb-6">Date: {date}</Text>
        <Text className="text-white text-2xl font-bold mb-6">Time: {time}</Text>

        <Text className="text-white text-xl font-bold mb-6 text-center">
          Would you like to talk about it more?
        </Text>

        <View className="flex-row gap-4 mt-8 w-full">
          <TouchableOpacity
            onPress={() => navigation.navigate("chatbot-page")}
            className="bg-[#FF6B35] p-4 rounded-2xl flex-1 items-center"
          >
            <Text className="text-white text-lg">Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("home-page")}
            className="bg-gray-700 p-4 rounded-2xl flex-1 items-center"
          >
            <Text className="text-white text-lg">No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}