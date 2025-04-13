// XpStreakManager.tsx
import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import XpStreakPopup from '../(tabs)/xp-streak-modal';

interface XpHistoryState {
  lastMoodEntryDate: string | null;
  lastChatbotRatingDate: string | null;
}

interface XpStreakManagerProps {
  selectedDate: Date;
  onMoodEntrySaved: boolean;
  onChatbotRating: boolean;
}

export default function XpStreakManager({ 
  selectedDate, 
  onMoodEntrySaved, 
  onChatbotRating 
}: XpStreakManagerProps) {
  // XP and streak state
  const [xpHistory, setXpHistory] = useState<XpHistoryState>({
    lastMoodEntryDate: null,
    lastChatbotRatingDate: null
  });
  const [xpAmount, setXpAmount] = useState<number>(0);
  const [xpSource, setXpSource] = useState<'mood_entry' | 'chatbot_rating' | null>(null);
  const [calculatedTotalXp, setTotalXp] = useState<number>(0); 
  const [streak, setStreak] = useState<number>(0);
  const [xpPopupVisible, setXpPopupVisible] = useState<boolean>(false);

  // Handle mood entry XP rewards
  const handleMoodEntryXp = () => {
    // Check if entry is for today
    const today = new Date();
    const isPastDay = !isSameDay(selectedDate, today);
  
    // Check if already earned XP for mood entry today
    const todayDateString = format(today, "yyyy-MM-dd");
    const alreadyEarnedToday = xpHistory.lastMoodEntryDate === todayDateString;

    // Only give XP for current day entries and if not already earned today
    if (!isPastDay && !alreadyEarnedToday) {
      // Update XP and streak
      setTotalXp(prev => prev + 5);
      setStreak(prev => prev + 1);

      // Set XP popup info
      setXpAmount(5);
      setXpSource('mood_entry');
      
      // Record that XP was earned today
      setXpHistory(prev => ({
        ...prev,
        lastMoodEntryDate: todayDateString
      }));
      
      // Show XP popup
      setTimeout(() => {
        setXpPopupVisible(true);
      }, 300);
    }
  };

  // Handle chatbot rating XP rewards
  const handleChatbotRatingXp = () => {
    // Check if already earned XP for chatbot rating today
    const today = new Date();
    const todayDateString = format(today, "yyyy-MM-dd");
    const alreadyEarnedToday = xpHistory.lastChatbotRatingDate === todayDateString;
    
    if (!alreadyEarnedToday) {
      // Update XP (no streak update for chatbot rating)
      setTotalXp(prev => prev + 20);
      
      // Set XP popup info
      setXpAmount(20);
      setXpSource('chatbot_rating');
      
      // Record that XP was earned today
      setXpHistory(prev => ({
        ...prev,
        lastChatbotRatingDate: todayDateString
      }));
      
      // Show XP popup
      setXpPopupVisible(true);
    }
  };

  // Listen for mood entry saved events
  useEffect(() => {
    if (onMoodEntrySaved) {
      handleMoodEntryXp();
    }
  }, [onMoodEntrySaved]);

  // Listen for chatbot rating events
  useEffect(() => {
    if (onChatbotRating) {
      handleChatbotRatingXp();
    }
  }, [onChatbotRating]);

  const closeXpPopup = () => {
    setXpPopupVisible(false);
  };

  return (
    <XpStreakPopup 
      visible={xpPopupVisible}
      onClose={closeXpPopup}
      calculatedTotalXp={calculatedTotalXp}
      streak={streak}
      xpAmount={xpAmount}
      xpSource={xpSource}
      isPastDay={selectedDate && !isSameDay(selectedDate, new Date())}
    />
  );
}