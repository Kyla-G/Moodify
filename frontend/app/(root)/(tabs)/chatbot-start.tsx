import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { height } = Dimensions.get("window");

type ChatbotStackParamList = {
  ChatbotPage: undefined;
};

export default function StartConversationModal() {
  const navigation = useNavigation<NativeStackNavigationProp<ChatbotStackParamList>>();

  return (
    <View className="absolute top-0 left-0 w-full bg-black" style={{ height: height - 80 }}>
      <View className="flex-1 justify-center items-center">
        <View className="bg-[#1A1A1A] p-6 rounded-lg w-80">
          <Text className="text-white text-lg font-semibold mb-4">Start a Conversation</Text>
          <Text className="text-gray-400 mb-6">Would you like to talk to Moodi?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("ChatbotPage")}>
            <Text className="text-[#FF6B35] font-semibold text-right">Start Conversation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
