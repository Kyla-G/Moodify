import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BarChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import { useTheme } from "@/app/(root)/properties/themecontext";

const screenWidth = Dimensions.get("window").width - 40; // Account for padding

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

// Array of daily affirmations
const affirmations = [
  "Today I choose joy and positivity",
  "I am worthy of all good things",
  "Every day is a fresh start",
  "I am getting stronger each day",
  "My feelings are valid and important",
  "Small steps lead to big changes",
  "I celebrate my progress today",
  "I deserve peace and happiness",
];

export default function StatsScreen() {
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [todayAffirmation, setTodayAffirmation] = useState("");

  useEffect(() => {
    // Get a random affirmation for the day
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setTodayAffirmation(affirmations[randomIndex]);
  }, []);

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  // Define mood colors based on the current theme
  const moodColors = {
    Rad: theme.accent1,
    Good: theme.accent2,
    Meh: theme.accent3,
    Bad: theme.accent4,
    Awful: theme.buttonBg,
  };

  const moodCounts = dummyEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages for the horizontal bar chart
  const totalEntries = dummyEntries.length;

  const moodBarChartData = {
    labels: Object.keys(moodCounts),
    datasets: [{
      data: Object.values(moodCounts),
    }],
  };

  const chartConfig = {
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.6,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 8 },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const isDarkTheme = theme.background === "#000000";
  const chartWidth = screenWidth - 32; // Adjusting for container padding

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar 
        style={isDarkTheme ? "light" : "dark"} 
        hidden={false} 
        translucent 
        backgroundColor="transparent" 
      />

      {/* Top Header */}
      <View style={{ position: "relative", zIndex: 20 }}>
        <View style={{ 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%", 
          paddingHorizontal: 16, 
          paddingTop: 24, 
          paddingBottom: 16 
        }}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: "600", 
            color: theme.text 
          }}>
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Affirmation Banner */}
        <View style={{
          backgroundColor: theme.accent2,
          paddingVertical: 20,
          paddingHorizontal: 16,
          borderRadius: 8,
          marginHorizontal: 16,
          marginBottom: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center"
        }}>
          <Ionicons 
            name="sunny-outline" 
            size={20} 
            color={theme.background === "#000000" ? "#000000" : "#FFFFFF"} 
            style={{ marginRight: 8 }}
          />
          <Text style={{
            color: theme.background === "#000000" ? "#000000" : "#FFFFFF",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 16
          }}>
            {todayAffirmation}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20, paddingHorizontal: 16 }}>
        {/* Mood Distribution - Manual Horizontal Bar Chart */}
        <View style={{ 
          width: "100%", 
          backgroundColor: theme.calendarBg || "#101011", 
          padding: 16, 
          marginBottom: 16, 
          borderRadius: 8
        }}>
          <Text style={{ 
            color: theme.text, 
            fontSize: 18, 
            fontWeight: "bold", 
            marginBottom: 16, 
            textAlign: "center" 
          }}>
            Mood Distribution
          </Text>
          
          {Object.keys(moodCounts).map((mood) => {
            const percentage = (moodCounts[mood] / totalEntries) * 100;
            return (
              <View key={mood} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: theme.text }}>{mood}</Text>
                  <Text style={{ color: theme.text }}>{percentage.toFixed(1)}%</Text>
                </View>
                <View style={{ height: 16, backgroundColor: theme.background || "#444", borderRadius: 8, overflow: "hidden" }}>
                  <View
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: moodColors[mood],
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        {/* Mood Count */}
        <View style={{ 
          width: "100%", 
          backgroundColor: theme.calendarBg || "#101011", 
          padding: 16, 
          marginBottom: 16, 
          borderRadius: 8,
          alignItems: "center"
        }}>
          <Text style={{ 
            color: theme.text, 
            fontSize: 18, 
            fontWeight: "bold", 
            marginBottom: 16, 
            textAlign: "center" 
          }}>
            Mood Count
          </Text>
          <View style={{ width: chartWidth, overflow: "hidden" }}>
            <BarChart
              data={moodBarChartData}
              width={chartWidth}
              height={250}
              yAxisLabel=""
              yAxisSuffix="x"
              chartConfig={chartConfig}
              showValuesOnTopOfBars
              fromZero
              withInnerLines={false}
              style={{ borderRadius: 8 }}
            />
          </View>
        </View>

        {/* Weekly Mood Average */}
        <View style={{ 
          width: "100%", 
          backgroundColor: theme.calendarBg || "#101011", 
          padding: 16, 
          marginBottom: 16, 
          borderRadius: 8 
        }}>
          <Text style={{ 
            color: theme.text, 
            fontSize: 18, 
            fontWeight: "bold", 
            marginBottom: 16, 
            textAlign: "center" 
          }}>
            Weekly Mood Average
          </Text>
          <Text style={{ 
            color: theme.dimmedText, 
            textAlign: "center", 
            fontSize: 18 
          }}>
            Your average mood score this month: 3.8
          </Text>
        </View>

        {/* Mood Logging Streak */}
        <View style={{ 
          width: "100%", 
          backgroundColor: theme.calendarBg || "#101011", 
          padding: 16, 
          marginBottom: 16, 
          borderRadius: 8 
        }}>
          <Text style={{ 
            color: theme.text, 
            fontSize: 18, 
            fontWeight: "bold", 
            marginBottom: 16, 
            textAlign: "center" 
          }}>
            Mood Tracking Streak
          </Text>
          <Text style={{ 
            color: theme.dimmedText, 
            textAlign: "center", 
            fontSize: 18 
          }}>
            Current streak: 5 days 🔥
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
