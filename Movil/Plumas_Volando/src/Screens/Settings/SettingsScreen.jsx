import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { AuthContext } from '../../Context/AuthContext';
import { maskEmail } from '../../Utils/formatters';
import { useToast } from '../../Context/ToastContext';
import api from '../../Services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
    <View style={styles.menuIconWrap}>
      <Ionicons name={icon} size={18} color={danger ? COLORS.error : COLORS.primary} />
    </View>
    <View style={styles.menuTexts}>
      <Text style={[styles.menuLabel, danger && { color: COLORS.error }]}>{label}</Text>
      {sublabel && <Text style={styles.menuSublabel}>{sublabel}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color={danger ? COLORS.error : COLORS.textSecondary} />
  </TouchableOpacity>
);

// ─── CAMPO DEL FORMULARIO ─────────────────────────────────────────────────────

const FormField = ({ label, value, onChangeText, placeholder, hint, keyboardType, autoCapitalize, maxLength }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.fieldInputWrap}>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'words'}
        maxLength={maxLength}
      />
    </View>
    {hint && <Text style={styles.fieldHint}>{hint}</Text>}
  </View>
);

// ─── PANTALLA ─────────────────────────────────────────────────────────────────

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateUser, profilePhotoUri, updateProfilePhoto } = useContext(AuthContext);
  const { showToast } = useToast();

  const [editVisible, setEditVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openEdit = () => {
    const rawPhone = user?.phone || '';
    const displayPhone = rawPhone.includes('-')
      ? rawPhone
      : rawPhone.length === 8
        ? `${rawPhone.slice(0, 4)}-${rawPhone.slice(4)}`
        : rawPhone;

    let displayDate = '';
    if (user?.birthdate) {
      const d = new Date(user.birthdate);
      if (!isNaN(d)) {
        const dd = String(d.getUTCDate()).padStart(2, '0');
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const yyyy = d.getUTCFullYear();
        displayDate = `${dd}/${mm}/${yyyy}`;
      }
    }

    setForm({
      name:      user?.name      || '',
      lastname:  user?.lastname  || '',
      email:     user?.email     || '',
      phone:     displayPhone,
      DUI:       user?.DUI       || '',
      birthdate: displayDate,
    });
    setEditVisible(true);
  };

  const handlePhoneChange = (text) => {
    const clean = text.replace(/[^0-9]/g, '');
    const formatted = clean.length > 4
      ? `${clean.slice(0, 4)}-${clean.slice(4, 8)}`
      : clean;
    setForm(f => ({ ...f, phone: formatted }));
  };

  const handleDateChange = (text) => {
    const clean = text.replace(/[^0-9]/g, '');
    let formatted = clean;
    if (clean.length > 2 && clean.length <= 4) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
    } else if (clean.length > 4) {
      formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
    }
    setForm(f => ({ ...f, birthdate: formatted }));
  };

  const onPickerChange = (_event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const yyyy = selectedDate.getFullYear();
      setForm(f => ({ ...f, birthdate: `${dd}/${mm}/${yyyy}` }));
    }
  };

  const pickerDate = (() => {
    if (!form.birthdate) return new Date(2000, 0, 1);
    const normalized = form.birthdate.replace(/-/g, '/');
    const parts = normalized.split('/');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const d = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
      if (!isNaN(d.getTime())) return d;
    }
    return new Date(2000, 0, 1);
  })();

  const handleSave = async () => {
    const { name, lastname, email, phone, DUI, birthdate } = form;

    if (!name.trim() || name.trim().length < 3) {
      showToast('El nombre debe tener al menos 3 caracteres.', 'error'); return;
    }
    if (!lastname.trim() || lastname.trim().length < 3) {
      showToast('Los apellidos deben tener al menos 3 caracteres.', 'error'); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast('El correo electrónico no es válido.', 'error'); return;
    }
    const cleanPhone = phone.replace(/-/g, '');
    if (!/^\d{8}$/.test(cleanPhone)) {
      showToast('El teléfono debe tener exactamente 8 dígitos.', 'error'); return;
    }
    if (DUI && !/^\d{8}-\d$/.test(DUI.trim())) {
      showToast('El DUI debe tener el formato 12345678-9.', 'error'); return;
    }

    let isoDate = user?.birthdate || '';
    if (birthdate) {
      const normalized = birthdate.replace(/-/g, '/');
      const parts = normalized.split('/');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts;
        const parsed = new Date(`${yyyy}-${mm}-${dd}`);
        if (isNaN(parsed.getTime())) {
          showToast('La fecha debe tener el formato DD/MM/AAAA.', 'error'); return;
        }
        isoDate = parsed.toISOString();
      } else {
        showToast('La fecha debe tener el formato DD/MM/AAAA.', 'error'); return;
      }
    }

    setSaving(true);
    try {
      await api.put(`/customer/${user._id}`, {
        name:      name.trim(),
        lastname:  lastname.trim(),
        email:     email.trim().toLowerCase(),
        phone:     cleanPhone,
        DUI:       DUI.trim() || user?.DUI || '',
        birthdate: isoDate,
        isActive:  user?.isActive ?? true,
      });

      const updated = {
        ...user,
        name:      name.trim(),
        lastname:  lastname.trim(),
        email:     email.trim().toLowerCase(),
        phone:     cleanPhone,
        DUI:       DUI.trim() || user?.DUI || '',
        birthdate: isoDate,
      };
      updateUser(updated);
      setEditVisible(false);
      showToast('¡Perfil actualizado correctamente!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al guardar los cambios.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

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
        const asset = result.assets[0];
        const base64Uri = `data:image/jpeg;base64,${asset.base64}`;
        await api.patch(`/customer/${user._id}/photo`, { profilePhoto: base64Uri });
        updateProfilePhoto(base64Uri);
        updateUser({ ...user, profilePhoto: base64Uri });
        showToast('¡Foto de perfil actualizada!', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo cambiar la foto.';
      showToast(msg, 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const initials = [user?.name, user?.lastname]
    .filter(Boolean)
    .map(n => n.charAt(0).toUpperCase())
    .join('');

  const displayPhone = (() => {
    const raw = user?.phone || '';
    if (raw.includes('-')) return raw;
    return raw.length === 8 ? `${raw.slice(0, 4)}-${raw.slice(4)}` : raw || 'No disponible';
  })();

  const displayBirthdate = (() => {
    if (!user?.birthdate) return 'No disponible';
    const d = new Date(user.birthdate);
    if (isNaN(d)) return 'No disponible';
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  })();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ENCABEZADO */}
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Perfil</Text>
          <Text style={styles.screenSubtitle}>Tu información personal</Text>
        </View>

        {/* AVATAR + NOMBRE */}
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

          <Text style={styles.profileName}>{user?.name} {user?.lastname}</Text>
          <Text style={styles.profileEmail}>{maskEmail(user?.email)}</Text>

          <View style={styles.roleBadge}>
            <Ionicons name="egg-outline" size={12} color={COLORS.primary} />
            <Text style={styles.roleText}>Cliente</Text>
          </View>
        </View>

        {/* INFORMACIÓN PERSONAL */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Información personal</Text>
            <TouchableOpacity style={styles.editBtn} onPress={openEdit} activeOpacity={0.8}>
              <Ionicons name="pencil-outline" size={14} color={COLORS.primary} />
              <Text style={styles.editBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <InfoRow icon="person-outline"   label="Nombres"             value={user?.name} />
          <View style={styles.divider} />
          <InfoRow icon="people-outline"   label="Apellidos"           value={user?.lastname} />
          <View style={styles.divider} />
          <InfoRow icon="mail-outline"     label="Correo electrónico"  value={maskEmail(user?.email)} />
          <View style={styles.divider} />
          <InfoRow icon="call-outline"     label="Teléfono"            value={displayPhone} />
          <View style={styles.divider} />
          <InfoRow icon="calendar-outline" label="Fecha de nacimiento" value={displayBirthdate} />
          {user?.DUI && (
            <>
              <View style={styles.divider} />
              <InfoRow icon="card-outline" label="DUI" value={user.DUI} />
            </>
          )}
        </View>

        {/* CONFIGURACIÓN */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="settings-outline" size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Configuración</Text>
          </View>

          <MenuOption icon="receipt-outline"       label="Mis pedidos"  sublabel="Ver historial de compras"       onPress={() => navigation.navigate('Orders')}   />
          <View style={styles.divider} />
          <MenuOption icon="document-text-outline" label="Mis facturas" sublabel="Ver mis comprobantes"            onPress={() => navigation.navigate('Invoices')}  />
          <View style={styles.divider} />
          <MenuOption icon="grid-outline"          label="Catálogo"     sublabel="Explorar productos disponibles"  onPress={() => navigation.navigate('Products')}  />
        </View>

        {/* CERRAR SESIÓN */}
        <View style={styles.sectionCard}>
          <MenuOption icon="log-out-outline" label="Cerrar sesión" sublabel="Salir de tu cuenta" onPress={handleLogout} danger />
        </View>

        <Text style={styles.versionText}>Plumas Volando · v1.0.0</Text>
      </ScrollView>

      {/* MODAL EDITAR PERFIL */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() => !saving && setEditVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => !saving && setEditVisible(false)}
                disabled={saving}
              >
                <Ionicons name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Editar perfil</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              contentContainerStyle={styles.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormField label="Nombre(s)"          value={form.name}     onChangeText={v => setForm(f => ({ ...f, name: v }))}     placeholder="Ej: Juan" />
              <FormField label="Apellidos"           value={form.lastname} onChangeText={v => setForm(f => ({ ...f, lastname: v }))} placeholder="Ej: García López" />
              <FormField label="Correo electrónico"  value={form.email}    onChangeText={v => setForm(f => ({ ...f, email: v }))}    placeholder="correo@ejemplo.com" keyboardType="email-address" autoCapitalize="none" />
              <FormField label="Teléfono"            value={form.phone}    onChangeText={handlePhoneChange}                          placeholder="0000-0000" keyboardType="numeric" autoCapitalize="none" hint="8 dígitos, el guión se inserta automáticamente" maxLength={9} />
              <FormField label="DUI"                 value={form.DUI}      onChangeText={v => setForm(f => ({ ...f, DUI: v }))}      placeholder="12345678-9" autoCapitalize="none" hint="Formato: 12345678-9" maxLength={10} />

              {/* Fecha de nacimiento */}
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>Fecha de nacimiento</Text>
                <View style={styles.dateRow}>
                  <View style={[styles.fieldInputWrap, { flex: 1 }]}>
                    <TextInput
                      style={styles.fieldInput}
                      value={form.birthdate}
                      onChangeText={handleDateChange}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.calendarBtn}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.fieldHint}>Acepta DD/MM/AAAA o DD-MM-AAAA</Text>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={pickerDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={onPickerChange}
                />
              )}

              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                activeOpacity={0.85}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                    <Text style={styles.saveBtnText}>Guardar cambios</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  header: { marginBottom: 24 },
  screenTitle: { ...TYPOGRAPHY.heading, fontSize: 26, color: COLORS.textPrimary },
  screenSubtitle: { ...TYPOGRAPHY.caption, fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

  // PERFIL
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarPhoto: { width: 88, height: 88, borderRadius: 44 },
  photoEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarOuter: {
    borderRadius: 46,
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
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
    overflow: 'hidden',
  },
  avatarInitials: { ...TYPOGRAPHY.heading, fontSize: 30, color: COLORS.primary, letterSpacing: 2 },
  profileName: { ...TYPOGRAPHY.heading, fontSize: 20, color: COLORS.textPrimary, textAlign: 'center' },
  profileEmail: { ...TYPOGRAPHY.caption, fontSize: 13, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
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
  roleText: { fontSize: 11, color: COLORS.primary, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },

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
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    ...NEUROMORPHIC.combinedShadow,
  },
  editBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#E8EAF0', marginHorizontal: 16 },

  // FILA INFO
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 13, gap: 12 },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  infoTexts: { flex: 1 },
  infoLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 2 },
  infoValue: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },

  // MENÚ
  menuOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  menuTexts: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  menuSublabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },

  versionText: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginTop: 8, letterSpacing: 0.3 },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.92,
    ...NEUROMORPHIC.topShadow,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#DDE1E9',
    alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F6',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  sheetTitle: { ...TYPOGRAPHY.subheading, fontSize: 17, color: COLORS.textPrimary },
  formScroll: { padding: 20, paddingBottom: 40 },

  // CAMPOS
  fieldWrap: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 12, fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7,
  },
  fieldInputWrap: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    ...NEUROMORPHIC.inset,
  },
  fieldInput: { fontSize: 15, color: COLORS.textPrimary, paddingHorizontal: 16, paddingVertical: 13 },
  fieldHint: { fontSize: 11, color: COLORS.textMuted, marginTop: 5, paddingHorizontal: 4 },

  // FECHA
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  calendarBtn: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },

  // BOTÓN GUARDAR
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 15, marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.65 },
  saveBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});

export default SettingsScreen;
