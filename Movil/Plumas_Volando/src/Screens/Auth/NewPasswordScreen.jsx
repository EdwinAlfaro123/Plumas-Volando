import React, { useState } from 'react';

import {
  View,
  Text,
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
import { useToast } from '../../Context/ToastContext';

import {
  RecoveryPasswordStyles as styles,
} from '../../Styles';


const NewPasswordScreen = ({
  navigation,
  route,
}) => {

  const recoveryToken =
    route.params?.recoveryToken;


  const [newPassword, setNewPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const { showToast } = useToast();


  // ==================================================
  // VALIDAR
  // ==================================================

  const validateForm = () => {

    const newErrors = {};


    if (!newPassword) {

      newErrors.newPassword =
        'La nueva contraseña es requerida';

    } else if (
      newPassword.length < 8
    ) {

      newErrors.newPassword =
        'La contraseña debe tener al menos 8 caracteres';

    }


    if (!confirmPassword) {

      newErrors.confirmPassword =
        'Confirma tu nueva contraseña';

    } else if (
      newPassword !== confirmPassword
    ) {

      newErrors.confirmPassword =
        'Las contraseñas no coinciden';

    }


    setErrors(newErrors);


    return (
      Object.keys(newErrors).length === 0
    );

  };


  // ==================================================
  // CAMBIAR CONTRASEÑA
  // ==================================================

  const handleUpdatePassword = async () => {

    if (!validateForm()) {
      return;
    }


    if (!recoveryToken) {

      showToast(
        'Sesión expirada. Solicita nuevamente la recuperación.',
        'warning'
      );

      navigation.replace('RecoveryPassword');

      return;

    }


    setLoading(true);


    try {

      const response =
        await authService.updatePassword(
          newPassword,
          confirmPassword,
          recoveryToken
        );


      if (!response.success) {

        showToast(
          response.message ||
            'No se pudo cambiar la contraseña.',
          'error'
        );

        return;

      }


      showToast(
        'Contraseña actualizada. Ya puedes iniciar sesión.',
        'success'
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {

      console.error(
        '[NewPassword] Error:',
        error
      );


      showToast(
        'No fue posible actualizar tu contraseña.',
        'error'
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <AuthLayout compact>

      <StatusBar style="dark" />


      <View style={styles.screenContainer}>


        {/* VOLVER */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
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
              Crea una nueva contraseña para
              recuperar el acceso a tu cuenta.
            </Text>

          </View>


          <View style={styles.form}>

            <FormInput
              label="Ingresa tu nueva contraseña"
              value={newPassword}
              onChangeText={(value) => {

                setNewPassword(value);

                if (errors.newPassword) {

                  setErrors(
                    (previous) => ({
                      ...previous,
                      newPassword: '',
                    })
                  );

                }

              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock-closed-outline"
              error={errors.newPassword}
            />


            <FormInput
              label="Confirmar tu nueva contraseña"
              value={confirmPassword}
              onChangeText={(value) => {

                setConfirmPassword(value);

                if (
                  errors.confirmPassword
                ) {

                  setErrors(
                    (previous) => ({
                      ...previous,
                      confirmPassword: '',
                    })
                  );

                }

              }}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              icon="lock-closed-outline"
              error={
                errors.confirmPassword
              }
            />


            <Text style={styles.passwordHint}>
              La contraseña debe contener
              al menos 8 caracteres.
            </Text>

          </View>


          <View style={styles.actions}>

            <Button
              title="Cambiar contraseña"
              onPress={
                handleUpdatePassword
              }
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


export default NewPasswordScreen;
