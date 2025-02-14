import { useRouter } from "expo-router";
import { Text, Image, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

export default function OnBoarding3() {
    const router = useRouter();
    const { width, height } = useWindowDimensions();

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-orange">
            {/* Background Image */}
            <Image 
                source={images.moodiwave} 
                style={{
                    width: width * 2.4,
                    marginBottom: height * -0.24, 
                    height: width * 2,
                    marginLeft: height * 0.22,
                    resizeMode: "contain",
                }}
            />

            {/* Headings */}
            <Text style={{ fontSize: width * 0.2, top: height * 0.13, right: width * 0.1 }} className="text-txt-blue font-LeagueSpartan-Bold absolute tracking-[.-4]">Meet</Text>
            <Text style={{ fontSize: width * 0.2, top: height * 0.205, right: width * 0.1 }} className="text-txt-blue font-LeagueSpartan-Bold absolute tracking-[.-4]">Moodi</Text>
            <Text style={{ fontSize: width * 0.06, top: height * 0.3, right: width * 0.1, textAlign: "right" }} className="text-txt-light font-LeagueSpartan absolute">
                Moodi is always there to chat{"\n"}whenever you need a friend
            </Text>

            {/* Get Started Button */}
            <TouchableOpacity 
                onPress={() => router.push('/entries-page')} 
                style={{
                    position: "absolute",
                    bottom: height * 0.08,
                    paddingVertical: height * 0.02,
                    paddingHorizontal: width * 0.08,
                    borderRadius: 45,
                }}
                className="bg-bg-dark flex-row justify-center items-center">
                <Text style={{ fontSize: width * 0.05 }} className="text-txt-light font-LeagueSpartan-Bold text-center">Get Started</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}