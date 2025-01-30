import { Link } from "expo-router";
import { Text, View, ActivityIndicator, Image } from "react-native";
import { useFonts } from "expo-font";
import { LeagueSpartan_400Regular } from "@expo-google-fonts/league-spartan";

import MoodiLP from "@/assets/images/MoodiLP.png"; 
import OrangeCurveLP from "@/assets/images/OrangeCurveLP.png"; 

export default function Index() {
  const [fontsLoaded] = useFonts({
    LeagueSpartan: LeagueSpartan_400Regular,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <View className="flex-1 justify-center items-center bg-[#EEEED0] relative">
      <Image 
        source={MoodiLP} 
        className="w-65 h-65 mb-6"
      />
      <Image 
        source={OrangeCurveLP} 
        className="absolute top-[-1px] right-[-10px] w-50 h-50" 
      />
      <Text className="text-[#FF6B35] font-leagueSpartanBold text-[70px] mt-50 tracking-tighter">
        Moodify
      </Text>
      <Text>Your Journey to Well-being</Text>
      <Text>One Mood at a Time</Text>
      <Link href="/on-boarding-page1" className="mt-10 bg-[#FF6B35] rounded-[45px] px-6 py-3 items-center justify-center">
        <Text className="text-[#EEEED0] text-lg font-bold text-center">Get Started</Text>
      </Link>
    </View>
  );
}
