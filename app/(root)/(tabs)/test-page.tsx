import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';

// Import mood PNGs
import MoodRad from '@/assets/icons/MoodRad.png';
import MoodGood from '@/assets/icons/MoodGood.png';
import MoodMeh from '@/assets/icons/MoodMeh.png';
import MoodBad from '@/assets/icons/MoodBad.png';
import MoodAwful from '@/assets/icons/MoodAwful.png';

// Mood mapping for PNGs
const moodIcons = {
  Rad: MoodRad,
  Good: MoodGood,
  Meh: MoodMeh,
  Bad: MoodBad,
  Awful: MoodAwful,
};

// Dummy mood entries
const dummyEntries = [
  { mood: 'Rad', date: '2025-02-15', time: '10:30 AM', journal: 'Had a great day at work!' },
  { mood: 'Bad', date: '2025-02-14', time: '8:15 PM', journal: '' },
  { mood: 'Rad', date: '2025-02-13', time: '2:45 PM', journal: 'Looking forward to the weekend!' },
  { mood: 'Bad', date: '2025-02-12', time: '7:00 AM', journal: 'Feeling a bit off today.' },
  { mood: 'Good', date: '2025-02-11', time: '6:30 PM', journal: 'Had a peaceful evening walk.' },
  { mood: 'Awful', date: '2025-02-10', time: '9:45 AM', journal: 'Workload is overwhelming today.' },
  { mood: 'Good', date: '2025-02-09', time: '5:15 PM', journal: 'Appreciating the little things in life.' },
  { mood: 'Meh', date: '2025-02-08', time: '11:30 PM', journal: '' },
];

export default function EnterMoodScreen() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MMMM yyyy'));

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, alignItems: "center", paddingTop: 20, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation */}
        <View className="flex-row justify-between items-center w-full">
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-white">{selectedMonth}</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-down-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Text 
            style={{ fontSize: 60, textAlign: "center" }} 
            className="text-txt-orange font-LeagueSpartan-Bold mt-60">
            How are you feeling?
          </Text>

       {/* Enter Mood Button */}
        <View className="flex-1 justify-center items-center w-full py-10 mb-40">
        <TouchableOpacity className="bg-[#FF6B35] w-20 h-20 rounded-full shadow-md flex items-center justify-center">
         <Text className="text-white text-6xl font-bold">+</Text>
       </TouchableOpacity>
        </View>


        {/* Mood Entries List */}
        <View className="w-full">
          {dummyEntries.map((entry, index) => {
            const moodIcon = moodIcons[entry.mood];

            return (
              <View key={index} className="bg-[#101011] flex-row items-center p-4 rounded-[16] mb-4 shadow w-full">
                {/* Mood Icon - Use PNG instead of SVG */}
                <Image 
                  source={moodIcon} 
                  style={{ width: 52, height: 52, marginRight: 12, resizeMode: 'contain' }} 
                />

                {/* Mood Details */}
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white">{entry.mood}</Text>
                  <Text className="text-gray-400">{entry.date} at {entry.time}</Text>
                  {entry.journal ? <Text className="text-gray-300 mt-2">{entry.journal}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
