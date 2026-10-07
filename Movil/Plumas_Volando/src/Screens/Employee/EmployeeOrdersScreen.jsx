import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, ScrollView, ActivityIndicator, Dimensions,
  Image, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Context/ToastContext';
import api from '../../Services/api';
import { formatCurrency, formatDateTime } from '../../Utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PAGE_SIZE = 5;

const STATE_CONFIG = {
  Pendiente: { color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline',     label: 'Pendiente' },
  Entregado: { color: '#22c55e', bg: '#f0fdf4', icon: 'checkmark-circle', label: 'Entregado' },
  Cancelado: { color: '#ef4444', bg: '#fef2f2', icon: 'close-circle',     label: 'Cancelado' },
};

const getState = (order) => STATE_CONFIG[order.state || 'Pendiente'] || STATE_CONFIG.Pendiente;
const shortId  = (id) => id ? '#' + String(id).slice(-4).toUpperCase() : '#----';

// ─── IMAGEN PRODUCTO ──────────────────────────────────────────────────────────

const ProductImg = ({ uri, size = 48, colors }) => {
  const [err, setErr] = useState(false);
  const r = size / 2;
  if (!uri || err) {
    return (
      <View style={{ width: size, height: size, borderRadius: r, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="egg-outline" size={size * 0.45} color={colors.primary} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: r }}
      onError={() => setErr(true)}
      resizeMode="cover"
    />
  );
};

// ─── CARD DE PEDIDO ───────────────────────────────────────────────────────────

const OrderCard = ({ order, onPress, colors, neuro }) => {
  const s     = getState(order);
  const name  = order.customerName || order.customerId?.name || 'Cliente';
  const items = order.products?.length ?? 0;

  return (
    <TouchableOpacity
      style={[{ flexDirection: 'row', backgroundColor: colors.background, borderRadius: 18, marginBottom: 12, overflow: 'hidden' }, neuro.combinedShadow]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={{ width: 4, backgroundColor: s.color }} />
      <View style={{ flex: 1, padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="receipt-outline" size={13} color={colors.primary} />
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.textPrimary }}>{shortId(order._id)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: s.bg }}>
            <Ionicons name={s.icon} size={11} color={s.color} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: s.color }}>{s.label}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13, color: colors.primary, fontWeight: '600', marginBottom: 8 }} numberOfLines={1}>{name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="cube-outline" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{items} producto{items !== 1 ? 's' : ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{formatDateTime(order.createdAt || order.date)}</Text>
          </View>
          <Text style={{ marginLeft: 'auto', fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>{formatCurrency(order.totalPrice ?? order.total ?? 0)}</Text>
        </View>
        {!!order.employeeComment && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
            <Ionicons name="chatbubble-outline" size={12} color={colors.primary} />
            <Text style={{ flex: 1, fontSize: 11, color: colors.primary, fontStyle: 'italic' }} numberOfLines={1}>{order.employeeComment}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── FILA INFO ────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, colors, neuro }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10 }}>
    <View style={[{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }, neuro.inset]}>
      <Ionicons name={icon} size={14} color={colors.primary} />
    </View>
    <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '600', width: 64 }}>{label}</Text>
    <Text style={{ flex: 1, fontSize: 13, color: colors.textPrimary }} numberOfLines={2}>{value || '—'}</Text>
  </View>
);

// ─── PANTALLA PRINCIPAL ───────────────────────────────────────────────────────

const EmployeeOrdersScreen = () => {
  const { colors, isDark, darkNeuro } = useTheme();
  const neuro = isDark ? darkNeuro : NEUROMORPHIC;
  const { showToast } = useToast();

  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [filter, setFilter]           = useState('Todos');

  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment]   = useState('');

  const loadPage = useCallback(async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true); else setLoadingMore(true);
    try {
      const res  = await api.get(`/orders?page=${pageNum}&limit=${PAGE_SIZE}`);
      const data = res.data?.orders ?? (Array.isArray(res.data) ? res.data : []);
      setOrders(prev => reset || pageNum === 1 ? data : [...prev, ...data]);
      setPage(res.data?.page ?? pageNum);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotal(res.data?.total ?? data.length);
    } catch {
      showToast('No se pudieron cargar los pedidos.', 'error');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { loadPage(1, true); }, []));

  const loadMore = () => {
    if (!loadingMore && page < totalPages) loadPage(page + 1);
  };

  const applyStateChange = async (newState) => {
    if (!selected) return;
    setUpdating(true);
    try {
      const payload = { state: newState };
      if (comment.trim()) payload.employeeComment = comment.trim();
      await api.patch(`/orders/${selected._id}/state`, payload);
      const updatedOrder = { ...selected, state: newState, employeeComment: payload.employeeComment ?? selected.employeeComment };
      setOrders(prev => prev.map(o => o._id === selected._id ? updatedOrder : o));
      setSelected(updatedOrder);
      showToast(`Estado actualizado a "${newState}".`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const openModal  = (order) => { setSelected(order); setComment(order.employeeComment || ''); };
  const closeModal = () => { setSelected(null); setComment(''); };

  const FILTERS  = ['Todos', 'Pendiente', 'Entregado', 'Cancelado'];
  const filtered = filter === 'Todos' ? orders : orders.filter(o => (o.state || 'Pendiente') === filter);
  const selectedState = selected ? getState(selected) : null;

  const s = getStyles(colors, neuro);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ENCABEZADO */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Pedidos</Text>
          <Text style={s.subtitle}>
            {loading ? 'Cargando…' : `${total} en total · página ${page}/${totalPages}`}
          </Text>
        </View>
        <TouchableOpacity style={s.refreshBtn} onPress={() => loadPage(1, true)} disabled={loading}>
          {loading
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="refresh-outline" size={20} color={colors.primary} />
          }
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {FILTERS.map(f => {
          const active = filter === f;
          const cfg    = STATE_CONFIG[f];
          return (
            <TouchableOpacity
              key={f}
              style={[s.filterChip, active && { backgroundColor: cfg?.color ?? colors.primary }]}
              onPress={() => setFilter(f)}
            >
              {cfg && <Ionicons name={cfg.icon} size={12} color={active ? '#fff' : cfg.color} style={{ marginRight: 4 }} />}
              <Text style={[s.filterText, active && { color: '#fff' }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* LISTA */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>Cargando pedidos…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={s.center}>
          <View style={s.emptyIcon}>
            <Ionicons name="receipt-outline" size={40} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>Sin pedidos</Text>
          <Text style={s.emptyText}>
            {filter !== 'Todos' ? `No hay pedidos con estado "${filter}".` : 'Aún no se han registrado pedidos.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={o => o._id}
          renderItem={({ item }) => <OrderCard order={item} onPress={() => openModal(item)} colors={colors} neuro={neuro} />}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={s.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={s.footerLoaderText}>Cargando más…</Text>
              </View>
            ) : page < totalPages ? (
              <TouchableOpacity style={s.loadMoreBtn} onPress={loadMore}>
                <Ionicons name="chevron-down" size={16} color={colors.primary} />
                <Text style={s.loadMoreText}>Ver más pedidos</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}

      {/* MODAL DETALLE */}
      <Modal visible={!!selected} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.sheet}>
            <View style={s.handle} />

            <View style={s.sheetHeader}>
              <TouchableOpacity style={s.closeBtn} onPress={closeModal}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={s.sheetTitle}>Detalle del Pedido</Text>
              <View style={{ width: 36 }} />
            </View>

            {selected && (
              <ScrollView contentContainerStyle={s.sheetContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* ID + ESTADO */}
                <View style={s.detailIdRow}>
                  <View style={s.detailIdBadge}>
                    <Text style={s.detailIdLabel}>Pedido</Text>
                    <Text style={s.detailIdValue}>{shortId(selected._id)}</Text>
                  </View>
                  <View style={[s.detailStateBadge, { backgroundColor: selectedState?.bg }]}>
                    <Ionicons name={selectedState?.icon} size={14} color={selectedState?.color} />
                    <Text style={[s.detailStateText, { color: selectedState?.color }]}>{selectedState?.label}</Text>
                  </View>
                </View>

                {/* DATOS DEL CLIENTE */}
                <View style={s.infoCard}>
                  <View style={[s.infoCardTitle, { borderBottomColor: colors.border }]}>
                    <Ionicons name="person-circle-outline" size={15} color={colors.primary} />
                    <Text style={s.infoCardTitleText}>Cliente</Text>
                  </View>
                  <InfoRow icon="person-outline"   label="Nombre"    value={selected.customerName || selected.customerId?.name || 'No disponible'} colors={colors} neuro={neuro} />
                  <InfoRow icon="mail-outline"     label="Correo"    value={selected.customerEmail || selected.customerId?.email || 'No disponible'} colors={colors} neuro={neuro} />
                  <InfoRow icon="calendar-outline" label="Fecha"     value={formatDateTime(selected.createdAt || selected.date)} colors={colors} neuro={neuro} />
                  <InfoRow icon="location-outline" label="Dirección" value={selected.location || 'No especificada'} colors={colors} neuro={neuro} />
                  <InfoRow icon="cash-outline"     label="Pago"      value={selected.paymentMethod === 'card' ? 'Tarjeta' : selected.paymentMethod === 'cash' ? 'Efectivo' : (selected.paymentMethod || 'No especificado')} colors={colors} neuro={neuro} />
                </View>

                {/* PRODUCTOS */}
                {(selected.products || []).length > 0 && (
                  <View style={s.productsCard}>
                    <View style={[s.infoCardTitle, { borderBottomColor: colors.border }]}>
                      <Ionicons name="cube-outline" size={15} color={colors.primary} />
                      <Text style={s.infoCardTitleText}>Productos ({selected.products.length})</Text>
                    </View>
                    {selected.products.map((item, i) => {
                      const prod = typeof item.productId === 'object' ? item.productId : null;
                      const name = prod?.name || prod?.nombre || prod?.productName || `Producto ${i + 1}`;
                      const uri  = prod?.imageUrl || prod?.image || null;
                      return (
                        <View key={i} style={[s.productRow, { borderBottomColor: colors.border }]}>
                          <ProductImg uri={uri} size={48} colors={colors} />
                          <View style={s.productInfo}>
                            <Text style={s.productName} numberOfLines={2}>{name}</Text>
                            <Text style={s.productQty}>Cantidad: {item.quantity}</Text>
                          </View>
                          <View style={s.productSubtotalWrap}>
                            <Text style={s.productSubtotal}>{formatCurrency(item.subtotal ?? 0)}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* TOTAL */}
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Total del pedido</Text>
                  <Text style={s.totalValue}>{formatCurrency(selected.totalPrice ?? selected.total ?? 0)}</Text>
                </View>

                {/* COMENTARIO */}
                <View style={s.commentSection}>
                  <View style={s.commentHeader}>
                    <Ionicons name="chatbubble-ellipses-outline" size={15} color={colors.primary} />
                    <Text style={s.commentTitle}>Comentario al cliente</Text>
                    <Text style={s.commentOptional}>(opcional)</Text>
                  </View>
                  <View style={s.commentInputWrap}>
                    <TextInput
                      style={s.commentInput}
                      value={comment}
                      onChangeText={setComment}
                      placeholder="Ej: Tu pedido está listo para recoger…"
                      placeholderTextColor={colors.textMuted}
                      multiline
                      maxLength={300}
                    />
                    <Text style={s.commentCount}>{comment.length}/300</Text>
                  </View>
                </View>

                {/* CAMBIAR ESTADO */}
                <Text style={s.changeStateTitle}>Cambiar estado del pedido</Text>
                <View style={s.stateButtons}>
                  {['Pendiente', 'Entregado', 'Cancelado'].map(st => {
                    const cfg     = STATE_CONFIG[st];
                    const current = (selected.state || 'Pendiente') === st;
                    return (
                      <TouchableOpacity
                        key={st}
                        style={[s.stateBtn, { borderColor: cfg.color }, current && { backgroundColor: cfg.color }]}
                        onPress={() => !current && applyStateChange(st)}
                        disabled={current || updating}
                        activeOpacity={0.8}
                      >
                        {updating && !current ? null : (
                          <>
                            {updating && current
                              ? <ActivityIndicator size="small" color="#fff" />
                              : <Ionicons name={cfg.icon} size={15} color={current ? '#fff' : cfg.color} />
                            }
                            <Text style={[s.stateBtnText, { color: current ? '#fff' : cfg.color }]}>{st}</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={s.stateNoteWrap}>
                  <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
                  <Text style={s.stateNote}>Al cambiar a "Entregado" se genera automáticamente la factura del cliente.</Text>
                </View>

              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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

  filterRow:  { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterChip: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.background, ...neuro.combinedShadow },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  list:             { paddingHorizontal: 16, paddingBottom: 24 },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 20 },
  loadingText:      { fontSize: 14, color: colors.textSecondary },
  emptyIcon:        { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', ...neuro.combinedShadow },
  emptyTitle:       { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  emptyText:        { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  footerLoader:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, paddingVertical: 16 },
  footerLoaderText: { fontSize: 13, color: colors.textSecondary },
  loadMoreBtn:      { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 14, marginHorizontal: 40, marginTop: 4, borderRadius: 20, backgroundColor: colors.background, ...neuro.combinedShadow },
  loadMoreText:     { fontSize: 13, fontWeight: '600', color: colors.primary },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:   { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: SCREEN_HEIGHT * 0.93, ...neuro.topShadow },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  closeBtn:    { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', ...neuro.combinedShadow },
  sheetTitle:  { ...TYPOGRAPHY.subheading, fontSize: 17, color: colors.textPrimary },
  sheetContent:{ padding: 20, paddingBottom: 50 },

  detailIdRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailIdBadge:  { backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, ...neuro.inset },
  detailIdLabel:  { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailIdValue:  { fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: 2 },
  detailStateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  detailStateText:  { fontSize: 14, fontWeight: '700' },

  infoCard:         { backgroundColor: colors.background, borderRadius: 16, marginBottom: 14, overflow: 'hidden', ...neuro.combinedShadow },
  infoCardTitle:    { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  infoCardTitleText:{ fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },

  productsCard:     { backgroundColor: colors.background, borderRadius: 16, marginBottom: 14, overflow: 'hidden', ...neuro.combinedShadow },
  productRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  productInfo:      { flex: 1 },
  productName:      { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  productQty:       { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productSubtotalWrap: { alignItems: 'flex-end' },
  productSubtotal:  { fontSize: 14, fontWeight: '700', color: colors.primary },

  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, borderRadius: 16, padding: 16, marginBottom: 20, ...neuro.combinedShadow },
  totalLabel: { fontSize: 14, color: colors.textSecondary },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.primary },

  commentSection:  { marginBottom: 20 },
  commentHeader:   { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  commentTitle:    { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  commentOptional: { fontSize: 12, color: colors.textMuted },
  commentInputWrap:{ backgroundColor: colors.background, borderRadius: 14, ...neuro.inset },
  commentInput:    { fontSize: 14, color: colors.textPrimary, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8, minHeight: 80, textAlignVertical: 'top' },
  commentCount:    { textAlign: 'right', fontSize: 11, color: colors.textMuted, paddingHorizontal: 14, paddingBottom: 8 },

  changeStateTitle: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  stateButtons:     { flexDirection: 'row', gap: 10, marginBottom: 14 },
  stateBtn:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 2, borderRadius: 14, paddingVertical: 13 },
  stateBtnText:     { fontSize: 12, fontWeight: '700' },
  stateNoteWrap:    { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  stateNote:        { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});

export default EmployeeOrdersScreen;
