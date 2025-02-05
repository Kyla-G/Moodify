import { SafeAreaView, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function OnBoarding2() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-medium relative">

        <Image 
            source={images.orangedesign} 
            className="absolute top-[95] left-[-55] w-[140px] h-[140px]"
        />
        <Image 
            source={images.lightbluedesign} 
            className="absolute top-[45px] left-10 w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image 
            source={images.darkbluecircle} 
            className="absolute top-[45px] left-[178] w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image
            source={images.lightdesign}
            className="absolute top-[45px] right-[-110] w-[240px] h-[240px]"
            resizeMode="contain"
        />
         <Image 
            source={images.lightbluedesign} 
            className="absolute top-[160px] left-[-150] w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image 
            source={images.darkbluedesign} 
            className="absolute top-[165px] left-[-10] w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image 
            source={images.lightblueline} 
            className="absolute top-[175px] left-[106] w-[220px] h-[220px]"
            resizeMode="contain"
        />
        <Image 
            source={images.lightborderdesign} 
            className="absolute top-[165px] right-[-20] w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image 
            source={images.orangedesign} 
            className="absolute top-[220px] right-[-86] w-[140px] h-[140px]"
        />
         <Image 
            source={images.orangedesign} 
            className="absolute top-[340] left-[-55] w-[140px] h-[140px]"
        />
        <Image 
            source={images.lightbluedesign} 
            className="absolute top-[295px] left-10 w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image 
            source={images.darkbluecircle} 
            className="absolute top-[295px] left-[178] w-[240px] h-[240px]"
            resizeMode="contain"
        />
        <Image
            source={images.lightdesign}
            className="absolute top-[295px] right-[-110] w-[240px] h-[240px]"
            resizeMode="contain"
        />

        <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl text-center absolute bottom-[320px] left-[75] tracking-[.-4]">Recognize</Text>
        <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl text-center absolute bottom-[250px] left-6 tracking-[.-4]">Patterns</Text>
        <Text className="text-txt-darkblue font-LeagueSpartan text-3xl absolute bottom-[190px] left-7">
        Notice patterns and{"\n"}understand your emotions
        </Text>

        <TouchableOpacity 
                onPress={() => router.push('/on-boarding-page3')} 
                className="absolute bottom-20 bg-[#FF6B35] rounded-[45px] px-7 py-4 flex-row justify-center items-center">
                <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}