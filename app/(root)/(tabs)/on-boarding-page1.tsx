import { useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import images from "@/constants/images"; // Assuming you have moods.png in your assets

const OnBoarding1 = () => {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-[#003049]">
      {/* Track Moods Text (positioned where Moodi's face was) */}
      <Text
        style={{
          textAlign: "left",
          marginTop: height * 0.15, // Adjust margin to move it to the same position as Moodi's face
          fontSize: width * 0.19
        }}
        className="text-txt-orange font-LeagueSpartan-Bold mt-6"
      >
        Track Moods
      </Text>

      {/* Image below the text (Moods image now at the Moodify text's position) */}
      <Image
        source={images.moods} // Ensure you have moods.png in your assets
        style={{
          width: width * 1.0, // Adjust image width to fit nicely
          height: height * 1.2, // Adjust image height proportionally
          resizeMode: "contain", // Maintain aspect ratio
          marginTop: height * -0.5, // Space between text and image
        }}
      />

      {/* Get Started Button */}
      <TouchableOpacity 
                onPress={() => router.push('/on-boarding-page2')} 
                className="absolute bottom-20 bg-[#FF6B35] rounded-[45px] px-7 py-4 flex-row justify-center items-center">
                <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">Next</Text>
            </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnBoarding1;
