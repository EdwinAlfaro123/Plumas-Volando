import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { useTheme } from '../../Context/ThemeContext';
import { AuthContext } from '../../Context/AuthContext';
import { maskEmail } from '../../Utils/formatters';
import { useToast } from '../../Context/ToastContext';
import api from '../../Services/api';

const EmployeeSettingsScreen = () => {
  const { colors, isDark, darkNeuro } = useTheme();
  const neuro = isDark ? darkNeuro : NEUROMORPHIC;
  const { user, logout, profilePhotoUri, updateProfilePhoto, updateUser } = useContext(AuthContext);
  const { showToast } = useToast();

  const initials = [user?.name, user?.lastName || user?.lastname]
    .filter(Boolean).map(n => n.charAt(0).toUpperCase()).join('');

  const pickPhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        showToast('Necesitamos permiso para acceder a tu galería.', 'error');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const base64Uri = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await api.patch(`/employee/${user._id}/photo`, { profilePhoto: base64Uri });
        updateProfilePhoto(base64Uri);
        updateUser({ ...user, profilePhoto: base64Uri });
        showToast('¡Foto de perfil actualizada!', 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'No se pudo cambiar la foto.', 'error');
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Perfil</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Cuenta de empleado</Text>
        </View>

        {/* AVATAR */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarOuter}>
              <View style={styles.avatarInner}>
                {profilePhotoUri ? (
                  <Image source={{ uri: profilePhotoUri }} style={styles.avatarPhoto} />
                ) : (
                  <Text style={styles.avatarInitials}>{initials || '?'}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.photoEditBtn} onPress={pickPhoto} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.name} {user?.lastName || user?.lastname}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{maskEmail(user?.email)}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.background }, neuro.combinedShadow]}>
            <Ionicons name="briefcase-outline" size={12} color={COLORS.primary} />
            <Text style={styles.roleText}>Empleado</Text>
          </View>
        </View>

        {/* INFO */}
        <View style={[styles.card, { backgroundColor: colors.background }, neuro.combinedShadow]}>
          <View style={[styles.cardTitle, { borderBottomColor: colors.border }]}>
            <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
            <Text style={[styles.cardTitleText, { color: colors.textSecondary }]}>Información</Text>
          </View>
          <InfoRow icon="person-outline"   label="Nombre"  value={`${user?.name || ''} ${user?.lastName || user?.lastname || ''}`} colors={colors} neuro={neuro} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow icon="mail-outline"     label="Correo"  value={maskEmail(user?.email)} colors={colors} neuro={neuro} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <InfoRow icon="call-outline"     label="Teléfono" value={user?.phone || 'No disponible'} colors={colors} neuro={neuro} />
        </View>

        {/* CERRAR SESIÓN */}
        <TouchableOpacity style={[styles.card, styles.logoutCard, { backgroundColor: colors.background }, neuro.combinedShadow]} onPress={logout} activeOpacity={0.8}>
          <View style={styles.logoutIconWrap}>
            <Ionicons name="log-out-outline" size={18} color={COLORS.error} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
            <Text style={[styles.logoutSub, { color: colors.textSecondary }]}>Salir de la cuenta de empleado</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.error} />
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>Plumas Volando · v1.0.0 · Empleado</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value, colors, neuro }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: colors.background }, neuro.inset]}>
      <Ionicons name={icon} size={16} color={colors.primary} />
    </View>
    <View style={styles.infoTexts}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value || 'No disponible'}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 20, paddingBottom: 20 },
  header: { marginBottom: 24 },
  title: { ...TYPOGRAPHY.heading, fontSize: 26, color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 14 },
  avatarPhoto: { width: 88, height: 88, borderRadius: 44 },
  photoEditBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.background,
  },
  avatarOuter: {
    borderRadius: 46, backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8', shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.8, shadowRadius: 12, elevation: 8,
  },
  avatarInner: {
    width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF', shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1, shadowRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitials: { ...TYPOGRAPHY.heading, fontSize: 30, color: COLORS.primary, letterSpacing: 2 },
  profileName: { ...TYPOGRAPHY.heading, fontSize: 20, color: COLORS.textPrimary },
  profileEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: COLORS.background, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, marginTop: 10,
    ...NEUROMORPHIC.combinedShadow,
  },
  roleText: { fontSize: 11, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase' },
  card: {
    backgroundColor: COLORS.background, borderRadius: 20, marginBottom: 16,
    overflow: 'hidden', ...NEUROMORPHIC.combinedShadow,
  },
  cardTitle: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#E8EAF0',
  },
  cardTitleText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#E8EAF0', marginHorizontal: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  infoIcon: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  infoTexts: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500', marginTop: 2 },
  logoutCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  logoutIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: COLORS.error },
  logoutSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  version: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: 8 },
});

export default EmployeeSettingsScreen;
