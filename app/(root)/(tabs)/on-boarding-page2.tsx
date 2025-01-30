import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const OnBoarding2 = () => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#EEEED0]">
      <Text className="text-[#FF6B35] font-leagueSpartanBold text-[32px] mb-4">
        Recognize Patterns
      </Text>
      <Link href="/on-boarding-page3" className="mt-10 bg-[#FF6B35] rounded-[45px] px-6 py-3 items-center justify-center">
        <Text className="text-[#EEEED0] text-lg font-bold text-center">Next</Text>
      </Link>
    </SafeAreaView>
  );
};

export default OnBoarding2;
