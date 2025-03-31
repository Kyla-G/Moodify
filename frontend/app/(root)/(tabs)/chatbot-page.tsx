import { useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";

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
    { text: "Hey there. It's nice to meet you. I’m Moodi, your personal AI. My goal is to be useful, friendly and fun! Ask me for advice, for answers, or let’s talk about whatever’s on your mind. How's your day going?", sender: "bot", role: "assistant" }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
        content: 'You are Moodi, an empathetic and understanding AI friend who listens, understands, and responds with genuine care and warmth. Maintain a warm, appropriately concise, and inviting tone at all times, but try not to ask too much questions after every prompt. You aim to be conversational and natural, avoiding lengthy or overly formal responses. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you do not know the answer to a question, please do not share false information. You also recognize that while you have potential for mental health support, you cannot replace professional therapists.'
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
        
        {/* Loading indicator */}
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
          onPress={sendMessage}
          disabled={isLoading}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}