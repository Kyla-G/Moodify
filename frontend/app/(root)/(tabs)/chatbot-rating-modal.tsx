import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ChatbotRatingModalProps {
  onSubmit: (rating: number, feedback: string) => void;
}

const ChatbotRatingModal: React.FC<ChatbotRatingModalProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const handleRatingSelect = (value: number) => {
    setRating(value);
    setError("");
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please rate before submitting.");
      return;
    }
    onSubmit(rating, feedback);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              How was your chat with Moodi?
            </Text>
            
            <Text style={styles.subtitle}>
              Your feedback helps us improve!
            </Text>

            {/* Stars */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingSelect(star)}
                >
                  <Ionicons
                    name={rating !== 0 && star <= rating ? "star" : "star-outline"}
                    size={40}
                    color={rating !== 0 && star <= rating ? "#FF6B35" : "#555"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            {/* Feedback */}
            <Text style={styles.feedbackLabel}>
              Additional feedback (optional):
            </Text>
            <TextInput
              style={styles.feedbackInput}
              multiline 
              numberOfLines={4}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="What did you like or dislike about this conversation?"
              placeholderTextColor="#888"
              textAlignVertical="top"
            />

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                rating === 0 && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.submitButtonText}>Submit & Save Session</Text>
            </TouchableOpacity>
            
            <View style={styles.feedbackNote}>
              <Ionicons name="information-circle-outline" size={16} color="#888" />
              <Text style={styles.noteText}>
                Your feedback and chat history will be saved for future reference
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#282828',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'LeagueSpartan-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#EEEED0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'LeagueSpartan',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 10,
  },
  errorText: {
    color: '#FF6B35',
    fontFamily: 'LeagueSpartan',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  feedbackLabel: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    color: '#EEEED0',
    fontSize: 16,
    fontFamily: 'LeagueSpartan',
  },
  feedbackInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 12,
    color: '#EEEED0',
    backgroundColor: '#1E1E1E',
    textAlignVertical: 'top',
    marginBottom: 20,
    fontFamily: 'LeagueSpartan',
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#EEEED0',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'LeagueSpartan-Bold',
  },
  feedbackNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
    fontFamily: 'LeagueSpartan',
  },
});

export default ChatbotRatingModal;