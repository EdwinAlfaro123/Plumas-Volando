import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AuthLayout from '../../Components/Auth/AuthLayout';
import AppLogo from '../../Components/Auth/AppLogo';
import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo electrónico inválido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    else if (password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message || 'Verifica tus credenciales e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <StatusBar style="dark" />

      {/* Header con logo neomórfico */}
      <View style={styles.header}>
        <AppLogo size={84} showShadow animate />
        <Text style={styles.appName}>Plumas Volando</Text>
        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
      </View>

      {/* Formulario */}
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
          onPress={() => navigation.navigate('RecoverPassword')}
        >
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />

        {/* Divider neomórfico */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <View style={styles.dividerBadge}>
            <Text style={styles.dividerText}>o</Text>
          </View>
          <View style={styles.divider} />
        </View>

        <Button
          title="Crear cuenta"
          onPress={() => navigation.navigate('Register')}
          variant="outline"
          size="medium"
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 36,
    marginTop: 8,
  },
  appName: {
    ...TYPOGRAPHY.heading,
    fontSize: 26,
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 6,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.shadowDark,
    opacity: 0.6,
  },
  dividerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    ...NEUROMORPHIC.flat,
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});

export default LoginScreen;
