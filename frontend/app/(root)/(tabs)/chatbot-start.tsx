import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

interface StartConversationModalProps {
  visible: boolean;
  onStartChat: () => void;
}

export default function StartConversationModal({ visible, onStartChat }: StartConversationModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="absolute top-0 left-0 w-full bg-black" style={{ height: height - 80 }}> 
        <View className="flex-1 justify-center items-center">
          <View className="bg-[#1A1A1A] p-6 rounded-lg w-80">
            <Text className="text-white text-lg font-semibold mb-4">Start a Conversation</Text>
            <Text className="text-gray-400 mb-6">Would you like to talk to Moodi?</Text>
            <TouchableOpacity onPress={onStartChat}>
              <Text className="text-[#FF6B35] font-semibold text-right">Start Conversation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}