import { useState, useCallback, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import * as Font from "expo-font";


export default function ChatbotPage() {

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isReady, setIsReady] = useState(false);

  // Setup font loading
  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        'Overlock-Regular': require('../assets/fonts/Overlock-Regular.ttf'),
        'Overlock-Bold': require('../assets/fonts/Overlock-Bold.ttf'),
        'Overlock-Italic': require('../assets/fonts/Overlock-Italic.ttf'),
      });
      setIsReady(true);
    } catch (e) {
      console.warn("Error loading fonts:", e);
      // Fallback to system fonts if Overlock can't be loaded
      setIsReady(true);
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!isReady) {
    return null; // Show nothing while loading
  }

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Dismiss keyboard after sending
    Keyboard.dismiss();

    // Simulated bot response
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, { text: "I'm here to assist!", sender: "bot" }]);
    }, 1000);
  };

  // Functions to change month
  const goToPreviousMonth = () => setSelectedMonth(subMonths(selectedMonth, 1));
  const goToNextMonth = () => setSelectedMonth(addMonths(selectedMonth, 1));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <SafeAreaView className="flex-1 bg-[#ffe5c2]">
        <StatusBar style="dark" hidden={false} translucent backgroundColor="transparent" />

        {/* Top Bar with Settings, Pagination, and Streak Button */}
        <View className="items-center w-full pt-6 px-4">
          <View className="flex-row justify-between items-center w-full mb-4">
            <TouchableOpacity>
              <Ionicons name="settings-outline" size={28} color="#0d3c26" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Ionicons name="chevron-back-outline" size={28} color="#0d3c26" />
            </TouchableOpacity>
            <Text style={styles.mediumText} className="text-xl text-[#0d3c26]">{format(selectedMonth, "MMMM yyyy")}</Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Ionicons name="chevron-forward-outline" size={28} color="#0d3c26" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="flame-outline" size={28} color="#0d3c26" />
            </TouchableOpacity>
          </View>
        </View>

       

          <ScrollView
            className="flex-1 px-4 py-2"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <View key={index} className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <View
                  className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-[#f5a081]" : "bg-[#ffe5c2]"
                    }`}
                >
                  <Text
                    style={msg.sender === "user" ? styles.userText : styles.botText}
                    className={`${msg.sender === "user" ? "text-[#0d3c26]" : "text-[#0d3c26]"}`}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        

        <View className="flex-row items-center p-4 rounded-full bg-[#ffffff] drop-shadow-lg ml-4 mr-4">
          <TextInput
            style={styles.inputText}
            className="flex-1 bg-[#fff] text-[#0d3c26] text-lg p-3 rounded-full drop-shadow-lg"
            placeholder="Talk with Moodi"
            placeholderTextColor="#0d3c26"
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity className="ml-2 p-3 bg-[#ffd49c] rounded-full" onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#0d3c26" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// Styles with Overlock font
const styles = StyleSheet.create({
  regularText: {
    fontFamily: 'Overlock-Regular',
  },
  mediumText: {
    fontFamily: 'Overlock-Bold',
  },
  inputText: {
    fontFamily: 'Overlock-Regular',
    fontSize: 16,
  },
  userText: {
    fontFamily: 'Overlock-Regular',
    fontSize: 16,
  },
  botText: {
    fontFamily: 'Overlock-Regular',
    fontSize: 16,
  }
});