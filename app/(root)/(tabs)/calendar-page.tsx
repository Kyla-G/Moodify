import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth,endOfMonth, eachDayOfInterval, getDay, subDays, addDays,} from "date-fns";
import { useWindowDimensions } from "react-native";

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
  const { width, height } = useWindowDimensions();
  const [view, setView] = useState("Calendar");
  const [selectedReward, setSelectedReward] = useState(null);

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const firstDay = startOfMonth(selectedMonth);
  const lastDay = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const firstDayOffset = getDay(firstDay);

  const prevMonthDays = Array.from({ length: firstDayOffset }).map((_, index) =>
    subDays(firstDay, firstDayOffset - index)
  );

  const remainingSlots = (7 - ((daysInMonth.length + firstDayOffset) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingSlots }).map((_, index) =>
    addDays(lastDay, index + 1)
  );

  const moodMap = Object.fromEntries(
    dummyEntries.map((entry) => [entry.date, entry.mood])
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar
        style="light"
        hidden={false}
        translucent
        backgroundColor="transparent"
      />

      <StatusBar
        style="light"
        hidden={false}
        translucent
        backgroundColor="transparent"
      />
      <View className="items-center w-full pt-6 px-4">
        <View className="flex-row justify-between items-center w-full mb-4">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-txt-medium font-LeagueSpartan-Bold text-3xl">
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons
              name="chevron-forward-outline"
              size={28}
              color="#545454"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-row bg-[#1A1A1A] rounded-lg p-1 w-[80%] mb-4">
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-lg ${
              view === "Calendar" ? "bg-[#FF6B35]" : ""
            }`}
            onPress={() => setView("Calendar")}
          >
            <Text
              className={`text-white font-semibold ${
                view === "Calendar" ? "text-black" : ""
              }`}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center py-2 rounded-lg ${
              view === "Streak" ? "bg-[#FF6B35]" : ""
            }`}
            onPress={() => setView("Streak")}
          >
            <Text
              className={`text-white font-semibold ${
                view === "Streak" ? "text-black" : ""
              }`}
            >
              Streak
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        {view === "Calendar" ? (
          <View className="w-full">
            <View className="flex-row justify-around mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text
                  key={day}
                  className="text-white text-center flex-1 font-semibold"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="w-full flex-wrap flex-row">
              {[...prevMonthDays, ...daysInMonth, ...nextMonthDays].map(
                (day, index) => {
                  const formattedDate = format(day, "yyyy-MM-dd");
                  const isDimmed = day < firstDay || day > lastDay;
                  const mood = moodMap[formattedDate];
                  const moodIcon = mood ? moodIcons[mood] : null;
                  return (
                    <View
                      key={index}
                      className="w-[14.28%] items-center justify-center mb-2"
                    >
                      <View
                        className={`rounded-lg w-12 h-12 items-center justify-center ${
                          isDimmed ? "bg-[#050505]" : "bg-[#1A1A1A]"
                        }`}
                      >
                        {moodIcon && (
                          <Image
                            source={moodIcon}
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
                            }}
                          />
                        )}
                      </View>
                      <Text
                        className={`text-sm mt-1 ${
                          isDimmed ? "text-gray-700" : "text-white"
                        }`}
                      >
                        {format(day, "d")}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        ) : (
          <View className="mt-6 w-full px-6 items-center">
            <Text className="text-white text-xl font-bold mb-8">
              🔥 XP Progress
            </Text>
            <Text className="text-white text-center">
              Track your streaks and unlock rewards for maintaining consistent
              moods!
            </Text>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {[
                {
                  title: "🎨 Palette 1",
                  icon: "https://cdn-icons-png.flaticon.com/128/2913/2913136.png",
                },
                {
                  title: "😀 Emoji Set",
                  icon: "https://cdn-icons-png.flaticon.com/128/3523/3523063.png",
                },
                {
                  title: "😎 Moodi Emotes",
                  icon: "https://cdn-icons-png.flaticon.com/128/1688/1688535.png",
                },
                {
                  title: "🎭 Moodi Accessories",
                  icon: "https://cdn-icons-png.flaticon.com/128/1104/1104935.png",
                },
              ].map((reward, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedReward(reward.title)}
                >
                  <View style={{ alignItems: "center", marginBottom: 24 }}>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: "#4A4A4A",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={{ uri: reward.icon }}
                        style={{ width: 32, height: 32 }}
                      />
                    </View>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 14,
                        fontWeight: "600",
                        marginTop: 8,
                        marginBottom: 30,
                      }}
                    >
                      {reward.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {selectedReward && (
              <Text className="text-white mt-4 text-lg font-semibold">{`You unlocked: ${selectedReward}`}</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}