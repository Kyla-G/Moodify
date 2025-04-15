import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import { getMoodEntryByDate } from "@/app/services/moodEntriesApi"; // Import the API function

/**
 * Calendar Mood Modal Component
 * Displays detailed information about a mood entry when a calendar day is clicked
 */
const CalendarMoodModal = ({
  visible,
  onClose,
  selectedDate, // Changed from entry to selectedDate
  theme,
  moodIcons
}) => {
  const { width, height } = useWindowDimensions();
  const iconSize = width < 350 ? 18 : 24;
  const [entry, setEntry] = useState(null); // State to store entry from API
  
  // Fetch the entry from API when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      // Get the entry from the API using the selectedDate
      const moodEntry = getMoodEntryByDate(selectedDate);
      console.log("Retrieved entry from API:", moodEntry);
      setEntry(moodEntry);
    } else {
      setEntry(null);
    }
  }, [selectedDate]);
  
  // Return null (don't render anything) if modal is not visible or no entry is fetched
  if (!visible || !entry) return null;
  
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
  
  // Get the appropriate color from theme based on mood
  const getMoodThemeColor = (mood) => {
    if (!mood) return theme.calendarBg;
    
    const normalizedMood = mood.toLowerCase();
    const themeProperty = moodToThemeMap[mood] || moodToThemeMap[normalizedMood];
    
    if (themeProperty && theme[themeProperty]) {
      return theme[themeProperty];
    }
    
    return theme.text; // Fallback
  };
  
  const moodColor = getMoodThemeColor(entry.mood);
  const moodIcon = moodIcons[entry.mood] || moodIcons[entry.mood.toLowerCase()];
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: width < 350 ? 12 : 20
      }}>
        <View style={{
          width: "90%",
          backgroundColor: theme.calendarBg,
          borderRadius: 20,
          padding: 16,
          maxHeight: height * 0.7,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 1
              }}
            >
              <Ionicons name="close" size={iconSize} color={theme.text} />
            </TouchableOpacity>
            
            {/* Header with Date */}
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              paddingTop: 8,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: `${theme.dimmedText}20`
            }}>
              <Ionicons 
                name="calendar-outline" 
                size={iconSize} 
                color={theme.text} 
                style={{ marginRight: 8 }}
              />
              <Text style={{
                fontFamily: "LaoSansPro-Regular",
                fontSize: width < 350 ? 14 : 16,
                fontWeight: "600",
                color: theme.text
              }}>
                {entry.day || format(new Date(entry.timestamp || entry.date), "EEEE")}, {entry.date}
              </Text>
            </View>
            
            {/* Mood Details */}
            <View style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              marginBottom: 16,
              paddingRight: 24
            }}>
              <Image
                source={moodIcon}
                style={{
                  width: width < 350 ? 40 : 50,
                  height: width < 350 ? 40 : 50,
                  marginRight: width < 350 ? 12 : 16,
                  resizeMode: "contain",
                  tintColor: moodColor
                }}
              />
              
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                  <Text style={{
                    fontFamily: "LeagueSpartan-Bold",
                    fontSize: width < 350 ? 26 : 32,
                    fontWeight: "600",
                    color: moodColor,
                    marginRight: 8
                  }}>
                    {entry.mood}
                  </Text>
                  <Text style={{
                    fontFamily: "LaoSansPro-Regular",
                    fontSize: width < 350 ? 12 : 14,
                    color: theme.text
                  }}>
                    {entry.time}
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Emotion Section - Always shown */}
            <View style={{
              marginBottom: 16,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: `${theme.dimmedText}20`
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons 
                  name="heart-outline" 
                  size={iconSize} 
                  color={moodColor} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={{
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: width < 350 ? 14 : 16,
                  color: theme.text
                }}>
                  Emotion
                </Text>
              </View>
              
              {entry.emotion ? (
                <Text style={{
                  fontFamily: "LeagueSpartan",
                  fontSize: width < 350 ? 16 : 18,
                  color: theme.text,
                  paddingLeft: iconSize + 8
                }}>
                  Feeling <Text style={{ color: moodColor, fontFamily: "LeagueSpartan-Bold" }}>{entry.emotion}</Text>
                </Text>
              ) : (
                <Text style={{
                  fontFamily: "LeagueSpartan",
                  fontSize: width < 350 ? 16 : 18,
                  color: theme.dimmedText,
                  fontStyle: "italic",
                  paddingLeft: iconSize + 8
                }}>
                  No emotion recorded
                </Text>
              )}
            </View>
            
            {/* Journal Section - Always shown */}
            <View style={{
              marginBottom: 16
            }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Ionicons 
                  name="journal-outline" 
                  size={iconSize} 
                  color={moodColor} 
                  style={{ marginRight: 8 }} 
                />
                <Text style={{
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: width < 350 ? 14 : 16,
                  color: theme.text
                }}>
                  Journal Entry
                </Text>
              </View>
              
              {entry.journal && entry.journal.trim() ? (
                <View style={{
                  padding: 12,
                  backgroundColor: `${theme.dimmedText}10`,
                  borderRadius: 12
                }}>
                  <Text style={{
                    color: theme.text,
                    fontFamily: "LeagueSpartan",
                    fontSize: width < 350 ? 14 : 16,
                    lineHeight: width < 350 ? 20 : 24
                  }}>
                    {entry.journal}
                  </Text>
                </View>
              ) : (
                <Text style={{
                  fontFamily: "LeagueSpartan",
                  fontSize: width < 350 ? 16 : 18,
                  color: theme.dimmedText,
                  fontStyle: "italic",
                  paddingLeft: iconSize + 8
                }}>
                  No journal entry
                </Text>
              )}
            </View>
            
            {/* Actions */}
            <View style={{
              marginTop: 8,
              flexDirection: "row",
              justifyContent: "center"
            }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  paddingHorizontal: 28,
                  paddingVertical: 12,
                  borderRadius: 100,
                  backgroundColor: moodColor
                }}
              >
                <Text style={{
                  color: theme.calendarBg,
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: 16
                }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarMoodModal;
    