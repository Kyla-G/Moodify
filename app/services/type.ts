// Types for the mood entry
export interface MoodEntry {
  mood: string;
  emotion: string;
  day: string;
  date: string;
  time: string;
  journal: string;
  timestamp?: number;
}

// Types for mood colors
export const moodColors = {
  rad: "#FF6B35", // orange
  good: "#31AC54", // green
  meh: "#828282", // gray
  bad: "#507EE3", // blue
  awful: "#C22222", // red
};

// Types for mood emotions
export const moodEmotions = {
  rad: ["energetic", "excited", "confident"],
  good: ["happy", "calm", "grateful", "hopeful"],
  meh: ["bored", "nervous", "confused", "anxious"],
  bad: ["sad", "fearful", "stressed"],
  awful: ["irritated", "angry"],
};