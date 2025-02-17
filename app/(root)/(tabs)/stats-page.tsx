import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PieChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";

const dummyEntries = [
  { mood: "Rad", date: "2025-02-15" },
  { mood: "Bad", date: "2025-02-14" },
  { mood: "Rad", date: "2025-02-13" },
  { mood: "Bad", date: "2025-02-12" },
  { mood: "Good", date: "2025-02-11" },
  { mood: "Awful", date: "2025-02-10" },
  { mood: "Good", date: "2025-02-09" },
  { mood: "Meh", date: "2025-02-08" },
];

const moodColors = {
  Rad: "#FFDD67",
  Good: "#A8E6CF",
  Meh: "#FFD3B6",
  Bad: "#FFAAA5",
  Awful: "#D7263D",
};

export default function StatsScreen() {
  const moodCounts = dummyEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(moodCounts).map((mood) => ({
    name: mood,
    count: moodCounts[mood],
    color: moodColors[mood],
    legendFontColor: "#FFF",
    legendFontSize: 14,
  }));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />
      
      <View className="items-center w-full pt-6 px-4">
        <Text className="text-txt-medium font-LeagueSpartan-Bold text-3xl">Mood Stats</Text>
      </View>
      
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <PieChart
          data={chartData}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "black",
            backgroundGradientFrom: "#1E1E1E",
            backgroundGradientTo: "#1E1E1E",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
        
        <View className="w-full mt-6">
          {Object.keys(moodCounts).map((mood, index) => (
            <View key={index} className="flex-row justify-between bg-[#101011] p-4 mb-2 rounded-lg">
              <Text className="text-white text-lg">{mood}</Text>
              <Text className="text-gray-400 text-lg">{moodCounts[mood]} times</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}