import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import { useNavigation, useIsFocused } from "@react-navigation/native";

interface Message {
  role?: string;
  text: string;
  sender: "user" | "bot";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm Moodi, your AI friend. How are you feeling today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.getParent()?.setOptions({ tabBarStyle: { backgroundColor: "black", borderTopWidth: 0 } });
    }
  }, [isFocused]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setInput("");

    try {
      const response = await fetch("https://router.huggingface.co/novita/v3/openai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Moodi, an empathetic and understanding AI friend who listens, understands, and responds with genuine care and warmth. Respond in a conversational and concise manner. You aim to be conversational and natural, avoiding lengthy or overly formal responses.",
            },
            {
              role: "user",
              content: input,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9,
          model: "meta-llama/llama-3.3-70b-instruct",
        }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, there was an error processing your message.", sender: "bot" },
        ]);
      } else if (data.choices && data.choices[0]?.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.choices[0].message.content || "No response received.", sender: "bot" },
        ]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: "Unexpected response from the AI.", sender: "bot" }]);
      }
    } catch (error) {
      setIsLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`, sender: "bot" },
      ]);
    }
  };

  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

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
        <TouchableOpacity className="ml-2 p-3 bg-[#FF6B35] rounded-lg" onPress={sendMessage} disabled={isLoading}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
