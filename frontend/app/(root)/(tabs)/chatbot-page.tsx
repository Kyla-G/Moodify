import { useState, useCallback, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, KeyboardAvoidingView, Platform, Modal, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, addDays, subDays, getYear, getMonth, getDate } from "date-fns";
import images from "@/constants/images";
import { useWindowDimensions } from "react-native";
import ChatbotRatingModal from "./chatbot-rating-modal";
import EndChatModal from "./end-chat-modal";

// Define the structure of the API response
interface Message {
  role?: 'system' | 'user' | 'assistant';
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface APIResponse {
  choices?: { message: { content: string } }[];
  error?: string;
}

interface ChatSession {
  chat_session_ID: string;
  start_time: Date;
  end_time: Date;
  isActive: number;
  messages: Message[];
}

export default function ChatbotPage() {
  // State for managing active chat session
  const [currentChatSession, setCurrentChatSession] = useState<ChatSession | null>(null);
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});
  
  // Selected date for viewing chat history
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Dropdown states
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  
  // Chat message states
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?", 
      sender: "bot", 
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [endChatModalVisible, setEndChatModalVisible] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);

  // Month names for dropdown
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
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

  // Get date key for storing sessions (format: YYYY-MM-DD)
  const getDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // Initialize or fetch chat session for the current date
  useEffect(() => {
    const dateKey = getDateKey(selectedDate);
    
    // Check if we already have a session for this date
    if (chatSessions[dateKey]) {
      // Use existing chat session
      setCurrentChatSession(chatSessions[dateKey]);
      setMessages(chatSessions[dateKey].messages);
    } else {
      // For demo purposes - In a real app, you would fetch from your backend here
      // Fetch chat session data from the backend for the selected date
      fetchChatSession(selectedDate);
    }
  }, [selectedDate]);

  // Fetch chat session from backend
  const fetchChatSession = async (date: Date) => {
    // In a real implementation, you would call your API here
    // For now, we'll simulate an empty chat or create a new session
    
    const dateKey = getDateKey(date);
    
    // Check if the date is today
    const isToday = getDateKey(new Date()) === dateKey;
    
    if (isToday) {
      // For today, we'll use the current active session or create a new one
      if (!currentChatSession) {
        const newSession: ChatSession = {
          chat_session_ID: `session_${Date.now()}`, // This would come from your backend
          start_time: new Date(),
          end_time: new Date(),
          isActive: 1,
          messages: [{ 
            text: "Hey there! I'm Moodi, your AI friend! Just checking in—how's your day?", 
            sender: "bot", 
            role: "assistant",
            timestamp: new Date()
          }]
        };
        
        setCurrentChatSession(newSession);
        setMessages(newSession.messages);
        
        // Update chat sessions
        setChatSessions(prev => ({
          ...prev,
          [dateKey]: newSession
        }));
      }
    } else {
      // For past dates, we could either have no messages or fetch historical data
      // For demo purposes, let's create some placeholder messages for past dates
      const pastSession: ChatSession = {
        chat_session_ID: `session_${date.getTime()}`,
        start_time: date,
        end_time: new Date(date.getTime() + 3600000), // 1 hour later
        isActive: 0,
        messages: [
          { 
            text: `This is a historical chat from ${format(date, "d MMM yyyy")}.`, 
            sender: "bot", 
            role: "assistant",
            timestamp: date
          },
          {
            text: "Hello from the past!",
            sender: "user",
            role: "user",
            timestamp: new Date(date.getTime() + 60000) // 1 minute later
          },
          {
            text: "It's nice to see you looking back at our conversations!",
            sender: "bot",
            role: "assistant",
            timestamp: new Date(date.getTime() + 120000) // 2 minutes later
          }
        ]
      };
      
      setCurrentChatSession(pastSession);
      setMessages(pastSession.messages);
      
      // Update chat sessions
      setChatSessions(prev => ({
        ...prev,
        [dateKey]: pastSession
      }));
    }
  };

  // Save current chat session
  const saveChatSession = async () => {
    if (!currentChatSession) return;
    
    const dateKey = getDateKey(selectedDate);
    
    // Update the current session with latest messages and end time
    const updatedSession: ChatSession = {
      ...currentChatSession,
      messages: messages,
      end_time: new Date()
    };
    
    // Save to state (In a real app, you would also save to your backend)
    setChatSessions(prev => ({
      ...prev,
      [dateKey]: updatedSession
    }));
    
    setCurrentChatSession(updatedSession);
    
    // Here you would make an API call to your backend to save the session
    // Example: await fetch('/api/chat-sessions', { method: 'POST', body: JSON.stringify(updatedSession) });
  };

  // Jump to today's chat
  const jumpToToday = () => {
    setSelectedDate(new Date());
    
    // Close any open dropdowns
    setShowMonthDropdown(false);
    setShowDayDropdown(false);
    setShowYearDropdown(false);
  };

  // Handle month selection from dropdown
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(monthIndex);
    setSelectedDate(newDate);
    setShowMonthDropdown(false);
  };

  // Handle day selection from dropdown
  const handleDaySelect = (day: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
    setShowDayDropdown(false);
  };

  // Handle year selection from dropdown
  const handleYearSelect = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowYearDropdown(false);
  };

  // Generate array of days in the selected month
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Generate array of years (e.g., last 5 years to next 5 years)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 5;
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
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
      
      // Save the updated chat session after receiving response
      saveChatSession();
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
    
    // Update the chat session in our state
    if (currentChatSession) {
      const updatedSession = {
        ...currentChatSession,
        isActive: 0,
        end_time: new Date(),
        messages: [...messages, farewellMessage]
      };
      
      const dateKey = getDateKey(selectedDate);
      setChatSessions(prev => ({
        ...prev,
        [dateKey]: updatedSession
      }));
      
      setCurrentChatSession(updatedSession);
      
      // Here you would make an API call to your backend to end the session
      // Example: await fetch(`/api/chat-sessions/${currentChatSession.chat_session_ID}/end`, { method: 'POST' });
    }
    
    // Show rating modal after the farewell message
    setTimeout(() => {
      setRatingModalVisible(true);
    }, 1000);
  };

  // Function to handle cancellation of ending chat
  const handleCancelEndChat = () => {
    setEndChatModalVisible(false);
  };

  // Function to handle rating submission
  const handleRatingSubmit = (rating: number, feedback: string) => {
    // Here you would typically send the rating data to your backend
    console.log("Rating submitted:", rating, feedback);
    setRatingModalVisible(false);
    // Additional actions after submission if needed
  };

  // Check if viewing today's chat
  const isToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      {/* Top Bar with Date Navigation */}
      <View className="items-center w-full pt-6 px-4">
        <View className="flex-row justify-between items-center w-full mb-4">
          {/* Today button */}
          <TouchableOpacity 
            className="bg-[#444] rounded-full px-3 py-1"
            onPress={jumpToToday}
          >
            <Text className="text-white">Today</Text>
          </TouchableOpacity>

          {/* Date navigation with dropdowns */}
          <View className="flex-row items-center">
            {/* Month dropdown */}
            <View className="relative">
              <TouchableOpacity 
                className="px-2 py-1 flex-row items-center" 
                onPress={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowDayDropdown(false);
                  setShowYearDropdown(false);
                }}
              >
                <Text className="text-xl font-semibold text-white">{format(selectedDate, "MMMM")}</Text>
                <Ionicons name={showMonthDropdown ? "chevron-up" : "chevron-down"} size={16} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              
              {/* Month dropdown menu */}
              {showMonthDropdown && (
                <View className="absolute top-10 left-0 bg-[#222] rounded-md z-50 w-40 max-h-64 shadow-lg">
                  <ScrollView>
                    {monthNames.map((month, index) => (
                      <TouchableOpacity
                        key={month}
                        className="py-3 px-4 border-b border-gray-700"
                        onPress={() => handleMonthSelect(index)}
                      >
                        <Text className={`text-white text-center ${index === selectedDate.getMonth() ? 'font-bold' : ''}`}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            {/* Day dropdown */}
            <View className="relative mx-2">
              <TouchableOpacity 
                className="px-2 py-1 flex-row items-center" 
                onPress={() => {
                  setShowDayDropdown(!showDayDropdown);
                  setShowMonthDropdown(false);
                  setShowYearDropdown(false);
                }}
              >
                <Text className="text-xl font-semibold text-white">{format(selectedDate, "d")}</Text>
                <Ionicons name={showDayDropdown ? "chevron-up" : "chevron-down"} size={16} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              
              {/* Day dropdown menu */}
              {showDayDropdown && (
                <View className="absolute top-10 left-0 bg-[#222] rounded-md z-50 w-16 max-h-64 shadow-lg">
                  <ScrollView>
                    {getDaysInMonth().map(day => (
                      <TouchableOpacity
                        key={day}
                        className="py-3 px-4 border-b border-gray-700"
                        onPress={() => handleDaySelect(day)}
                      >
                        <Text className={`text-white text-center ${day === selectedDate.getDate() ? 'font-bold' : ''}`}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            
            {/* Year dropdown */}
            <View className="relative">
              <TouchableOpacity 
                className="px-2 py-1 flex-row items-center" 
                onPress={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                  setShowDayDropdown(false);
                }}
              >
                <Text className="text-xl font-semibold text-white">{format(selectedDate, "yyyy")}</Text>
                <Ionicons name={showYearDropdown ? "chevron-up" : "chevron-down"} size={16} color="white" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              
              {/* Year dropdown menu */}
              {showYearDropdown && (
                <View className="absolute top-10 right-0 bg-[#222] rounded-md z-50 w-24 max-h-64 shadow-lg">
                  <ScrollView>
                    {getYearOptions().map(year => (
                      <TouchableOpacity
                        key={year}
                        className="py-3 px-4 border-b border-gray-700"
                        onPress={() => handleYearSelect(year)}
                      >
                        <Text className={`text-white text-center ${year === selectedDate.getFullYear() ? 'font-bold' : ''}`}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
          
          {/* Empty view for spacing */}
          <View style={{ width: 50 }} />
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
      
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-8 mt-6"
      >
        {messages.map((msg, index) => (
          <View key={index}
            className={`mb-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <View className={`rounded-lg p-3 max-w-[80%] ${msg.sender === "user" ? "bg-bg-gray" : "" }`}
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
        
        {/* Show message if viewing past conversation */}
        {!isToday() && (
          <View className="items-center my-4">
            <View className="rounded-lg p-3 bg-gray-700 opacity-80">
              <Text className="text-white text-center">You are viewing a past conversation.</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input area - Only enabled for today's conversation */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="px-8 mb-3">
          <View className={`bg-bg-gray rounded-full flex-row items-center px-4 py-2 shadow-md ${!isToday() ? 'opacity-50' : ''}`}>
            <TextInput
              className="flex-1 text-txt-light font-LeagueSpartan text-base"
              placeholder={isToday() ? " Talk with Moodi..." : " Can't chat in past conversations"}
              placeholderTextColor="#545454"
              value={input}
              onChangeText={setInput}
              editable={isToday() && !chatEnded}
            />
            <TouchableOpacity
              className={`ml-2 p-2 rounded-full ${(!isToday() || chatEnded) ? "opacity-50" : ""}`}
              onPress={sendMessage}
              disabled={isLoading || !isToday() || chatEnded}
            >
              <Ionicons name="send" size={18} color="#EEEED0" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* END button - only show if chat is not ended and we're viewing today */}
      {isToday() && !chatEnded && (
        <View className="px-32 mb-4">
          <TouchableOpacity
            className="p-2 bg-[#FF6B35] rounded-full items-center"
            onPress={handleEndChat}
          >
            <Text className="text-txt-darkgray font-LeagueSpartan-Bold text-xl">End Conversation</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* End Chat Confirmation Modal */}
      <EndChatModal
        visible={endChatModalVisible}
        onCancel={handleCancelEndChat}
        onConfirm={handleConfirmEndChat}
      />

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