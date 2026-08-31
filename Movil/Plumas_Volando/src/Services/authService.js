import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export const authService = {
  // Iniciar sesión
  login: async (email, password) => {
    try {
      const response = await api.post('/loginCustomer', { email, password });
      
      if (response.data.success) {
        const { token, customer } = response.data;
        
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(customer));
        
        api.defaults.headers.Authorization = `Bearer ${token}`;
        
        return { success: true, user: customer };
      }
      
      return { success: false, message: response.data.message || 'Error al iniciar sesión' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  },

  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await api.post('/registerCustomer', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
      };
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      delete api.defaults.headers.Authorization;
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al cerrar sesión' };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        return { success: true, user: JSON.parse(userData) };
      }
      return { success: false, user: null };
    } catch (error) {
      return { success: false, user: null };
    }
  },

  // Verificar si está autenticado
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Recuperar contraseña SOLICITAR (solo esta función, sin código intermedio)
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/recoveryPasswordCustomer/requestCode', { email });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al solicitar recuperación',
      };
    }
  },

  // Recuperar contraseña CAMBIAR (esta reemplaza a verificar código y nueva contraseña)
  updatePassword: async (newPassword, confirmPassword) => {
    try {
      const response = await api.post('/recoveryPasswordCustomer/newPassword', {
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar contraseña',
      };
    }
  },
};

export default authService;