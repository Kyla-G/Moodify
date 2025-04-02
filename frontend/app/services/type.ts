// Types for the mood entry
export interface moodEntry {
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