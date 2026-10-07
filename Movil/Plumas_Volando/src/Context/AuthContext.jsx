import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../Services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                     = useState(null);
  const [userType, setUserType]             = useState('customer'); // 'customer' | 'employee'
  const [loading, setLoading]               = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token    = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      const type     = await AsyncStorage.getItem('userType') || 'customer';
      const photo    = await AsyncStorage.getItem('profilePhoto');

      if (token && userData) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setUserType(type);
        setIsAuthenticated(true);
        // Preferir foto guardada en DB; si no, usar la del AsyncStorage local
        const dbPhoto = parsedUser?.profilePhoto;
        if (dbPhoto) setProfilePhotoUri(dbPhoto);
        else if (photo) setProfilePhotoUri(photo);
      }
    } catch (error) {
      console.log('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Login unificado: prueba cliente primero, luego empleado ──
  const login = async (email, password) => {
    // Intento 1: cliente
    try {
      const res = await api.post('/loginCustomer', { email, password });
      if (res.data.success) {
        const { token, customer } = res.data;
        await AsyncStorage.multiSet([
          ['authToken', token],
          ['userData', JSON.stringify(customer)],
          ['userType', 'customer'],
        ]);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(customer);
        setUserType('customer');
        setIsAuthenticated(true);
        if (customer.profilePhoto) setProfilePhotoUri(customer.profilePhoto);
        return { success: true };
      }
    } catch {
      // no era cliente, intentar como empleado
    }

    // Intento 2: empleado
    const res = await api.post('/loginEmployee', { email, password });
    if (res.data.success) {
      const { token, employee } = res.data;
      await AsyncStorage.multiSet([
        ['authToken', token],
        ['userData', JSON.stringify(employee)],
        ['userType', 'employee'],
      ]);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(employee);
      setUserType('employee');
      setIsAuthenticated(true);
      if (employee.profilePhoto) setProfilePhotoUri(employee.profilePhoto);
      return { success: true };
    }
    throw new Error(res.data.message || 'Correo o contraseña incorrectos.');
  };

  // ── loginEmployee se mantiene por compatibilidad interna ──
  const loginEmployee = async (email, password) => login(email, password);

  // ── Logout ──
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData', 'userType', 'profilePhoto']);
      delete api.defaults.headers.Authorization;
      setUser(null);
      setUserType('customer');
      setIsAuthenticated(false);
      setProfilePhotoUri(null);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  // ── Actualizar datos de usuario ──
  const updateUser = (userData) => {
    setUser(userData);
    AsyncStorage.setItem('userData', JSON.stringify(userData));
  };

  // ── Actualizar foto de perfil ──
  const updateProfilePhoto = (uri) => {
    setProfilePhotoUri(uri);
    if (uri) {
      AsyncStorage.setItem('profilePhoto', uri);
    } else {
      AsyncStorage.removeItem('profilePhoto');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      loading,
      isAuthenticated,
      profilePhotoUri,
      login,
      loginEmployee,
      logout,
      updateUser,
      updateProfilePhoto,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
