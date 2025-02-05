import { SafeAreaView, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function OnBoarding3() {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-bg-orange relative">

            <Image 
                source={images.moodiwave} 
                className="absolute top-[57] left-[-190] w-[1000] h-[1000]" 
                resizeMode="contain"
            />

            <Text className="text-txt-blue font-LeagueSpartan-Bold text-8xl absolute top-[110px] right-20 tracking-[.-4]">Meet</Text>
            <Text className="text-txt-blue font-LeagueSpartan-Bold text-8xl absolute top-[175px] right-20 tracking-[.-4]">Moodi</Text>
            <Text className="text-txt-light font-LeagueSpartan text-3xl absolute top-[260px] right-20">
            Moodi is always there to chat{"\n"}whenever you need a friend
            </Text>

    <TouchableOpacity 
            onPress={() => router.push('/entries-page')} 
            className="absolute bottom-20 bg-bg-dark rounded-[45px] px-7 py-4 flex-row justify-center items-center">
            <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">Get Started</Text>
        </TouchableOpacity>
        </SafeAreaView>
    )
}