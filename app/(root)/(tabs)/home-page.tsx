import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput, useWindowDimensions, Alert, KeyboardAvoidingView, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import images from "@/constants/images";
import XpStreakPopup from '../(tabs)/streak-notif'; // Import the new XP popup component

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

const moodColors = {
  rad: "#FF6B35", // orange
  good: "#31AC54", // green
  meh: "#828282", // gray
  bad: "#507EE3", // blue
  awful: "#C22222", // red
};

const moodEmotions = {
  rad: ["energetic", "excited", "confident"],
  good: ["happy", "calm", "grateful", "hopeful"],
  meh: ["bored", "nervous", "confused", "anxious"],
  bad: ["sad", "fearful", "stressed"],
  awful: ["irritated", "angry"],
};

const dummyEntries = [
  { mood: "rad", day: "Monday", date: "March 06, 2025", time: "10:30 AM", journal: "Had a great day at work!"},
  { mood: "awful", day: "Tuesday", date: "March 05, 2025", time: "8:15 PM", journal: "Thesis sucks"},
  { mood: "good", day: "Wednesday", date: "March 04, 2025", time: "8:15 PM", journal: "lmao" },
  { mood: "meh", day: "Thursday", date: "March 03, 2025", time: "8:15 PM", journal: "" },
  { mood: "bad", day: "Friday", date: "March 02, 2025", time: "8:15 PM", journal: "" },
  { mood: "bad", day: "Saturday", date: "March 01, 2025", time: "8:15 PM", journal: "" },
];

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
  
  // New state for XP popup
  const [xpPopupVisible, setXpPopupVisible] = useState(false);
  const [totalXp, setTotalXp] = useState(500); // Example initial XP value
  const [streak, setStreak] = useState(7); // Example initial streak value

  const toggleEntryExpansion = (index) => {
    setExpandedEntries(prev => ({...prev, [index]: !prev[index]}));
  };

  const now = new Date();
  const currentDate = format(now, "MMMM dd, yyyy");
  const currentTime = format(now, "h:mm a");

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

  const handleSaveEntry = () => {
    if (!selectedEmotion) {
      Alert.alert("Please select an emotion first");
      return;
    }
    setEmotionModalVisible(false);
    setTimeout(() => {
      setSummaryModalVisible(true);
    }, 300);
  };

  const finalSaveEntry = () => {
    setSummaryModalVisible(false);
    
    // Update XP and streak when logging mood
    setTotalXp(prev => prev + 50); // Add 50 XP for logging a mood
    setStreak(prev => prev + 1); // Increment streak by 1
    
    // Show XP popup after clicking "No"
    setTimeout(() => {
      setXpPopupVisible(true);
    }, 300);
    
    // Reset states
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  const redirectToChatbot = () => {
    setSummaryModalVisible(false);
    Alert.alert("Redirecting", "Navigating to chatbot screen");
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  const closeXpPopup = () => {
    setXpPopupVisible(false);
  };

  const backgroundHeight = height * 0.86;
  const backgroundWidth = width;
  const backgroundBottomOffset = height * -0.06;
  
  const titleFontSize = width < 350 ? 40 : 55;
  const moodButtonSize = width < 350 ? 60 : 80;
  const contentPadding = width < 350 ? 12 : 20;
  const iconSize = width < 350 ? 22 : 28;
  const modalPadding = width < 350 ? 12 : 24;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      <Image
        source={images.homepagebg}
        style={{
          position: "absolute",
          bottom: backgroundBottomOffset - 40,
          width: backgroundWidth,
          height: backgroundHeight,
          resizeMode: "contain",
        }}
      />

      <View className="relative z-20">
        <View style={{ paddingHorizontal: contentPadding }} className="flex-row justify-between items-center w-full pt-6 pb-4">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={iconSize} color="#EEEED0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={iconSize} color="#545454" />
          </TouchableOpacity>
          <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl">
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={iconSize} color="#545454" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={iconSize} color="#EEEED0" />
          </TouchableOpacity>
        </View>
      </View>

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
          paddingHorizontal: contentPadding,
        }}>
        <Text
          className="text-txt-orange font-LeagueSpartan-Bold mt-16 tracking-[.-3.5]"
          style={{ 
            fontSize: titleFontSize, 
            textAlign: "center",
            marginTop: height * 0.05,
          }}>
          How are you feeling?
        </Text>

        <View className="flex-1 justify-center items-center w-full py-10 mb-16">
          <TouchableOpacity
            onPress={openMoodModal}
            style={{
              width: moodButtonSize,
              height: moodButtonSize,
            }}
            className="bg-bg-light rounded-full shadow-md flex items-center justify-center">
            <Text className="text-txt-orange text-8xl">+</Text>
          </TouchableOpacity>
        </View>

        {/* Data */}
        <View
          className="w-full pb-24"
          style={{ marginTop: height * 0.2 }}
        >
          {dummyEntries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];
            const hasJournal = entry.journal && entry.journal.trim().length > 0;
            const isExpanded = expandedEntries[index];

            return (
              <View
                key={index}
                className="bg-[#101011] p-4 rounded-[20] mb-4 shadow w-full"
                style={{ paddingHorizontal: contentPadding }}
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

                        {hasJournal && (
                          <TouchableOpacity 
                            onPress={() => toggleEntryExpansion(index)}
                            className="flex-row items-center"
                          >
                            <Text style={{
                              fontFamily: "LaoSansPro-Regular", 
                              fontSize: width < 350 ? 12 : 14,
                              color: "#545454"}}>
                                Journal 
                            </Text>
                            <Ionicons 
                              name={isExpanded ? "chevron-up" : "chevron-down"} 
                              size={width < 350 ? 14 : 18} 
                              color="#545454" 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {hasJournal && isExpanded && (
                  <View className="mt-4 pt-3 border-t border-gray-800">
                    <Text 
                      className="text-txt-light font-LeagueSpartan"
                      style={{ fontSize: width < 350 ? 16 : 18 }}>
                      {entry.journal}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Mood Selection Modal */}
      <Modal visible={moodModalVisible} transparent animationType="slide">
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-bg-black">
          <View 
            className="flex-1 justify-center items-center relative"
            style={{ 
              paddingHorizontal: modalPadding, 
              justifyContent: 'center',
              alignItems: 'center'}}
          >
            <TouchableOpacity 
              onPress={closeMoodModal} 
              style={{ 
                position: 'absolute',
                top: height * 0.05,
                left: width * 0.05,
                zIndex: 10
              }}
            >
              <Ionicons name="close" size={iconSize} color="#EEEED0" />
            </TouchableOpacity>
            
            <Text 
              className="text-txt-light font-LeagueSpartan-Bold mb-9 text-center"
              style={{ fontSize: width < 350 ? 24 : 30 }}
            >
              How's your mood right now?
            </Text>
            
            <View className="flex-row flex-wrap justify-between w-full mb-6">
              {Object.keys(moodIcons).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  className="items-center p-4 rounded-lg"
                  style={{ width: '20%' }}
                  onPress={() => selectMood(mood)}
                >
                  <Image
                    source={moodIcons[mood]}
                    style={{ 
                      width: width < 350 ? 32 : 40, 
                      height: width < 350 ? 32 : 40, 
                      marginBottom: 8 
                    }}
                  />
                  <Text 
                    className="text-txt-light text-center"
                    style={{ fontSize: width < 350 ? 12 : 14 }}
                  >
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Emotion & Journal Modal */}
      <Modal visible={emotionModalVisible} transparent animationType="slide">
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-bg-black">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <ScrollView 
              className="flex-1 bg-bg-black py-10"
              contentContainerStyle={{ 
                paddingHorizontal: modalPadding,
                paddingTop: height * 0.05,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="items-center w-full relative">
                <TouchableOpacity 
                  onPress={() => {
                    setEmotionModalVisible(false);
                    setSelectedEmotion(null);
                    setJournalEntry("");
                    setMoodModalVisible(true);
                  }}
                  style={{ 
                    position: 'absolute',
                    top: height * -0.045,
                    left: width * -0.016,
                    zIndex: 10
                  }}
                  className="p-2"
                >
                  <Ionicons name="arrow-back" size={iconSize} color="#EEEED0" />
                </TouchableOpacity>

                <Text 
                  className="text-txt-light font-LeagueSpartan-Bold mt-6 mb-10 text-center"
                  style={{ fontSize: width < 350 ? 24 : 30 }}
                >
                  Which emotion describes you're feeling now?
                </Text>

                <View className="flex-row flex-wrap justify-between w-full gap-2 mb-8">
                  {[
                    { name: "energetic", color: "#FF6B35" },
                    { name: "excited", color: "#FF6B35" },
                    { name: "confident", color: "#FF6B35" },
                    { name: "happy", color: "#31AC54" },
                    { name: "calm", color: "#31AC54" },
                    { name: "grateful", color: "#31AC54" },
                    { name: "hopeful", color: "#31AC54" },
                    { name: "bored", color: "#828282" },
                    { name: "nervous", color: "#828282" },
                    { name: "confused", color: "#828282" },
                    { name: "anxious", color: "#828282" },
                    { name: "sad", color: "#507EE3" },
                    { name: "fearful", color: "#507EE3" },
                    { name: "stressed", color: "#507EE3" },
                    { name: "irritated", color: "#C22222" },
                    { name: "angry", color: "#C22222" },
                  ].map((emotion) => (
                    <TouchableOpacity
                      key={emotion.name}
                      style={{
                        backgroundColor: emotion.color,
                        padding: width < 350 ? 12 : 16,
                        borderRadius: 16,
                        width: "48%",
                        alignItems: "center",
                        borderWidth: selectedEmotion === emotion.name ? 2 : 0,
                        borderColor: "#EEEED0",
                        marginBottom: 8,
                      }}
                      onPress={() => selectEmotion(emotion.name)}
                    >
                      <Text
                        style={{
                          color: "#EEEED0",
                          fontSize: width < 350 ? 16 : 20,
                          fontFamily: "LeagueSpartan-Bold",
                        }}
                      >
                        {emotion.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  className="bg-[#202020] text-txt-light p-5 rounded-2xl w-full min-h-[180px]"
                  style={{ 
                    fontSize: width < 350 ? 16 : 18, 
                    fontFamily: "LeagueSpartan-Regular"
                  }}
                  placeholder="Add Journal Entry"
                  placeholderTextColor="#888"
                  multiline
                  value={journalEntry}
                  onChangeText={setJournalEntry}
                />

                <View className="w-full items-end mt-8">
                  <TouchableOpacity
                    onPress={handleSaveEntry}
                    disabled={!selectedEmotion}
                    className={`bg-[#EEEED0] p-4 rounded-full ${!selectedEmotion ? "opacity-50" : ""}`}
                  >
                    <Ionicons name="arrow-forward" size={iconSize} color="#272528" />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={summaryModalVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <View
          className="flex-1 items-center justify-center"
          style={{
            backgroundColor: selectedMood ? moodColors[selectedMood] : "#333",
            paddingVertical: modalPadding,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 items-center justify-center">
            <View 
              className="items-center justify-center"
              style={{ padding: modalPadding }}
            >
              <Text 
                className="text-white font-LeagueSpartan text-center mb-2"
                style={{ fontSize: width < 350 ? 28 : 36 }}
              >
                You're feeling
              </Text>

              <Text 
                className="text-txt-light font-LeagueSpartan-Bold text-center mb-10"
                style={{ fontSize: width < 350 ? 20 : 48 }}
              >
                {selectedMood} and {selectedEmotion}
              </Text>

              <View className="flex-row items-center justify-center mb-10">
                <Text 
                  className="text-white font-LeagueSpartan text-center"
                  style={{ fontSize: width < 350 ? 16 : 20 }}
                >
                  {currentDate}  |  {currentTime}
                </Text>
              </View>
            </View>

            {/* Chatbot Section */}
            <View style={{ padding: modalPadding, width: '100%', alignItems: 'flex-start' }}>
              <Text 
                className="text-white font-LeagueSpartan-Bold mb-6"
                style={{ fontSize: width < 350 ? 20 : 24 }}
              >
                Would you like to talk about it more?
              </Text>

              <View className="items-start">
                <TouchableOpacity
                  onPress={redirectToChatbot}
                  className="px-6 py-3 rounded-full items-center mb-2"
                  style={{
                    backgroundColor: "#EEEED0"
                  }}
                >
                  <Text
                    className="font-LeagueSpartan text-txt-darkblue text-2xl"
                    style={{ color: selectedMood ? moodColors[selectedMood] : "#333" }}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={finalSaveEntry}
                  className="px-6 py-3 rounded-full items-center mb-2"
                  style={{
                    backgroundColor: "#EEEED0"
                  }}
                >
                  <Text 
                    className="font-LeagueSpartan text-2xl"
                    style={{ color: selectedMood ? moodColors[selectedMood] : "#333" }}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Image
              source={images.moodichat}
              style={{
                width: width * 1,
                height: width * 1,
                position: 'absolute',
                bottom: -130,
                left: 80,
                resizeMode: 'contain'
              }}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* XP Popup Modal */}
      <XpStreakPopup
        visible={xpPopupVisible}
        onClose={closeXpPopup}
        totalXp={totalXp}
        streak={streak}
      />
    </SafeAreaView>
  );
}