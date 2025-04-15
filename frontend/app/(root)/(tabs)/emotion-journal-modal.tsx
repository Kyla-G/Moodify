import React from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

interface EmotionJournalModalProps {
  visible: boolean;
  onBack: () => void;
  selectedEmotion: string | null;
  setSelectedEmotion: React.Dispatch<React.SetStateAction<string | null>>;
  journalEntry: string;
  setJournalEntry: React.Dispatch<React.SetStateAction<string>>;
  onContinue: () => void;
}

const EmotionJournalModal: React.FC<EmotionJournalModalProps> = ({
  visible,
  onBack,
  selectedEmotion,
  setSelectedEmotion,
  journalEntry,
  setJournalEntry,
  onContinue,
}) => {
  const { width, height } = useWindowDimensions();
  const modalPadding = width < 350 ? 12 : 24;
  const iconSize = width < 350 ? 22 : 28;

  const emotions = [
    { name: "energetic", color: "#FF6B35" },
    { name: "excited", color: "#FF6B35" },
    { name: "confident", color: "#FF6B35" },
    { name: "happy", color: "#31AC54" },
    { name: "calm", color: "#31AC54" },
    { name: "grateful", color: "#31AC54" },
    { name: "hopeful", color: "#31AC54" },
    { name: "bored", color: "#828282" },
    { name: "nervous", color: "#828282" },
    { name: "confused", color: "#828282" },
    { name: "anxious", color: "#828282" },
    { name: "sad", color: "#507EE3" },
    { name: "fearful", color: "#507EE3" },
    { name: "stressed", color: "#507EE3" },
    { name: "irritated", color: "#C22222" },
    { name: "angry", color: "#C22222" },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView edges={['top', 'left', 'right', 'bottom']} className="flex-1 bg-bg-black">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            className="flex-1 bg-bg-black py-10"
            contentContainerStyle={{
              paddingHorizontal: modalPadding,
              paddingTop: height * 0.05,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="items-center w-full relative">
              <TouchableOpacity
                onPress={onBack}
                style={{
                  position: 'absolute',
                  top: height * -0.045,
                  left: width * -0.016,
                  zIndex: 10
                }}
                className="p-2"
              >
                <Ionicons name="arrow-back" size={iconSize} color="#EEEED0" />
              </TouchableOpacity>

              <Text
                className="text-txt-light font-LeagueSpartan-Bold mt-6 mb-10 text-center"
                style={{ fontSize: width < 350 ? 24 : 30 }}
              >
                Which emotion describes you're feeling now?
              </Text>

              <View className="flex-row flex-wrap justify-between w-full gap-2 mb-8">
                {emotions.map((emotion) => (
                  <TouchableOpacity
                    key={emotion.name}
                    style={{
                      backgroundColor: emotion.color,
                      padding: width < 350 ? 12 : 16,
                      borderRadius: 16,
                      width: "48%",
                      alignItems: "center",
                      borderWidth: selectedEmotion === emotion.name ? 2 : 0,
                      borderColor: "#EEEED0",
                      marginBottom: 8,
                    }}
                    onPress={() => setSelectedEmotion(emotion.name)}
                  >
                    <Text
                      style={{
                        color: "#EEEED0",
                        fontSize: width < 350 ? 16 : 20,
                        fontFamily: "LeagueSpartan-Bold",
                      }}
                    >
                      {emotion.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                className="bg-[#202020] text-txt-light p-5 rounded-2xl w-full min-h-[180px]"
                style={{
                  fontSize: width < 350 ? 16 : 18,
                  fontFamily: "LeagueSpartan-Regular"
                }}
                placeholder="Add notes here..."
                placeholderTextColor="#888"
                multiline
                value={journalEntry}
                onChangeText={setJournalEntry}
              />

              <View className="w-full items-end mt-8">
                <TouchableOpacity
                  onPress={onContinue}
                  disabled={!selectedEmotion}
                  className={`bg-[#EEEED0] p-4 rounded-full ${!selectedEmotion ? "opacity-50" : ""}`}
                >
                  <Ionicons name="arrow-forward" size={iconSize} color="#272528" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default EmotionJournalModal;