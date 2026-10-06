import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { formatCurrency, formatDate } from '../../Utils/formatters';

const shortInvoiceId = (invoice) => {
  const raw = invoice.invoiceNumber || invoice._id || '';
  return '#' + String(raw).slice(-4).toUpperCase();
};

const InvoiceCard = ({ invoice, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.card}
    onPress={onPress}
  >
    {/* ICONO */}
    <View style={styles.iconContainer}>
      <Ionicons name="document-text-outline" size={22} color={COLORS.primary} />
    </View>

    {/* INFO */}
    <View style={styles.info}>
      <Text style={styles.invoiceId}>Factura {shortInvoiceId(invoice)}</Text>
      <Text style={styles.date}>
        {formatDate(invoice.date || invoice.createdAt)}
      </Text>
    </View>

    {/* TOTAL + FLECHA */}
    <View style={styles.right}>
      <Text style={styles.total}>{formatCurrency(invoice.total ?? invoice.totalAmount ?? 0)}</Text>
      <View style={styles.arrowWrap}>
        <Ionicons name="chevron-forward" size={14} color={COLORS.textSecondary} />
      </View>
    </View>
  </TouchableOpacity>
);

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
  invoiceId: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
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

export default InvoiceCard;
