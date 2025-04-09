import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../(tabs)/home-page";
import ChatbotStartScreen from "../(tabs)/chatbot-start";
import ChatbotPageScreen from "../(tabs)/chatbot-page";
import CalendarScreen from "../(tabs)/calendar-page";
import StatsScreen from "../(tabs)/stats-page";
import { useTheme } from "@/app/(root)/properties/themecontext"; // Import the theme context

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
  const { theme } = useTheme(); // Use the theme context to access current theme
  
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
        // Use theme colors for tab bar
        tabBarActiveTintColor: theme.buttonBg, // Use the theme's button color for active tabs
        tabBarInactiveTintColor: theme.dimmedText, // Use dimmed text color for inactive tabs
        tabBarStyle: {
          backgroundColor: theme.background, // Use theme background color
          borderTopWidth: 0,
        },
        // Set header style if you ever enable headers
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
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