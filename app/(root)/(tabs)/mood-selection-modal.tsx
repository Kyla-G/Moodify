import React from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

const moodIcons = {
  rad: icons.MoodRad,
  good: icons.MoodGood,
  meh: icons.MoodMeh,
  bad: icons.MoodBad,
  awful: icons.MoodAwful,
};

const MoodSelectionModal: React.FC<MoodSelectionModalProps> = ({
  visible,
  onClose,
  selectedDate,
  setSelectedDate,
  onSelectMood,
  isDatePickerVisible,
  setDatePickerVisible,
  isTimePickerVisible,
  setTimePickerVisible,
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;
  const iconSize = width < 350 ? 22 : 28;

  // ✅ Handles date selection
  const handleDateConfirm = (date: Date) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()); // Updates only date
    setSelectedDate(newDate);
    setDatePickerVisible(false); // Closes picker after selection
  };

  // ✅ Handles time selection
  const handleTimeConfirm = (time: Date) => {
    setSelectedDate((prevDate) => 
      new Date(prevDate.setHours(time.getHours(), time.getMinutes(), 0, 0))
    );
    setTimePickerVisible(false);
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
              onPress={() => setDatePickerVisible(true)}
              className="bg-bg-medium flex-1 mr-4 rounded-xl p-2 flex-row items-center justify-center"
            >
              <Ionicons name="calendar-outline" size={iconSize} color="#272528" style={{ marginRight: 8 }} />
              <Text className="text-txt-dark font-LeagueSpartan">{format(selectedDate, "MMMM dd, yyyy")}</Text>
            </TouchableOpacity>

            {/* Time Picker Button */}
            <TouchableOpacity
              onPress={() => setTimePickerVisible(true)}
              className="bg-bg-medium flex-1 ml-4 rounded-xl p-2 flex-row items-center justify-center"
            >
              <Ionicons name="time-outline" size={iconSize} color="#272528" style={{ marginRight: 8 }} />
              <Text className="text-txt-dark font-LeagueSpartan">{format(selectedDate, "h:mm a")}</Text>
            </TouchableOpacity>
          </View>

          {/* Mood Selection Title */}
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
                  source={moodIcons[mood]}
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
        </View>

        {/* ✅ Date Picker (Calendar View) */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"} // Calendar for Android, Inline for iOS
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
          date={selectedDate}
          maximumDate={new Date()} // Restricts future dates
        />

        {/* ✅ Time Picker (Spinner View) */}
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          display="spinner" // Scrollable time picker for both iOS & Android
          onConfirm={handleTimeConfirm}
          onCancel={() => setTimePickerVisible(false)}
          date={selectedDate}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default MoodSelectionModal;