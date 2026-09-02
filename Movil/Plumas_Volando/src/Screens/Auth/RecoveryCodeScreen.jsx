import React, {
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import AuthLayout from '../../Components/Auth/AuthLayout';
import AppLogo from '../../Components/Auth/AppLogo';
import Button from '../../Components/Common/Button';

import { COLORS } from '../../Constants/theme';
import { authService } from '../../Services/authService';

import {
  RecoveryPasswordStyles as styles,
} from '../../Styles';


const RecoveryCodeScreen = ({
  navigation,
  route,
}) => {

  const {
    email,
    recoveryToken: initialToken,
  } = route.params || {};


  const [digits, setDigits] = useState(
    ['', '', '', '', '', '']
  );

  const [recoveryToken, setRecoveryToken] =
    useState(initialToken || '');

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] =
    useState('');


  const inputs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];


  // ==================================================
  // CAMBIAR CADA CARÁCTER
  // ==================================================

  const handleChangeDigit = (
    value,
    index
  ) => {

    const cleanValue = value
      .replace(/[^0-9a-fA-F]/g, '')
      .slice(-1)
      .toLowerCase();


    const newDigits = [...digits];

    newDigits[index] =
      cleanValue;

    setDigits(newDigits);

    setError('');


    if (
      cleanValue &&
      index < inputs.length - 1
    ) {

      inputs[index + 1].current?.focus();

    }

  };


  // ==================================================
  // BACKSPACE
  // ==================================================

  const handleKeyPress = (
    event,
    index
  ) => {

    if (
      event.nativeEvent.key === 'Backspace' &&
      !digits[index] &&
      index > 0
    ) {

      inputs[index - 1].current?.focus();

    }

  };


  // ==================================================
  // VERIFICAR CÓDIGO
  // ==================================================

  const handleVerifyCode = async () => {

    const code =
      digits.join('').toLowerCase();


    if (code.length !== 6) {

      setError(
        'Ingresa los 6 caracteres del código'
      );

      return;

    }


    if (!recoveryToken) {

      Alert.alert(
        'Sesión expirada',
        'Solicita un nuevo código de recuperación.'
      );


      navigation.replace(
        'RecoveryPassword'
      );

      return;

    }


    setError('');
    setLoading(true);


    try {

      const response =
        await authService.verifyRecoveryCode(
          code,
          recoveryToken
        );


      if (!response.success) {

        setError(
          response.message ||
          'El código ingresado no es correcto'
        );

        return;

      }


      const verifiedToken =
        response.data?.token;


      if (!verifiedToken) {

        Alert.alert(
          'Error',
          'No se recibió el token de verificación.'
        );

        return;

      }


      navigation.navigate(
        'NewPassword',
        {
          recoveryToken:
            verifiedToken,
        }
      );

    } catch (error) {

      console.error(
        '[RecoveryCode] Error:',
        error
      );


      Alert.alert(
        'Error',
        'No fue posible verificar el código.'
      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // REENVIAR
  // ==================================================

  const handleResendCode = async () => {

    if (!email) {

      Alert.alert(
        'Error',
        'No se encontró el correo de recuperación.'
      );

      navigation.replace(
        'RecoveryPassword'
      );

      return;

    }


    setResending(true);
    setError('');


    try {

      const response =
        await authService.requestPasswordReset(
          email
        );


      if (!response.success) {

        Alert.alert(
          'Error',
          response.message
        );

        return;

      }


      const newToken =
        response.data?.token;


      if (newToken) {

        setRecoveryToken(
          newToken
        );

      }


      setDigits(
        ['', '', '', '', '', '']
      );


      inputs[0].current?.focus();


      Alert.alert(
        'Código reenviado',
        'Hemos enviado un nuevo código a tu correo electrónico.'
      );

    } catch (error) {

      console.error(
        '[RecoveryCode] Reenvío:',
        error
      );


      Alert.alert(
        'Error',
        'No fue posible reenviar el código.'
      );

    } finally {

      setResending(false);

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
              Ingresa el código de verificación
              que enviamos a tu correo.
            </Text>

          </View>


          {/* CÓDIGO */}

          <View style={styles.codeSection}>

            <Text style={styles.fieldLabel}>
              Ingresa código de verificación
            </Text>


            <View style={styles.codeContainer}>

              {digits.map(
                (digit, index) => (

                  <View
                    key={index}
                    style={[
                      styles.codeInputOuter,
                      digit &&
                        styles.codeInputFilled,
                      error &&
                        styles.codeInputError,
                    ]}
                  >

                    <View
                      style={
                        styles.codeInputHighlight
                      }
                    />


                    <TextInput
                      ref={inputs[index]}
                      style={styles.codeInput}
                      value={digit}
                      onChangeText={(value) =>
                        handleChangeDigit(
                          value,
                          index
                        )
                      }
                      onKeyPress={(event) =>
                        handleKeyPress(
                          event,
                          index
                        )
                      }
                      maxLength={1}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textAlign="center"
                      selectionColor={
                        COLORS.primary
                      }
                      returnKeyType="next"
                    />

                  </View>

                )
              )}

            </View>


            {error ? (

              <View style={styles.errorRow}>

                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={COLORS.error}
                />

                <Text
                  style={styles.errorText}
                >
                  {error}
                </Text>

              </View>

            ) : null}


            <View style={styles.resendContainer}>

              <Text style={styles.resendQuestion}>
                ¿No recibiste el código?
              </Text>


              <TouchableOpacity
                onPress={handleResendCode}
                disabled={resending}
                activeOpacity={0.7}
              >

                <Text style={styles.resendLink}>

                  {resending
                    ? 'Reenviando...'
                    : 'Reenviar'}

                </Text>

              </TouchableOpacity>

            </View>

          </View>


          <View style={styles.actions}>

            <Button
              title="Ingresar"
              onPress={handleVerifyCode}
              loading={loading}
              disabled={
                loading ||
                resending
              }
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


export default RecoveryCodeScreen;