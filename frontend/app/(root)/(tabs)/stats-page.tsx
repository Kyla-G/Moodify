import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, parseISO, isSameMonth } from "date-fns";
import { useTheme } from "@/app/(root)/properties/themecontext";
import { LinearGradient } from "expo-linear-gradient";
import { moodColors } from "@/app/services/type";

const { width, height } = Dimensions.get("window");
const screenWidth = width - 40; // Account for padding
const chartWidth = screenWidth - 16;

// Sample data - in a real app, this would come from your API
const sampleEntries = [
  { mood: "rad", emotion: "excited", date: "2025-04-10", journal: "Had a great day today!" },
  { mood: "bad", emotion: "stressed", date: "2025-04-09", journal: "Work was really tough." },
  { mood: "rad", emotion: "inspired", date: "2025-04-08", journal: "" },
  { mood: "bad", emotion: "anxious", date: "2025-04-07", journal: "Worried about the presentation." },
  { mood: "good", emotion: "content", date: "2025-04-06", journal: "Nice, relaxing weekend." },
  { mood: "awful", emotion: "depressed", date: "2025-04-05", journal: "Everything went wrong today." },
  { mood: "good", emotion: "grateful", date: "2025-04-04", journal: "Had lunch with an old friend." },
  { mood: "meh", emotion: "tired", date: "2025-04-03", journal: "Just an ordinary day." },
  { mood: "meh", emotion: "bored", date: "2025-04-02", journal: "" },
  { mood: "good", emotion: "optimistic", date: "2025-04-01", journal: "New month, new goals!" },
  { mood: "rad", emotion: "joyful", date: "2025-03-31", journal: "Birthday celebration was amazing!" },
  { mood: "good", emotion: "relaxed", date: "2025-03-30", journal: "" },
  { mood: "meh", emotion: "unmotivated", date: "2025-03-29", journal: "Lazy Saturday." },
  { mood: "bad", emotion: "frustrated", date: "2025-03-28", journal: "Traffic was terrible." },
  { mood: "awful", emotion: "overwhelmed", date: "2025-03-27", journal: "Too many deadlines." },
  { mood: "good", emotion: "proud", date: "2025-03-26", journal: "Completed my project." },
  { mood: "rad", emotion: "energetic", date: "2025-03-25", journal: "Great workout today!" },
];

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
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [todayAffirmation, setTodayAffirmation] = useState("");
  const [entries, setEntries] = useState(sampleEntries);
  const [monthlyEntries, setMonthlyEntries] = useState([]);
  const [stats, setStats] = useState({
    moodCounts: {},
    avgScore: 0,
    streak: 0,
    topEmotions: [],
    journalPercentage: 0,
    weeklyTrend: []
  });

  useEffect(() => {
    // Get a random affirmation for the day
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setTodayAffirmation(affirmations[randomIndex]);

    // Filter entries for the selected month
    filterEntriesByMonth(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    // Calculate statistics when entries change
    calculateStats();
  }, [monthlyEntries]);

  const filterEntriesByMonth = (date) => {
    const filtered = entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isSameMonth(entryDate, date);
    });
    setMonthlyEntries(filtered);
  };

  const calculateStats = () => {
    if (monthlyEntries.length === 0) {
      setStats({
        moodCounts: {},
        avgScore: 0,
        streak: calculateStreak(),
        topEmotions: [],
        journalPercentage: 0,
        weeklyTrend: []
      });
      return;
    }

    // Calculate mood counts
    const moodCounts = monthlyEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    // Calculate average mood score
    const totalScore = monthlyEntries.reduce((sum, entry) => sum + moodScores[entry.mood], 0);
    const avgScore = totalScore / monthlyEntries.length;

    // Calculate journal completion percentage
    const entriesWithJournal = monthlyEntries.filter(entry => entry.journal && entry.journal.trim().length > 0);
    const journalPercentage = (entriesWithJournal.length / monthlyEntries.length) * 100;

    // Count emotions and get top ones
    const emotionCounts = monthlyEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {});
    
    const topEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, count]) => ({ emotion, count }));

    // Calculate weekly trend (simplified)
    // In a real app, you would group by week and calculate averages
    const weeklyTrend = [
      { week: "Week 1", score: 3.2 },
      { week: "Week 2", score: 3.8 },
      { week: "Week 3", score: 4.1 },
      { week: "Week 4", score: 3.5 },
    ];

    setStats({
      moodCounts,
      avgScore,
      streak: calculateStreak(),
      topEmotions,
      journalPercentage,
      weeklyTrend
    });
  };

  const calculateStreak = () => {
    // In a real app, you would check consecutive days with entries
    // This is a simplified example
    return 5;
  };

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

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

  // Prepare data for charts
  const moodDistributionData = {
    labels: Object.keys(stats.moodCounts).map(mood => moodNames[mood] || mood),
    datasets: [{
      data: Object.values(stats.moodCounts),
    }],
  };

  const weeklyTrendData = {
    labels: stats.weeklyTrend.map(item => item.week),
    datasets: [{
      data: stats.weeklyTrend.map(item => item.score),
      color: (opacity = 1) => theme.buttonBg,
      strokeWidth: 2
    }],
  };
  
  // Prepare data for pie chart
  const pieChartData = Object.keys(stats.moodCounts).map(mood => ({
    name: moodNames[mood] || mood,
    population: stats.moodCounts[mood],
    color: getMoodThemeColor(mood),
    legendFontColor: theme.text,
    legendFontSize: 12
  }));

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

  const isDarkTheme = theme.background === "#000000";

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
            `${theme.background}E6`, // Add opacity
            `${theme.background}80`, // More transparent
            "transparent"
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>

      <View style={{ width: "100%", paddingHorizontal: 16 }}>
        <View style={{ 
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
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={width < 350 ? 22 : 28} color={theme.dimmedText} />
          </TouchableOpacity>
          <Text style={{ 
            color: theme.text, 
            fontFamily: "LeagueSpartan-Bold", 
            fontSize: 24 
          }}>
            {format(selectedMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={width < 350 ? 22 : 28} color={theme.dimmedText} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={width < 350 ? 22 : 28} color={theme.text} />
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
            Monthly Summary
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
                {monthlyEntries.length}
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
                const percentage = (stats.moodCounts[mood] / monthlyEntries.length) * 100;
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
              fontFamily: "LaoSansPro-Regular" 
            }}>
              No mood entries for this month
            </Text>
          )}
        </View>

        {/* Weekly Trend Chart */}
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
            Weekly Mood Trend
          </Text>
          
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <LineChart
              data={weeklyTrendData}
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
              fromZero={false}
              yAxisLabel=""
              yAxisSuffix=""
            />
          </View>
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
                  }}
                >
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
              fontFamily: "LaoSansPro-Regular" 
            }}>
              No emotion data available
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
                Your mood seems to be highest on the weekends
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
                Your average mood has improved by 0.5 points compared to last month
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}