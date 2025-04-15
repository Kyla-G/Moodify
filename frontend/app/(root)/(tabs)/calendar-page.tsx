import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays, addDays } from "date-fns";
import { useWindowDimensions } from "react-native";
import { useTheme } from "@/app/(root)/properties/themecontext"; // Import the theme hook
// Import specific functions from API to avoid "undefined" errors
import { getMoodEntriesForCalendar, subscribeToChanges } from "@/app/services/moodEntriesApi";
import { moodColors } from "@/app/services/type";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage import

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

// Array of daily affirmations
const affirmations = [
  "Today I choose joy and positivity",
  "I am worthy of all good things",
  "Every day is a fresh start",
  "I am getting stronger each day",
  "My feelings are valid and important",
  "Small steps lead to big changes",
  "I celebrate my progress today",
  "I deserve peace and happiness",
];

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { width, height } = useWindowDimensions();
  const [view, setView] = useState("Calendar");
  const [selectedReward, setSelectedReward] = useState(null);
  const [todayAffirmation, setTodayAffirmation] = useState("");
  const [calendarEntries, setCalendarEntries] = useState([]);
  
  // Use the theme context with multiple themes
  const { theme, setThemeName, availableThemes } = useTheme();

  // The available theme palettes - seasonal themes
  const palettes = [
    {
      title: "🌱 Spring Theme",
      themeName: "spring",
      icon: "https://cdn-icons-png.flaticon.com/128/1688/1688535.png",
      description: "Fresh green & yellow tones",
      color: "#5fa55a"
    },
    {
      title: "❄️ Winter Theme",
      themeName: "winter",
      icon: "https://cdn-icons-png.flaticon.com/128/3523/3523063.png",
      description: "Cool blue & ice tones",
      color: "#4deeea"
    },
    {
      title: "☀️ Summer Theme",
      themeName: "summer",
      icon: "https://cdn-icons-png.flaticon.com/128/1104/1104935.png",
      description: "Vibrant pink & purple",
      color: "#c266a7"
    },
    {
      title: "🍂 Autumn Theme",
      themeName: "autumn",
      icon: "https://cdn-icons-png.flaticon.com/128/2913/2913136.png",
      description: "Warm orange & red tones",
      color: "#FF6B35"
    },
  ];

  // Load saved theme from AsyncStorage on component mount
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeName(savedTheme);
          // Set the selected reward based on the saved theme
          const matchingPalette = palettes.find(p => p.themeName.toLowerCase() === savedTheme.toLowerCase());
          if (matchingPalette) {
            setSelectedReward(matchingPalette.title);
          }
        }
      } catch (error) {
        console.error("Error loading saved theme:", error);
      }
    };
    
    loadSavedTheme();
  }, []);

  useEffect(() => {
    // Get a random affirmation for the day
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setTodayAffirmation(affirmations[randomIndex]);
  }, []);
  
  // Load mood entries from API
  useEffect(() => {
    // Add console logs for debugging
    console.log("API functions available:", {
      getMoodEntriesForCalendar: typeof getMoodEntriesForCalendar,
      subscribeToChanges: typeof subscribeToChanges
    });

    try {
      // Get initial calendar entries
      const entries = getMoodEntriesForCalendar();
      console.log("Calendar entries:", entries);
      setCalendarEntries(entries);
      
      // Subscribe to future changes
      const unsubscribe = subscribeToChanges(() => {
        console.log("Mood entries updated, refreshing calendar");
        setCalendarEntries(getMoodEntriesForCalendar());
      });
      
      return unsubscribe; // Cleanup subscription on unmount
    } catch (error) {
      console.error("Error loading calendar entries:", error);
    }
  }, []);

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

  // Create a lookup map for mood entries by date
  const moodMap = Object.fromEntries(
    calendarEntries.map((entry) => [entry.date, entry.mood])
  );

  // Handle reward selection and theme change
  const handleRewardSelect = async (palette) => {
    setSelectedReward(palette.title);
    setThemeName(palette.themeName);
    
    // Save the selected theme to AsyncStorage
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, palette.themeName);
      console.log(`Theme ${palette.themeName} saved to storage`);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar
        style={theme.background === "#000000" ? "light" : "dark"}
        hidden={false}
        translucent
        backgroundColor="transparent"
      />

      <View style={{ alignItems: "center", width: "100%", paddingTop: 24, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 16 }}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={{ color: theme.text, fontWeight: "bold", fontSize: 24 }}>
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons
              name="chevron-forward-outline"
              size={28}
              color={theme.dimmedText}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={{ 
          flexDirection: "row", 
          backgroundColor: theme.calendarBg, 
          borderRadius: 8, 
          padding: 4, 
          width: "80%", 
          marginBottom: 16 
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: view === "Calendar" ? theme.buttonBg : "transparent"
            }}
            onPress={() => setView("Calendar")}
          >
            <Text
              style={{
                color: view === "Calendar" ? (theme.background === "#000000" ? "#000000" : "#FFFFFF") : theme.text,
                fontWeight: "600"
              }}
            >
              Calendar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: view === "Streak" ? theme.buttonBg : "transparent"
            }}
            onPress={() => setView("Streak")}
          >
            <Text
              style={{
                color: view === "Streak" ? (theme.background === "#000000" ? "#000000" : "#FFFFFF") : theme.text,
                fontWeight: "600"
              }}
            >
              Streak
            </Text>
          </TouchableOpacity>
        </View>

        {/* Affirmation Banner */}
        <View style={{
          backgroundColor: theme.accent2,
          paddingVertical: 20,
          paddingHorizontal: 16,
          borderRadius: 8,
          width: "100%",
          marginBottom: 16,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center"
        }}>
          <Ionicons 
            name="sunny-outline" 
            size={20} 
            color={theme.background === "#000000" ? "#000000" : "#FFFFFF"} 
            style={{ marginRight: 8 }}
          />
          <Text style={{
            color: theme.background === "#000000" ? "#000000" : "#FFFFFF",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 16
          }}>
            {todayAffirmation}
          </Text>
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
          <View style={{ width: "100%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text
                  key={day}
                  style={{ color: theme.text, textAlign: "center", flex: 1, fontWeight: "600" }}
                >
                  {day}
                </Text>
              ))}
            </View>

            <View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
              {[...prevMonthDays, ...daysInMonth, ...nextMonthDays].map(
                (day, index) => {
                  const formattedDate = format(day, "yyyy-MM-dd");
                  const isDimmed = day < firstDay || day > lastDay;
                  const mood = moodMap[formattedDate];
                  const moodIcon = mood ? moodIcons[mood] : null;
                  
                  // Map mood types to theme color properties
                  const moodToThemeMap = {
                    "Rad": "buttonBg",
                    "Good": "accent1",
                    "Meh": "accent2",
                    "Bad": "accent3",
                    "Awful": "accent4"
                  };
                  
                  // Use the appropriate theme color for the mood
                  const moodColor = mood ? theme[moodToThemeMap[mood]] || moodColors[mood] : null;
                  
                  return (
                    <View
                      key={index}
                      style={{ width: "14.28%", alignItems: "center", justifyContent: "center", marginBottom: 8 }}
                    >
                      <View
                        style={{
                          borderRadius: 8,
                          width: 48,
                          height: 48,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: mood ? moodColor : 
                            (isDimmed ? 
                              (theme.background === "#000000" ? "#050505" : "#E5E5E5") : 
                              theme.calendarBg)
                        }}
                      >
                        {moodIcon && (
                          <Image
                            source={moodIcon}
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
                              tintColor: mood === "Rad" ? theme.calendarBg : theme.calendarBg
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          marginTop: 4,
                          color: isDimmed ? theme.dimmedText : theme.text
                        }}
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
          <View style={{ marginTop: 24, width: "100%", paddingHorizontal: 16, alignItems: "center" }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "bold", marginBottom: 32 }}>
              🔥 XP Progress
            </Text>
            <Text style={{ color: theme.text, textAlign: "center", marginBottom: 24 }}>
              Track your streaks and unlock seasonal themes for maintaining consistent moods!
            </Text>

            {/* Theme title with current theme name */}
            <Text style={{ color: theme.buttonBg, fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>
              Current Season: {theme.name}
            </Text>
            
            {/* Themes section header */}
            <View style={{ 
              backgroundColor: theme.calendarBg, 
              paddingVertical: 12, 
              borderTopLeftRadius: 8, 
              borderTopRightRadius: 8,
              width: "100%",
              alignItems: "center"
            }}>
              <Text style={{ color: theme.text, fontWeight: "bold" }}>
                Seasonal Themes
              </Text>
            </View>
            
            {/* Horizontal theme tabs */}
            <View style={{ 
              flexDirection: "row", 
              justifyContent: "space-around", 
              width: "100%",
              backgroundColor: theme.calendarBg,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              paddingVertical: 16,
              paddingHorizontal: 8,
              marginBottom: 24
            }}>
              {palettes.slice(0, 3).map((palette, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRewardSelect(palette)}
                  style={{ 
                    alignItems: "center",
                    flex: 1
                  }}
                >
                  <View
                    style={{                                                                                
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: theme.calendarBg,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: selectedReward === palette.title ? 2 : 0,
                      borderColor: selectedReward === palette.title ? palette.color : 'transparent'
                    }}
                  >
                    <View style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: palette.color
                    }} />
                  </View>
                  <Text
                    style={{
                      color: theme.text,
                      fontSize: 12,
                      fontWeight: "600",
                      marginTop: 8,
                      textAlign: "center"
                    }}
                  >
                    {palette.title.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Autumn theme option below the horizontal tabs */}
            <TouchableOpacity
              onPress={() => handleRewardSelect(palettes[3])}
              style={{ marginBottom: 16 }}
            >
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                backgroundColor: theme.calendarBg,
                padding: 12,
                borderRadius: 8,
                width: "100%"
              }}>
                <View
                  style={{                                                                                
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.calendarBg,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: selectedReward === palettes[3].title ? 2 : 0,
                    borderColor: selectedReward === palettes[3].title ? palettes[3].color : 'transparent',
                    marginRight: 16
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: palettes[3].color
                  }} />
                </View>
                <View>
                  <Text style={{ color: theme.text, fontWeight: "600" }}>
                    {palettes[3].title}
                  </Text>
                  <Text style={{ color: theme.dimmedText, fontSize: 12 }}>
                    {palettes[3].description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {selectedReward && (
              <Text style={{ color: theme.buttonBg, marginTop: 16, fontSize: 18, fontWeight: "600" }}>
                {`Theme Unlocked: ${selectedReward}`}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}