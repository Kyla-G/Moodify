import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from "date-fns";
import icons from "@/constants/icons";

// Remove the incorrectly placed useState hook
// const [mood, setMood] = useState<"rad" | "good" | "meh" | "bad" | "awful">("good");

// Hours and minutes for the time picker
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const periods = ["AM", "PM"];

// Weekday names
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

// Map mood types to theme color properties
const moodToThemeMap = {
  "rad": "buttonBg",
  "good": "accent1",
  "meh": "accent2",
  "bad": "accent3",
  "awful": "accent4"
};

const MoodSelectionModal = ({
  visible,
  onClose,
  selectedDate,
  setSelectedDate,
  onSelectMood,
  isDatePickerVisible,
  setDatePickerVisible,
  isTimePickerVisible,
  setTimePickerVisible,
  theme
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;
  const iconSize = width < 350 ? 22 : 28;
  
  // State for managing picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // States for custom calendar
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Get current values for time picker
  const currentHour = selectedDate.getHours();
  const displayHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
  const currentMinute = selectedDate.getMinutes();
  const currentPeriod = currentHour >= 12 ? "PM" : "AM";
  
  // State for time picker values
  const [selectedHour, setSelectedHour] = useState(displayHour);
  const [selectedMinute, setSelectedMinute] = useState(currentMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);

  // Generate calendar days for the current month
  useEffect(() => {
    const daysArray = [];
    const daysInMonth = getDaysInMonth(currentMonth);
    const monthStart = startOfMonth(currentMonth);
    const startDay = getDay(monthStart); // 0 for Sunday, 1 for Monday, etc.

    // Add empty days for the start of the calendar
    for (let i = 0; i < startDay; i++) {
      daysArray.push({ date: null, isCurrentMonth: false });
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      daysArray.push({ date, isCurrentMonth: true });
    }

    // Add empty days to complete the grid (if needed)
    const remainingDays = 7 - (daysArray.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        daysArray.push({ date: null, isCurrentMonth: false });
      }
    }

    setCalendarDays(daysArray);
  }, [currentMonth]);

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    if (date) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setSelectedDate(newDate);
      setShowDatePicker(false);
    }
  };

  // Handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    // Prevent going to future months
    if (nextMonth <= new Date()) {
      setCurrentMonth(nextMonth);
    }
  };

  // Check if a date is equal to the selected date (only comparing year, month, day)
  const isDateEqual = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return isDateEqual(date, today);
  };

  // Apply time selection
  const handleTimeConfirm = () => {
    const newDate = new Date(selectedDate);
    let hours = selectedHour;
    
    // Convert to 24-hour format
    if (selectedPeriod === "PM" && selectedHour < 12) {
      hours += 12;
    } else if (selectedPeriod === "AM" && selectedHour === 12) {
      hours = 0;
    }
    
    newDate.setHours(hours, selectedMinute, 0, 0);
    setSelectedDate(newDate);
    setShowTimePicker(false);
  };

  // Get mood color from theme
  const getMoodThemeColor = (mood) => {
    if (!mood) return theme.calendarBg;
    
    // Convert "rad" to "Rad" if needed for mapping
    const normalizedMood = mood.toLowerCase();
    const themeProperty = moodToThemeMap[normalizedMood];
    
    if (themeProperty && theme[themeProperty]) {
      return theme[themeProperty];
    }
    
    return theme.text; // Fallback
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={{ flex: 1, backgroundColor: theme.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            paddingHorizontal: modalPadding,
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: "absolute",
              top: height * 0.05,
              left: width * 0.05,
              zIndex: 10,
            }}
          >
            <Ionicons name="close" size={iconSize} color={theme.text} />
          </TouchableOpacity>

          {/* Date & Time Selection */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: 24
          }}>
            {/* Date Picker Button */}
            <TouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
                setShowTimePicker(false);
                setCurrentMonth(new Date(selectedDate));
              }}
              style={{
                backgroundColor: theme.calendarBg,
                flex: 1,
                marginRight: 16,
                borderRadius: 12,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicons name="calendar-outline" size={iconSize} color={theme.text} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.text, fontFamily: "LeagueSpartan-Bold" }}>{format(selectedDate, "MMMM dd, yyyy")}</Text>
            </TouchableOpacity>

            {/* Time Picker Button */}
            <TouchableOpacity
              onPress={() => {
                setShowTimePicker(true);
                setShowDatePicker(false);
              }}
              style={{
                backgroundColor: theme.calendarBg,
                flex: 1,
                marginLeft: 16,
                borderRadius: 12,
                padding: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicons name="time-outline" size={iconSize} color={theme.text} style={{ marginRight: 8 }} />
              <Text style={{ color: theme.text, fontFamily: "LeagueSpartan-Bold" }}>{format(selectedDate, "h:mm a")}</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Calendar View */}
          {showDatePicker && (
            <View style={{
              width: "100%",
              backgroundColor: theme.calendarBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24
            }}>
              {/* Month Navigation */}
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
              }}>
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Ionicons name="chevron-back" size={iconSize} color={theme.text} />
                </TouchableOpacity>
                <Text style={{
                  color: theme.text,
                  fontFamily: "LeagueSpartan-Bold",
                  fontSize: 18
                }}>
                  {format(currentMonth, "MMMM yyyy")}
                </Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <Ionicons name="chevron-forward" size={iconSize} color={theme.text} />
                </TouchableOpacity>
              </View>
              
              {/* Weekday headers */}
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8
              }}>
                {weekDays.map((day) => (
                  <Text 
                    key={day} 
                    style={{
                      color: theme.text,
                      fontFamily: "LeagueSpartan-Bold",
                      textAlign: "center",
                      width: `${100/7}%`
                    }}
                  >
                    {day}
                  </Text>
                ))}
              </View>
              
              {/* Calendar grid */}
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap"
              }}>
                {calendarDays.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ 
                      width: `${100/7}%`, 
                      aspectRatio: 1,
                      opacity: item.date ? 1 : 0 
                    }}
                    disabled={!item.date || (item.date && item.date > new Date())}
                    onPress={() => item.date && handleDateSelect(item.date)}
                  >
                    <View 
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 4,
                        borderRadius: 100,
                        backgroundColor: item.date && isDateEqual(item.date, selectedDate) 
                          ? theme.buttonBg
                          : item.date && isToday(item.date)
                            ? `${theme.buttonBg}30`
                            : 'transparent'
                      }}
                    >
                      {item.date && (
                        <Text 
                          style={{
                            color: item.date && isDateEqual(item.date, selectedDate)
                              ? theme.calendarBg
                              : theme.text,
                            fontFamily: (isDateEqual(item.date, selectedDate) || isToday(item.date))
                              ? "LeagueSpartan-Bold"
                              : "LeagueSpartan"
                          }}
                        >
                          {item.date.getDate()}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Custom Time Picker */}
          {showTimePicker && (
            <View style={{
              width: "100%",
              backgroundColor: theme.calendarBg,
              borderRadius: 12,
              padding: 16,
              marginBottom: 24
            }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{
                    color: theme.text,
                    textAlign: "center",
                    marginBottom: 8,
                    fontFamily: "LeagueSpartan-Bold"
                  }}>Hour</Text>
                  <View style={{
                    height: 128,
                    backgroundColor: theme.calendarBg,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: `${theme.text}20`
                  }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 8, paddingBottom: 48 }}>
                      {hours.map((hour) => (
                        <TouchableOpacity
                          key={`hour-${hour}`}
                          style={{
                            padding: 8,
                            backgroundColor: selectedHour === hour ? theme.buttonBg : 'transparent'
                          }}
                          onPress={() => setSelectedHour(hour)}
                        >
                          <Text style={{
                            textAlign: "center",
                            color: selectedHour === hour ? theme.calendarBg : theme.text,
                            fontFamily: selectedHour === hour ? "LeagueSpartan-Bold" : "LeagueSpartan"
                          }}>
                            {String(hour).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Text style={{
                    color: theme.text,
                    textAlign: "center",
                    marginBottom: 8,
                    fontFamily: "LeagueSpartan-Bold"
                  }}>Minute</Text>
                  <View style={{
                    height: 128,
                    backgroundColor: theme.calendarBg,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: `${theme.text}20`
                  }}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 8, paddingBottom: 48 }}>
                      {minutes.map((minute) => (
                        <TouchableOpacity
                          key={`minute-${minute}`}
                          style={{
                            padding: 8,
                            backgroundColor: selectedMinute === minute ? theme.buttonBg : 'transparent'
                          }}
                          onPress={() => setSelectedMinute(minute)}
                        >
                          <Text style={{
                            textAlign: "center",
                            color: selectedMinute === minute ? theme.calendarBg : theme.text,
                            fontFamily: selectedMinute === minute ? "LeagueSpartan-Bold" : "LeagueSpartan"
                          }}>
                            {String(minute).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{
                    color: theme.text,
                    textAlign: "center",
                    marginBottom: 8,
                    fontFamily: "LeagueSpartan-Bold"
                  }}>AM/PM</Text>
                  <View style={{
                    height: 128,
                    backgroundColor: theme.calendarBg,
                    borderRadius: 8,
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: `${theme.text}20`
                  }}>
                    {periods.map((period) => (
                      <TouchableOpacity
                        key={`period-${period}`}
                        style={{
                          padding: 16,
                          backgroundColor: selectedPeriod === period ? theme.buttonBg : 'transparent'
                        }}
                        onPress={() => setSelectedPeriod(period)}
                      >
                        <Text style={{
                          textAlign: "center",
                          color: selectedPeriod === period ? theme.calendarBg : theme.text,
                          fontFamily: selectedPeriod === period ? "LeagueSpartan-Bold" : "LeagueSpartan"
                        }}>
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={handleTimeConfirm}
                style={{
                  backgroundColor: theme.buttonBg,
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 8
                }}
              >
                <Text style={{
                  color: theme.calendarBg,
                  textAlign: "center",
                  fontFamily: "LeagueSpartan-Bold"
                }}>Confirm Time</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Mood Selection Title (hide when pickers are visible) */}
          {!showDatePicker && !showTimePicker && (
            <>
              <Text style={{ 
                color: theme.text,
                fontFamily: "LeagueSpartan-Bold",
                marginBottom: 20,
                textAlign: "center",
                fontSize: width < 350 ? 24 : 30
              }}>
                How's your mood right now?
              </Text>

              {/* Mood Selection Buttons */}
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "100%",
                marginBottom: 24
              }}>
                {Object.keys(moodIcons).map((mood) => {
                  const moodColor = getMoodThemeColor(mood);
                  
                  return (
                    <TouchableOpacity
                      key={mood}
                      style={{
                        alignItems: "center",
                        padding: 16,
                        borderRadius: 8,
                        width: "20%"
                      }}
                      onPress={() => onSelectMood(mood)}
                    >
                      <Image 
                        source={moodIcons[mood]}
                        style={{
                          width: width < 350 ? 32 : 40,
                          height: width < 350 ? 32 : 40,
                          marginBottom: 8,
                          tintColor: moodColor
                        }}
                      />
                      <Text style={{
                        color: theme.text,
                        textAlign: "center",
                        fontSize: width < 350 ? 12 : 14
                      }}>
                        {mood}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MoodSelectionModal;