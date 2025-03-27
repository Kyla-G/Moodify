import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import StartConversationModal from "./chatbot-start"; // Import the modal

interface Message {
  role?: string;
  text: string;
  sender: 'user' | 'bot';
}

interface APIResponse {
  choices?: { message: { content: string } }[];
  error?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Moodi, your AI friend. How are you feeling today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Default to false

  useEffect(() => {
    const checkModalStatus = async () => {
      const hasSeenModal = await AsyncStorage.getItem("hasSeenChatbotModal");
      if (!hasSeenModal) {
        setIsModalVisible(true); // Show modal only if it hasn't been seen
      }
    };

    checkModalStatus();
  }, []);

  const handleStartChat = async () => {
    await AsyncStorage.setItem("hasSeenChatbotModal", "true"); // Save flag in AsyncStorage
    setIsModalVisible(false);
  };

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Start Conversation Modal */}
      <StartConversationModal visible={isModalVisible} onStartChat={handleStartChat} />

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

      <ScrollView className="flex-1 px-4 py-2">
        {messages.map((msg, index) => (
          <View key={index} className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <View className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-[#FF6B35]" : "bg-[#333]"}`}>
              <Text className="text-white">{msg.text}</Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View className="items-start mb-2">
            <View className="rounded-lg p-3 bg-[#333]">
              <Text className="text-white">Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="flex-row items-center p-4 bg-[#1A1A1A]">
        <TextInput
          className="flex-1 bg-[#222] text-white p-3 rounded-lg"
          placeholder="Type a message..."
          placeholderTextColor="#777"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          className="ml-2 p-3 bg-[#FF6B35] rounded-lg"
          onPress={() => {}}
          disabled={isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
