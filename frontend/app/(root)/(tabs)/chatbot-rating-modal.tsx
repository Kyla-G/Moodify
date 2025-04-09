import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard,TouchableWithoutFeedback } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ChatbotRatingModalProps {
  onSubmit: (rating: number, feedback: string) => void;
}

const ChatbotRatingModal: React.FC<ChatbotRatingModalProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (rating === null) {
      setError("Please rate before submitting.");
      return;
    }
    onSubmit(rating, feedback);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-black/50 justify-center px-4">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-[#1E1E1E] rounded-2xl px-6 py-8 w-full max-w-[90%]">
            <Text className="text-txt-orange font-LeagueSpartan-Bold text-3xl font-bold mb-6 text-center">
              Rate your conversation
            </Text>
            <Text className="text-txt-light font-LeagueSpartan text-xl mb-3 text-center">
              How was your experience with Moodi?
            </Text>

            {/* Stars */}
            <View className="flex-row justify-center mb-4 space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => {
                    setRating(star);
                    setError("");
                  }}
                >
                  <Ionicons
                    name={rating !== null && star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={rating !== null && star <= rating ? "#FF6B35" : "#555"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {error ? (
              <Text className="text-txt-orange font-LeagueSpartan mb-2 text-xl text-center">
                {error}
              </Text>
            ) : null}

            {/* Feedback */}
            <View className="w-full mb-5">
              <Text className="text-txt-light font-LeagueSpartan text-lg mb-1">
                Share your feedback (Optional)
              </Text>
              <TextInput
                className="border border-[#555] rounded-xl px-4 py-2 font-LeagueSpartan text-txt-light text-lg bg-[#2D2D2D] h-24 text-base"
                multiline
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Tell us about your experience..."
                placeholderTextColor="#888"
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              className="bg-[#FF6B35] rounded-2xl py-3 w-full items-center"
              onPress={handleSubmit}
            >
              <Text className="text-txt-darkgray font-LeagueSpartan-Bold text-xl">Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatbotRatingModal;