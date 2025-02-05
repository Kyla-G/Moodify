import { SafeAreaView, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function OnBoarding3() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-light relative">

            <Image 
                source={images.journal} 
                className="absolute bottom-[-372] w-[1350] h-[1350]" 
                resizeMode="contain"
            />

        <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl text-center absolute top-[110px] left-5 tracking-[.-4]">Journaling</Text>
        <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl text-center absolute top-[175px] left-[48] tracking-[.-4]">Made Easy</Text>
        <Text className="text-txt-darkblue font-LeagueSpartan text-3xl absolute top-[255px] text-right right-8">
            A safe place to jot down{"\n"}thoughts anytime
        </Text>

    <TouchableOpacity 
            onPress={() => router.push('/on-boarding-page4')} 
            className="absolute bottom-20 bg-[#FF6B35] rounded-[45px] px-7 py-4 flex-row justify-center items-center">
            <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">Next</Text>
        </TouchableOpacity>
        </SafeAreaView>
    )
}