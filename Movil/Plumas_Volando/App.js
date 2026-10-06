// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/Context/AuthContext';
import { CartProvider } from './src/Context/CartContext';
import { ToastProvider } from './src/Context/ToastContext';
import AppNavigator from './src/Navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import Toast from './src/Components/Common/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </CartProvider>
        </AuthProvider>
        {/* Toast fuera de NavigationContainer para que aparezca sobre todo */}
        <Toast />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
