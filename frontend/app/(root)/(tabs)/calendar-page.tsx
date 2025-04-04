import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subDays, addDays } from "date-fns";
import { useWindowDimensions } from "react-native";
import { useTheme } from "@/app/(root)/properties/themecontext"; // Import the theme hook

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
  { mood: "Rad", date: "2025-02-15" },
  { mood: "Bad", date: "2025-02-14" },
  { mood: "Rad", date: "2025-02-13" },
  { mood: "Bad", date: "2025-02-12" },
  { mood: "Good", date: "2025-02-11" },
  { mood: "Awful", date: "2025-02-10" },
  { mood: "Good", date: "2025-02-09" },
  { mood: "Meh", date: "2025-02-08" },
];

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { width, height } = useWindowDimensions();
  const [view, setView] = useState("Calendar");
  const [selectedReward, setSelectedReward] = useState(null);
  
  // Use the theme context with multiple themes
  const { theme, setThemeName, availableThemes } = useTheme();

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

  const moodMap = Object.fromEntries(
    dummyEntries.map((entry) => [entry.date, entry.mood])
  );

  // The available theme palettes
  const palettes = [
    {
      title: "🔶 Orange Palette",
      themeName: "dark",
      icon: "https://cdn-icons-png.flaticon.com/128/2913/2913136.png",
      description: "Default orange theme",
      color: "#FF6B35"
    },
    {
      title: "🔵 Blue Palette",
      themeName: "blue",
      icon: "https://cdn-icons-png.flaticon.com/128/3523/3523063.png",
      description: "Cool blue accents",
      color: "#3498DB"
    },
    {
      title: "🟡 Yellow Palette",
      themeName: "yellow",
      icon: "https://cdn-icons-png.flaticon.com/128/1688/1688535.png",
      description: "Sunny yellow accents",
      color: "#F1C40F"
    },
    {
      title: "💗 Pink Palette",
      themeName: "pink",
      icon: "https://cdn-icons-png.flaticon.com/128/1104/1104935.png",
      description: "Vibrant pink accents",
      color: "#E84393"
    },
  ];

  // Handle reward selection and theme change
  const handleRewardSelect = (palette) => {
    setSelectedReward(palette.title);
    setThemeName(palette.themeName);
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
                          backgroundColor: isDimmed ? 
                            (theme.background === "#000000" ? "#050505" : "#E5E5E5") : 
                            theme.calendarBg
                        }}
                      >
                        {moodIcon && (
                          <Image
                            source={moodIcon}
                            style={{
                              width: 30,
                              height: 30,
                              resizeMode: "contain",
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
          <View style={{ marginTop: 24, width: "100%", paddingHorizontal: 24, alignItems: "center" }}>
            <Text style={{ color: theme.text, fontSize: 20, fontWeight: "bold", marginBottom: 32 }}>
              🔥 XP Progress
            </Text>
            <Text style={{ color: theme.text, textAlign: "center", marginBottom: 24 }}>
              Track your streaks and unlock theme palettes for maintaining consistent moods!
            </Text>

            {/* Theme title with current theme name */}
            <Text style={{ color: theme.buttonBg, fontWeight: "bold", fontSize: 16, marginBottom: 16 }}>
              Current Theme: {theme.name}
            </Text>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {palettes.map((palette, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleRewardSelect(palette)}
                  style={{ marginBottom: 16 }}
                >
                  <View style={{ alignItems: "center", marginBottom: 24 }}>
                    <View
                      style={{                                                                                
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: theme.calendarBg,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: selectedReward === palette.title ? 2 : 0,
                        borderColor: palette.color
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
                        fontSize: 14,
                        fontWeight: "600",
                        marginTop: 8,
                      }}
                    >
                      {palette.title}
                    </Text>
                    <Text
                      style={{
                        color: theme.dimmedText,
                        fontSize: 12,
                        marginTop: 4,
                        marginBottom: 16,
                      }}
                    >
                      {palette.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

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