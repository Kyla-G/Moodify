import axios from "axios";

// Dummy Data (For Local Testing)
const dummyEntries = [
  { mood: "Rad", date: "2025-02-15", time: "10:30 AM", journal: "Had a great day at work!" },
  { mood: "Good", date: "2025-02-14", time: "5:45 PM", journal: "Productive coding session." },
  { mood: "Meh", date: "2025-02-13", time: "2:20 PM", journal: "" },
  { mood: "Bad", date: "2025-02-12", time: "8:15 PM", journal: "Feeling overwhelmed with tasks." },
];

const API_URL = "https://your-api-url.com"; // Replace with your actual API

// Function to Get Mood Entries
export const getMoodEntries = async () => {
  try {
    const response = await axios.get(`${API_URL}/mood-entries`);
    return response.data || dummyEntries; // Use API data if available, otherwise return dummy data
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    return dummyEntries; // Return dummy data on error
  }
};
