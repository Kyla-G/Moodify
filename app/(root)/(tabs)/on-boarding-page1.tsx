import { SafeAreaView, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import images from "@/constants/images";

export default function OnBoarding1() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();
  
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-dark relative">
            
            {/* Background Image */}
            <Image 
                source={images.moods} 
                style={{
                    position: "absolute",
                    bottom: height * 0.05,
                    width: width * 5, 
                    height: width * 2,
                    resizeMode: "contain",
                }}
            />

            {/* Heading */}
            <Text 
                style={{ fontSize: width * 0.2, top: height * 0.13, left: width * 0.15 }}
                className="text-txt-orange font-LeagueSpartan-Bold absolute tracking-[.-4]">
                Track
            </Text>
            <Text 
                style={{ fontSize: width * 0.2, top: height * 0.2 }}
                className="text-txt-orange font-LeagueSpartan-Bold absolute text-center tracking-[.-4]">
                Moods
            </Text>
            
            {/* Subtitle */}
            <Text 
                style={{ fontSize: width * 0.055, top: height * 0.29, left: width * 0.1 }}
                className="text-txt-light font-LeagueSpartan absolute">
                log how you feel each day
            </Text>

            {/* Next Button */}
            <TouchableOpacity 
                onPress={() => router.push('/on-boarding-page2')} 
                style={{
                    position: "absolute",
                    bottom: height * 0.08,
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.08,
                    borderRadius: 45,
                }}
                className="bg-[#FF6B35] flex-row justify-center items-center">
                <Text style={{ fontSize: width * 0.05 }}
                    className="text-txt-light font-LeagueSpartan-Bold text-center">
                    Next
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}