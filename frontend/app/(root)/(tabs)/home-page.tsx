import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, isSameDay, startOfWeek, endOfWeek, addWeeks, subWeeks, isWithinInterval, parseISO, subMonths, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useLocalSearchParams } from "expo-router";
import XpStreakManager from '../(tabs)/xp-streak-manager';
import { useTheme } from "@/app/(root)/properties/themecontext"; // Import the theme context
import { moodColors } from "@/app/services/type";

// Import specific functions from API to avoid "undefined" errors
import { 
  getAllMoodEntries, 
  subscribeToChanges, 
  getMoodEntryByDate, 
  addMoodEntry 
} from "@/app/services/moodEntriesApi";

import MoodSelectionModal from "./mood-selection-modal";
import EmotionJournalModal from "./emotion-journal-modal";
import SummaryModal from "./summary-modal";
import WelcomeModal from "./welcome-modal";
import SettingsModal from "./settings-modal";

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

const moodToThemeMap = {
  "rad": "buttonBg",
  "good": "accent1",
  "meh": "accent2",
  "bad": "accent3",
  "awful": "accent4"
};

export default function HomeScreen() {
  // Use the theme context
  const { theme } = useTheme();
  
  // Toggle between weekly and monthly views
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "monthly"
  
  const [selectedDate, setSelectedDate] = useState(new Date()); // Central date for both week and month views
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [emotionModalVisible, setEmotionModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const { width, height } = useWindowDimensions();
  const [expandedEntries, setExpandedEntries] = useState({});
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  
  const params = useLocalSearchParams();
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(false);
  const nickname = params.nickname || "Friend";

  // XP and streak-related state
  const [moodEntrySaved, setMoodEntrySaved] = useState(false);
  const [chatbotRated, setChatbotRated] = useState(false);

  // Settings modal state
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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

  // Filter entries based on selected view mode (weekly or monthly)
  useEffect(() => {
    if (entries.length > 0) {
      let filteredList = [];
      
      if (viewMode === "weekly") {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 }); // Saturday
        
        filteredList = entries.filter(entry => {
          // Parse the date from the entry
          const entryDate = entry.timestamp ? new Date(entry.timestamp) : parseISO(entry.formattedDate);
          // Check if it falls within the selected week
          return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
        });
      } else {
        // Monthly view
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        
        filteredList = entries.filter(entry => {
          // Parse the date from the entry
          const entryDate = entry.timestamp ? new Date(entry.timestamp) : parseISO(entry.formattedDate);
          // Check if it falls within the selected month
          return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
        });
      }
      
      setFilteredEntries(filteredList);
      // Reset expanded state when changing time periods
      setExpandedEntries({});
    }
  }, [selectedDate, entries, viewMode]);

  const toggleEntryExpansion = (index) => {
    setExpandedEntries(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === "weekly") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };
  
  const goToNext = () => {
    if (viewMode === "weekly") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  // Format for displaying the date range
  const getDateRangeText = () => {
    if (viewMode === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  // Toggle between weekly and monthly views
  const toggleViewMode = () => {
    setViewMode(viewMode === "weekly" ? "monthly" : "weekly");
  };

  const openMoodModal = () => {
    setSelectedDate(new Date()); // Reset to current date/time when opening modal
    setMoodModalVisible(true);
  };
  
  const closeMoodModal = () => setMoodModalVisible(false);

  // Open settings modal
  const openSettingsModal = () => {
    setSettingsModalVisible(true);
  };

  // Close settings modal
  const closeSettingsModal = () => {
    setSettingsModalVisible(false);
  };

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

  // Get mood color from theme
  const getMoodThemeColor = (mood) => {
    if (!mood) return theme.calendarBg;
    
    // Convert "rad" to "Rad" if needed for mapping
    const normalizedMood = mood.toLowerCase();
    const themeProperty = moodToThemeMap[normalizedMood];
    
    if (themeProperty && theme[themeProperty]) {
      return theme[themeProperty];
    }
    
    // Fallback to original moodColors if not found in theme
    return moodColors[normalizedMood];
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
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

      {/* Header Navigation with Weekly/Monthly Toggle */}
      <View style={{ zIndex: 20 }}>
        <View style={{ 
          paddingHorizontal: width < 350 ? 12 : 20, 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%", 
          paddingTop: 24, 
          paddingBottom: 16 
        }}>
          {/* Updated: Added onPress to open settings modal */}
          <TouchableOpacity onPress={openSettingsModal}>
            <Ionicons name="settings-outline" size={width < 350 ? 22 : 28} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPrevious}>
            <Ionicons name="chevron-back-outline" size={width < 350 ? 22 : 28} color={theme.dimmedText} />
          </TouchableOpacity>
          <Text style={{ 
            color: theme.text, 
            fontFamily: "LeagueSpartan-Bold", 
            fontSize: width < 350 ? 18 : 22,
            flex: 1,
            textAlign: "center"
          }}>
            {getDateRangeText()}
          </Text>
          <TouchableOpacity onPress={goToNext}>
            <Ionicons name="chevron-forward-outline" size={width < 350 ? 22 : 28} color={theme.dimmedText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleViewMode} style={{ paddingHorizontal: 5 }}>
            <Ionicons 
              name={viewMode === "weekly" ? "calendar-outline" : "calendar-number-outline"} 
              size={width < 350 ? 22 : 28} 
              color={theme.text} 
            />
          </TouchableOpacity>
        </View>
        
        {/* View Mode Indicator */}
        <View style={{ 
          alignItems: "center", 
          paddingBottom: 10 
        }}>
          <View style={{ 
            flexDirection: "row", 
            backgroundColor: theme.calendarBg, 
            borderRadius: 16, 
            padding: 4, 
          }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor: viewMode === "weekly" ? theme.buttonBg : "transparent",
              }}
              onPress={() => setViewMode("weekly")}
            >
              <Text style={{ 
                color: viewMode === "weekly" ? 
                  (theme.background === "#000000" ? "#000000" : "#FFFFFF") : 
                  theme.text,
                fontWeight: "600",
                fontSize: 14
              }}>
                Weekly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor: viewMode === "monthly" ? theme.buttonBg : "transparent",
              }}
              onPress={() => setViewMode("monthly")}
            >
              <Text style={{ 
                color: viewMode === "monthly" ? 
                  (theme.background === "#000000" ? "#000000" : "#FFFFFF") : 
                  theme.text,
                fontWeight: "600",
                fontSize: 14
              }}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
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
          colors={[
            `${theme.background}E6`, // Add opacity
            `${theme.background}80`, // More transparent
            "transparent"
          ]}
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
          style={{ 
            color: theme.buttonBg, 
            fontFamily: "LeagueSpartan-Bold", 
            marginTop: height * 0.05,
            fontSize: width < 350 ? 40 : 55,
            textAlign: "center",
            letterSpacing: -3.5,
          }}>
          How are you feeling?
        </Text>

        {/* Add Mood Button */}
        <View style={{ 
          flex: 1, 
          justifyContent: "center", 
          alignItems: "center", 
          width: "100%", 
          paddingVertical: 40,
          marginBottom: 64
        }}>
          <TouchableOpacity
            onPress={openMoodModal}
            style={{
              width: width < 350 ? 60 : 80,
              height: width < 350 ? 60 : 80,
              backgroundColor: theme.calendarBg,
              borderRadius: 40,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}>
            <Text style={{ color: theme.buttonBg, fontSize: 48 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Entries List */}
        <View
          style={{ 
            width: "100%", 
            paddingBottom: 96,
            marginTop: height * 0.2 
          }}
        >
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry, index) => {
              const moodIcon = moodIcons[entry.mood];
              const hasJournal = entry.journal && entry.journal.trim().length > 0;
              const isExpanded = expandedEntries[index];
              // Use theme colors for mood
              const moodColor = getMoodThemeColor(entry.mood);

              return (
                <View
                  key={index}
                  style={{ 
                    backgroundColor: theme.calendarBg, 
                    padding: 16, 
                    borderRadius: 20, 
                    marginBottom: 16, 
                    width: "100%",
                    paddingHorizontal: width < 350 ? 12 : 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 3
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={moodIcon}
                      style={{
                        width: width < 350 ? 35 : 45,
                        height: width < 350 ? 35 : 45,
                        marginRight: width < 350 ? 10 : 15,
                        resizeMode: "contain",
                        tintColor: moodColor
                      }}
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontFamily: "LaoSansPro-Regular",
                        fontSize: width < 350 ? 12 : 15,
                        fontWeight: "600",
                        color: theme.text
                      }}>
                        {entry.day}, {entry.date}
                      </Text>
                      <View style={{ flex: 1, marginTop: 12 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{
                              fontFamily: "LeagueSpartan-Bold",
                              fontSize: width < 350 ? 24 : 30,
                              fontWeight: "600",
                              color: moodColor,
                            }}>
                              {entry.mood}{" "}
                            </Text>
                            <Text style={{
                              fontFamily: "LaoSansPro-Regular", 
                              fontSize: width < 350 ? 11 : 13,
                              color: theme.text, 
                            }}>
                              {entry.time}
                            </Text>
                          </View>

                          <TouchableOpacity 
                            onPress={() => toggleEntryExpansion(index)}
                            style={{ flexDirection: "row", alignItems: "center" }}
                          >
                            <Text style={{
                              fontFamily: "LaoSansPro-Regular", 
                              fontSize: width < 350 ? 12 : 14,
                              color: theme.dimmedText
                            }}>
                              {hasJournal ? "Journal" : "Emotion"}
                            </Text>
                            <Ionicons 
                              name={isExpanded ? "chevron-up" : "chevron-down"} 
                              size={width < 350 ? 14 : 18} 
                              color={theme.dimmedText} 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  {isExpanded && (
                    <View style={{ 
                      marginTop: 16, 
                      paddingTop: 12, 
                      borderTopWidth: 1, 
                      borderTopColor: `${theme.dimmedText}33` 
                    }}>
                      <Text style={{ 
                        color: theme.text, 
                        fontFamily: "LeagueSpartan", 
                        marginBottom: 8,
                        fontSize: width < 350 ? 16 : 18 
                      }}>
                        Feeling <Text style={{ color: moodColor }}>{entry.emotion}</Text>
                      </Text>
                      
                      {hasJournal && (
                        <Text style={{ 
                          color: theme.text, 
                          fontFamily: "LeagueSpartan", 
                          marginTop: 8,
                          fontSize: width < 350 ? 16 : 18 
                        }}>
                          {entry.journal}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={{ 
              backgroundColor: theme.calendarBg, 
              padding: 20, 
              borderRadius: 20, 
              marginTop: 10,
              alignItems: 'center',
              width: "100%",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3
            }}>
              <Ionicons 
                name="calendar-outline" 
                size={width < 350 ? 32 : 42} 
                color={theme.dimmedText} 
                style={{ marginBottom: 10 }}
              />
              <Text style={{ 
                color: theme.text, 
                fontFamily: "LeagueSpartan-Bold", 
                fontSize: width < 350 ? 16 : 18,
                textAlign: "center"
              }}>
                No entries for this {viewMode === "weekly" ? "week" : "month"}
              </Text>
              <Text style={{ 
                color: theme.dimmedText, 
                fontFamily: "LaoSansPro-Regular", 
                fontSize: width < 350 ? 14 : 16,
                textAlign: "center",
                marginTop: 8
              }}>
                Tap the + button to add your first mood entry
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals - Pass theme to modals */}
      <WelcomeModal
        visible={welcomeModalVisible}
        onClose={() => setWelcomeModalVisible(false)}
        nickname={nickname.toString()}
        theme={theme}
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
        theme={theme}
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
        theme={theme}
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
        theme={theme}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={closeSettingsModal}
        nickname={nickname.toString()}
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