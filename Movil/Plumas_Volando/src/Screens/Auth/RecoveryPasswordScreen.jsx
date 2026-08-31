import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AuthLayout from '../../Components/Auth/AuthLayout';
import AppLogo from '../../Components/Auth/AppLogo';
import FormInput from '../../Components/Common/FormInput';
import Button from '../../Components/Common/Button';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import api from '../../Services/api';

const RecoveryPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState('email'); // 'email' | 'code' | 'newPassword'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!email) {
      setError('El correo electronico es requerido');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Correo electronico invalido');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/recoveryPasswordCustomer/requestCode', { email });
      setRecoveryToken(response.data.token);
      setStep('code');
    } catch (error) {
      const message = error.response?.data?.message || 'Error al procesar la solicitud';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      setError('Código inválido');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/recoveryPasswordCustomer/verifyCode', { code, token: recoveryToken });
      setRecoveryToken(response.data.token);
      setStep('newPassword');
    } catch (error) {
      const message = error.response?.data?.message || 'Código incorrecto';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/recoveryPasswordCustomer/newPassword', {
        newPassword,
        confirmNewPassword: confirmPassword,
        token: recoveryToken
      });
      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido actualizada correctamente.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar la contraseña';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => step === 'email' ? navigation.goBack() : step === 'code' ? setStep('email') : setStep('code')}>
          <View style={styles.backButtonInner}>
            <Ionicons name="arrow-back-outline" size={20} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
        <AppLogo size={72} showShadow />
        <Text style={styles.title}>
          {step === 'email' ? 'Recuperar contraseña' : step === 'code' ? 'Verificar código' : 'Nueva contraseña'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'email'
            ? 'Ingresa tu correo y te ayudaremos a restablecer tu contraseña'
            : step === 'code'
            ? 'Ingresa el código que hemos enviado a tu correo'
            : 'Crea una nueva contraseña segura para tu cuenta'}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'email' && (
          <FormInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            icon="mail-outline"
          />
        )}
        
        {step === 'code' && (
          <FormInput
            label="Código de verificación"
            value={code}
            onChangeText={setCode}
            placeholder="Ingresa el código"
            keyboardType="default"
            autoCapitalize="none"
            error={error}
            icon="key-outline"
          />
        )}

        {step === 'newPassword' && (
          <>
            <FormInput
              label="Nueva contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              secureTextEntry
              error={error}
              icon="lock-closed-outline"
            />
            <FormInput
              label="Confirmar nueva contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry
              error={error}
              icon="lock-closed-outline"
            />
          </>
        )}
      </View>

      <View style={styles.actions}>
        {step === 'email' && (
          <Button title="Enviar código" onPress={handleSendCode} loading={loading} disabled={loading} />
        )}
        {step === 'code' && (
          <Button title="Verificar código" onPress={handleVerifyCode} loading={loading} disabled={loading} />
        )}
        {step === 'newPassword' && (
          <Button title="Actualizar contraseña" onPress={handleUpdatePassword} loading={loading} disabled={loading} />
        )}
        
        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLinkText}>
            <Ionicons name="arrow-back-outline" size={16} color={COLORS.primary} />
            {' '}Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.flat,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 22,
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  actions: {
    width: '100%',
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
});

export default RecoveryPasswordScreen;