import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../Context/AuthContext';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import RecoveryPasswordScreen from '../Screens/Auth/RecoveryPasswordScreen';
import TabNavigator from './TabNavigator'; // Navegador de pestañas
import InvoiceDetailScreen from '../Screens/Invoices/InvoiceDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Podrías poner un SplashScreen aquí
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RecoverPassword" component={RecoveryPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;