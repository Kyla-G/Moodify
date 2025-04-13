import { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import images from "@/constants/images";
import { useWindowDimensions } from "react-native";
import ChatbotRatingModal from "./chatbot-rating-modal"; // Import the rating modal component

const { height, width} = Dimensions.get("window");

// Define the structure of the API response
interface Message {
  role?: 'system' | 'user' | 'assistant';
  text: string;
  sender: 'user' | 'bot';
}

interface APIResponse {
  choices?: { message: { content: string } }[];
  error?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?", sender: "bot", role: "assistant" }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage: Message = { text: input, sender: "user", role: "user" };
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
          role: "assistant"
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        // Add bot response to chat
        const botMessage: Message = { 
          text: data.choices[0].message.content || 'No response received.', 
          sender: "bot",
          role: "assistant"
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        // Handle unexpected response format
        const unexpectedMessage: Message = { 
          text: 'Unexpected response from the AI.', 
          sender: "bot",
          role: "assistant"
        };
        setMessages((prevMessages) => [...prevMessages, unexpectedMessage]);
      }
    } catch (error) {
      setIsLoading(false);
      // Handle network or other errors
      const errorMessage: Message = { 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        sender: "bot",
        role: "assistant"
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));
  
  // Function to handle END button press
  const handleEndChat = () => {
    setRatingModalVisible(true);
  };

  // Function to handle rating submission
  const handleRatingSubmit = (rating: number, feedback: string) => {
    // Here you would typically send the rating data to your backend
    console.log("Rating submitted:", rating, feedback);
    setRatingModalVisible(false);
    // Additional actions after submission if needed
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Top Bar with Settings, Pagination, and Streak Button */}
      <View className="items-center w-full pt-6 px-4">
        <View className="flex-row justify-between items-center w-full mb-4">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToPreviousMonth}>
            <Ionicons name="chevron-back-outline" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white">{format(selectedMonth, "MMMM yyyy")}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Ionicons name="chevron-forward-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="flame-outline" size={28} color="white" />
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
        }}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-8 py-6 mt-60"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg, index) => (
            <View key={index} className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <View className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-bg-medium" : ""}`}>
                <Text className="text-[#000746] text-[20px]">{msg.text}</Text>
              </View>
            </View>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <View className="items-start mb-2">
              <View className="rounded-lg p-3 bg-bg-medium">
                <Text className="text-txt-darkblue">Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-4 mb-4">
          <View className="flex-row items-center p-4 bg-bg-orange rounded-full">
            <TextInput
              className="flex-1 bg-bg-medium text-white p-3 rounded-full"
              placeholder="Talk with Moodi..."
              placeholderTextColor="#777"
              value={input}
              onChangeText={setInput}
            />
            <TouchableOpacity 
              className="ml-2 p-3 bg-[#FF6B35] rounded-lg" 
              onPress={sendMessage}
              disabled={isLoading}
            >
              <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* END button */}
          <TouchableOpacity 
            className="mt-3 p-3 bg-[#FF3535] rounded-lg items-center"
            onPress={handleEndChat}
          >
            <Text className="text-white font-bold text-lg">END</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Rating Modal */}
      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {/* Prevent closing by back button */}}
      >
        <ChatbotRatingModal 
          onSubmit={handleRatingSubmit} 
          // Modal can only be closed via the submit function
        />
      </Modal>
    </SafeAreaView>
  );
}