import axios from "axios";

// Replace with your ngrok/public/local server URL
const BASE_URL = "http://192.168.1.7:3000"; 

// "http://localhost:3000"; sa postman ganto
//lagay mo local ip add mo NYHAHAHA like http://192.162.1.5:3000

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
