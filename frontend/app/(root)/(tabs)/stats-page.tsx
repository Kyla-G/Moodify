import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import { 
  format, 
  subMonths, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  subWeeks,
  addWeeks,
  isWithinInterval
} from "date-fns";
import { useTheme } from "@/app/(root)/properties/themecontext";
import { LinearGradient } from "expo-linear-gradient";
import { moodColors } from "@/app/services/type";
import axios from "@/axiosConfig"; // Import axios for API calls

const { width, height } = Dimensions.get("window");
const screenWidth = width - 40; // Account for padding
const chartWidth = screenWidth - 16;

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

// Map mood types to theme color properties
const moodToThemeMap = {
  "rad": "buttonBg",
  "good": "accent1",
  "meh": "accent2",
  "bad": "accent3",
  "awful": "accent4"
};

// Map mood values to numerical scores for averages
const moodScores = {
  "rad": 5,
  "good": 4,
  "meh": 3,
  "bad": 2,
  "awful": 1
};

// Define mood names with proper capitalization
const moodNames = {
  "rad": "Rad",
  "good": "Good",
  "meh": "Meh",
  "bad": "Bad",
  "awful": "Awful"
};

export default function StatsScreen() {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("weekly"); // "weekly" or "monthly"
  const [todayAffirmation, setTodayAffirmation] = useState("");
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [stats, setStats] = useState({
    moodCounts: {},
    avgScore: 0,
    streak: 0,
    topEmotions: [],
    journalPercentage: 0,
    weeklyTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.1.11:3000/entries/getAllEntries');
        if (response.data.successful) {
          console.log("Successfully loaded mood entries:", response.data.formattedEntries.length);
  
          const transformedEntries = response.data.formattedEntries.map(entry => {
            const emotionsArray = typeof entry.emotions === 'string'
              ? entry.emotions.split(',')
              : [];
  
            return {
              id: entry.entry_ID,
              mood: entry.mood.toLowerCase(),
              timestamp: new Date(entry.logged_date).getTime(),
              formattedDate: entry.logged_date,
              emotion: emotionsArray[0] || 'unknown',
              emotions: emotionsArray,
              journal: entry.journal || ''
            };
          });
  
          setEntries(transformedEntries); // ✅ CRUCIAL: Save to state!
  
        } else {
          console.warn("Failed to load mood entries:", response.data.message);
          setEntries([]);
        }
      } catch (error) {
        console.error("Error loading mood entries:", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMoodEntries();
  }, []);
  

  useEffect(() => {
    // Get a random affirmation for the day
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setTodayAffirmation(affirmations[randomIndex]);

    // Filter entries based on the view mode
    filterEntriesByPeriod();
  }, [selectedDate, entries, viewMode]);

  useEffect(() => {
    // Calculate statistics when filtered entries change
    calculateStats();
  }, [filteredEntries]);

  // Function to filter entries based on view mode (weekly or monthly)
const filterEntriesByPeriod = () => {
  // Temporarily show all entries instead of filtering
  console.log("Total entries available:", entries.length);
  setFilteredEntries(entries);
  
  /* Original filtering code (commented out for now)
  if (entries.length === 0) {
    setFilteredEntries([]);
    return;
  }

  let filtered = [];
  
  if (viewMode === "weekly") {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 }); // Saturday
    
    filtered = entries.filter(entry => {
      // Parse the date from the entry
      const entryDate = entry.timestamp ? new Date(entry.timestamp) : new Date(entry.formattedDate);
      // Check if it falls within the selected week
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });
  } else {
    // Monthly view
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    
    filtered = entries.filter(entry => {
      // Parse the date from the entry
      const entryDate = entry.timestamp ? new Date(entry.timestamp) : new Date(entry.formattedDate);
      // Check if it falls within the selected month
      return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
    });
  }
  
  setFilteredEntries(filtered);
  */
};

  const calculateStats = () => {
    if (filteredEntries.length === 0) {
      setStats({
        moodCounts: {},
        avgScore: 0,
        streak: calculateStreak(),
        topEmotions: [],
        journalPercentage: 0,
        weeklyTrend: generateEmptyTrend()
      });
      return;
    }

    // Calculate mood counts - ensuring lowercase mood values
    const moodCounts = filteredEntries.reduce((acc, entry) => {
      const normalizedMood = entry.mood.toLowerCase();
      acc[normalizedMood] = (acc[normalizedMood] || 0) + 1;
      return acc;
    }, {});

    // Calculate average mood score
    const totalScore = filteredEntries.reduce((sum, entry) => {
      const normalizedMood = entry.mood.toLowerCase();
      return sum + moodScores[normalizedMood];
    }, 0);
    const avgScore = totalScore / filteredEntries.length;

    // Calculate journal completion percentage
    const entriesWithJournal = filteredEntries.filter(entry => entry.journal && entry.journal.trim().length > 0);
    const journalPercentage = (entriesWithJournal.length / filteredEntries.length) * 100;

    // Count emotions and get top ones
    const emotionCounts = filteredEntries.reduce((acc, entry) => {
      if (entry.emotions && entry.emotions.length > 0) {
        entry.emotions.forEach(emotion => {
          acc[emotion] = (acc[emotion] || 0) + 1;
        });
      }
      return acc;
    }, {});
    
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, count]) => ({ emotion, count }));

    // Generate trend data based on the actual entries
    const weeklyTrend = generateTrendData();

    setStats({
      moodCounts,
      avgScore,
      streak: calculateStreak(),
      topEmotions,
      journalPercentage,
      weeklyTrend
    });
  };

  const generateEmptyTrend = () => {
    if (viewMode === "weekly") {
      return Array(7).fill(0).map((_, index) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
        score: 0
      }));
    } else {
      return Array(4).fill(0).map((_, index) => ({
        week: `Week ${index + 1}`,
        score: 0
      }));
    }
  };

  const generateTrendData = () => {
    if (filteredEntries.length === 0) return generateEmptyTrend();
  
    if (viewMode === "weekly") {
      // Create data for each day of the week with safe defaults
      const dayScores = Array(7).fill(0).map(() => ({ count: 0, total: 0 }));
      
      // Safely process each entry
      filteredEntries.forEach(entry => {
        if (!entry || !entry.timestamp) return; // Skip invalid entries
        
        try {
          const date = new Date(entry.timestamp);
          if (isNaN(date.getTime())) return; // Skip invalid dates
          
          const dayIndex = date.getDay(); // 0 for Sunday, 6 for Saturday
          if (dayIndex < 0 || dayIndex > 6) return; // Skip invalid day indices
          
          const moodKey = entry.mood ? entry.mood.toLowerCase() : '';
          const moodScore = moodScores[moodKey] || 0;
          
          dayScores[dayIndex].count += 1;
          dayScores[dayIndex].total += moodScore;
        } catch (e) {
          console.error("Error processing entry for trend data:", e);
        }
      });
      
      return dayScores.map((data, index) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
        score: data.count > 0 ? data.total / data.count : 0
      }));
    } else {
      // Monthly view - group by weeks
      const monthStart = startOfMonth(selectedDate);
      const weekData = Array(4).fill(0).map(() => ({ count: 0, total: 0 }));
      
      // Safely process each entry
      filteredEntries.forEach(entry => {
        if (!entry || !entry.timestamp) return; // Skip invalid entries
        
        try {
          const entryDate = new Date(entry.timestamp);
          if (isNaN(entryDate.getTime())) return; // Skip invalid dates
          
          const weeksDiff = (entryDate - monthStart) / (7 * 24 * 60 * 60 * 1000);
          if (isNaN(weeksDiff)) return; // Skip if calculation is invalid
          
          const weekIndex = Math.floor(weeksDiff);
          const safeIndex = Math.min(Math.max(weekIndex, 0), 3); // Ensure index is between 0-3
          
          const moodKey = entry.mood ? entry.mood.toLowerCase() : '';
          const moodScore = moodScores[moodKey] || 0;
          
          weekData[safeIndex].count += 1;
          weekData[safeIndex].total += moodScore;
        } catch (e) {
          console.error("Error processing entry for trend data:", e);
        }
      });
      
      return weekData.map((data, index) => ({
        week: `Week ${index + 1}`,
        score: data.count > 0 ? data.total / data.count : 0
      }));
    }
  };
  
  const calculateStreak = () => {
    // This would require checking consecutive days with entries
    // Simplified version for the example
    return entries.length > 0 ? Math.min(entries.length, 5) : 0;
  };

  // Format date range text for display in header
  const getDateRangeText = () => {
    if (viewMode === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  // Navigation functions with support for both weekly and monthly views
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

  // Toggle between weekly and monthly views
  const toggleViewMode = () => {
    setViewMode(viewMode === "weekly" ? "monthly" : "weekly");
  };

  // Get mood color from theme
  const getMoodThemeColor = (mood) => {
    if (!mood) return theme.calendarBg;
    
    // Convert mood to lowercase for mapping
    const normalizedMood = mood.toLowerCase();
    const themeProperty = moodToThemeMap[normalizedMood];
    
    if (themeProperty && theme[themeProperty]) {
      return theme[themeProperty];
    }
    
    // Fallback to original moodColors if not found in theme
    return moodColors[normalizedMood];
  };

  // Chart data preparation
  const trendData = {
    labels: stats.weeklyTrend.map(item => viewMode === "weekly" ? item.day : item.week),
    datasets: [{
      data: stats.weeklyTrend.map(item => Number.isFinite(item.score) ? item.score : 0),
      color: (opacity = 1) => theme.buttonBg,
      strokeWidth: 2
    }],
  };
  
  const chartConfig = {
    backgroundColor: theme.calendarBg,
    backgroundGradientFrom: theme.calendarBg,
    backgroundGradientTo: theme.calendarBg,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => theme.text,
    barPercentage: 0.7,
    propsForVerticalLabels: {
      fontSize: 10,
      fill: theme.text
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      fill: theme.text
    },
    propsForBackgroundLines: {
      stroke: `${theme.dimmedText}33`
    }
  };

  const hasValidTrendData = stats.weeklyTrend.length > 0 && 
    stats.weeklyTrend.every(item => Number.isFinite(item.score));

   

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Background Gradient */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: height * 0.5,
          zIndex: 5,
        }}
      >
        <LinearGradient
          colors={[
            `${theme.background}90`,
            `${theme.background}50`,
            "transparent"
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

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
          <TouchableOpacity>
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

        {/* Affirmation Banner */}
        <View style={{
          backgroundColor: theme.accent2,
          paddingVertical: 20,
          paddingHorizontal: 16,
          borderRadius: 8,
          width: "100%",
          marginHorizontal: 16,
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

      {/* Main Title */}
      <View style={{ 
        paddingHorizontal: 16, 
        marginTop: 8, 
        marginBottom: 24,
        alignItems: "center"
      }}>
        <Text style={{ 
          color: theme.buttonBg, 
          fontFamily: "LeagueSpartan-Bold", 
          fontSize: width < 350 ? 36 : 48,
          textAlign: "center",
          letterSpacing: -2,
        }}>
          Your Mood Stats
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: theme.text, fontSize: 18 }}>Loading your mood data...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ 
            paddingBottom: 32, 
            paddingHorizontal: 16 
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Monthly Mood Summary */}
          <View style={{ 
            width: "100%", 
            backgroundColor: theme.calendarBg, 
            padding: 20, 
            marginBottom: 16, 
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
          }}>
            <Text style={{ 
              color: theme.text, 
              fontSize: 20, 
              marginBottom: 16, 
              fontFamily: "LeagueSpartan-Bold",
            }}>
              {viewMode === "weekly" ? "Weekly" : "Monthly"} Summary
            </Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: theme.dimmedText, fontSize: 14, marginBottom: 4, fontFamily: "LaoSansPro-Regular" }}>
                  Avg. Mood
                </Text>
                <Text style={{ color: theme.buttonBg, fontSize: 24, fontWeight: "bold", fontFamily: "LeagueSpartan-Bold" }}>
                  {stats.avgScore.toFixed(1)}
                </Text>
              </View>
              
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: theme.dimmedText, fontSize: 14, marginBottom: 4, fontFamily: "LaoSansPro-Regular" }}>
                  Entries
                </Text>
                <Text style={{ color: theme.buttonBg, fontSize: 24, fontWeight: "bold", fontFamily: "LeagueSpartan-Bold" }}>
                  {filteredEntries.length}
                </Text>
              </View>
              
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: theme.dimmedText, fontSize: 14, marginBottom: 4, fontFamily: "LaoSansPro-Regular" }}>
                  Journal %
                </Text>
                <Text style={{ color: theme.buttonBg, fontSize: 24, fontWeight: "bold", fontFamily: "LeagueSpartan-Bold" }}>
                  {stats.journalPercentage.toFixed(0)}%
                </Text>
              </View>
            </View>
            
            {/* Streak Badge */}
            <View style={{ 
              alignItems: "center", 
              marginTop: 8, 
              marginBottom: 8, 
              backgroundColor: `${theme.buttonBg}20`,
              borderRadius: 16,
              padding: 12
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="flame" size={24} color={theme.buttonBg} style={{ marginRight: 8 }} />
                <Text style={{ 
                  color: theme.buttonBg, 
                  fontSize: 18, 
                  fontWeight: "bold",
                  fontFamily: "LeagueSpartan-Bold"
                }}>
                  {stats.streak} day streak
                </Text>
              </View>
            </View>
          </View>

          {/* Mood Distribution Chart */}
          <View style={{ 
            width: "100%", 
            backgroundColor: theme.calendarBg, 
            padding: 20, 
            marginBottom: 16, 
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
          }}>
            <Text style={{ 
              color: theme.text, 
              fontSize: 20, 
              marginBottom: 16, 
              fontFamily: "LeagueSpartan-Bold",
            }}>
              Mood Distribution
            </Text>
            
            {Object.keys(stats.moodCounts).length > 0 ? (
              <>
                {/* Bar chart with percentages */}
                {Object.keys(stats.moodCounts).map((mood) => {
                  const percentage = (stats.moodCounts[mood] / filteredEntries.length) * 100;
                  const displayMood = moodNames[mood] || mood;
                  const moodColor = getMoodThemeColor(mood);
                  
                  return (
                    <View key={mood} style={{ marginBottom: 12 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                        <Text style={{ 
                          color: moodColor, 
                          fontFamily: "LeagueSpartan-Bold",
                          fontSize: 16
                        }}>
                          {displayMood}
                        </Text>
                        <Text style={{ 
                          color: theme.text, 
                          fontFamily: "LaoSansPro-Regular" 
                        }}>
                          {stats.moodCounts[mood]} ({percentage.toFixed(0)}%)
                        </Text>
                      </View>
                      <View style={{ 
                        height: 12, 
                        backgroundColor: `${theme.text}20`, 
                        borderRadius: 6, 
                        overflow: "hidden" 
                      }}>
                        <View
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            backgroundColor: moodColor,
                            borderRadius: 6,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </>
            ) : (
              <Text style={{ 
                color: theme.dimmedText, 
                textAlign: "center", 
                fontFamily: "LaoSansPro-Regular",
                marginVertical: 20
              }}>
                No mood entries for this {viewMode === "weekly" ? "week" : "month"}
              </Text>
            )}
          </View>

          {/* Trend Chart */}
          <View style={{ 
            width: "100%", 
            backgroundColor: theme.calendarBg, 
            padding: 20, 
            marginBottom: 16, 
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
          }}>
            <Text style={{ 
              color: theme.text, 
              fontSize: 20, 
              marginBottom: 16, 
              fontFamily: "LeagueSpartan-Bold",
            }}>
              {viewMode === "weekly" ? "Daily" : "Weekly"} Mood Trend
            </Text>
            
            {hasValidTrendData && filteredEntries.length > 0 ? (
              <View style={{ alignItems: "center", marginBottom: 8 }}>
                <LineChart
                  data={trendData}
                  width={chartWidth}
                  height={220}
                  chartConfig={{
                    ...chartConfig,
                    fillShadowGradientFrom: theme.buttonBg,
                    fillShadowGradientTo: `${theme.buttonBg}00`,
                    strokeWidth: 2,
                  }}
                  bezier
                  style={{ borderRadius: 16 }}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  fromZero={true}
                  yAxisLabel=""
                  yAxisSuffix=""
                />
              </View>
            ) : (
              <Text style={{ 
                color: theme.dimmedText, 
                textAlign: "center", 
                fontFamily: "LaoSansPro-Regular",
                marginVertical: 40
              }}>
                Not enough data to display {viewMode === "weekly" ? "daily" : "weekly"} trend
              </Text>
            )}
          </View>

          {/* Top Emotions */}
          <View style={{ 
            width: "100%", 
            backgroundColor: theme.calendarBg, 
            padding: 20, 
            marginBottom: 16, 
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
          }}>
            <Text style={{ 
              color: theme.text, 
              fontSize: 20, 
              marginBottom: 16, 
              fontFamily: "LeagueSpartan-Bold",
            }}>
              Top Emotions
            </Text>
            
            {stats.topEmotions.length > 0 ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {stats.topEmotions.map((item, index) => (
                  <View 
                    key={index} 
                    style={{ 
                      backgroundColor: `${theme.buttonBg}20`, 
                      paddingHorizontal: 12, 
                      paddingVertical: 8, 
                      borderRadius: 16, 
                      marginRight: 8,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center"
                    }}>
                    <Text style={{ 
                      color: theme.buttonBg, 
                      fontFamily: "LeagueSpartan-Bold",
                      fontSize: 15
                    }}>
                      {item.count}×
                    </Text>
                    <Text style={{ 
                      color: theme.text, 
                      fontFamily: "LaoSansPro-Regular",
                      marginLeft: 4
                    }}>
                      {item.emotion}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ 
                color: theme.dimmedText, 
                textAlign: "center", 
                fontFamily: "LaoSansPro-Regular",
                marginVertical: 20
              }}>
                No emotion data available for this {viewMode === "weekly" ? "week" : "month"}
              </Text>
            )}
          </View>

          {/* Insights */}
          <View style={{ 
            width: "100%", 
            backgroundColor: theme.calendarBg, 
            padding: 20, 
            marginBottom: 16, 
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3
          }}>
            <Text style={{ 
              color: theme.text, 
              fontSize: 20, 
              marginBottom: 16, 
              fontFamily: "LeagueSpartan-Bold",
            }}>
              Mood Insights
            </Text>
            
            {filteredEntries.length > 0 ? (
              <>
                <View style={{ 
                  backgroundColor: `${theme.buttonBg}15`, 
                  padding: 16, 
                  borderRadius: 12, 
                  marginBottom: 12
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="sunny" size={18} color={theme.buttonBg} style={{ marginRight: 8 }} />
                    <Text style={{ 
                      color: theme.text, 
                      fontFamily: "LaoSansPro-Regular",
                      flex: 1
                    }}>
                      {stats.avgScore > 3 
                        ? "Your overall mood has been positive!" 
                        : "You've been experiencing some challenges lately."}
                    </Text>
                  </View>
                </View>
                
                <View style={{ 
                  backgroundColor: `${theme.accent1}15`, 
                  padding: 16, 
                  borderRadius: 12 
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="trending-up" size={18} color={theme.accent1} style={{ marginRight: 8 }} />
                    <Text style={{ 
                      color: theme.text, 
                      fontFamily: "LaoSansPro-Regular",
                      flex: 1
                    }}>
                      {filteredEntries.length > 1 
                        ? `You've tracked ${filteredEntries.length} moods this ${viewMode === "weekly" ? "week" : "month"}.`
                        : `Keep tracking to see more insights!`}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={{ 
                color: theme.dimmedText, 
                textAlign: "center", 
                fontFamily: "LaoSansPro-Regular",
                marginVertical: 20
              }}>
                No insights available yet for this {viewMode === "weekly" ? "week" : "month"}
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}