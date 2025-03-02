import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";

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
  { mood: "Rad", date: "2025-02-15", time: "10:30 AM", journal: "Had a great day at work!" },
  { mood: "Bad", date: "2025-02-14", time: "8:15 PM", journal: "" },
  { mood: "Rad", date: "2025-02-13", time: "2:45 PM", journal: "Looking forward to the weekend!" },
  { mood: "Bad", date: "2025-02-12", time: "7:00 AM", journal: "Feeling a bit off today." },
  { mood: "Good", date: "2025-02-11", time: "6:30 PM", journal: "Had a peaceful evening walk." },
  { mood: "Awful", date: "2025-02-10", time: "9:45 AM", journal: "Workload is overwhelming today." },
  { mood: "Good", date: "2025-02-09", time: "5:15 PM", journal: "Appreciating the little things in life." },
  { mood: "Meh", date: "2025-02-08", time: "11:30 PM", journal: "" },
];

export default function HomeScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Navbar */}
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
      </View>

      {/* Gradient Overlay (Allows Touch Events to Pass Through) */}
      <View pointerEvents="none" style={{ position: "absolute", top: 570, left: 0, right: 0, height: 250, zIndex: 5 }}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16 }}>
        <Text className="text-txt-orange font-LeagueSpartan-Bold mt-60" style={{ fontSize: 60, textAlign: "center" }}>
          How are you feeling?
        </Text>

        <View className="flex-1 justify-center items-center w-full py-10 mb-40">
          <TouchableOpacity className="bg-[#FF6B35] w-20 h-20 rounded-full shadow-md flex items-center justify-center">
            <Text className="text-white text-6xl font-bold">+</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Entries */}
        <View className="w-full pb-10">
          {dummyEntries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];

            return (
              <View key={index} className="bg-[#101011] flex-row items-center p-4 rounded-[16] mb-4 shadow w-full">
                <Image source={moodIcon} style={{ width: 52, height: 52, marginRight: 12, resizeMode: "contain" }} />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white">{entry.mood}</Text>
                  <Text className="text-gray-400">{entry.date} at {entry.time}</Text>
                  {entry.journal ? <Text className="text-gray-300 mt-2">{entry.journal}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
