import { View, Text, Image, TouchableOpacity} from "react-native";
import { useRouter } from "expo-router";
import images from "@/constants/images";

export default function EntriesPage() {
    const router = useRouter();
    return (
        <View className="flex-1 justify-center items-center bg-bg-black relative">

            <Image 
                source={images.iconlight} 
                className="absolute top-[70px] left-[10] w-[100] h-[100]" 
                resizeMode="contain"
            />
           
            <Text className="text-txt-orange font-LeagueSpartan-Bold text-5xl absolute top-[200px] text-center tracking-[.-3]">Your Feelings are Valid</Text>
            <Text className="text-txt-light font-LeagueSpartan text-3xl absolute top-[260px] right-20"></Text>
        </View>
    )
}