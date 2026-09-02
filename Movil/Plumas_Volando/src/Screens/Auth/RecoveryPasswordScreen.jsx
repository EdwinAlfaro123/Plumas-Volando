import React, { useState } from 'react';

import {
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AuthLayout from '../../Components/Auth/AuthLayout';
import AppLogo from '../../Components/Auth/AppLogo';
import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';

import { COLORS } from '../../Constants/theme';
import { authService } from '../../Services/authService';

import {
  RecoveryPasswordStyles as styles,
} from '../../Styles';


const RecoveryPasswordScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  // ==================================================
  // ENVIAR CÓDIGO
  // ==================================================

  const handleSendCode = async () => {

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {

      setError(
        'El correo electrónico es requerido'
      );

      return;

    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(cleanEmail)) {

      setError(
        'Ingresa un correo electrónico válido'
      );

      return;

    }


    setError('');
    setLoading(true);


    try {

      const response =
        await authService.requestPasswordReset(
          cleanEmail
        );


      if (!response.success) {

        Alert.alert(
          'No se pudo enviar el código',
          response.message
        );

        return;

      }


      const recoveryToken =
        response.data?.token;


      if (!recoveryToken) {

        Alert.alert(
          'Error',
          'El servidor no devolvió el token de recuperación.'
        );

        return;

      }


      navigation.navigate(
        'RecoveryCode',
        {
          email: cleanEmail,
          recoveryToken,
        }
      );

    } catch (error) {

      console.error(
        '[RecoveryPassword] Error:',
        error
      );


      Alert.alert(
        'Error',
        'No fue posible enviar el código. Intenta nuevamente.'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <AuthLayout compact>

      <StatusBar style="dark" />


      <View style={styles.screenContainer}>


        {/* BOTÓN VOLVER */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >

          <Ionicons
            name="arrow-back-outline"
            size={20}
            color={COLORS.primaryDark}
          />

        </TouchableOpacity>


        {/* LOGO */}

        <View style={styles.logoContainer}>

          <AppLogo
            size={70}
            showShadow
          />

        </View>


        {/* TARJETA */}

        <View style={styles.card}>

          <View style={styles.header}>

            <View style={styles.titleRow}>

              <Text style={styles.title}>
                Recuperar{'\n'}Contraseña
              </Text>


              <View style={styles.titleIcon}>

                <Ionicons
                  name="lock-open-outline"
                  size={22}
                  color={COLORS.primary}
                />

              </View>

            </View>


            <Text style={styles.subtitle}>
              Ingresa tu correo electrónico y
              te enviaremos un código de
              verificación.
            </Text>

          </View>


          <View style={styles.form}>

            <FormInput
              label="Ingresa tu correo electrónico"
              value={email}
              onChangeText={(value) => {

                setEmail(value);

                if (error) {
                  setError('');
                }

              }}
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              icon="mail-outline"
              error={error}
            />

          </View>


          <View style={styles.actions}>

            <Button
              title="Enviar"
              onPress={handleSendCode}
              loading={loading}
              disabled={loading}
              size="medium"
            />


            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.navigate('Login')
              }
              activeOpacity={0.75}
            >

              <Ionicons
                name="arrow-back-outline"
                size={15}
                color={COLORS.primaryDark}
              />

              <Text style={styles.loginButtonText}>
                Volver al inicio de sesión
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </View>

    </AuthLayout>

  );

};


export default RecoveryPasswordScreen;