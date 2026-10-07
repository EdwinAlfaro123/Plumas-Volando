import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, ScrollView, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { useToast } from '../../Context/ToastContext';
import api from '../../Services/api';
import { formatCurrency, formatDateTime } from '../../Utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const STATE_CONFIG = {
  Pendiente:  { color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline',      label: 'Pendiente'  },
  Entregado:  { color: '#22c55e', bg: '#f0fdf4', icon: 'checkmark-circle',  label: 'Entregado'  },
  Cancelado:  { color: '#ef4444', bg: '#fef2f2', icon: 'close-circle',      label: 'Cancelado'  },
};

const getState = (order) => {
  const key = order.state || order.status || 'Pendiente';
  return STATE_CONFIG[key] || STATE_CONFIG.Pendiente;
};

const shortId = (id) => id ? '#' + String(id).slice(-3).toUpperCase() : '#---';

// ─── CARD DE PEDIDO ───────────────────────────────────────────────────────────

const OrderItem = ({ order, onPress }) => {
  const s = getState(order);
  const customerName = order.customerName || order.customerId?.name || 'Cliente';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardLeft}>
        <View style={styles.cardIcon}>
          <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardId}>Pedido {shortId(order._id)}</Text>
          <Text style={styles.cardCustomer} numberOfLines={1}>{customerName}</Text>
          <Text style={styles.cardDate}>
            {formatDateTime(order.createdAt || order.date)}
          </Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardTotal}>{formatCurrency(order.totalPrice ?? order.total ?? 0)}</Text>
        <View style={[styles.statePill, { backgroundColor: s.bg }]}>
          <Ionicons name={s.icon} size={11} color={s.color} />
          <Text style={[styles.stateText, { color: s.color }]}>{s.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── PANTALLA ─────────────────────────────────────────────────────────────────

const EmployeeOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const { showToast } = useToast();

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      const data = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      setOrders(data);
    } catch {
      showToast('No se pudieron cargar los pedidos.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(loadOrders);

  const changeState = async (orderId, newState) => {
    setUpdating(true);
    try {
      await api.patch(`/orders/${orderId}/state`, { state: newState });
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, state: newState } : o
      ));
      if (selected?._id === orderId) {
        setSelected(prev => ({ ...prev, state: newState }));
      }
      showToast(`Estado cambiado a "${newState}".`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar estado.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const FILTERS = ['Todos', 'Pendiente', 'Entregado', 'Cancelado'];

  const filtered = filter === 'Todos'
    ? orders
    : orders.filter(o => (o.state || o.status) === filter);

  const selectedState = selected ? getState(selected) : null;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <StatusBar style="dark" />

      {/* ENCABEZADO */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pedidos</Text>
          <Text style={styles.subtitle}>{orders.length} en total</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={loadOrders}>
          <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => {
          const active = filter === f;
          const cfg = STATE_CONFIG[f];
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              {cfg && <Ionicons name={cfg.icon} size={12} color={active ? '#fff' : cfg.color} style={{ marginRight: 4 }} />}
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* LISTA */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>No hay pedidos {filter !== 'Todos' ? `con estado "${filter}"` : ''}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={o => o._id}
          renderItem={({ item }) => (
            <OrderItem order={item} onPress={() => setSelected(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* MODAL DETALLE + CAMBIO DE ESTADO */}
      <Modal
        visible={!!selected}
        animationType="slide"
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Ionicons name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Detalle del Pedido</Text>
              <View style={{ width: 36 }} />
            </View>

            {selected && (
              <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>

                {/* ID + ESTADO ACTUAL */}
                <View style={styles.detailIdRow}>
                  <View style={styles.detailIdBadge}>
                    <Text style={styles.detailIdLabel}>Pedido</Text>
                    <Text style={styles.detailIdValue}>{shortId(selected._id)}</Text>
                  </View>
                  <View style={[styles.detailStateBadge, { backgroundColor: selectedState?.bg }]}>
                    <Ionicons name={selectedState?.icon} size={13} color={selectedState?.color} />
                    <Text style={[styles.detailStateText, { color: selectedState?.color }]}>
                      {selectedState?.label}
                    </Text>
                  </View>
                </View>

                {/* INFO CLIENTE */}
                <View style={styles.infoCard}>
                  <InfoRow icon="person-outline"   label="Cliente"  value={selected.customerName || 'No disponible'} />
                  <InfoRow icon="mail-outline"     label="Correo"   value={selected.customerEmail || 'No disponible'} />
                  <InfoRow icon="calendar-outline" label="Fecha"    value={formatDateTime(selected.createdAt || selected.date)} />
                  <InfoRow icon="location-outline" label="Dirección" value={selected.location || 'No especificada'} />
                  <InfoRow icon="cash-outline"     label="Pago"     value={selected.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'} />
                </View>

                {/* PRODUCTOS */}
                {(selected.products || []).length > 0 && (
                  <View style={styles.productsCard}>
                    <Text style={styles.productsTitle}>Productos</Text>
                    {selected.products.map((item, i) => {
                      const prod = typeof item.productId === 'object' ? item.productId : null;
                      const name = prod?.name || prod?.nombre || `Producto ${i + 1}`;
                      return (
                        <View key={i} style={styles.productRow}>
                          <Text style={styles.productName} numberOfLines={1}>{name}</Text>
                          <Text style={styles.productQty}>x{item.quantity}</Text>
                          <Text style={styles.productSub}>{formatCurrency(item.subtotal ?? 0)}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* TOTAL */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(selected.totalPrice ?? selected.total ?? 0)}
                  </Text>
                </View>

                {/* CAMBIAR ESTADO */}
                <Text style={styles.changeStateTitle}>Cambiar estado del pedido</Text>
                <View style={styles.stateButtons}>
                  {['Pendiente', 'Entregado', 'Cancelado'].map(s => {
                    const cfg = STATE_CONFIG[s];
                    const current = (selected.state || 'Pendiente') === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.stateBtn,
                          { borderColor: cfg.color },
                          current && { backgroundColor: cfg.color },
                        ]}
                        onPress={() => !current && changeState(selected._id, s)}
                        disabled={current || updating}
                        activeOpacity={0.8}
                      >
                        {updating && current ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <>
                            <Ionicons name={cfg.icon} size={15} color={current ? '#fff' : cfg.color} />
                            <Text style={[styles.stateBtnText, { color: current ? '#fff' : cfg.color }]}>{s}</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.stateNote}>
                  Al cambiar a "Entregado" se genera automáticamente la factura del cliente.
                </Text>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── HELPER ───────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={14} color={COLORS.primary} style={{ width: 20 }} />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
  </View>
);

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: { ...TYPOGRAPHY.heading, fontSize: 26, color: COLORS.textPrimary },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  refreshBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },

  // FILTROS
  filterRow: { paddingHorizontal: 20, paddingBottom: 12, gap: 8 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: COLORS.background,
    ...NEUROMORPHIC.combinedShadow,
  },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  filterTextActive: { color: '#fff' },

  // LISTA
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center' },

  // CARD
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.background, borderRadius: 18, padding: 14, marginBottom: 12,
    ...NEUROMORPHIC.combinedShadow,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  cardIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  cardInfo: { flex: 1 },
  cardId: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  cardCustomer: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: 1 },
  cardDate: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  cardRight: { alignItems: 'flex-end', gap: 6 },
  cardTotal: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  statePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4,
  },
  stateText: { fontSize: 11, fontWeight: '700' },

  // MODAL
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.92,
    ...NEUROMORPHIC.topShadow,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#DDE1E9', alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#EEF0F6',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  sheetTitle: { ...TYPOGRAPHY.subheading, fontSize: 17, color: COLORS.textPrimary },
  sheetContent: { padding: 20, paddingBottom: 40 },

  detailIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailIdBadge: {
    backgroundColor: COLORS.background, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 10,
    ...NEUROMORPHIC.inset,
  },
  detailIdLabel: { fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailIdValue: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 2 },
  detailStateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  detailStateText: { fontSize: 13, fontWeight: '700' },

  infoCard: {
    backgroundColor: COLORS.background, borderRadius: 16, padding: 14, marginBottom: 14,
    ...NEUROMORPHIC.combinedShadow,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7, gap: 8 },
  infoLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600', width: 70 },
  infoValue: { flex: 1, fontSize: 14, color: COLORS.textPrimary },

  productsCard: {
    backgroundColor: COLORS.background, borderRadius: 16, padding: 14, marginBottom: 14,
    ...NEUROMORPHIC.combinedShadow,
  },
  productsTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, textTransform: 'uppercase', marginBottom: 8 },
  productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#EEF0F6' },
  productName: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  productQty: { fontSize: 13, color: COLORS.textSecondary, marginHorizontal: 8 },
  productSub: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.background, borderRadius: 16, padding: 16, marginBottom: 20,
    ...NEUROMORPHIC.combinedShadow,
  },
  totalLabel: { fontSize: 15, color: COLORS.textSecondary },
  totalValue: { fontSize: 22, fontWeight: '800', color: COLORS.primary },

  changeStateTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
  },
  stateButtons: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stateBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderWidth: 2, borderRadius: 14, paddingVertical: 12,
  },
  stateBtnText: { fontSize: 13, fontWeight: '700' },
  stateNote: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16 },
});

export default EmployeeOrdersScreen;
