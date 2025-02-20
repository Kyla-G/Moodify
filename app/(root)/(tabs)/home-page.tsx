import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import images from "@/constants/images";
import { useWindowDimensions } from "react-native";

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

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 bg-black">
      
      <Image 
        source={images.homepagebg} 
        style={{
          position: "absolute",
          bottom: height * -0.06,
          width: width * 1, 
          height: height * 0.69,
          resizeMode: "contain",
        }}
      />

      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />
      <View className="items-center w-full pt-6 px-4">
        {/* Month Pagination with Settings & Streak Buttons */}
        <View className="flex-row justify-between items-center w-full mb-4">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color="#EEEED0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color="#545454" />
          </TouchableOpacity>
          <Text className="text-txt-medium font-LeagueSpartan-Bold text-3xl">{format(selectedMonth, "MMMM yyyy")}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={28} color="#545454" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color="#EEEED0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16 }}>
        <Text className="text-txt-orange font-LeagueSpartan-Bold mt-20" style={{ fontSize: 55, textAlign: "center" }}>
          How are you feeling?
        </Text>

        <View className="flex-1 justify-center items-center w-full py-10 mb-40">
          <TouchableOpacity className="bg-bg-light w-20 h-20 rounded-full shadow-md flex items-center justify-center mb-20">
            <Text className="text-txt-orange text-7xl font-bold">+</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full">
          {dummyEntries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];

            return (
              <View key={index} className="bg-[#101011] flex-row items-center p-4 rounded-[16] mt-5 shadow w-full">
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