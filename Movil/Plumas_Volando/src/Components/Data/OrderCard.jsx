import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { formatCurrency, formatDate } from '../../Utils/formatters';

const STATE_CONFIG = {
  'Entregado':  { color: '#22c55e', icon: 'checkmark-circle',  label: 'Entregado'  },
  'Pendiente':  { color: '#f59e0b', icon: 'time-outline',       label: 'Pendiente'  },
  'Cancelado':  { color: '#ef4444', icon: 'close-circle',       label: 'Cancelado'  },
  'completed':  { color: '#22c55e', icon: 'checkmark-circle',   label: 'Completado' },
  'pending':    { color: '#f59e0b', icon: 'time-outline',        label: 'Pendiente'  },
  'cancelled':  { color: '#ef4444', icon: 'close-circle',        label: 'Cancelado'  },
};

const getStateInfo = (order) => {
  const key = order.state || order.status || 'Pendiente';
  return STATE_CONFIG[key] || { color: COLORS.textSecondary, icon: 'ellipse-outline', label: key };
};

const shortId = (id) => id ? `#${String(id).slice(0, 4).toUpperCase()}` : '#----';

const OrderCard = ({ order, onPress }) => {
  const price = order.totalPrice ?? order.total ?? 0;
  const stateInfo = getStateInfo(order);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={onPress}
    >
      {/* ICONO */}
      <View style={styles.iconContainer}>
        <Ionicons name="receipt-outline" size={22} color={COLORS.primary} />
      </View>

      {/* INFO */}
      <View style={styles.info}>
        <Text style={styles.orderId}>
          Pedido {shortId(order._id)}
        </Text>
        <Text style={styles.date}>
          {formatDate(order.date || order.orderDate || order.createdAt)}
        </Text>
        <View style={styles.statusRow}>
          <Ionicons name={stateInfo.icon} size={12} color={stateInfo.color} style={{ marginRight: 4 }} />
          <Text style={[styles.statusText, { color: stateInfo.color }]}>
            {stateInfo.label}
          </Text>
        </View>
      </View>

      {/* PRECIO + FLECHA */}
      <View style={styles.right}>
        <Text style={styles.total}>{formatCurrency(price)}</Text>
        <View style={styles.arrowWrap}>
          <Ionicons name="chevron-forward" size={14} color={COLORS.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    ...NEUROMORPHIC.combinedShadow,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...NEUROMORPHIC.inset,
  },
  info: {
    flex: 1,
  },
  orderId: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  total: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.primary,
  },
  arrowWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
});

export default OrderCard;
