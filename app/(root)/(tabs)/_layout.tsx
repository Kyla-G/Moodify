import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import HomeScreen from '../(tabs)/home-page';
import ChatbotScreen from '../(tabs)/chatbot-page';
import CalendarScreen from '../(tabs)/calendar-page';
import StatsScreen from '../(tabs)/stats-page';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Chatbot') iconName = 'chatbubble-ellipses';
          else if (route.name === 'Calendar') iconName = 'calendar';
          else if (route.name === 'Stats') iconName = 'bar-chart';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#442920',
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
    </Tab.Navigator>
  );
}
