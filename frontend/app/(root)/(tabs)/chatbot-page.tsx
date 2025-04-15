import { useState, useCallback, useRef, useEffect } from "react";
<<<<<<< HEAD
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Image, KeyboardAvoidingView, Platform, Modal } from "react-native";
=======
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, Modal } from "react-native";
>>>>>>> glean2120674
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, subMonths, addMonths } from "date-fns";
import images from "@/constants/images";
import { useWindowDimensions } from "react-native";
import ChatbotRatingModal from "./chatbot-rating-modal"; // Import the rating modal component
<<<<<<< HEAD
import EndChatModal from "./end-chat-modal"; // Import the end chat confirmation modal
import XpStreakManager from "./XpStreakManager"; // Adjust path if needed
import CalendarPicker from 'react-native-calendar-picker'; // For calendar functionality

const { height, width } = Dimensions.get("window");
=======

const { height, width} = Dimensions.get("window");
>>>>>>> glean2120674

// Define the structure of the API response
interface Message {
  role?: 'system' | 'user' | 'assistant';
  text: string;
  sender: 'user' | 'bot';
<<<<<<< HEAD
  timestamp: Date; // Add timestamp property
=======
>>>>>>> glean2120674
}

interface APIResponse {
  choices?: { message: { content: string } }[];
  error?: string;
}

export default function ChatbotPage() {
<<<<<<< HEAD
  const [chatbotRated, setChatbotRated] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?",
      sender: "bot",
      role: "assistant",
      timestamp: new Date() // Initialize with current timestamp
    }
=======
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?", sender: "bot", role: "assistant" }
>>>>>>> glean2120674
  ]);
  const [input, setInput] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
<<<<<<< HEAD
  const [endChatModalVisible, setEndChatModalVisible] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
=======
>>>>>>> glean2120674

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

<<<<<<< HEAD
  // Reset chatbotRated state when starting a new chat session
useEffect(() => {
  if (!chatEnded) {
    setChatbotRated(false);
  }
}, [chatEnded]);

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
=======
  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage: Message = { text: input, sender: "user", role: "user" };
>>>>>>> glean2120674
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
<<<<<<< HEAD
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
=======
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
>>>>>>> glean2120674
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        // Handle unexpected response format
<<<<<<< HEAD
        const unexpectedMessage: Message = {
          text: 'Unexpected response from the AI.',
          sender: "bot",
          role: "assistant",
          timestamp: new Date() // Add current timestamp
=======
        const unexpectedMessage: Message = { 
          text: 'Unexpected response from the AI.', 
          sender: "bot",
          role: "assistant"
>>>>>>> glean2120674
        };
        setMessages((prevMessages) => [...prevMessages, unexpectedMessage]);
      }
    } catch (error) {
      setIsLoading(false);
      // Handle network or other errors
<<<<<<< HEAD
      const errorMessage: Message = {
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sender: "bot",
        role: "assistant",
        timestamp: new Date() // Add current timestamp
=======
      const errorMessage: Message = { 
        text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        sender: "bot",
        role: "assistant"
>>>>>>> glean2120674
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
  // Function to handle rating submission
const handleRatingSubmit = (rating: number, feedback: string) => {
  // Log the rating data (will be sent to backend later)
  console.log("Rating submitted:", rating, feedback);
  
  // Close the rating modal
  setRatingModalVisible(false);
  
  // Set chatbotRated to trigger XP reward
  setChatbotRated(true);
  
  // After a short delay to allow XP notification to be seen
  setTimeout(() => {
    // Save current session to history (mock implementation for now)
    const sessionRecord = {
      date: new Date(),
      messages: messages,
      rating: rating,
      feedback: feedback
    };
    console.log("Session saved:", sessionRecord);
    
    // Start a new chat session
    setMessages([{
      text: "Hey there! I'm back. How can I help you today?",
      sender: "bot",
      role: "assistant",
      timestamp: new Date()
    }]);
    setChatEnded(false);
  }, 3000); // Give 3 seconds to see XP notification
};

  const mockSessionDates = [
    new Date(2025, 3, 2), // April 2, 2025
    new Date(2025, 3, 5), // April 5, 2025
    new Date(2025, 3, 8), // April 8, 2025
    new Date(2025, 3, 10), // April 10, 2025
    new Date(2025, 3, 14), // April 14, 2025 (today)
  ];

  // Simple date picker modal component
  const DatePickerModal = () => {
    // Function to check if a date has session history
    const hasSessionHistory = (date: Date) => {
      return mockSessionDates.some(sessionDate => 
        sessionDate.getDate() === date.getDate() && 
        sessionDate.getMonth() === date.getMonth() && 
        sessionDate.getFullYear() === date.getFullYear()
      );
    };
  
    // Custom date styling function
    const customDayRenderer = (date: any) => {
      const jsDate = new Date(date);
      
      // Check if this date has session history
      if (hasSessionHistory(jsDate)) {
        return {
          style: {
            backgroundColor: '#FF6B35',
            borderRadius: 20,
          },
          textStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
        };
      }
      
      // Default styling for dates without sessions
      return {
        style: {},
        textStyle: {
          color: '#EEEED0',
        },
      };
    };
  
    return (
      <Modal
        visible={datePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <TouchableOpacity
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
          }}
          activeOpacity={1}
          onPress={() => setDatePickerVisible(false)}
        >
          <View 
            style={{ 
              backgroundColor: '#282828', 
              marginHorizontal: 20, 
              borderRadius: 15,
              padding: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{ 
              color: '#FF6B35', 
              fontSize: 22, 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginBottom: 15,
            }}>
              Session History
            </Text>
            
            <View style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                <View style={{ 
                  width: 12, 
                  height: 12, 
                  backgroundColor: '#FF6B35', 
                  borderRadius: 6, 
                  marginRight: 8 
                }} />
                <Text style={{ color: '#EEEED0' }}>Days with chat sessions</Text>
              </View>
            </View>
            
            <CalendarPicker
              startFromMonday={false}
              allowRangeSelection={false}
              minDate={new Date(2025, 0, 1)}
              maxDate={new Date()}
              weekdays={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
              months={[
                'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
              ]}
              previousTitle="Previous"
              nextTitle="Next"
              todayBackgroundColor="#4F4F4F"
              selectedDayColor="#FF6B35"
              selectedDayTextColor="#FFFFFF"
              dayShape="circle"
              scaleFactor={375}
              textStyle={{
                color: '#EEEED0',
              }}
              customDatesStyles={customDayRenderer}
              onDateChange={(date) => {
                // Convert the selected date string to a Date object
                const selectedDate = new Date(date.toString());
                handleDateSelect(selectedDate);
              }}
              previousTitleStyle={{ color: '#FF6B35' }}
              nextTitleStyle={{ color: '#FF6B35' }}
              monthTitleStyle={{ color: '#EEEED0', fontSize: 18, fontWeight: 'bold' }}
              yearTitleStyle={{ color: '#EEEED0', fontSize: 18, fontWeight: 'bold' }}
            />
            
            <TouchableOpacity
              style={{
                backgroundColor: '#FF6B35',
                padding: 12,
                borderRadius: 25,
                marginTop: 15,
                alignItems: 'center',
              }}
              onPress={() => setDatePickerVisible(false)}
            >
              <Text style={{ color: '#EEEED0', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
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
          <Text className="text-[#EEEED0] darkgray font-LeagueSpartan-Bold text-xl p-1 bg-[#FF6B35] rounded-full items-center">End Chat</Text>
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
<<<<<<< HEAD
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

=======
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

>>>>>>> glean2120674
      {/* Rating Modal */}
      <Modal
        visible={ratingModalVisible}
        transparent={true}
        animationType="slide"
<<<<<<< HEAD
        onRequestClose={() => {/* Prevent closing by back button */ }}
      >
        <ChatbotRatingModal
          onSubmit={handleRatingSubmit}
        />
      </Modal>
      {/* XP Streak Manager */}
<XpStreakManager
  selectedDate={selectedMonth}
  onMoodEntrySaved={false}
  onChatbotRating={chatbotRated}
/>
=======
        onRequestClose={() => {/* Prevent closing by back button */}}
      >
        <ChatbotRatingModal 
          onSubmit={handleRatingSubmit} 
          // Modal can only be closed via the submit function
        />
      </Modal>
>>>>>>> glean2120674
    </SafeAreaView>
  );
}