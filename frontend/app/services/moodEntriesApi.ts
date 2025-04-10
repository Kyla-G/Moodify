import { format } from 'date-fns';

// Initial seed data with dates before the current date (April 11, 2025)
// Three entries do not have journal entries
const initialEntries = [
  {
    mood: "rad",
    emotion: "Excited",
    day: "Thursday",
    date: "April 10, 2025",
    time: "9:30 AM",
    journal: "Feeling great today! Started a new project.",
    timestamp: new Date("2025-04-10T09:30:00").getTime(),
    formattedDate: "2025-04-10" // For calendar screen lookup
  },
  {
    mood: "bad",
    emotion: "Frustrated",
    day: "Wednesday",
    date: "April 9, 2025",
    time: "8:45 PM",
    timestamp: new Date("2025-04-09T20:45:00").getTime(),
    formattedDate: "2025-04-09"
  },
  {
    mood: "rad",
    emotion: "Energetic",
    day: "Tuesday",
    date: "April 8, 2025",
    time: "10:15 AM",
    journal: "Got a promotion at work! So happy!",
    timestamp: new Date("2025-04-08T10:15:00").getTime(),
    formattedDate: "2025-04-08"
  },
  {
    mood: "bad",
    emotion: "Anxious",
    day: "Monday",
    date: "April 7, 2025",
    time: "3:20 PM",
    timestamp: new Date("2025-04-07T15:20:00").getTime(),
    formattedDate: "2025-04-07"
  },
  {
    mood: "good",
    emotion: "Content",
    day: "Sunday",
    date: "April 6, 2025",
    time: "7:00 PM",
    journal: "Relaxing evening with a good book.",
    timestamp: new Date("2025-04-06T19:00:00").getTime(),
    formattedDate: "2025-04-06"
  },
  {
    mood: "awful",
    emotion: "Depressed",
    day: "Saturday",
    date: "April 5, 2025",
    time: "11:45 AM",
    journal: "Got some bad news and everything feels overwhelming.",
    timestamp: new Date("2025-04-05T11:45:00").getTime(),
    formattedDate: "2025-04-05"
  },
  {
    mood: "good",
    emotion: "Peaceful",
    day: "Friday",
    date: "April 4, 2025",
    time: "4:30 PM",
    journal: "Spent time in nature and felt very calm.",
    timestamp: new Date("2025-04-04T16:30:00").getTime(),
    formattedDate: "2025-04-04"
  },
  {
    mood: "meh",
    emotion: "Bored",
    day: "Thursday",
    date: "April 3, 2025",
    time: "2:15 PM",
    timestamp: new Date("2025-04-03T14:15:00").getTime(),
    formattedDate: "2025-04-03"
  },
  {
    mood: "good",
    emotion: "Hopeful",
    day: "Wednesday",
    date: "April 2, 2025",
    time: "8:30 AM",
    journal: "Starting the day with a positive mindset.",
    timestamp: new Date("2025-04-02T08:30:00").getTime(),
    formattedDate: "2025-04-02"
  },
  {
    mood: "meh",
    emotion: "Tired",
    day: "Tuesday",
    date: "April 1, 2025",
    time: "9:45 PM",
    journal: "Long day, feeling exhausted.",
    timestamp: new Date("2025-04-01T21:45:00").getTime(),
    formattedDate: "2025-04-01"
  }
];

// Our in-memory database of mood entries
let moodEntries = [...initialEntries];

// For handling changes to data
const listeners = [];

/**
 * Subscribe to data changes
 * @param listener Function to call when data changes
 * @returns Unsubscribe function
 */
export const subscribeToChanges = (listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

/**
 * Notify all listeners of a data change
 */
const notifyChanges = () => {
  listeners.forEach(listener => listener());
};

/**
 * Get all mood entries
 * @returns Array of mood entries
 */
export const getAllMoodEntries = () => {
  return [...moodEntries];
};

/**
 * Get a mood entry by its timestamp
 * @param timestamp The timestamp to look up
 * @returns The mood entry or undefined if not found
 */
export const getMoodEntryByTimestamp = (timestamp) => {
  return moodEntries.find(entry => entry.timestamp === timestamp);
};

/**
 * Get a mood entry by its date
 * @param dateString Date string in "YYYY-MM-DD" format
 * @returns The mood entry or undefined if not found
 */
export const getMoodEntryByDate = (dateString) => {
  return moodEntries.find(entry => entry.formattedDate === dateString);
};

/**
 * Add a new mood entry
 * @param entry The mood entry to add
 * @returns The added entry
 */
export const addMoodEntry = (entry) => {
  // Make sure we have the formatted date for calendar lookup
  if (!entry.formattedDate && entry.timestamp) {
    entry.formattedDate = format(new Date(entry.timestamp), "yyyy-MM-dd");
  }
  
  // Check if we're updating an existing entry
  const existingEntryIndex = moodEntries.findIndex(
    e => e.formattedDate === entry.formattedDate
  );
  
  if (existingEntryIndex >= 0) {
    // Update existing entry
    moodEntries[existingEntryIndex] = entry;
  } else {
    // Add new entry
    moodEntries.push(entry);
  }
  
  // Sort entries by timestamp, newest first
  moodEntries.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  
  notifyChanges();
  return entry;
};

/**
 * Update an existing mood entry
 * @param updatedEntry The updated mood entry
 * @returns The updated entry or undefined if not found
 */
export const updateMoodEntry = (updatedEntry) => {
  const index = moodEntries.findIndex(entry => entry.timestamp === updatedEntry.timestamp);
  
  if (index === -1) {
    return undefined;
  }
  
  moodEntries[index] = updatedEntry;
  notifyChanges();
  return updatedEntry;
};

/**
 * Delete a mood entry
 * @param timestamp The timestamp of the entry to delete
 * @returns True if deleted, false if not found
 */
export const deleteMoodEntry = (timestamp) => {
  const index = moodEntries.findIndex(entry => entry.timestamp === timestamp);
  
  if (index === -1) {
    return false;
  }
  
  moodEntries.splice(index, 1);
  notifyChanges();
  return true;
};

/**
 * Get mood entries formatted for calendar display
 * @returns Array of entries with format { mood: string, date: string }
 */
export const getMoodEntriesForCalendar = () => {
  return moodEntries.map(entry => ({
    mood: entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1), // Capitalize for calendar
    date: entry.formattedDate
  }));
};

/**
 * Reset to initial data (for testing)
 */
export const resetToInitialData = () => {
  moodEntries = [...initialEntries];
  notifyChanges();
};