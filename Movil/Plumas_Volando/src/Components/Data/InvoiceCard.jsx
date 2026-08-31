import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { formatCurrency, formatDate } from '../../Utils/formatters';

const InvoiceCard = ({ invoice, onPress }) => {
  return (
    <View style={[styles.cardWrapper, NEUROMORPHIC.topShadow]}>
      <View style={[styles.cardContainer, NEUROMORPHIC.bottomShadow]}>
        <TouchableOpacity activeOpacity={0.8} style={styles.cardInner} onPress={onPress}>
          <View style={styles.iconContainer}>
            <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.invoiceId}>Factura #{invoice.invoiceNumber || invoice._id}</Text>
            <Text style={styles.date}>{formatDate(invoice.date || invoice.createdAt)}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.total}>{formatCurrency(invoice.total)}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: COLORS.cardBackground,
  },
  cardContainer: {
    borderRadius: 16,
    backgroundColor: COLORS.cardBackground,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
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
  invoiceId: { ...TYPOGRAPHY.subheading, fontSize: 16, color: COLORS.textPrimary },
  date: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  total: { ...TYPOGRAPHY.subheading, fontSize: 16, color: COLORS.primary },
});

export default InvoiceCard;