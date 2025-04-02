import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from "date-fns";
import icons from "@/constants/icons";

interface MoodSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  onSelectMood: (mood: string) => void;
  isDatePickerVisible: boolean;
  setDatePickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isTimePickerVisible: boolean;
  setTimePickerVisible: React.Dispatch<React.SetStateAction<boolean>>; 
}

const moodIcons: Record<"rad" | "good" | "meh" | "bad" | "awful", any> = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

const [mood, setMood] = useState<"rad" | "good" | "meh" | "bad" | "awful">("good");

// Hours and minutes for the time picker
const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const periods = ["AM", "PM"];

// Weekday names
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MoodSelectionModal: React.FC<MoodSelectionModalProps> = ({
  visible,
  onClose,
  selectedDate,
  setSelectedDate,
  onSelectMood,
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;
  const iconSize = width < 350 ? 22 : 28;
  
  // State for managing picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // States for custom calendar
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date | null; isCurrentMonth: boolean }>>([]);
  
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
  const handleDateSelect = (date: Date) => {
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
  const isDateEqual = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if a date is today
  const isToday = (date: Date) => {
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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView edges={["top", "left", "right", "bottom"]} className="flex-1 bg-bg-black">
        <View
          className="flex-1 justify-center items-center relative"
          style={{
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
            <Ionicons name="close" size={iconSize} color="#EEEED0" />
          </TouchableOpacity>

          {/* Date & Time Selection */}
          <View className="flex-row justify-between w-full mb-6">
            {/* Date Picker Button */}
            <TouchableOpacity
              onPress={() => {
                setShowDatePicker(true);
                setShowTimePicker(false);
                setCurrentMonth(new Date(selectedDate));
              }}
              className="bg-bg-light flex-1 mr-4 rounded-xl p-2 flex-row items-center justify-center"
            >
              <Ionicons name="calendar-outline" size={iconSize} color="#272528" style={{ marginRight: 8 }} />
              <Text className="text-txt-dark font-LeagueSpartan-Bold">{format(selectedDate, "MMMM dd, yyyy")}</Text>
            </TouchableOpacity>

            {/* Time Picker Button */}
            <TouchableOpacity
              onPress={() => {
                setShowTimePicker(true);
                setShowDatePicker(false);
              }}
              className="bg-bg-light flex-1 ml-4 rounded-xl p-2 flex-row items-center justify-center"
            >
              <Ionicons name="time-outline" size={iconSize} color="#272528" style={{ marginRight: 8 }} />
              <Text className="text-txt-dark font-LeagueSpartan-Bold">{format(selectedDate, "h:mm a")}</Text>
            </TouchableOpacity>
          </View>

          {/* Custom Calendar View */}
          {showDatePicker && (
            <View className="w-full bg-bg-light rounded-xl p-4 mb-6">
              {/* Month Navigation */}
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={handlePrevMonth}>
                  <Ionicons name="chevron-back" size={iconSize} color="#272528" />
                </TouchableOpacity>
                <Text className="text-txt-dark font-LeagueSpartan-Bold text-lg">
                  {format(currentMonth, "MMMM yyyy")}
                </Text>
                <TouchableOpacity onPress={handleNextMonth}>
                  <Ionicons name="chevron-forward" size={iconSize} color="#272528" />
                </TouchableOpacity>
              </View>
              
              {/* Weekday headers */}
              <View className="flex-row justify-between mb-2">
                {weekDays.map((day) => (
                  <Text 
                    key={day} 
                    className="text-txt-dark font-LeagueSpartan-Bold text-center"
                    style={{ width: `${100/7}%` }}
                  >
                    {day}
                  </Text>
                ))}
              </View>
              
              {/* Calendar grid */}
              <View className="flex-row flex-wrap">
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
                      className={`flex-1 justify-center items-center m-1 rounded-full ${
                        item.date && isDateEqual(item.date, selectedDate) 
                          ? 'bg-bg-orange' 
                          : item.date && isToday(item.date)
                            ? 'bg-bg-light'
                            : ''
                      }`}
                    >
                      {item.date && (
                        <Text 
                          className={`${
                            isDateEqual(item.date, selectedDate) 
                              ? 'font-LeagueSpartan-Bold' 
                              : isToday(item.date)
                                ? 'text-txt-dark font-LeagueSpartan-Bold'
                                : 'text-txt-dark'
                          } font-LeagueSpartan`}
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
            <View className="w-full bg-bg-light rounded-xl p-4 mb-6">
              <View className="flex-row justify-between">
                <View className="flex-1 mr-2">
                  <Text className="text-txt-dark text-center mb-2 font-LeagueSpartan-Bold">Hour</Text>
                  <View className="h-32 bg-bg-light rounded-lg">
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-2 pb-12">
                      {hours.map((hour) => (
                        <TouchableOpacity
                          key={`hour-${hour}`}
                          className={`py-2 ${selectedHour === hour ? 'bg-bg-orange' : ''}`}
                          onPress={() => setSelectedHour(hour)}
                        >
                          <Text className={`text-center text-txt-dark font-LeagueSpartan ${selectedHour === hour ? 'font-LeagueSpartan-Bold' : ''}`}>
                            {String(hour).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                
                <View className="flex-1 mx-2">
                  <Text className="text-txt-dark text-center mb-2 font-LeagueSpartan-Bold">Minute</Text>
                  <View className="h-32 bg-bg-light rounded-lg">
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 pt-2 pb-12">
                      {minutes.map((minute) => (
                        <TouchableOpacity
                          key={`minute-${minute}`}
                          className={`py-2 ${selectedMinute === minute ? 'bg-bg-orange' : ''}`}
                          onPress={() => setSelectedMinute(minute)}
                        >
                          <Text className={`text-center text-txt-dark font-LeagueSpartan ${selectedMinute === minute ? 'font-LeagueSpartan-Bold' : ''}`}>
                            {String(minute).padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                </View>
                
                <View className="flex-1 ml-2">
                  <Text className="text-txt-dark text-center mb-2 font-LeagueSpartan-Bold">AM/PM</Text>
                  <View className="h-32 bg-bg-light rounded-lg justify-center">
                    {periods.map((period) => (
                      <TouchableOpacity
                        key={`period-${period}`}
                        className={`py-4 ${selectedPeriod === period ? 'bg-bg-orange' : ''}`}
                        onPress={() => setSelectedPeriod(period)}
                      >
                        <Text className={`text-center text-txt-dark font-LeagueSpartan ${selectedPeriod === period ? 'font-LeagueSpartan-Bold' : ''}`}>
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={handleTimeConfirm}
                className="bg-bg-orange mt-4 p-3 rounded-lg"
              >
                <Text className="text-txt-dark text-center font-LeagueSpartan-Bold">Confirm Time</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Mood Selection Title (hide when pickers are visible) */}
          {!showDatePicker && !showTimePicker && (
            <>
              <Text className="text-txt-light font-LeagueSpartan-Bold mb-5 text-center" style={{ fontSize: width < 350 ? 24 : 30 }}>
                How's your mood right now?
              </Text>

              {/* Mood Selection Buttons */}
              <View className="flex-row flex-wrap justify-between w-full mb-6">
                {Object.keys(moodIcons).map((mood) => (
                  <TouchableOpacity
                    key={mood}
                    className="items-center p-4 rounded-lg"
                    style={{ width: "20%" }}
                    onPress={() => onSelectMood(mood)}
                  >
                    <Image 
                      source={moodIcons[mood as keyof typeof moodIcons]}
                      style={{
                        width: width < 350 ? 32 : 40,
                        height: width < 350 ? 32 : 40,
                        marginBottom: 8,
                      }}
                    />
                    <Text className="text-txt-light text-center" style={{ fontSize: width < 350 ? 12 : 14 }}>
                      {mood}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default MoodSelectionModal;