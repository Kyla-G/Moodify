import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays, addDays } from "date-fns";

// Mood Icons
import MoodRad from "@/assets/icons/MoodRad.png";
import MoodGood from "@/assets/icons/MoodGood.png";
import MoodMeh from "@/assets/icons/MoodMeh.png";
import MoodBad from "@/assets/icons/MoodBad.png";
import MoodAwful from "@/assets/icons/MoodAwful.png";

const moodIcons = {
  Rad: MoodRad,
  Good: MoodGood,
  Meh: MoodMeh,
  Bad: MoodBad,
  Awful: MoodAwful,
};

// Sample Mood Entries
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

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [view, setView] = useState("Calendar"); // Toggle between "Calendar" and "Streak"

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  // Generate days of the month
  const firstDay = startOfMonth(selectedMonth);
  const lastDay = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const firstDayOffset = getDay(firstDay);

  // Previous month days
  const prevMonthDays = Array.from({ length: firstDayOffset }).map((_, index) =>
    subDays(firstDay, firstDayOffset - index)
  );

  // Next month days
  const remainingSlots = (7 - ((daysInMonth.length + firstDayOffset) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingSlots }).map((_, index) =>
    addDays(lastDay, index + 1)
  );

  // Map moods to their corresponding dates
  const moodMap = Object.fromEntries(dummyEntries.map((entry) => [entry.date, entry.mood]));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      <View className="items-center w-full pt-6 px-4">
        {/* Month Pagination with Settings & Streak Buttons */}
        <View className="flex-row justify-between items-center w-full mb-4">
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

        {/* Toggle View (Calendar / Streak) */}
        <View className="flex-row bg-[#1A1A1A] rounded-lg p-1 w-[80%] mb-4">
          <TouchableOpacity className={`flex-1 items-center py-2 rounded-lg ${view === "Calendar" ? "bg-[#FF6B35]" : ""}`} onPress={() => setView("Calendar")}>
            <Text className={`text-white font-semibold ${view === "Calendar" ? "text-black" : ""}`}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`flex-1 items-center py-2 rounded-lg ${view === "Streak" ? "bg-[#FF6B35]" : ""}`} onPress={() => setView("Streak")}>
            <Text className={`text-white font-semibold ${view === "Streak" ? "text-black" : ""}`}>Streak</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16 }}>
        {view === "Calendar" ? (
          <View className="w-full">
            {/* Days of the Week */}
            <View className="flex-row justify-around mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} className="text-white text-center w-14 font-semibold">{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View className="w-full flex-wrap flex-row justify-center">
              {[...prevMonthDays, ...daysInMonth, ...nextMonthDays].map((day, index) => {
                const formattedDate = format(day, "yyyy-MM-dd");
                const isDimmed = day < firstDay || day > lastDay;
                const mood = moodMap[formattedDate];
                const moodIcon = mood ? moodIcons[mood] : null;
                return (
                  <View key={index} className="items-center w-14 h-18 m-1 justify-center">
                    <View className={`rounded-lg w-14 h-14 items-center justify-center ${isDimmed ? "bg-[#050505]" : "bg-[#1A1A1A]"}`}>
                      {moodIcon && <Image source={moodIcon} style={{ width: 30, height: 30, resizeMode: "contain" }} />}
                    </View>
                    <Text className={`text-sm mt-1 ${isDimmed ? "text-gray-700" : "text-white"}`}>{format(day, "d")}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <Text className="text-white text-lg mt-6">🔥 Streak feature coming soon...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
