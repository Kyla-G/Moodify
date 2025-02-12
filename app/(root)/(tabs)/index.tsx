import { useRouter } from "expo-router";
import { Text, Image, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

export default function Index() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-bg-light relative">
      
      {/*Logo*/}
      <Image 
        source={images.moodiface} 
        style={{
          width: width * 1.1,  // Increased to 110% of screen width
          height: height * 0.5, // Increased to 50% of screen height
          marginTop: height * -0.08, 
          marginLeft: height * 0.03,
          resizeMode: "contain",}}
      />

      {/* Decorative Images */}
      <Image source={images.orangecurve} 
        style={{ position: "absolute", top: height * -0.02, right: width * -0.05, width: width * 0.4, height: width * 0.4 }}/>
      <Image source={images.leftlightcurve} 
        style={{ position: "absolute", top: height * 0.25, left: width * -0.46, width: width * 0.9, height: width * 0.9 }}/>
      <Image source={images.rightlightcurve} 
        style={{ position: "absolute", bottom: height * -0.08, right: width * -0.14, width: width * 0.9, height: width * 0.9 }}/>
      <Image source={images.rightdarkcurve} 
        style={{ position: "absolute", bottom: height * -0.064, right: width * -0.07, width: width * 0.6, height: width * 0.6 }}/>

      {/* App Name */}
      <Text 
        style={{ fontSize: width * 0.22 }} 
        className="text-txt-orange font-LeagueSpartan-Bold mt-6 tracking-[.-4]">
          Moodify
      </Text>

      {/* Tagline */}
      <Text 
        style={{ fontSize: width * 0.056 }} 
        className="text-txt-darkblue font-LeagueSpartan text-center mt-2">
        Your Journey to Well-being{"\n"}One Mood at a Time
      </Text>

      {/* Get Started Button */}
      <TouchableOpacity 
        onPress={() => router.push('/on-boarding-page1')} 
        style={{
          marginTop: height * 0.08,
          paddingVertical: height * 0.02,
          paddingHorizontal: width * 0.08,
          borderRadius: 45,
          alignSelf: 'center', // Center the button horizontally
        }}
        className="bg-bg-dark flex-row justify-center items-center">
        <Text style={{ fontSize: width * 0.05 }} 
          className="text-txt-light font-LeagueSpartan-Bold text-center">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}