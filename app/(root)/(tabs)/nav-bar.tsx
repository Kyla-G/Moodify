import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './(tabs)/home-page';
import SettingsPage from './(tabs)/settings-page';
import EntryDetailsPage from './(tabs)/entry-details-page';
import ChatbotPage from './(tabs)/chatbot-page';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false }} />
      <Stack.Screen name="EntryDetailsPage" component={EntryDetailsPage} options={{ headerShown: false }} />
      <Stack.Screen name="ChatbotPage" component={ChatbotPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}