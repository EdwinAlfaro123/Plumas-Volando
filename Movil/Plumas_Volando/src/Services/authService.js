import api from './api';

import AsyncStorage
  from '@react-native-async-storage/async-storage';


const AUTH_TOKEN_KEY =
  'authToken';

const USER_DATA_KEY =
  'userData';


export const authService = {


  // ==================================================
  // INICIAR SESIÓN
  // ==================================================

  login: async (
    email,
    password
  ) => {

    try {

      const response =
        await api.post(
          '/loginCustomer',
          {
            email,
            password,
          }
        );


      if (response.data.success) {

        const {
          token,
          customer,
        } = response.data;


        await AsyncStorage.setItem(
          AUTH_TOKEN_KEY,
          token
        );


        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(customer)
        );


        api.defaults.headers.Authorization =
          `Bearer ${token}`;


        return {
          success: true,
          user: customer,
        };

      }


      return {
        success: false,

        message:
          response.data.message ||
          'Error al iniciar sesión',
      };

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          'Error al iniciar sesión',
      };

    }

  },


  // ==================================================
  // REGISTRAR
  // ==================================================

  register: async (
    userData
  ) => {

    try {

      const response =
        await api.post(
          '/registerCustomer',
          userData
        );


      return {
        success: true,
        data: response.data,
      };

    } catch (error) {

      return {
        success: false,

        message:
          error.response?.data?.message ||
          'Error al registrar usuario',
      };

    }

  },


  // ==================================================
  // CERRAR SESIÓN
  // ==================================================

  logout: async () => {

    try {

      await AsyncStorage.removeItem(
        AUTH_TOKEN_KEY
      );


      await AsyncStorage.removeItem(
        USER_DATA_KEY
      );


      delete (
        api.defaults.headers.Authorization
      );


      return {
        success: true,
      };

    } catch (error) {

      return {
        success: false,
        message:
          'Error al cerrar sesión',
      };

    }

  },


  // ==================================================
  // USUARIO ACTUAL
  // ==================================================

  getCurrentUser: async () => {

    try {

      const userData =
        await AsyncStorage.getItem(
          USER_DATA_KEY
        );


      if (userData) {

        return {
          success: true,

          user:
            JSON.parse(userData),
        };

      }


      return {
        success: false,
        user: null,
      };

    } catch (error) {

      return {
        success: false,
        user: null,
      };

    }

  },


  // ==================================================
  // VERIFICAR SESIÓN
  // ==================================================

  isAuthenticated: async () => {

    try {

      const token =
        await AsyncStorage.getItem(
          AUTH_TOKEN_KEY
        );


      return !!token;

    } catch (error) {

      return false;

    }

  },


  // ==================================================
  // RECUPERACIÓN - PASO 1
  // ENVIAR CÓDIGO
  // ==================================================

  requestPasswordReset:
    async (email) => {

      try {

        const response =
          await api.post(
            '/recoveryPasswordCustomer/requestCode',
            {
              email,
            }
          );


        return {
          success: true,
          data: response.data,
        };

      } catch (error) {

        return {
          success: false,

          message:
            error.response?.data?.message ||
            'No se pudo enviar el código de recuperación',
        };

      }

    },


  // ==================================================
  // RECUPERACIÓN - PASO 2
  // VERIFICAR CÓDIGO
  // ==================================================

  verifyRecoveryCode:
    async (
      code,
      recoveryToken
    ) => {

      try {

        const response =
          await api.post(
            '/recoveryPasswordCustomer/verifyCode',
            {
              code,
              token: recoveryToken,
            }
          );


        return {
          success: true,
          data: response.data,
        };

      } catch (error) {

        return {
          success: false,

          message:
            error.response?.data?.message ||
            'El código ingresado no es válido',
        };

      }

    },


  // ==================================================
  // RECUPERACIÓN - PASO 3
  // NUEVA CONTRASEÑA
  // ==================================================

  updatePassword:
    async (
      newPassword,
      confirmPassword,
      recoveryToken
    ) => {

      try {

        const response =
          await api.post(
            '/recoveryPasswordCustomer/newPassword',
            {
              newPassword,

              confirmNewPassword:
                confirmPassword,

              token:
                recoveryToken,
            }
          );


        return {
          success: true,
          data: response.data,
        };

      } catch (error) {

        return {
          success: false,

          message:
            error.response?.data?.message ||
            'No se pudo actualizar la contraseña',
        };

      }

    },

};


export default authService;