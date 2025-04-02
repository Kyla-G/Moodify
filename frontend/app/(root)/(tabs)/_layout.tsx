import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../(tabs)/home-page";
import ChatbotStartScreen from "../(tabs)/chatbot-start";
import ChatbotPageScreen from "../(tabs)/chatbot-page";
import CalendarScreen from "../(tabs)/calendar-page";
import StatsScreen from "../(tabs)/stats-page";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ChatbotStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatbotStart" component={ChatbotStartScreen} />
      <Stack.Screen name="ChatbotPage" component={ChatbotPageScreen} />
    </Stack.Navigator>
  );
}

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Chatbot") iconName = "chatbubble-ellipses";
          else if (route.name === "Calendar") iconName = "calendar";
          else if (route.name === "Stats") iconName = "bar-chart";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#442920",
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}