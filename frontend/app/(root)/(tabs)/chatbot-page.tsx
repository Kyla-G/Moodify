import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import axios from 'axios';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const sendMessage = async () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    const userMessage = input;
    setInput("");

    try {
      const response = await axios.post('http://10.10.50.23:3000/chat', { message: userMessage });
      const botMessage = response.data[0].generated_text;
      setMessages((prevMessages) => [...prevMessages, { text: botMessage, sender: "bot" }]);
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Error fetching chatbot response.", sender: "bot" }]);
    }
  };

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

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

      <ScrollView className="flex-1 px-4 py-2">
        {messages.map((msg, index) => (
          <View key={index} className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <View className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-[#FF6B35]" : "bg-[#333]"}`}>
              <Text className="text-white">{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row items-center p-4 bg-[#1A1A1A]">
        <TextInput
          className="flex-1 bg-[#222] text-white p-3 rounded-lg"
          placeholder="Type a message..."
          placeholderTextColor="#777"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity className="ml-2 p-3 bg-[#FF6B35] rounded-lg" onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}