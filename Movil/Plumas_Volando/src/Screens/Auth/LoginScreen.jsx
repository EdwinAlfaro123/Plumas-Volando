import React, { useState, useContext, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';

import { COLORS } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';

import LogoImage from '../../../assets/logo-plumas.png';
import BackgroundImage from '../../../assets/pattern-bg.png';

import { LoginStyles as styles } from '../../Styles';


const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});


  const [accountType, setAccountType] = useState('customer'); // 'customer' | 'employee'

  const { login, loginEmployee } = useContext(AuthContext);
  const { showToast } = useToast();


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

      if (accountType === 'employee') {
        await loginEmployee(email, password);
      } else {
        await login(email, password);
      }

    } catch (error) {

      showToast(
        error.message || 'Verifica tus credenciales e intenta de nuevo.',
        'error'
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


            {/* TOGGLE CLIENTE / EMPLEADO */}

            <View style={loginToggleStyles.pill}>
              <TouchableOpacity
                style={[loginToggleStyles.option, accountType === 'customer' && loginToggleStyles.optionActive]}
                onPress={() => setAccountType('customer')}
                activeOpacity={0.8}
              >
                <Ionicons name="person-outline" size={14} color={accountType === 'customer' ? '#fff' : COLORS.textSecondary} />
                <Text style={[loginToggleStyles.optionText, accountType === 'customer' && loginToggleStyles.optionTextActive]}>
                  Cliente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[loginToggleStyles.option, accountType === 'employee' && loginToggleStyles.optionActive]}
                onPress={() => setAccountType('employee')}
                activeOpacity={0.8}
              >
                <Ionicons name="briefcase-outline" size={14} color={accountType === 'employee' ? '#fff' : COLORS.textSecondary} />
                <Text style={[loginToggleStyles.optionText, accountType === 'employee' && loginToggleStyles.optionTextActive]}>
                  Empleado
                </Text>
              </TouchableOpacity>
            </View>


            {/* ENCABEZADO */}

            <View style={styles.header}>

              <Text style={styles.welcomeTitle}>
                Bienvenido/a
              </Text>


              <Text style={styles.welcomeSubtitle}>
                {accountType === 'employee'
                  ? 'Acceso corporativo — empleados'
                  : 'Inicia sesión para continuar'}
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
                  navigation.navigate('RecoveryPassword', { accountType })
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


              {/* DIVISOR + REGISTRO — solo para clientes */}

              {accountType === 'customer' && (
                <>
                  <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerBadge}>
                      <Text style={styles.dividerText}>o</Text>
                    </View>
                    <View style={styles.dividerLine} />
                  </View>

                  <Button
                    title="Crear una cuenta"
                    onPress={() => navigation.navigate('Register')}
                    variant="outline"
                    size="medium"
                    style={styles.registerButton}
                  />
                </>
              )}

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


const loginToggleStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 30,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 26,
  },
  optionActive: {
    backgroundColor: COLORS.primary,
    shadowColor: '#3A6BE8',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});

export default LoginScreen;
