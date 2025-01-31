import { View, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function OnBoarding1() {
    const router = useRouter();
  
    return (
        <View className="flex-1 justify-center items-center bg-bg-dark relative">
            
            <Image 
                source={images.moods} 
                className="absolute bottom-[-5] w-[1000px] h-[1000px]" 
                resizeMode="contain"
            />

            <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl absolute top-[120px] left-16">Track</Text>
            <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl absolute top-[185px] text-center">Moods</Text>

            <Text className="absolute top-[260px] left-16 text-txt-light font-LeagueSpartan text-3xl">
                log how you feel each day
            </Text>

            <TouchableOpacity 
                onPress={() => router.push('/on-boarding-page2')} 
                className="absolute bottom-20 bg-[#FF6B35] rounded-[45px] px-7 py-4 flex-row justify-center items-center">
                <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">Next</Text>
            </TouchableOpacity>
            
        </View>
        )
}