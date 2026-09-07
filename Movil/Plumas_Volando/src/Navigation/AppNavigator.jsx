import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../Context/AuthContext';
import LoginScreen from '../Screens/Auth/LoginScreen';
import RegisterScreen from '../Screens/Auth/RegisterScreen';
import RecoveryPasswordScreen from '../Screens/Auth/RecoveryPasswordScreen';
import RecoveryCodeScreen from '../Screens/Auth/RecoveryCodeScreen';
import NewPasswordScreen from '../Screens/Auth/NewPasswordScreen';
import AppLoadingScreen from '../Screens/AppLoadingScreen';
import TabNavigator from './TabNavigator';
import InvoiceDetailScreen from '../Screens/Invoices/InvoiceDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return <AppLoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ animation: 'fade', headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen component={TabNavigator} name="Main" />
          <Stack.Screen component={InvoiceDetailScreen} name="InvoiceDetail" />
        </>
      ) : (
        <>
          <Stack.Screen component={LoginScreen} name="Login" />
          <Stack.Screen component={RegisterScreen} name="Register" />
          <Stack.Screen component={RecoveryPasswordScreen} name="RecoveryPassword" />
          <Stack.Screen component={RecoveryCodeScreen} name="RecoveryCode" />
          <Stack.Screen component={NewPasswordScreen} name="NewPassword" />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
