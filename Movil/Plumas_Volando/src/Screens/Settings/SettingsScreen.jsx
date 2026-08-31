import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';
import { maskEmail } from '../../Utils/formatters';
import Button from '../../Components/Common/Button';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sí, salir', style: 'destructive', onPress: async () => { await logout(); } },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.name}>{user?.name} {user?.lastname}</Text>
          <Text style={styles.email}>{maskEmail(user?.email)}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombres</Text>
            <Text style={styles.value}>{user?.name || 'No disponible'}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Apellidos</Text>
            <Text style={styles.value}>{user?.lastname || 'No disponible'}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico</Text>
            <Text style={styles.value}>{maskEmail(user?.email)}</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{user?.phone || 'No disponible'}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="outline"
            style={{ borderColor: COLORS.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    ...NEUROMORPHIC.outerShadow, ...NEUROMORPHIC.innerShadow,
  },
  name: { ...TYPOGRAPHY.heading, fontSize: 24, color: COLORS.textPrimary },
  email: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  formContainer: { marginBottom: 32 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
  value: {
    fontSize: 16, color: COLORS.textPrimary, backgroundColor: COLORS.cardBackground,
    padding: 12, borderRadius: 12, ...NEUROMORPHIC.innerShadow,
  },
  actions: { width: '100%' },
});

export default SettingsScreen;