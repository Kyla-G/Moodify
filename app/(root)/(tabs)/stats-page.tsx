import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PieChart, BarChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";

const screenWidth = Dimensions.get("window").width - 40; // Account for padding

const brandColors = {
  primary: "#003049",
  secondary: "#FF6B35",
  accent: "#F6C49E",
};

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
  Rad: brandColors.accent,
  Good: "#A8E6CF",
  Meh: "#FFD3B6",
  Bad: brandColors.secondary,
  Awful: "#D7263D",
};

const moodCounts = dummyEntries.reduce((acc, entry) => {
  acc[entry.mood] = (acc[entry.mood] || 0) + 1;
  return acc;
}, {});

const moodChartData = Object.keys(moodCounts).map((mood) => ({
  name: mood,
  population: moodCounts[mood],
  color: moodColors[mood],
  legendFontColor: "#FFF",
  legendFontSize: 14,
}));

const moodBarChartData = {
  labels: Object.keys(moodCounts),
  datasets: [{ data: Object.values(moodCounts) }],
};

export default function StatsScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />
<<<<<<< HEAD

      {/* Top Header */}
      <View className="relative z-20">
        <View className="flex-row justify-between items-center w-full px-4 pt-6 pb-4">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white">{format(selectedMonth, "MMMM yyyy")}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>
=======
      
      <View className="items-center w-full pt-6 px-4">
        <Text className="text-white text-2xl font-bold">Mood Stats</Text>
>>>>>>> parent of 06a7602 (edited nav)
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
        {/* Mood Chart */}
        <View className="w-full bg-[#101011] p-4 mb-4 rounded-lg">
          <Text className="text-white text-lg font-bold mb-4 text-center">Mood Distribution</Text>
          <PieChart
            data={moodChartData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: brandColors.primary,
              backgroundGradientFrom: brandColors.primary,
              backgroundGradientTo: brandColors.primary,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Mood Count */}
        <View className="w-full bg-[#101011] p-4 mb-4 rounded-lg">
          <Text className="text-white text-lg font-bold mb-4 text-center">Mood Count</Text>
          <BarChart
            data={moodBarChartData}
            width={screenWidth}
            height={250}
            yAxisLabel=""
            yAxisSuffix="x"
            chartConfig={{
              backgroundColor: brandColors.primary,
              backgroundGradientFrom: brandColors.primary,
              backgroundGradientTo: brandColors.primary,
              color: (opacity = 1) => brandColors.secondary,
              barPercentage: 0.6,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 8 },
            }}
            showValuesOnTopOfBars
            fromZero
            withInnerLines={false}
            style={{ borderRadius: 8 }}
          />
        </View>

        {/* Weekly Mood Average */}
        <View className="w-full bg-[#101011] p-4 mb-4 rounded-lg">
          <Text className="text-white text-lg font-bold mb-4 text-center">Weekly Mood Average</Text>
          <Text className="text-gray-400 text-center text-lg">Your average mood score this month: 3.8</Text>
        </View>

        {/* Mood Logging Streak */}
        <View className="w-full bg-[#101011] p-4 mb-4 rounded-lg">
          <Text className="text-white text-lg font-bold mb-4 text-center">Mood Tracking Streak</Text>
          <Text className="text-gray-400 text-center text-lg">Current streak: 5 days 🔥</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
