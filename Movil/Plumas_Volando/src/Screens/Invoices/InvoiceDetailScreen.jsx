import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import DataState from '../../Components/Data/DataSate';
import { invoiceService } from '../../Services/invoiceService';
import { formatCurrency, formatDate } from '../../Utils/formatters';

const InvoiceDetailScreen = ({ route, navigation }) => {
  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    setLoading(true);
    setError('');
    const response = await invoiceService.getInvoiceDetail(invoiceId);
    if (response.success) {
      setInvoice(response.invoice);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  if (loading || error) {
    return (
      <SafeAreaView style={styles.container}>
        <DataState loading={loading} error={error} onRetry={loadInvoice} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Factura #{invoice.invoiceNumber || invoice._id}</Text>
          <Text style={styles.date}>{formatDate(invoice.createdAt)}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cliente:</Text>
            <Text style={styles.detailValue}>{invoice.customerName || 'Cliente'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha:</Text>
            <Text style={styles.detailValue}>{formatDate(invoice.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Detalle de la factura</Text>
          {invoice.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name || item.productId}</Text>
                <Text style={styles.itemQty}>Cantidad: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(invoice.total)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  backButton: { padding: 8, marginBottom: 16 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { ...TYPOGRAPHY.heading, fontSize: 24, color: COLORS.textPrimary, textAlign: 'center' },
  date: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  detailsContainer: {
    backgroundColor: COLORS.cardBackground, borderRadius: 16, padding: 16, marginBottom: 20,
    ...NEUROMORPHIC.combinedShadow,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 16, color: COLORS.textSecondary },
  detailValue: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  itemsContainer: { marginBottom: 20 },
  itemsTitle: { ...TYPOGRAPHY.subheading, fontSize: 18, color: COLORS.textPrimary, marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemInfo: { flex: 1, paddingRight: 10 },
  itemName: { fontSize: 16, color: COLORS.textPrimary },
  itemQty: { fontSize: 14, color: COLORS.textSecondary },
  itemPrice: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  totalContainer: {
    backgroundColor: COLORS.primaryLight, borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  totalLabel: { fontSize: 18, color: COLORS.primary },
  totalAmount: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
});

export default InvoiceDetailScreen;