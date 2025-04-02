import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, isSameDay } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useLocalSearchParams } from "expo-router";
import XpStreakPopup from '../(tabs)/streak-notif';
import { moodEntry, moodColors } from "@/app/services/type";
import MoodSelectionModal from "./mood-selection-modal";
import EmotionJournalModal from "./emotion-journal-modal";
import SummaryModal from "./summary-modal";
import WelcomeModal from "./welcome-modal";

const moodIcons: { [key: string]: any } = {
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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const { width, height } = useWindowDimensions();
  const [expandedEntries, setExpandedEntries] = useState<Record<number, boolean>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [entries, setEntries] = useState<moodEntry[]>([
  ]);
  const [xpHistory, setXpHistory] = useState<{ 
    lastMoodEntryDate: string | null; 
    lastChatbotRatingDate: string | null; 
  }>({
    lastMoodEntryDate: null,
    lastChatbotRatingDate: null
  });
  const [xpAmount, setXpAmount] = useState(0);
  const [xpSource, setXpSource] = useState<"mood_entry" | "chatbot_rating" | null>(null);
  const params = useLocalSearchParams();
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const nickname = params.nickname || "Friend";
  
  // XP popup state
  const [xpPopupVisible, setXpPopupVisible] = useState(false);
  const [totalXp, setTotalXp] = useState(0); 
  const [streak, setStreak] = useState(0);

  const toggleEntryExpansion = (index: number) => {
    setExpandedEntries(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  const openMoodModal = () => {
    setSelectedDate(new Date()); // Reset to current date/time when opening modal
    setMoodModalVisible(true);
  };
  
  const closeMoodModal = () => setMoodModalVisible(false);

  const selectMood = (mood: string) => {
    setSelectedMood(mood);
    setMoodModalVisible(false);
    setEmotionModalVisible(true);
  };

  const selectEmotion = (emotion: string) => {
    setSelectedEmotion(emotion);
  };

  const handleSaveEntry = () => {
    // Check if there's already an entry for this date
    const entryDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    
    const existingEntryIndex = entries.findIndex(entry => 
      entry.timestamp != null && isSameDay(new Date(entry.timestamp ?? 0), entryDate)
    );
    
    if (existingEntryIndex !== -1) {
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
    
    // Create new entry
    const newEntry: moodEntry = {
      mood: selectedMood ?? "",
      emotion: selectedEmotion ?? "",
      day: dayOfWeek,
      date: formattedDate,
      time: displayTime,
      journal: journalEntry,
      timestamp: selectedDate.getTime() // Store timestamp for sorting
    };
    
    // Check if we're updating an existing entry
    const existingEntryIndex = entries.findIndex(entry => 
      entry.date === formattedDate
    );
    
    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = newEntry;
      setEntries(updatedEntries);
    } else {
      // Add new entry
      setEntries(prevEntries =>
        [...prevEntries, newEntry].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
      );
    }
    
    // Check if entry is for today
    const today = new Date();
    const isPastDay = !isSameDay(selectedDate, today);
  
    // Check if already earned XP for mood entry today
    const todayDateString = format(today, "yyyy-MM-dd");
    const alreadyEarnedToday = xpHistory.lastMoodEntryDate === todayDateString;

    // Only give XP for current day entries and if not already earned today
    if (!isPastDay && !alreadyEarnedToday) {
      // Update XP and streak
      setTotalXp(prev => prev + 5);
      setStreak(prev => prev + 1);

      // Set XP popup info
      setXpAmount(5);
      setXpSource('mood_entry');
      
      // Record that XP was earned today
      setXpHistory(prev => ({
        ...prev,
        lastMoodEntryDate: todayDateString
      }));
      
      // Show XP popup
      setTimeout(() => {
        setXpPopupVisible(true);
      }, 300);
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

  // Add a new function for chatbot rating
  const handleChatbotRating = () => {
    // Check if already earned XP for chatbot rating today
    const today = new Date();
    const todayDateString = format(today, "yyyy-MM-dd");
    const alreadyEarnedToday = xpHistory.lastChatbotRatingDate === todayDateString;
    
    if (!alreadyEarnedToday) {
      // Update XP (no streak update for chatbot rating)
      setTotalXp(prev => prev + 20);
      
      // Set XP popup info
      setXpAmount(20);
      setXpSource('chatbot_rating');
      
      // Record that XP was earned today
      setXpHistory(prev => ({
        ...prev,
        lastChatbotRatingDate: todayDateString
      }));
      
      // Show XP popup
      setXpPopupVisible(true);
    }
  };

  const closeXpPopup = () => {
    setXpPopupVisible(false);
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
          <TouchableOpacity>
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
          How are you feeling?
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
                            color: moodColors[entry.mood as keyof typeof moodColors],
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
                      Feeling <Text style={{ color: moodColors[entry.mood as keyof typeof moodColors] }}>{entry.emotion}</Text>
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

      {/* XP Streak Popup */}
      <XpStreakPopup 
        visible={xpPopupVisible}
        onClose={closeXpPopup}
        totalXp={totalXp}
        streak={streak}
        xpAmount={xpAmount}
        xpSource={xpSource}
        isPastDay={selectedDate && !isSameDay(selectedDate, new Date())}
      />
    </SafeAreaView>
  );
}