import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from "react-native";
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

const moodEmotions = {
  Rad: ["Excited", "Energetic", "Proud"],
  Good: ["Content", "Hopeful", "Optimistic"],
  Meh: ["Bored", "Indifferent", "Unmotivated"],
  Bad: ["Stressed", "Frustrated", "Lonely"],
  Awful: ["Angry", "Anxious", "Overwhelmed"],
};

const dummyEntries = [
  { mood: "Rad", date: "2025-02-15", time: "10:30 AM", journal: "Had a great day at work!" },
  { mood: "Bad", date: "2025-02-14", time: "8:15 PM", journal: "" },
];

export default function HomeScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [emotionModalVisible, setEmotionModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const openMoodModal = () => setMoodModalVisible(true);
  const closeMoodModal = () => setMoodModalVisible(false);

  const selectMood = (mood) => {
    setSelectedMood(mood);
    setMoodModalVisible(false);
    setEmotionModalVisible(true);
  };

  const selectEmotion = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const saveEntry = () => {
    // Save the entry logic
    setEmotionModalVisible(false);
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

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

      <View pointerEvents="none" style={{ position: "absolute", top: 570, left: 0, right: 0, height: 250, zIndex: 5 }}>
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingHorizontal: 16 }}>
        <Text className="text-txt-orange font-LeagueSpartan-Bold mt-60" style={{ fontSize: 60, textAlign: "center" }}>
          How are you feeling?
        </Text>

        <View className="flex-1 justify-center items-center w-full py-10 mb-40">
          <TouchableOpacity
            onPress={openMoodModal}
            className="bg-[#FF6B35] w-20 h-20 rounded-full shadow-md flex items-center justify-center"
          >
            <Text className="text-white text-6xl font-bold">+</Text>
          </TouchableOpacity>
        </View>

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

      {/* Mood Selection Modal */}
      <Modal visible={moodModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-90 justify-center items-center px-6">
          <Text className="text-white text-2xl font-bold mb-6 text-center">What mood best describes how you're feeling?</Text>
          {Object.keys(moodIcons).map((mood) => (
            <TouchableOpacity
              key={mood}
              className="bg-[#202020] flex-row items-center p-4 rounded-lg mb-4 w-full"
              onPress={() => selectMood(mood)}
            >
              <Image source={moodIcons[mood]} style={{ width: 40, height: 40, marginRight: 12 }} />
              <Text className="text-white text-lg">{mood}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={closeMoodModal} className="mt-6">
            <Text className="text-red-500 text-lg">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Emotion & Journal Modal */}
      <Modal visible={emotionModalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-90 justify-center items-center px-6">
          <Text className="text-white text-2xl font-bold mb-6 text-center">Choose an emotion</Text>
          {selectedMood &&
            moodEmotions[selectedMood].map((emotion) => (
              <TouchableOpacity
                key={emotion}
                className={`bg-[#303030] p-4 rounded-lg mb-3 w-full ${selectedEmotion === emotion ? "border border-white" : ""}`}
                onPress={() => selectEmotion(emotion)}
              >
                <Text className="text-white text-lg">{emotion}</Text>
              </TouchableOpacity>
            ))}

          <TextInput
            className="bg-[#202020] text-white p-4 rounded-lg mt-4 w-full"
            placeholder="Write a journal entry..."
            placeholderTextColor="#888"
            multiline
            value={journalEntry}
            onChangeText={setJournalEntry}
          />

          <TouchableOpacity onPress={saveEntry} className="mt-6 bg-[#FF6B35] p-4 rounded-lg w-full">
            <Text className="text-white text-lg text-center">Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
