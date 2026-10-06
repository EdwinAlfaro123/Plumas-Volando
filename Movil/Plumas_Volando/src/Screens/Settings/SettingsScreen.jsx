import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';
import { maskEmail } from '../../Utils/formatters';
import { useToast } from '../../Context/ToastContext';

// ─── FILA DE INFORMACIÓN ──────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <Ionicons name={icon} size={17} color={COLORS.primary} />
    </View>
    <View style={styles.infoTexts}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'No disponible'}</Text>
    </View>
  </View>
);

// ─── OPCIÓN DE MENÚ ───────────────────────────────────────────────────────────

const MenuOption = ({ icon, label, sublabel, onPress, danger }) => (
  <TouchableOpacity style={styles.menuOption} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.menuIconWrap, danger && styles.menuIconDanger]}>
      <Ionicons name={icon} size={18} color={danger ? COLORS.error : COLORS.primary} />
    </View>
    <View style={styles.menuTexts}>
      <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
      {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color={danger ? COLORS.error : COLORS.textSecondary} />
  </TouchableOpacity>
);

// ─── PANTALLA ─────────────────────────────────────────────────────────────────

const SettingsScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();

  const handleLogout = async () => {
    showToast('¿Cerrar sesión?', 'warning');

    // Pequeño delay para que el toast sea visible antes de la confirmación
    setTimeout(async () => {
      await logout();
    }, 300);
  };

  const initials = [user?.name, user?.lastname]
    .filter(Boolean)
    .map(n => n.charAt(0).toUpperCase())
    .join('');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── ENCABEZADO ── */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Perfil</Text>
          <Text style={styles.screenSubtitle}>Tu información personal</Text>
        </View>

        {/* ── AVATAR + NOMBRE ── */}
        <View style={styles.profileSection}>

          {/* Sombra exterior */}
          <View style={styles.avatarOuter}>
            {/* Sombra interior blanca */}
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitials}>{initials || '?'}</Text>
            </View>
          </View>

          <Text style={styles.profileName}>
            {user?.name} {user?.lastname}
          </Text>
          <Text style={styles.profileEmail}>
            {maskEmail(user?.email)}
          </Text>

          {/* Badge de cliente */}
          <View style={styles.roleBadge}>
            <Ionicons name="egg-outline" size={12} color={COLORS.primary} />
            <Text style={styles.roleText}>Cliente</Text>
          </View>

        </View>

        {/* ── INFORMACIÓN DE CUENTA ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Información personal</Text>
          </View>

          <InfoRow
            icon="person-outline"
            label="Nombres"
            value={user?.name}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="people-outline"
            label="Apellidos"
            value={user?.lastname}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="mail-outline"
            label="Correo electrónico"
            value={maskEmail(user?.email)}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={user?.phone}
          />
          {user?.DUI && (
            <>
              <View style={styles.divider} />
              <InfoRow
                icon="card-outline"
                label="DUI"
                value={user.DUI}
              />
            </>
          )}
        </View>

        {/* ── MENÚ DE OPCIONES ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="settings-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Configuración</Text>
          </View>

          <MenuOption
            icon="receipt-outline"
            label="Mis pedidos"
            sublabel="Ver historial de compras"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuOption
            icon="document-text-outline"
            label="Mis facturas"
            sublabel="Ver mis comprobantes"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuOption
            icon="shield-checkmark-outline"
            label="Privacidad y seguridad"
            sublabel="Configurar acceso a tu cuenta"
            onPress={() => {}}
          />
        </View>

        {/* ── CERRAR SESIÓN ── */}
        <View style={styles.sectionCard}>
          <MenuOption
            icon="log-out-outline"
            label="Cerrar sesión"
            sublabel="Salir de tu cuenta"
            onPress={handleLogout}
            danger
          />
        </View>

        {/* ── VERSIÓN ── */}
        <Text style={styles.versionText}>Plumas Volando · v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 16,
  },

  // ENCABEZADO
  header: {
    marginBottom: 24,
  },
  screenTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 26,
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },

  // PERFIL
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarOuter: {
    borderRadius: 46,
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  avatarInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    ...TYPOGRAPHY.heading,
    fontSize: 30,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  profileName: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  profileEmail: {
    ...TYPOGRAPHY.caption,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
    ...NEUROMORPHIC.combinedShadow,
  },
  roleText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // SECCIÓN CARD
  sectionCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...NEUROMORPHIC.combinedShadow,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAF0',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8EAF0',
    marginHorizontal: 16,
  },

  // FILA INFO
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  infoTexts: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  // MENÚ
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  menuIconDanger: {
    // inherits, just icon color changes
  },
  menuTexts: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  menuSublabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },

  // VERSIÓN
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    letterSpacing: 0.3,
  },
});

export default SettingsScreen;
