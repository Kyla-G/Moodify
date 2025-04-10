import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface EndChatModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const EndChatModal: React.FC<EndChatModalProps> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#1E1E1E] rounded-2xl p-6 w-[80%] shadow-lg">
          <Text className="text-txt-orange text-3xl font-LeagueSpartan-Bold text-center mb-4">
            End Conversation
          </Text>

          <Text className="text-txt-light text-xl text-center font-LeagueSpartan mb-6">
            Are you sure you want to end this conversation? You won't be able to continue chatting in this session.
          </Text>

          <View className="flex-row justify-between space-x-2">
            <TouchableOpacity
              className="flex-1 bg-[#333] rounded-2xl mr-5 py-3 items-center"
              onPress={onCancel}
            >
              <Text className="text-txt-light font-LeagueSpartan text-base">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-[#FF6B35] rounded-2xl py-3 items-center"
              onPress={onConfirm}
            >
              <Text className="text-txt-darkgray font-LeagueSpartan-Bold text-base">End Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EndChatModal;