import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Context/ToastContext';
import api from '../../Services/api';
import { maskEmail } from '../../Utils/formatters';

const PAGE_SIZE = 5;

const getInitials = (name = '', lastname = '') =>
  [name.charAt(0), lastname.charAt(0)].filter(Boolean).join('').toUpperCase() || '?';

// ─── CARD DE CLIENTE ──────────────────────────────────────────────────────────

const CustomerCard = ({ customer, colors, neuro }) => {
  const initials = getInitials(customer.name, customer.lastname || customer.lastName || '');
  const isActive = customer.isActive !== false;

  return (
    <View style={[card.wrap, { backgroundColor: colors.background }, neuro.combinedShadow]}>
      {/* franja lateral de estado */}
      <View style={[card.stripe, { backgroundColor: isActive ? '#22c55e' : '#ef4444' }]} />

      {/* avatar */}
      <View style={[card.avatar, { backgroundColor: colors.background }, neuro.inset]}>
        {customer.profilePhoto ? (
          <Image source={{ uri: customer.profilePhoto }} style={card.avatarImg} />
        ) : (
          <Text style={[card.avatarText, { color: colors.primary }]}>{initials}</Text>
        )}
      </View>

      {/* info */}
      <View style={card.info}>
        <View style={card.topRow}>
          <Text style={[card.name, { color: colors.textPrimary }]} numberOfLines={1}>
            {customer.name || 'Sin nombre'} {customer.lastname || customer.lastName || ''}
          </Text>
          <View style={[card.badge, { backgroundColor: isActive ? '#f0fdf4' : '#fef2f2' }]}>
            <View style={[card.badgeDot, { backgroundColor: isActive ? '#22c55e' : '#ef4444' }]} />
            <Text style={[card.badgeText, { color: isActive ? '#22c55e' : '#ef4444' }]}>
              {isActive ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>

        <View style={card.row}>
          <Ionicons name="mail-outline" size={12} color={colors.textMuted} />
          <Text style={[card.detail, { color: colors.textSecondary }]} numberOfLines={1}>
            {maskEmail(customer.email) || 'Sin correo'}
          </Text>
        </View>

        <View style={card.row}>
          <Ionicons name="call-outline" size={12} color={colors.textMuted} />
          <Text style={[card.detail, { color: colors.textSecondary }]}>
            {customer.phone || 'Sin teléfono'}
          </Text>
        </View>

        {!!customer.DUI && (
          <View style={card.row}>
            <Ionicons name="card-outline" size={12} color={colors.textMuted} />
            <Text style={[card.detail, { color: colors.textSecondary }]}>{customer.DUI}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const card = StyleSheet.create({
  wrap:       { flexDirection: 'row', borderRadius: 18, marginBottom: 12, overflow: 'hidden', minHeight: 100 },
  stripe:     { width: 4 },
  avatar:     { width: 52, height: 52, borderRadius: 26, margin: 16, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  avatarImg:  { width: 52, height: 52, borderRadius: 26 },
  avatarText: { fontSize: 18, fontWeight: '800' },
  info:       { flex: 1, paddingVertical: 14, paddingRight: 14, justifyContent: 'center', gap: 4 },
  topRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  name:       { ...TYPOGRAPHY.subheading, fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  badge:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, flexShrink: 0 },
  badgeDot:   { width: 6, height: 6, borderRadius: 3 },
  badgeText:  { fontSize: 10, fontWeight: '700' },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detail:     { fontSize: 12, flex: 1 },
});

// ─── PANTALLA PRINCIPAL ───────────────────────────────────────────────────────

const EmployeeCustomersScreen = () => {
  const { colors, isDark, darkNeuro } = useTheme();
  const neuro = isDark ? darkNeuro : NEUROMORPHIC;
  const { showToast } = useToast();

  const [allCustomers, setAllCustomers] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('Todos');
  const [page, setPage]                 = useState(1);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/customer');
      const list = Array.isArray(res.data) ? res.data : [];
      const seen = new Set();
      setAllCustomers(list.filter(c => { if (seen.has(c._id)) return false; seen.add(c._id); return true; }));
    } catch {
      showToast('No se pudieron cargar los clientes.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadCustomers(); setPage(1); }, []));

  const FILTERS = ['Todos', 'Activos', 'Inactivos'];

  const filtered = filter === 'Activos'
    ? allCustomers.filter(c => c.isActive !== false)
    : filter === 'Inactivos'
      ? allCustomers.filter(c => c.isActive === false)
      : allCustomers;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (f) => { setFilter(f); setPage(1); };

  const s = getStyles(colors, neuro);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ENCABEZADO */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Clientes</Text>
          <Text style={s.subtitle}>
            {loading ? 'Cargando…' : `${filtered.length} cliente${filtered.length !== 1 ? 's' : ''} · página ${safePage}/${totalPages}`}
          </Text>
        </View>
        <TouchableOpacity style={s.refreshBtn} onPress={() => { loadCustomers(); setPage(1); }} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="refresh-outline" size={20} color={colors.primary} />
          }
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={s.filterRow}>
        {FILTERS.map(f => {
          const active = filter === f;
          return (
            <TouchableOpacity key={f} style={[s.filterChip, active && { backgroundColor: colors.primary }]} onPress={() => handleFilterChange(f)}>
              <Text style={[s.filterText, active && { color: '#fff' }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>Cargando clientes…</Text>
        </View>
      ) : pageData.length === 0 ? (
        <View style={s.center}>
          <View style={s.emptyIcon}>
            <Ionicons name="people-outline" size={40} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>Sin clientes</Text>
          <Text style={s.emptyText}>
            {filter !== 'Todos' ? `No hay clientes "${filter.toLowerCase()}".` : 'Aún no hay clientes registrados.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={pageData}
          keyExtractor={c => c._id}
          renderItem={({ item }) => <CustomerCard customer={item} colors={colors} neuro={neuro} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            totalPages > 1 ? (
              <View style={s.pagination}>
                <TouchableOpacity
                  style={[s.pageBtn, safePage === 1 && s.pageBtnDisabled]}
                  onPress={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                >
                  <Ionicons name="chevron-back" size={16} color={safePage === 1 ? colors.textMuted : colors.primary} />
                  <Text style={[s.pageBtnText, safePage === 1 && { color: colors.textMuted }]}>Anterior</Text>
                </TouchableOpacity>

                <View style={[s.pageIndicator, neuro.inset]}>
                  <Text style={[s.pageIndicatorText, { color: colors.textPrimary }]}>{safePage} / {totalPages}</Text>
                </View>

                <TouchableOpacity
                  style={[s.pageBtn, safePage === totalPages && s.pageBtnDisabled]}
                  onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                >
                  <Text style={[s.pageBtnText, safePage === totalPages && { color: colors.textMuted }]}>Siguiente</Text>
                  <Ionicons name="chevron-forward" size={16} color={safePage === totalPages ? colors.textMuted : colors.primary} />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

// ─── ESTILOS DINÁMICOS ────────────────────────────────────────────────────────

const getStyles = (colors, neuro) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  title:      { ...TYPOGRAPHY.heading, fontSize: 26, color: colors.textPrimary },
  subtitle:   { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  refreshBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', ...neuro.combinedShadow },

  filterRow:  { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filterChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 20, paddingVertical: 10, backgroundColor: colors.background, ...neuro.combinedShadow },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  list:        { paddingHorizontal: 16, paddingBottom: 24 },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 20 },
  loadingText: { fontSize: 14, color: colors.textSecondary },
  emptyIcon:   { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', ...neuro.combinedShadow },
  emptyTitle:  { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  emptyText:   { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  pagination:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingVertical: 8, gap: 8 },
  pageBtn:           { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, ...neuro.combinedShadow },
  pageBtnDisabled:   { opacity: 0.4 },
  pageBtnText:       { fontSize: 13, fontWeight: '600', color: colors.primary },
  pageIndicator:     { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 10 },
  pageIndicatorText: { fontSize: 13, fontWeight: '700' },
});

export default EmployeeCustomersScreen;
