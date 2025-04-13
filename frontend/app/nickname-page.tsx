import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, Image, TouchableOpacity, TextInput, View, ActivityIndicator, Alert } from "react-native";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Import axios but comment it out until the backend is ready
// import axios from "@/axiosConfig";

export default function NicknamePage() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!nickname.trim()) return;

    setIsLoading(true);

    try {
      // Store the nickname locally so we can proceed without the API
      await AsyncStorage.setItem("user_nickname", nickname.trim());
      
      // Add a small delay to simulate the API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // COMMENTED OUT: API call that's causing timeouts
      /* 
      const response = await axios.post("/users/addUser", {
        nickname: nickname.trim(),
      });

      if (response.data.successful) {
        console.log("✅ User added:", response.data.user);
        ...
      }
      */
      
      // Log success to console
      console.log("✅ User saved locally:", nickname.trim());

      // Navigate to the home page
      router.push({
        pathname: "/(root)/(tabs)/home-page",
        params: { nickname: nickname.trim(), showWelcome: "true" },
      });
    } catch (error) {
      console.error("❌ Error saving nickname:", error);
      Alert.alert(
        "Error",
        "Unable to save your nickname. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-bg-medium">
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

      <Text
        style={{
          fontSize: width * 0.15,
          top: height * 0.13,
          right: width * 0.1,
        }}
        className="text-txt-orange font-LeagueSpartan-Bold absolute tracking-[.-4]"
      >
        Hi there!
      </Text>

      <View
        style={{
          top: height * 0.25,
          width: width * 0.8,
        }}
        className="absolute"
      >
        <Text
          style={{ fontSize: width * 0.06, marginBottom: height * 0.02 }}
          className="text-txt-darkblue font-LeagueSpartan-Bold"
        >
          What should I call you?
        </Text>

        <View className="bg-bg-light rounded-3xl overflow-hidden">
          <TextInput
            className="px-6 py-4 font-LeagueSpartan-Bold text-txt-orange"
            style={{ fontSize: width * 0.05 }}
            placeholder="Enter your nickname"
            placeholderTextColor="#999"
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
            editable={!isLoading}
          />
        </View>

        <Text
          style={{ fontSize: width * 0.04, marginTop: height * 0.02 }}
          className="text-txt-darkblue font-LeagueSpartan"
        >
          This is how Moodi will address you
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleContinue}
        disabled={!nickname.trim() || isLoading}
        style={{
          position: "absolute",
          bottom: height * 0.08,
          paddingVertical: height * 0.02,
          paddingHorizontal: width * 0.08,
          borderRadius: 45,
          opacity: (nickname.trim() && !isLoading) ? 1 : 0.5,
        }}
        className="bg-bg-orange flex-row justify-center items-center"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text
            style={{ fontSize: width * 0.05 }}
            className="text-txt-light font-LeagueSpartan-Bold text-center"
          >
            Continue
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}