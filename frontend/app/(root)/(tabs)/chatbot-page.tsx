import { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Image, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import images from "@/constants/images";
import { useWindowDimensions } from "react-native";
import ChatbotRatingModal from "./chatbot-rating-modal"; // Import the rating modal component
import EndChatModal from "./end-chat-modal"; // Import the end chat confirmation modal

const { height, width } = Dimensions.get("window");

// Define the structure of the API response
interface Message {
  role?: 'system' | 'user' | 'assistant';
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date; // Add timestamp property
}

interface APIResponse {
  choices?: { message: { content: string } }[];
  error?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?",
      sender: "bot",
      role: "assistant",
      timestamp: new Date() // Initialize with current timestamp
    }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [endChatModalVisible, setEndChatModalVisible] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Format timestamp to show time (AM/PM) and date (day, month in 3 letters)
  const formatTimestamp = (timestamp: Date): string => {
    const hours = timestamp.getHours();
    const minutes = timestamp.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const day = timestamp.getDate();
    // Get month as 3-letter abbreviation (Jan, Feb, Mar, etc.)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[timestamp.getMonth()];
    const year = timestamp.getFullYear();

    return `${formattedHours}:${formattedMinutes} ${ampm} • ${day} ${month} ${year}`;
  };

  const sendMessage = async () => {
    if (input.trim() === "" || chatEnded) return;

    // Add user message to chat with current timestamp
    const userMessage: Message = {
      text: input,
      sender: "user",
      role: "user",
      timestamp: new Date() // Add current timestamp
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setInput("");

    try {
      // Prepare messages for API call, converting to the format required by the API
      const apiMessages = updatedMessages
        .filter(msg => msg.role !== undefined)
        .map(msg => ({
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          content: msg.text
        }));

      // Prepend system message
      const systemMessage = {
        role: 'system',
        content: 'You are Moodi, an empathetic, warm, and understanding AI friend who listens and responds with genuine care and warmth. Maintain a warm, inviting tone at all times, but try not to ask too much questions after every prompt. You aim to be conversational, and natural, avoiding lengthy or overly formal responses. Focus on clean, brief, and relevant answers while maintaining an empathetic, friendly tone. Avoid flowery language, overly long explanations, and unnecessary details. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you do not know the answer to a question, please do not share false information. You also recognize that while you have potential for mental health support, you cannot replace professional therapists.'
      };

      const response = await fetch('https://router.huggingface.co/novita/v3/openai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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', // Hugging Face API token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            systemMessage,
            ...apiMessages
          ],
          max_tokens: 300, // Shorter responses
          temperature: 0.7, // Balanced creativity
          top_p: 0.9, // Balanced diversity
          model: 'meta-llama/llama-3.3-70b-instruct',
        }),
      });

      const data: APIResponse = await response.json();
      setIsLoading(false);

      if (data.error) {
        // Handle API error
        const errorMessage: Message = {
          text: 'Sorry, there was an error processing your message.',
          sender: "bot",
          role: "assistant",
          timestamp: new Date() // Add current timestamp
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        // Add bot response to chat with current timestamp
        const botMessage: Message = {
          text: data.choices[0].message.content || 'No response received.',
          sender: "bot",
          role: "assistant",
          timestamp: new Date() // Add current timestamp
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        // Handle unexpected response format
        const unexpectedMessage: Message = {
          text: 'Unexpected response from the AI.',
          sender: "bot",
          role: "assistant",
          timestamp: new Date() // Add current timestamp
        };
        setMessages((prevMessages) => [...prevMessages, unexpectedMessage]);
      }
    } catch (error) {
      setIsLoading(false);
      // Handle network or other errors
      const errorMessage: Message = {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "bot",
        role: "assistant",
        timestamp: new Date() // Add current timestamp
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  // Function to handle END button press
  const handleEndChat = () => {
    setEndChatModalVisible(true);
  };

  // Function to handle confirmation of ending chat
  const handleConfirmEndChat = () => {
    setEndChatModalVisible(false);
    setChatEnded(true);

    // Add farewell message from the bot with current timestamp
    const farewellMessage: Message = {
      text: "Thank you for chatting with me! I'm always here whenever you need someone to talk to. Take care!",
      sender: "bot",
      role: "assistant",
      timestamp: new Date() // Add current timestamp
    };

    setMessages((prevMessages) => [...prevMessages, farewellMessage]);

    // Show rating modal after the farewell message
    setTimeout(() => {
      setRatingModalVisible(true);
    }, 1000);
  };

  // Function to handle cancellation of ending chat
  const handleCancelEndChat = () => {
    setEndChatModalVisible(false);
  };

  // Function to show/hide date picker
  const toggleDatePicker = () => {
    setDatePickerVisible(!datePickerVisible);
  };

  // Function to handle date selection from the dropdown
  const handleDateSelect = (date: Date) => {
    setSelectedMonth(date);
    setDatePickerVisible(false);
    // Additional logic for jumping to specific date conversations would go here
  };

  // Function to handle rating submission
  const handleRatingSubmit = (rating: number, feedback: string) => {
    // Here you would typically send the rating data to your backend
    console.log("Rating submitted:", rating, feedback);
    setRatingModalVisible(false);
    // Additional actions after submission if needed
  };

  // Simple date picker modal component
  const DatePickerModal = () => {
    // Generate some sample dates for the dropdown (past 7 days)
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    return (
      <Modal
        visible={datePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          activeOpacity={1}
          onPress={() => setDatePickerVisible(false)}
        >
          <View className="bg-bg-gray rounded-lg m-8 p-4 mt-20 shadow-lg">
            <Text className="text-txt-orange text-xl font-LeagueSpartan-Bold mb-4 text-center">Select Date</Text>
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                className="py-3 border-b border-gray-700"
                onPress={() => handleDateSelect(date)}
              >
                <Text className="text-txt-light text-lg">
                  {format(date, "EEEE, MMMM d, yyyy")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Top Bar with History, Pagination, and End Conversation Button */}
      <View className="items-center w-full pt-6 px-4">
        <View className="flex-row justify-between items-center w-full mb-4">
          
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-txt-orange">{format(selectedMonth, "EEE, MMMM yyyy")}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDatePicker}>
            <Ionicons name="calendar-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEndChat} disabled={chatEnded}>
          <Text className="text-[#EEEED0] darkgray font-LeagueSpartan-Bold text-xl p-1 bg-[#FF6B35] rounded-full items-center">EndChat</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Image
        source={images.chatbotbg}
        style={{
          position: "absolute",
          bottom: (height * -0.06) - 10,
          width: width,
          height: height * 1,
          resizeMode: "contain",
          zIndex: -1, // Add this line to put the image behind everything
        }}
      />
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-8 mt-60"
      >
        {messages.map((msg, index) => (
          <View key={index}
            className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <View className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-bg-gray" : ""}`}
            >
              <Text className={`text-[20px] font-LeagueSpartan ${msg.sender === "user" ? "text-[#EEEED0]" : "text-[#101011]"}`}
              >
                {msg.text}
              </Text>

              {/* Add timestamp display */}
              <Text className={`text-xs mt-1 ${msg.sender === "user" ? "text-[#AEAEAE]" : "text-[#6E6E6E]"}`}>
                {formatTimestamp(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <View className="items-start mb-2">
            <View className="rounded-lg p-3 bg-bg-gray">
              <Text className="text-txt-light">Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="px-8 mb-3">
          <View className="bg-bg-gray rounded-full flex-row items-center px-4 py-2 shadow-md">
            <TextInput
              className="flex-1 text-txt-light text-[19px] font-LeagueSpartan"
              placeholder=" Talk with Moodi..."
              placeholderTextColor="#545454"
              value={input}
              onChangeText={setInput}
              editable={!chatEnded}
            />
            <TouchableOpacity
              className={`ml-2 p-2 rounded-full ${chatEnded ? "opacity-50" : ""}`}
              onPress={sendMessage}
              disabled={isLoading || chatEnded}
            >
              <Ionicons name="send" size={18} color="#EEEED0" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* End Chat Confirmation Modal */}
      <EndChatModal
        visible={endChatModalVisible}
        onCancel={handleCancelEndChat}
        onConfirm={handleConfirmEndChat}
      />

      {/* Date Picker Modal */}
      <DatePickerModal />

      {/* Rating Modal */}
      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {/* Prevent closing by back button */ }}
      >
        <ChatbotRatingModal
          onSubmit={handleRatingSubmit}
        />
      </Modal>
    </SafeAreaView>
  );
}