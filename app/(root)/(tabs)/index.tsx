import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="title">Moodify</Text>
      <Link href="/on-boarding-page1">Get Started</Link>
    </View>
  );
}
