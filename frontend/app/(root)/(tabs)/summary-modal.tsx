import React from "react";
import { View, Text, TouchableOpacity, Modal, Image, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format } from "date-fns";
import images from "@/constants/images";

interface SummaryModalProps {
  visible: boolean;
  onClose: () => void;
  selectedMood: string | null;
  selectedEmotion: string | null;
  selectedDate: Date;
  onSaveEntry: () => void;
  onChatbot: () => void;
  moodColors: Record<string, string>;
  width: number;
  height: number;
}

const SummaryModal: React.FC<SummaryModalProps> = ({
  visible,
  onClose,
  selectedMood,
  selectedEmotion,
  selectedDate,
  onSaveEntry,
  onChatbot,
  moodColors,
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{
          backgroundColor: selectedMood ? moodColors[selectedMood] : "#333",
          paddingVertical: modalPadding,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 items-center justify-center">
          <View
            className="items-center justify-center"
            style={{ padding: modalPadding }}
          >
            <Text
              className="text-white font-LeagueSpartan text-center mb-2"
              style={{ fontSize: width < 350 ? 28 : 36 }}
            >
              You're feeling
            </Text>

            <Text
              className="text-txt-light font-LeagueSpartan-Bold text-center mb-10"
              style={{ fontSize: width < 350 ? 20 : 48 }}
            >
              {selectedMood} and {selectedEmotion}
            </Text>

            <View className="flex-row items-center justify-center mb-10">
              <View className="flex-row items-center mr-4">
                <Ionicons name="calendar-outline" size={width < 350 ? 18 : 24} color="white" style={{ marginRight: 8 }} />
                <Text
                  className="text-white font-LeagueSpartan text-center"
                  style={{ fontSize: width < 350 ? 16 : 20 }}
                >
                  {format(selectedDate, "MMMM dd, yyyy")}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={width < 350 ? 18 : 24} color="white" style={{ marginRight: 8 }} />
                <Text
                  className="text-white font-LeagueSpartan text-center"
                  style={{ fontSize: width < 350 ? 16 : 20 }}
                >
                  {format(selectedDate, "h:mm a")}
                </Text>
              </View>
            </View>
          </View>

          {/* Chatbot Section */}
          <View style={{ padding: modalPadding, width: '100%', alignItems: 'flex-start' }}>
            <Text
              className="text-white font-LeagueSpartan-Bold mb-6"
              style={{ fontSize: width < 350 ? 20 : 24 }}
            >
              Would you like to talk about it more?
            </Text>

            <View className="items-start">
              <TouchableOpacity
                onPress={onChatbot}
                className="px-6 py-3 rounded-full items-center mb-2"
                style={{
                  backgroundColor: "#EEEED0"
                }}
              >
                <Text
                  className="font-LeagueSpartan-Bold text-txt-darkblue text-2xl"
                  style={{ color: selectedMood ? moodColors[selectedMood] : "#333" }}
                >
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSaveEntry}
                className="px-6 py-3 rounded-full items-center mb-2"
                style={{
                  backgroundColor: "#EEEED0"
                }}
              >
                <Text
                  className="font-LeagueSpartan text-2xl"
                  style={{ color: selectedMood ? moodColors[selectedMood] : "#333" }}
                >
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Image
            source={images.moodichat}
            style={{
              width: width * 1,
              height: width * 1,
              position: 'absolute',
              bottom: -130,
              left: 85,
              resizeMode: 'contain'
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default SummaryModal;