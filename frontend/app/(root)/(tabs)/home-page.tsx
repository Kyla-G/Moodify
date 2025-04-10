import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useLocalSearchParams, useRouter } from "expo-router";
import { moodColors } from "@/app/services/type";
// Import specific functions from API to avoid "undefined" errors
import { 
  getAllMoodEntries, 
  subscribeToChanges, 
  getMoodEntryByDate, 
  addMoodEntry 
} from "@/app/services/moodEntriesApi";

import XpStreakManager from "./XpStreakManager";
import MoodSelectionModal from "./mood-selection-modal";
import EmotionJournalModal from "./emotion-journal-modal";
import SummaryModal from "./summary-modal";
import WelcomeModal from "./welcome-modal";

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

export default function HomeScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [emotionModalVisible, setEmotionModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const { width, height } = useWindowDimensions();
  const [expandedEntries, setExpandedEntries] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [entries, setEntries] = useState([]);
  const params = useLocalSearchParams();
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const nickname = params.nickname || "Friend";
  const router = useRouter();
  
  // XP and streak-related state
  const [moodEntrySaved, setMoodEntrySaved] = useState(false);
  const [chatbotRated, setChatbotRated] = useState(false);

  // Load entries from API
  useEffect(() => {
    // Check if API functions are available
    console.log("API functions available:", {
      getAllMoodEntries: typeof getAllMoodEntries,
      subscribeToChanges: typeof subscribeToChanges,
      getMoodEntryByDate: typeof getMoodEntryByDate,
      addMoodEntry: typeof addMoodEntry
    });

    try {
      // Get initial entries
      const initialEntries = getAllMoodEntries();
      console.log("Initial entries:", initialEntries);
      setEntries(initialEntries);
      
      // Subscribe to future changes
      const unsubscribe = subscribeToChanges(() => {
        console.log("Mood entries updated");
        setEntries(getAllMoodEntries());
      });
      
      return unsubscribe; // Cleanup subscription on unmount
    } catch (error) {
      console.error("Error loading mood entries:", error);
    }
  }, []);

  const toggleEntryExpansion = (index) => {
    setExpandedEntries(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const openMoodModal = () => {
    setSelectedDate(new Date()); // Reset to current date/time when opening modal
    setMoodModalVisible(true);
  };
  
  const closeMoodModal = () => setMoodModalVisible(false);

  const selectMood = (mood) => {
    setSelectedMood(mood);
    setMoodModalVisible(false);
    setEmotionModalVisible(true);
  };

  const selectEmotion = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSaveEntry = () => {
    // Check if there's already an entry for this date
    const entryDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const formattedDate = format(entryDate, "yyyy-MM-dd");
    const existingEntry = getMoodEntryByDate(formattedDate);
    
    if (existingEntry) {
      Alert.alert(
        "Mood exists",
        "You already have a mood entry for this date. Would you like to update it?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Update",
            onPress: () => {
              setEmotionModalVisible(false);
              setTimeout(() => {
                setSummaryModalVisible(true);
              }, 300);
            }
          }
        ]
      );
    } else {
      setEmotionModalVisible(false);
      setTimeout(() => {
        setSummaryModalVisible(true);
      }, 300);
    }
  };

  const finalSaveEntry = () => {
    setSummaryModalVisible(false);
    
    // Format date strings
    const formattedDate = format(selectedDate, "MMMM dd, yyyy");
    const dayOfWeek = format(selectedDate, "EEEE");
    const displayTime = format(selectedDate, "h:mm a");
    const calendarDate = format(selectedDate, "yyyy-MM-dd");
    
    // Create new entry
    const newEntry = {
      mood: selectedMood || "",
      emotion: selectedEmotion || "",
      day: dayOfWeek,
      date: formattedDate,
      time: displayTime,
      journal: journalEntry,
      timestamp: selectedDate.getTime(),
      formattedDate: calendarDate // For calendar lookups
    };
    
    // Save to API - this will handle both new and existing entries
    try {
      addMoodEntry(newEntry);
      console.log("Entry saved:", newEntry);
      
      // Trigger XP reward if entry is for today
      if (isSameDay(selectedDate, new Date())) {
        setMoodEntrySaved(prev => !prev); // Toggle to trigger effect in XpStreakManager
      }
    } catch (error) {
      console.error("Error saving entry:", error);
    }
    
    // Reset states
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  const redirectToChatbot = () => {
    // First save the entry
    finalSaveEntry();
    
    // Then redirect
    setSummaryModalVisible(false);
    Alert.alert("Redirecting", "Navigating to chatbot screen");
    // Implement actual navigation here
  };

  // Navigate to settings page
  const navigateToSettings = () => {
    try {
      router.push({
        pathname: '/settings-page',
        params: { nickname: nickname }
      });
    } catch (error) {
      console.error('Error navigating to settings page:', error);
    }
  };
  
  

  // Handle chatbot rating
  const handleChatbotRating = () => {
    setChatbotRated(prev => !prev); // Toggle to trigger effect in XpStreakManager
  };
  
  useEffect(() => {
    // Show welcome popup if coming from nickname page
    if (params.showWelcome === "true") {
      setWelcomeModalVisible(true);
       
      const timer = setTimeout(() => {
        setWelcomeModalVisible(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [params.showWelcome]);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Background Image */}
      <Image
        source={images.homepagebg}
        style={{
          position: "absolute",
          bottom: (height * -0.06) - 40,
          width: width,
          height: height * 0.86,
          resizeMode: "contain",
        }}
      />

      {/* Header Navigation */}
      <View className="relative z-20">
        <View style={{ paddingHorizontal: width < 350 ? 12 : 20 }} className="flex-row justify-between items-center w-full pt-6 pb-4">
          <TouchableOpacity onPress={navigateToSettings}>
            <Ionicons name="settings-outline" size={width < 350 ? 22 : 28} color="#EEEED0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={width < 350 ? 22 : 28} color="#545454" />
          </TouchableOpacity>
          <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl">
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={width < 350 ? 22 : 28} color="#545454" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={width < 350 ? 22 : 28} color="#EEEED0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Gradient Overlay */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.3,
          zIndex: 5,
        }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.5)", "transparent"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      <ScrollView contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: width < 350 ? 12 : 20,
        }}>
        <Text
          className="text-txt-orange font-LeagueSpartan-Bold mt-16 tracking-[.-3.5]"
          style={{ 
            fontSize: width < 350 ? 40 : 55,
            textAlign: "center",
            marginTop: height * 0.05,
          }}>
          How are you feeling??
        </Text>

        {/* Add Mood Button */}
        <View className="flex-1 justify-center items-center w-full py-10 mb-16">
          <TouchableOpacity
            onPress={openMoodModal}
            style={{
              width: width < 350 ? 60 : 80,
              height: width < 350 ? 60 : 80,
            }}
            className="bg-bg-light rounded-full shadow-md flex items-center justify-center">
            <Text className="text-txt-orange text-8xl">+</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Entries List */}
        <View
          className="w-full pb-24"
          style={{ marginTop: height * 0.2 }}
        >
          {entries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];
            const hasJournal = entry.journal && entry.journal.trim().length > 0;
            const isExpanded = expandedEntries[index];

            return (
              <View
                key={index}
                className="bg-[#101011] p-4 rounded-[20] mb-4 shadow w-full"
                style={{ paddingHorizontal: width < 350 ? 12 : 20 }}
              >
                <View className="flex-row items-center">
                  <Image
                    source={moodIcon}
                    style={{
                      width: width < 350 ? 35 : 45,
                      height: width < 350 ? 35 : 45,
                      marginRight: width < 350 ? 10 : 15,
                      resizeMode: "contain",
                    }}
                  />

                  <View className="flex-1">
                    <Text style={{
                      fontFamily: "LaoSansPro-Regular",
                      fontSize: width < 350 ? 12 : 15,
                      fontWeight: "600",
                      color: "#EEEED0"
                    }}>
                      {entry.day}, {entry.date}
                    </Text>
                    <View className="flex-1 mt-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text style={{
                            fontFamily: "LeagueSpartan-Bold",
                            fontSize: width < 350 ? 24 : 30,
                            fontWeight: "600",
                            color: moodColors[entry.mood],
                          }}>
                            {entry.mood}{" "}
                          </Text>
                          <Text style={{
                            fontFamily: "LaoSansPro-Regular", 
                            fontSize: width < 350 ? 11 : 13,
                            color: "#EEEED0", 
                          }}>
                            {entry.time}
                          </Text>
                        </View>

                        <TouchableOpacity 
                          onPress={() => toggleEntryExpansion(index)}
                          className="flex-row items-center"
                        >
                          <Text style={{
                            fontFamily: "LaoSansPro-Regular", 
                            fontSize: width < 350 ? 12 : 14,
                            color: "#545454"}}>
                              {hasJournal ? "Journal" : "Emotion"}
                          </Text>
                          <Ionicons 
                            name={isExpanded ? "chevron-up" : "chevron-down"} 
                            size={width < 350 ? 14 : 18} 
                            color="#545454" 
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {isExpanded && (
                  <View className="mt-4 pt-3 border-t border-gray-900">
                    <Text className="text-txt-light font-LeagueSpartan mb-2"
                      style={{ fontSize: width < 350 ? 16 : 18 }}>
                      Feeling <Text style={{ color: moodColors[entry.mood] }}>{entry.emotion}</Text>
                    </Text>
                    
                    {hasJournal && (
                      <Text 
                        className="text-txt-light font-LeagueSpartan mt-2"
                        style={{ fontSize: width < 350 ? 16 : 18 }}>
                        {entry.journal}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modals */}
      <WelcomeModal
        visible={welcomeModalVisible}
        onClose={() => setWelcomeModalVisible(false)}
        nickname={nickname.toString()}
      />

      <MoodSelectionModal
        visible={moodModalVisible}
        onClose={closeMoodModal}
        onSelectMood={selectMood}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isDatePickerVisible={isDatePickerVisible}
        setDatePickerVisible={setDatePickerVisible}
        isTimePickerVisible={isTimePickerVisible}
        setTimePickerVisible={setTimePickerVisible}
      />

      <EmotionJournalModal
        visible={emotionModalVisible}
        onBack={() => {
          setEmotionModalVisible(false);
          setSelectedEmotion(null);
          setJournalEntry("");
          setMoodModalVisible(true);
        }}
        onContinue={handleSaveEntry}
        selectedEmotion={selectedEmotion}
        setSelectedEmotion={setSelectedEmotion}
        journalEntry={journalEntry}
        setJournalEntry={setJournalEntry}
      />

      <SummaryModal
        visible={summaryModalVisible}
        onClose={() => setSummaryModalVisible(false)}
        selectedMood={selectedMood}
        selectedEmotion={selectedEmotion}
        selectedDate={selectedDate}
        onSaveEntry={finalSaveEntry}
        onChatbot={redirectToChatbot}
        width={width}
        height={height}
        moodColors={moodColors}
      />

      {/* XP and Streak Manager */}
      <XpStreakManager 
        selectedDate={selectedDate}
        onMoodEntrySaved={moodEntrySaved}
        onChatbotRating={chatbotRated}
      />
    </SafeAreaView>
  );
}