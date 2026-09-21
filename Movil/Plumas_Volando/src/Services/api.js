import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================================
// URL DEL BACKEND
// ============================================================
const BASE_URL = "https://plumas-volandot.onrender.com";
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("userData");
      
      // Disparar evento para logout
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:tokenExpired"));
      }
    }
    return Promise.reject(error);
  }
);

export default api;