import React, {
  useContext,
} from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  AuthContext,
} from '../Context/AuthContext';

import LoginScreen
  from '../Screens/Auth/LoginScreen';

import RegisterScreen
  from '../Screens/Auth/RegisterScreen';

import RecoveryPasswordScreen
  from '../Screens/Auth/RecoveryPasswordScreen';

import RecoveryCodeScreen
  from '../Screens/Auth/RecoveryCodeScreen';

import NewPasswordScreen
  from '../Screens/Auth/NewPasswordScreen';

import TabNavigator
  from './TabNavigator';

import InvoiceDetailScreen
  from '../Screens/Invoices/InvoiceDetailScreen';


const Stack =
  createNativeStackNavigator();


const AppNavigator = () => {

  const {
    isAuthenticated,
    loading,
  } = useContext(AuthContext);


  if (loading) {

    return null;

  }


  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >

      {isAuthenticated ? (

        <>

          <Stack.Screen
            name="Main"
            component={TabNavigator}
          />


          <Stack.Screen
            name="InvoiceDetail"
            component={
              InvoiceDetailScreen
            }
          />

        </>

      ) : (

        <>

          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />


          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />


          {/* PASO 1 - CORREO */}

          <Stack.Screen
            name="RecoveryPassword"
            component={
              RecoveryPasswordScreen
            }
          />


          {/* PASO 2 - CÓDIGO */}

          <Stack.Screen
            name="RecoveryCode"
            component={
              RecoveryCodeScreen
            }
          />


          {/* PASO 3 - NUEVA CONTRASEÑA */}

          <Stack.Screen
            name="NewPassword"
            component={
              NewPasswordScreen
            }
          />

        </>

      )}

    </Stack.Navigator>

  );

};


export default AppNavigator;