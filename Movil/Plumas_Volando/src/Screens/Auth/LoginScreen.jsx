import React, { useState, useContext } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';

import { COLORS } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';

import LogoImage from '../../../assets/logo-plumas.png';
import BackgroundImage from '../../../assets/pattern-bg.png';

import { LoginStyles as styles } from '../../Styles';


const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});


  const { login } = useContext(AuthContext);


  const validateForm = () => {

    const newErrors = {};


    if (!email) {

      newErrors.email =
        'El correo electrónico es requerido';

    } else if (!/\S+@\S+\.\S+/.test(email)) {

      newErrors.email =
        'Correo electrónico inválido';

    }


    if (!password) {

      newErrors.password =
        'La contraseña es requerida';

    } else if (password.length < 8) {

      newErrors.password =
        'Mínimo 8 caracteres';

    }


    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;

  };


  const handleLogin = async () => {

    if (!validateForm()) return;


    setLoading(true);


    try {

      await login(
        email,
        password
      );

    } catch (error) {

      Alert.alert(
        'Error al iniciar sesión',

        error.message ||
          'Verifica tus credenciales e intenta de nuevo.'
      );

    } finally {

      setLoading(false);

    }

  };


  const renderLoginButton = () => (

    <TouchableOpacity
      style={[
        styles.loginButtonWrapper,

        loading &&
          styles.loginButtonDisabled,
      ]}
      onPress={handleLogin}
      disabled={loading}
      activeOpacity={0.88}
    >

      <View style={styles.buttonHighlight} />


      <View style={styles.loginButtonContent}>

        {loading ? (

          <View style={styles.loadingContainer}>

            <ActivityIndicator
              size="small"
              color={COLORS.primary}
            />

            <Text style={styles.loadingText}>
              Iniciando sesión...
            </Text>

          </View>

        ) : (

          <>

            <Text style={styles.loginButtonText}>
              Iniciar Sesión
            </Text>


            <View style={styles.buttonIcon}>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={COLORS.primary}
              />

            </View>

          </>

        )}

      </View>

    </TouchableOpacity>

  );


  return (

    <View style={styles.screen}>

      <StatusBar style="dark" />


      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >


          {/* HERO / IMAGEN DEL MOCKUP */}

          <View style={styles.heroContainer}>

            <ImageBackground
              source={BackgroundImage}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
              resizeMode="cover"
            >

              <View style={styles.heroOverlay} />


              {/* LOGO */}

              <View style={styles.logoOuter}>

                <View style={styles.logoHighlight} />


                <View style={styles.logoInner}>

                  <Image
                    source={LogoImage}
                    style={styles.logoImage}
                  />

                </View>

              </View>

            </ImageBackground>

          </View>


          {/* PANEL PRINCIPAL */}

          <View style={styles.contentPanel}>


            {/* ENCABEZADO */}

            <View style={styles.header}>

              <Text style={styles.welcomeTitle}>
                Bienvenido/a
              </Text>


              <Text style={styles.welcomeSubtitle}>
                Inicia sesión para continuar
              </Text>

            </View>


            {/* FORMULARIO */}

            <View style={styles.form}>

              <FormInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                icon="mail-outline"
              />


              <FormInput
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
                icon="lock-closed-outline"
              />


              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() =>
                  navigation.navigate(
                    'RecoveryPassword'
                  )
                }
                activeOpacity={0.7}
              >

                <Text
                  style={
                    styles.forgotPasswordText
                  }
                >
                  ¿Olvidaste tu contraseña?
                </Text>

              </TouchableOpacity>

            </View>


            {/* BOTONES */}

            <View style={styles.actions}>

              {renderLoginButton()}


              {/* DIVISOR */}

              <View
                style={
                  styles.dividerContainer
                }
              >

                <View
                  style={styles.dividerLine}
                />


                <View
                  style={styles.dividerBadge}
                >

                  <Text
                    style={styles.dividerText}
                  >
                    o
                  </Text>

                </View>


                <View
                  style={styles.dividerLine}
                />

              </View>


              {/* REGISTRO */}

              <Button
                title="Crear una cuenta"
                onPress={() =>
                  navigation.navigate(
                    'Register'
                  )
                }
                variant="outline"
                size="medium"
                style={
                  styles.registerButton
                }
              />

            </View>


            {/* PIE */}

            <View style={styles.footer}>

              <View style={styles.footerIcon}>

                <Ionicons
                  name="egg-outline"
                  size={17}
                  color={COLORS.primary}
                />

              </View>


              <Text style={styles.footerText}>
                Del nido a tu mesa, con la frescura de siempre
              </Text>

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>

  );

};


export default LoginScreen;