import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { formatCurrency, formatDate } from '../../Utils/formatters';

const OrderCard = ({ order, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Ionicons name="receipt-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.orderId}>Pedido #{order.orderNumber || order._id}</Text>
        <Text style={styles.date}>{formatDate(order.date || order.createdAt)}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.status}>Estado: </Text>
          <Text style={[styles.status, { color: order.status === 'Delivered' ? COLORS.success : COLORS.warning }]}>
            {order.status || 'Pendiente'}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
        <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...NEUROMORPHIC.combinedShadow,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...NEUROMORPHIC.innerShadow,
  },
  info: { flex: 1 },
  orderId: { ...TYPOGRAPHY.subheading, fontSize: 16, color: COLORS.textPrimary },
  date: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusRow: { flexDirection: 'row', marginTop: 4 },
  status: { fontSize: 12, color: COLORS.textSecondary },
  right: { alignItems: 'flex-end' },
  total: { ...TYPOGRAPHY.subheading, fontSize: 16, color: COLORS.primary },
});

export default OrderCard;