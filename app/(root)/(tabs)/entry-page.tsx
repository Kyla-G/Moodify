// import { View, Text, Image, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Ionicons from "@expo/vector-icons/Ionicons";

// import MoodRad from "@/assets/icons/MoodRad.png";
// import MoodGood from "@/assets/icons/MoodGood.png";
// import MoodMeh from "@/assets/icons/MoodMeh.png";
// import MoodBad from "@/assets/icons/MoodBad.png";
// import MoodAwful from "@/assets/icons/MoodAwful.png";

// const moodIcons = {
//   Rad: MoodRad,
//   Good: MoodGood,
//   Meh: MoodMeh,
//   Bad: MoodBad,
//   Awful: MoodAwful,
// };

// export default function EntryScreen() {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { entry } = route.params;

//   return (
//     <SafeAreaView className="flex-1 bg-black px-4">
//       {/* Header */}
//       <View className="flex-row items-center justify-between py-4">
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back-outline" size={28} color="white" />
//         </TouchableOpacity>
//         <Text className="text-xl font-semibold text-white">Mood Entry</Text>
//         <TouchableOpacity>
//           <Ionicons name="create-outline" size={28} color="white" />
//         </TouchableOpacity>
//       </View>

//       {/* Mood Icon & Details */}
//       <View className="items-center mt-10">
//         <Image source={moodIcons[entry.mood]} style={{ width: 80, height: 80, resizeMode: "contain" }} />
//         <Text className="text-3xl font-bold text-white mt-4">{entry.mood}</Text>
//         <Text className="text-gray-400 mt-2">{entry.date} at {entry.time}</Text>
//       </View>

//       {/* Journal Entry */}
//       <View className="bg-[#101011] p-4 rounded-[16] mt-8 shadow">
//         <Text className="text-lg text-gray-300">{entry.journal || "No journal entry provided."}</Text>
//       </View>
//     </SafeAreaView>
//   );
// }
