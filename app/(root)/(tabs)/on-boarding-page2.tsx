import { View, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function OnBoarding2() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center bg-bg-light relative">

        <Image 
            source={images.orangedesign} 
            className="absolute top-40 w-[150px] h-[150px]"
        />
        <Image 
            source={images.lightbluedesign} 
            className="absolute top-30 w-[200px] h-[200px]"
            resizeMode="contain"
        />
        <Image 
            source={images.darkbluecircle} 
            className="absolute top-30 w-[200px] h-[200px]"
            resizeMode="contain"
        />

        <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl text-center absolute bottom-40]">Recognize{"\n"}Patterns</Text>
        <Text className="font-LeagueSpartan text-2xl mt-2 ml-4">
        Notice patterns and{"\n"}understand your emotions
        </Text>

        <TouchableOpacity 
            onPress={() => router.push('/on-boarding-page3')} 
            className="mt-20 ml-[-10] bg-[#FF6B35] rounded-[45px] px-7 py-4 flex-row justify-center items-center">
            <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">
            Next
            </Text>
        </TouchableOpacity>
        </View>
    )
}