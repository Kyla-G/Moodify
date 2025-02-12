import { useRouter } from "expo-router";
import { Text, Image, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

export default function OnBoarding2() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-medium">
            {/* Decorative Images */}
           
            
            {/* Headings */}
            <Text style={{ fontSize: width * 0.22, bottom: height * 0.41, left: width * 0.09 }} className="text-txt-orange font-LeagueSpartan-Bold absolute tracking-[.-4]">Recognize</Text>
            <Text style={{ fontSize: width * 0.22, bottom: height * 0.33, left: width * 0.02 }} className="text-txt-orange font-LeagueSpartan-Bold absolute tracking-[.-4]">Patterns</Text>
            <Text style={{ fontSize: width * 0.056, bottom: height * 0.27, left: width * 0.028 }} className="text-txt-darkblue font-LeagueSpartan absolute">Notice patterns and{"\n"}understand your emotions</Text>

            {/* Next Button */}
            <TouchableOpacity 
                onPress={() => router.push('/on-boarding-page3')} 
                style={{
                    position: "absolute",
                    bottom: height * 0.08,
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.08,
                    borderRadius: 45,
                }}
                className="bg-[#FF6B35] flex-row justify-center items-center">
                <Text style={{ fontSize: width * 0.05 }} className="text-txt-light font-LeagueSpartan-Bold text-center">Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}