import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput, useWindowDimensions, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import images from "@/constants/images";

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

const moodColors = {
  rad: "#F2FF00", // yellow
  good: "#31AC54", // green
  meh: "#828282", // gray
  bad: "#78A2FE", // blue
  awful: "#FF0000", // red
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
  // State to track expanded journal entries
  const [expandedEntries, setExpandedEntries] = useState({});

  // Toggle journal entry visibility
  const toggleEntryExpansion = (index) => {
    setExpandedEntries(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get current date and time for the summary modal
  const now = new Date();
  const currentDate = format(now, "MMMM dd, yyyy");
  const currentTime = format(now, "h:mm a");
  const currentDay = format(now, "d");

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
    // Check if an emotion is selected
    if (!selectedEmotion) {
      Alert.alert("Please select an emotion first");
      return;
    }

    // Close emotion modal first
    setEmotionModalVisible(false);

    // Then show summary modal after a short delay
    setTimeout(() => {
      setSummaryModalVisible(true);
    }, 300);
  };

  const finalSaveEntry = () => {
    // Save the entry logic would go here
    setSummaryModalVisible(false);
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  const redirectToChatbot = () => {
    // First close the modal
    setSummaryModalVisible(false);

    // This function would navigate to the chatbot screen
    // In a real app, you would use navigation here
    // navigation.navigate('Chatbot');

    // Mock alert to show it's working
    Alert.alert("Redirecting", "Navigating to chatbot screen");

    // Reset state
    setJournalEntry("");
    setSelectedMood(null);
    setSelectedEmotion(null);
  };

  // Calculate responsive dimensions
  const backgroundHeight = height * 0.84;
  const backgroundWidth = width;
  const backgroundBottomOffset = height * -0.06;
  
  const titleFontSize = width < 350 ? 40 : 55; // Smaller font on smaller screens
  const moodButtonSize = width < 350 ? 60 : 80; // Smaller button on smaller screens
  const contentPadding = width < 350 ? 12 : 20; // Less padding on smaller screens
  const iconSize = width < 350 ? 22 : 28; // Smaller icons on smaller screens
  
  // Responsive padding for the modals
  const modalPadding = width < 350 ? 12 : 24;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-black">
      <StatusBar
        style="light"
        hidden={false}
        translucent
        backgroundColor="transparent"
      />

      <Image
        source={images.homepagebg}
        style={{
          position: "absolute",
          bottom: backgroundBottomOffset - 40, // Slightly adjust the bottom offset
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
            <Ionicons
              name="chevron-forward-outline"
              size={iconSize}
              color="#545454"
            />
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
          height: height * 0.3, // Responsive height for gradient
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

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingHorizontal: contentPadding,
        }}
      >
        <Text
          className="text-txt-orange font-LeagueSpartan-Bold mt-16 tracking-[.-3.5]"
          style={{ 
            fontSize: titleFontSize, 
            textAlign: "center",
            marginTop: height * 0.05, // Responsive top margin
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
            className="bg-[#FF6B35] rounded-full shadow-md flex items-center justify-center">
            <Text className="text-white text-5xl font-bold">+</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full pb-24">
          {dummyEntries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];
            const hasJournal = entry.journal && entry.journal.trim().length > 0;
            const isExpanded = expandedEntries[index];

            return (
              <View
                key={index}
                className="bg-[#101011] p-4 rounded-[20] mb-4 shadow w-full"
                style={{ 
                  paddingHorizontal: contentPadding,
                  marginBottom: height * 0.02, // Responsive margin
                }}
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
                  
                  {/* Current records */}
                  <View className="flex-1">
                    <Text style={{
                            fontFamily: "LaoSansPro-Regular",
                            fontSize: width < 350 ? 12 : 15,
                            fontWeight: "600",
                            color: "#EEEED0"
                          }}
                        >
                      {entry.day}, {entry.date}
                    </Text>
                    <View className="flex-1 mt-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Text
                            style={{
                              fontFamily: "LeagueSpartan-Bold",
                              fontSize: width < 350 ? 24 : 30,
                              fontWeight: "600",
                              color: moodColors[entry.mood],
                            }}
                          >
                            {entry.mood}{" "}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "LaoSansPro-Regular", 
                              fontSize: width < 350 ? 11 : 13,
                              color: "#EEEED0", 
                            }}
                          >
                            {entry.time}
                          </Text>
                        </View>
                        
                        {/* Journal toggle button - only show if there is journal content */}
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
                
                {/* Collapsible journal content */}
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
      style={{ paddingHorizontal: modalPadding }}
    >
      {/* X Button in upper left - positioned relative to SafeAreaView */}
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
    <ScrollView 
      className="flex-1 bg-bg-black py-10"
      contentContainerStyle={{ 
        paddingHorizontal: modalPadding,
        paddingTop: height * 0.05
      }}
    >
      <View className="items-center w-full relative">
        {/* Back Arrow Button - returns to mood modal */}
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
            { name: "energetic", color: "#F2FF00" }, // Yellow
            { name: "excited", color: "#F2FF00" }, // Yellow
            { name: "confident", color: "#F2FF00" }, // Yellow
            { name: "happy", color: "#31AC54" }, // Green
            { name: "calm", color: "#31AC54" }, // Green
            { name: "grateful", color: "#31AC54" }, // Green
            { name: "hopeful", color: "#31AC54" }, // Green
            { name: "bored", color: "#828282" }, // Grey
            { name: "nervous", color: "#828282" }, // Grey
            { name: "confused", color: "#828282" }, // Grey
            { name: "anxious", color: "#828282" }, // Grey
            { name: "sad", color: "#78A2FE" }, // Blue
            { name: "fearful", color: "#78A2FE" }, // Blue
            { name: "stressed", color: "#78A2FE" }, // Blue
            { name: "irritated", color: "#FF0000" }, // Red
            { name: "angry", color: "#FF0000" }, // Red
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
                borderColor: "white",
                marginBottom: 8,
              }}
              onPress={() => selectEmotion(emotion.name)}
            >
              <Text
                style={{
                  color: "black",
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
          className="bg-[#202020] text-white p-5 rounded-2xl w-full min-h-[180px]"
          style={{ fontSize: width < 350 ? 16 : 18 }}
          placeholder="Add Journal Entry"
          placeholderTextColor="#888"
          multiline
          value={journalEntry}
          onChangeText={setJournalEntry}
        />

        {/* Forward Arrow Button - positioned at bottom right */}
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
    className="flex-1 justify-between"
    style={{
      backgroundColor: "#003049",
    }}
  >
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1">
      {/* Top part with mood info */}
      <View 
        className="flex-1 justify-center items-center"
        style={{ padding: modalPadding }}
      >
        <Text 
          className="text-white font-LeagueSpartan text-center mb-2"
          style={{ fontSize: width < 350 ? 28 : 36 }}
        >
          You're feeling
        </Text>

        <Text 
          className="text-white font-LeagueSpartan-Bold text-center mb-8"
          style={{ fontSize: width < 350 ? 20 : 48 }}
        >
          {selectedMood} and {selectedEmotion}
        </Text>

        <View className="flex-row items-center justify-center mb-8">
          <Text 
            className="text-white opacity-80 text-center"
            style={{ fontSize: width < 350 ? 16 : 20 }}
          >
            {currentDate}             {currentTime}
          </Text>
        </View>
        
        <Image
          source={selectedMood ? moodIcons[selectedMood] : null}
          style={{ 
            width: width * 0.25, 
            height: width * 0.25,
          }}
        />
      </View>

      {/* Bottom part with chatbot option - Redesigned */}
      <View style={{ padding: modalPadding }} className="mb-8">
        <Text 
          className="text-white font-bold text-center mb-6"
          style={{ fontSize: width < 350 ? 20 : 24 }}
        >
          Would you like to talk about it more?
        </Text>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1 items-center">
            <TouchableOpacity
              onPress={redirectToChatbot}
              className="bg-white px-8 py-3 rounded-full items-center mb-4"
              style={{
                backgroundColor: selectedMood ? moodColors[selectedMood] : "#333",

              }}
            >
              <Text
                className="font-semibold"
                style={{
                  color: "white",
                  fontSize: width < 350 ? 16 : 20
                }}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={finalSaveEntry}
              className="bg-white px-8 py-3 rounded-full items-center mb-4"
            >
              <Text 
                className="text-black font-semibold"
                style={{ fontSize: width < 350 ? 16 : 20 }}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Moodi Face on right side */}
          <View className="ml-6">
            <Image
            source={images.moodiwave}
              style={{ 
                width: width * .5, 
                height: width * .5,
                resizeMode: 'contain'
              }}
            />
            
          </View>
        </View>
      </View>
    </SafeAreaView>
  </View>
</Modal>
    </SafeAreaView>
  );
}