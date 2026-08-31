import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lee la URL del backend desde la variable de entorno del .env
// Fallback al servidor en Render en caso de que la variable no esté disponible
const BASE_URL = process.env.PLUMAS_VOLANDO_PUBLIC_URL || 'https://plumas-volandot.onrender.com';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s — Render puede tardar en despertar si estaba en reposo
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Timeout — el servidor tardó demasiado en responder');
    } else if (!error.response) {
      console.error('[API] Error de red — verifica tu conexión o que el servidor esté activo:', error.message);
    } else if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default api;
