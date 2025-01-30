import { Link } from "expo-router";
import { Text, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import { LeagueSpartan_400Regular, LeagueSpartan_700Bold } from "@expo-google-fonts/league-spartan";


export default function Index() {
  const [fontsLoaded] = useFonts({
    LeagueSpartanRegular: LeagueSpartan_400Regular,
    LeagueSpartanBold: LeagueSpartan_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <View
      className="flex-1 justify-center items-center bg-[#EEEED0]"  // Tailwind background color
    >
      <Text className="text-[#FF6B35] font-extrathin text-[55px] mt-60 tracking-tighter" style={{ fontFamily: "LeagueSpartanBold" }}>
        Moodify
      </Text>
      <Text> 
      Your Journey to Well-being
      </Text>
      <Text>
      One Mood at a Time
      </Text>
      <Link className="mt-10" href="/on-boarding-page1">Get Started</Link>
    </View>
  );
}
