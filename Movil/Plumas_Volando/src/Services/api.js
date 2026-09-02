import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ============================================================
// URL DEL BACKEND
// ============================================================

const BASE_URL =
  'https://plumas-volandot.onrender.com';

const API_URL =
  `${BASE_URL}/api`;


// ============================================================
// AXIOS
// ============================================================

const api = axios.create({

  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  timeout: 30000,

});


// ============================================================
// REQUEST
// ============================================================

api.interceptors.request.use(

  async (config) => {

    try {

      const token =
        await AsyncStorage.getItem(
          'authToken'
        );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;

      }

    } catch (error) {

      console.warn(
        '[API] Error obteniendo token:',
        error.message
      );

    }


    console.log(
      '[API] Request:',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );


    return config;

  },

  (error) => {

    console.error(
      '[API] Request error:',
      error
    );

    return Promise.reject(error);

  }

);


// ============================================================
// RESPONSE
// ============================================================

api.interceptors.response.use(

  (response) => {

    console.log(
      '[API] Response:',
      response.status,
      response.config?.url
    );

    return response;

  },

  async (error) => {

    if (!error.response) {

      console.error(
        '[API] Network Error'
      );

      console.error(
        '[API] URL:',
        `${error.config?.baseURL || ''}${error.config?.url || ''}`
      );

      console.error(
        '[API] Mensaje:',
        error.message
      );

    }

    else {

      console.error(
        '[API] HTTP Error:',
        error.response.status
      );

      console.error(
        '[API] Data:',
        error.response.data
      );

    }


    if (
      error.response?.status === 401
    ) {

      await AsyncStorage.removeItem(
        'authToken'
      );

      await AsyncStorage.removeItem(
        'userData'
      );

    }


    return Promise.reject(error);

  }

);


export default api;