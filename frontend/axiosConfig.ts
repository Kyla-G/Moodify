import axios from "axios";

// Replace with your ngrok/public/local server URL
const BASE_URL = "http://192.168.1.7:3000"; 

// "http://localhost:3000"; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
