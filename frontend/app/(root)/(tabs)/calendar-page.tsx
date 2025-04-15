import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays, addDays } from "date-fns";
import { useWindowDimensions } from "react-native";
import { useTheme } from "@/app/(root)/properties/themecontext"; // Import the theme hook
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage import
import CalendarMoodModal from "./calendar-mood-modal"; // Import the modal component
import axios from "@/axiosConfig"; // Import axios for API calls

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
  rad: MoodRad,
  good: MoodGood,
  meh: MoodMeh,
  bad: MoodBad,
  awful: MoodAwful,
};

// Map mood types to theme color properties
const moodToThemeMap = {
  "rad": "buttonBg",
  "good": "accent1",
  "meh": "accent2",
  "bad": "accent3",
  "awful": "accent4",
  "Rad": "buttonBg",
  "Good": "accent1",
  "Meh": "accent2",
  "Bad": "accent3",
  "Awful": "accent4"
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

// Theme storage key for AsyncStorage
const THEME_STORAGE_KEY = "app_selected_theme";

// Manila time zone offset in milliseconds (UTC+8)
const MANILA_TIMEZONE_OFFSET = 8 * 60 * 60 * 1000;
export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { width, height } = useWindowDimensions();
  const [view, setView] = useState("Calendar");
  const [selectedReward, setSelectedReward] = useState(null);
  const [todayAffirmation, setTodayAffirmation] = useState("");
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [moodMap, setMoodMap] = useState({});
  const [userXP, setUserXP] = useState(90); // Example XP progress 0-100
  const [loading, setLoading] = useState(true);
  
  // Update state for mood modal - change to selectedDate instead of entry
  const [selectedDate, setSelectedDate] = useState(null);
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  
  // Use the theme context with multiple themes
  const { theme, setThemeName, availableThemes } = useTheme();

  // The available theme palettes - Autumn now first (default) theme
  const palettes = [
    {
      title: "🍂 Autumn Theme",
      themeName: "autumn",
      icon: "flame-outline",
      description: "Warm orange & red tones",
      color: "#FF6B35",
      requiredXP: 0, // Starting theme (was 60)
      unlocked: true
    },
    {
      title: "🌱 Spring Theme",
      themeName: "spring",
      icon: "leaf-outline",
      description: "Fresh green & yellow tones",
      color: "#5fa55a",
      requiredXP: 30, // Was 0
      unlocked: userXP >= 30
    },
    {
      title: "☀️ Summer Theme",
      themeName: "summer",
      icon: "sunny-outline",
      description: "Vibrant pink & purple",
      color: "#c266a7",
      requiredXP: 60, // Was 30
      unlocked: userXP >= 60
    },
    {
      title: "❄️ Winter Theme",
      themeName: "winter",
      icon: "snow-outline",
      description: "Cool blue & ice tones",
      color: "#4deeea",
      requiredXP: 90, // Stays the same
      unlocked: userXP >= 90
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
  // Helper function to convert UTC date to Manila time
  const convertToManilaTime = (utcDate) => {
    if (!utcDate || isNaN(utcDate.getTime())) {
      return null;
    }
    
    // Convert to Manila time by adding 8 hours to UTC
    const manilaDate = new Date(utcDate.getTime() + MANILA_TIMEZONE_OFFSET);
    return manilaDate;
  };
  
  // Load mood entries from API with Manila time zone adjustment
  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.100.22:3000/entries/getAllEntries');
        if (response.data.successful) {
          console.log("Successfully loaded mood entries:", response.data.formattedEntries.length);
          
          // Store all entries without filtering
          const transformedEntries = response.data.formattedEntries.map(entry => {
            // Ensure we have valid emotion data
            const emotionsArray = typeof entry.emotions === 'string' && entry.emotions.trim() !== ''
              ? entry.emotions.split(',')
              : [];
    
            // Parse the date from the database format
            let utcDate;
            try {
              // Parse the ISO-like date format from the database
              // Example format: 2025-03-10 16:00:00.000 +00:00
              const dateTimeString = entry.logged_date;
              
              // First check if it's in MM-DD-YYYY format
              const dateRegex = /^(\d{2})-(\d{2})-(\d{4})\s/;
              const match = dateTimeString.match(dateRegex);
              
              if (match) {
                // It's in MM-DD-YYYY format
                const month = parseInt(match[1], 10) - 1; // Months are 0-indexed
                const day = parseInt(match[2], 10);
                const year = parseInt(match[3], 10);
                
                // Create a UTC date (this correctly interprets as UTC)
                utcDate = new Date(Date.UTC(year, month, day));
                console.log(`Parsed MM-DD-YYYY date: ${dateTimeString} -> UTC: ${utcDate.toISOString()}`);
              } else if (dateTimeString.includes('+00:00')) {
                // It's in ISO-like format with explicit UTC timezone
                // Remove the space between date and timezone for proper ISO format
                const isoString = dateTimeString.replace(' +00:00', '+00:00');
                utcDate = new Date(isoString);
                console.log(`Parsed ISO date: ${dateTimeString} -> UTC: ${utcDate.toISOString()}`);
              } else {
                // Try direct parsing as a fallback
                utcDate = new Date(dateTimeString);
                console.log(`Fallback parsing: ${dateTimeString} -> UTC: ${utcDate.toISOString()}`);
              }
              
              // Convert UTC date to Manila time
              const manilaDate = convertToManilaTime(utcDate);
              if (manilaDate) {
                console.log(`Manila time: ${manilaDate.toISOString()} (Manila date: ${manilaDate.getDate()})`);
              }
            } catch (error) {
              console.error(`Error parsing date ${entry.logged_date}:`, error);
              utcDate = null;
            }
            
            // Skip future dates
            const today = new Date();
            const manilaDate = utcDate ? convertToManilaTime(utcDate) : null;
            
            if (manilaDate && manilaDate > today) {
              console.warn(`Entry date ${manilaDate.toISOString()} is in the future - ignoring`);
              utcDate = null;
              manilaDate = null;
            }
    
            // Create a standardized entry object
            return {
              id: entry.entry_ID,
              // Ensure mood is lowercase for consistency
              mood: entry.mood ? entry.mood.toLowerCase() : 'meh',
              // Store both UTC and Manila timestamps
              timestamp: utcDate ? utcDate.getTime() : null,
              formattedDate: entry.logged_date,
              utcDate: utcDate,
              manilaDate: manilaDate,
              emotion: emotionsArray[0] || 'unknown',
              emotions: emotionsArray,
              journal: entry.journal || ''
            };
          });
    
          // Filter out entries with null dates
          const validEntries = transformedEntries.filter(entry => entry.manilaDate !== null);
          
          // Log to verify transformations
          console.log("Transformed entries sample:", 
            validEntries.length > 0 ? 
            {
              ...validEntries[0], 
              manilaDateString: validEntries[0].manilaDate.toDateString()
            } : "No valid entries");
          
          // Store all valid entries
          setCalendarEntries(validEntries);
          // Create a mood map for calendar display using Manila time
          const newMoodMap = {};
          validEntries.forEach(entry => {
            try {
              // Skip entries with null Manila date
              if (entry.manilaDate && !isNaN(entry.manilaDate.getTime())) {
                // Format date as yyyy-MM-dd using Manila date
                const year = entry.manilaDate.getFullYear();
                const month = (entry.manilaDate.getMonth() + 1).toString().padStart(2, '0');
                const day = entry.manilaDate.getDate().toString().padStart(2, '0');
                
                // Create date key in YYYY-MM-DD format using Manila time
                const dateKey = `${year}-${month}-${day}`;
                
                newMoodMap[dateKey] = entry.mood;
                console.log(`Added mood entry for Manila date ${dateKey}: ${entry.mood} (from ${entry.formattedDate})`);
              } else {
                console.log(`Skipping entry with null Manila date: ${entry.id} - ${entry.formattedDate}`);
              }
            } catch (error) {
              console.error("Error processing entry for mood map:", error);
            }
          });
          
          console.log("Created mood map with", Object.keys(newMoodMap).length, "entries");
          console.log("Mood map entries:", Object.keys(newMoodMap));
          setMoodMap(newMoodMap);
          
        } else {
          console.warn("Failed to load mood entries:", response.data.message);
          setCalendarEntries([]);
          setMoodMap({});
        }
      } catch (error) {
        console.error("Error loading mood entries:", error);
        setCalendarEntries([]);
        setMoodMap({});
      } finally {
        setLoading(false);
      }
    };
  
    fetchMoodEntries();
    
    // Set up polling for updates (every 30 seconds)
    const intervalId = setInterval(fetchMoodEntries, 30000);
    return () => clearInterval(intervalId);
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

  // Handle day selection with Manila time awareness
  const handleDaySelect = (day) => {
    // Format date consistently
    const formattedDate = format(day, "yyyy-MM-dd");
    const mood = moodMap[formattedDate];
    
    if (mood) {
      console.log("Selected date:", formattedDate, "with mood:", mood);
      
      // Find the full entry for this date to display in modal
      const selectedEntry = calendarEntries.find(entry => {
        if (!entry.manilaDate) return false;
        
        // Format the entry date the same way for consistent comparison
        const year = entry.manilaDate.getFullYear();
        const month = (entry.manilaDate.getMonth() + 1).toString().padStart(2, '0');
        const day = entry.manilaDate.getDate().toString().padStart(2, '0');
        const entryDateKey = `${year}-${month}-${day}`;
        
        return entryDateKey === formattedDate;
      });
      
      if (selectedEntry) {
        console.log("Found entry for modal:", selectedEntry);
      } else {
        console.log("No matching entry found for date:", formattedDate);
      }
      
      setSelectedDate(formattedDate);
      setMoodModalVisible(true);
    }
  };
  // Handle reward selection and theme change
  const handleRewardSelect = async (palette) => {
    if (!palette.unlocked) {
      return; // Don't allow selection of locked themes
    }
    
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.text, fontSize: 18 }}>Loading your mood data...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 24,
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
                    
                    // Get the correct theme color for the mood
                    const themeProperty = moodToThemeMap[mood];
                    const moodColor = mood && theme[themeProperty] ? theme[themeProperty] : null;
                    
                    // Debug - log when we find a matching mood in the current month
                    if (mood && !isDimmed) {
                      console.log(`Rendering mood for ${formattedDate}: ${mood}, color: ${moodColor}`);
                    }
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={{ width: "14.28%", alignItems: "center", justifyContent: "center", marginBottom: 8 }}
                        onPress={() => handleDaySelect(day)}
                        disabled={!mood || isDimmed}
                        activeOpacity={mood && !isDimmed ? 0.7 : 1}
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
                                tintColor: theme.calendarBg
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
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
              
              {/* Entry Count Indicator */}
              <View style={{ 
                marginTop: 24, 
                padding: 16, 
                backgroundColor: theme.calendarBg, 
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calendar-outline" size={22} color={theme.buttonBg} style={{ marginRight: 8 }} />
                  <Text style={{ color: theme.text, fontWeight: '600' }}>
                    {format(selectedMonth, 'MMMM')} Entries
                  </Text>
                </View>
                <Text style={{ 
                  color: theme.buttonBg, 
                  fontWeight: 'bold', 
                  fontSize: 18 
                }}>
                  {Object.keys(moodMap).filter(date => 
                    date.startsWith(format(selectedMonth, 'yyyy-MM'))
                  ).length}
                </Text>
              </View>
            </View>
          ) : (
            // Streak Page - Redesigned with focus on XP
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text style={{ 
                color: theme.text, 
                fontSize: 20, 
                fontWeight: "bold", 
                marginBottom: 24,
                alignSelf: "center"
              }}>
                Your Mood Theme Journey
              </Text>
              
              {/* Enhanced XP Progress Section */}
              <View style={{ 
                width: "100%", 
                backgroundColor: theme.calendarBg,
                borderRadius: 16,
                padding: 20,
                marginBottom: 24
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <Ionicons name="trophy" size={24} color={theme.buttonBg} style={{ marginRight: 8 }} />
                  <Text style={{ color: theme.text, fontSize: 18, fontWeight: "bold" }}>
                    Mood XP Progress
                  </Text>
                </View>
                
                <Text style={{ 
                  color: theme.dimmedText, 
                  marginBottom: 16,
                  lineHeight: 20
                }}>
                  Log moods daily to earn XP and unlock new seasonal themes.
                </Text>
                
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ color: theme.text, fontWeight: "600" }}>Current XP</Text>
                  <Text style={{ color: theme.buttonBg, fontWeight: "bold" }}>{userXP}/100</Text>
                </View>
                
                <View style={{ 
                  height: 14, 
                  backgroundColor: `${theme.buttonBg}20`, 
                  borderRadius: 7, 
                  overflow: "hidden",
                  marginBottom: 8
                }}>
                  <View
                    style={{
                      width: `${userXP}%`,
                      height: "100%",
                      backgroundColor: theme.buttonBg,
                      borderRadius: 7
                    }}
                  />
                </View>
                
                <Text style={{ 
                  color: theme.accent1,
                  fontSize: 13,
                  fontWeight: "500",
                  textAlign: "right"
                }}>
                  {100 - userXP} XP needed for next theme
                </Text>
              </View>

              {/* Theme Map Title */}
              <Text style={{ 
                color: theme.text, 
                fontSize: 18, 
                fontWeight: "bold", 
                marginBottom: 16,
                alignSelf: "flex-start"
              }}>
                Theme Map
              </Text>

              {/* Theme Map */}
              <View style={{ 
                width: "100%", 
                backgroundColor: theme.calendarBg,
                borderRadius: 16,
                padding: 16,
                marginBottom: 16
              }}>
                {/* Map Path - Curved Line Connecting All Themes */}
                <View style={{ 
                  position: "absolute", 
                  left: 45, 
                  top: 80, 
                  width: 2, 
                  height: 220,
                  backgroundColor: `${theme.dimmedText}60`,
                  borderRadius: 4,
                  zIndex: 1
                }} />
                {/* First Theme - Autumn (Starting Point) */}
                <TouchableOpacity
                  onPress={() => handleRewardSelect(palettes[0])}
                  style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginBottom: 24,
                    zIndex: 2
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: palettes[0].color,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: selectedReward === palettes[0].title ? 3 : 0,
                    borderColor: theme.text,
                    opacity: palettes[0].unlocked ? 1 : 0.5
                  }}>
                    <Ionicons name={palettes[0].icon} size={28} color="#fff" />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: theme.text, 
                      fontWeight: "bold", 
                      fontSize: 16
                    }}>
                      {palettes[0].title}
                    </Text>
                    <Text style={{ color: theme.dimmedText, fontSize: 12 }}>
                      {palettes[0].description}
                    </Text>
                  </View>
                  
                  <View style={{
                    backgroundColor: theme.buttonBg,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>DEFAULT</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Second Theme - Spring */}
                <TouchableOpacity
                  onPress={() => handleRewardSelect(palettes[1])}
                  style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginBottom: 24,
                    zIndex: 2
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: palettes[1].unlocked ? palettes[1].color : `${theme.dimmedText}60`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: selectedReward === palettes[1].title ? 3 : 0,
                    borderColor: theme.text,
                    opacity: palettes[1].unlocked ? 1 : 0.5
                  }}>
                    <Ionicons name={palettes[1].icon} size={28} color="#fff" />
                    {!palettes[1].unlocked && (
                      <Ionicons name="lock-closed" size={16} color="#fff" style={{ position: "absolute", bottom: 0, right: 0 }} />
                    )}
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: theme.text, 
                      fontWeight: "bold", 
                      fontSize: 16
                    }}>
                      {palettes[1].title}
                    </Text>
                    <Text style={{ color: theme.dimmedText, fontSize: 12 }}>
                      {palettes[1].description}
                    </Text>
                  </View>
                  
                  <View style={{
                    backgroundColor: palettes[1].unlocked ? theme.accent1 : `${theme.dimmedText}40`,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{palettes[1].unlocked ? "UNLOCKED" : `${palettes[1].requiredXP} XP`}</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Third Theme - Summer */}
                <TouchableOpacity
                  onPress={() => handleRewardSelect(palettes[2])}
                  style={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    marginBottom: 24,
                    zIndex: 2
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: palettes[2].unlocked ? palettes[2].color : `${theme.dimmedText}60`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: selectedReward === palettes[2].title ? 3 : 0,
                    borderColor: theme.text,
                    opacity: palettes[2].unlocked ? 1 : 0.5
                  }}>
                    <Ionicons name={palettes[2].icon} size={28} color="#fff" />
                    {!palettes[2].unlocked && (
                      <Ionicons name="lock-closed" size={16} color="#fff" style={{ position: "absolute", bottom: 0, right: 0 }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: theme.text, 
                      fontWeight: "bold", 
                      fontSize: 16
                    }}>
                      {palettes[2].title}
                    </Text>
                    <Text style={{ color: theme.dimmedText, fontSize: 12 }}>
                      {palettes[2].description}
                    </Text>
                  </View>
                  
                  <View style={{
                    backgroundColor: palettes[2].unlocked ? theme.buttonBg : `${theme.dimmedText}40`,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{palettes[2].unlocked ? "UNLOCKED" : `${palettes[2].requiredXP} XP`}</Text>
                  </View>
                </TouchableOpacity>
                
                {/* Fourth Theme - Winter */}
                <TouchableOpacity
                  onPress={() => handleRewardSelect(palettes[3])}
                  style={{ 
                    flexDirection: "row", 
                    alignItems: "center",
                    zIndex: 2
                  }}
                >
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: palettes[3].unlocked ? palettes[3].color : `${theme.dimmedText}60`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                    borderWidth: selectedReward === palettes[3].title ? 3 : 0,
                    borderColor: theme.text,
                    opacity: palettes[3].unlocked ? 1 : 0.5
                  }}>
                    <Ionicons name={palettes[3].icon} size={28} color="#fff" />
                    {!palettes[3].unlocked && (
                      <Ionicons name="lock-closed" size={16} color="#fff" style={{ position: "absolute", bottom: 0, right: 0 }} />
                    )}
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: theme.text, 
                      fontWeight: "bold", 
                      fontSize: 16
                    }}>
                      {palettes[3].title}
                    </Text>
                    <Text style={{ color: theme.dimmedText, fontSize: 12 }}>
                      {palettes[3].description}
                    </Text>
                  </View>
                  
                  <View style={{
                    backgroundColor: palettes[3].unlocked ? theme.accent3 : `${theme.dimmedText}40`,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>{palettes[3].unlocked ? "UNLOCKED" : `${palettes[3].requiredXP} XP`}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Current Theme Info */}
              <View style={{ 
                width: "100%", 
                backgroundColor: theme.calendarBg, 
                borderRadius: 12, 
                padding: 16,
                flexDirection: "row", 
                alignItems: "center" 
              }}>
                <Ionicons name="color-palette-outline" size={24} color={theme.buttonBg} style={{ marginRight: 10 }} />
                
                <View>
                  <Text style={{ color: theme.text, fontWeight: "bold" }}>Current Theme</Text>
                  <Text style={{ color: theme.buttonBg, fontWeight: "600" }}>{theme.name}</Text>
                </View>
              </View>
              
              {/* Total Entries Stats */}
              <View style={{ 
                width: "100%", 
                backgroundColor: theme.calendarBg, 
                borderRadius: 12, 
                padding: 16,
                marginTop: 16,
                flexDirection: "row", 
                justifyContent: "space-between"
              }}>
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ color: theme.dimmedText, fontSize: 14, marginBottom: 4 }}>Total Entries</Text>
                  <Text style={{ color: theme.buttonBg, fontSize: 20, fontWeight: "bold" }}>{calendarEntries.length}</Text>
                </View>
                
                <View style={{ width: 1, height: "80%", backgroundColor: `${theme.dimmedText}30`, alignSelf: "center" }} />
                
                <View style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ color: theme.dimmedText, fontSize: 14, marginBottom: 4 }}>Monthly Goal</Text>
                  <Text style={{ color: theme.buttonBg, fontSize: 20, fontWeight: "bold" }}>
                    {Math.min(calendarEntries.length, 30)}/30
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      )}
      {/* Calendar Mood Modal */}
      <CalendarMoodModal
        visible={moodModalVisible}
        onClose={() => {
          setMoodModalVisible(false);
          setSelectedDate(null); // Clear selected date when closing
        }}
        selectedDate={selectedDate}
        theme={theme}
        moodIcons={moodIcons}
        // Pass the entry data for the selected date with Manila time awareness
        entry={selectedDate ? calendarEntries.find(entry => {
          if (!entry.manilaDate) return false;
          
          // Format the entry date the same way for consistent comparison
          const year = entry.manilaDate.getFullYear();
          const month = (entry.manilaDate.getMonth() + 1).toString().padStart(2, '0');
          const day = entry.manilaDate.getDate().toString().padStart(2, '0');
          const entryDateKey = `${year}-${month}-${day}`;
          
          return entryDateKey === selectedDate;
        }) : null}
      />
    </SafeAreaView>
  );
}