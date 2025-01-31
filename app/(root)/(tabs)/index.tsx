import { useRouter } from "expo-router";
import { Text, View, Image, TouchableOpacity} from "react-native";
import images from "@/constants/images";

export default function Index() {
  const router = useRouter();
  
  return (
    <View className="flex-1 justify-center items-center bg-bg-light relative">

      <Image 
      source={images.moodiface} 
      className="mt-[-120px] right-[-10px] w-[500px] h-[500px] " 
      resizeMode="contain"
      />
      <Image
      source={images.orangecurve}
      className="absolute top-[-20px] right-[-10px] w-[150px] h-[150px]" 
      />
      <Image
      source={images.leftlightcurve}
      className="absolute top-40 left-[-270px] w-[500px] h-[500px]" 
      />
      <Image
      source={images.rightlightcurve}
      className="absolute bottom-[-57] right-[-50px] w-[420px] h-[420px]" 
      />
      <Image
      source={images.rightdarkcurve}
      className="absolute bottom-[-60] right-[-30px] w-[300px] h-[300px]" 
      />
      
      <Text className="text-txt-orange font-LeagueSpartan-Bold text-8xl mt-100]">Moodify</Text>
      <Text className="text-txt-darkblue font-LeagueSpartan text-3xl text-center mt-2">
        Your Journey to Well-being{"\n"}One Mood at a Time
      </Text>

      <TouchableOpacity 
        onPress={() => router.push('/on-boarding-page1')} 
        className="mt-20 ml-[-10] bg-bg-dark rounded-[45px] px-7 py-4 flex-row justify-center items-center">
        <Text className="text-txt-light font-LeagueSpartan-Bold text-3xl text-center">
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}