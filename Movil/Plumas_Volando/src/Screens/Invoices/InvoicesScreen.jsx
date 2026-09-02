import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';
import InvoiceCard from '../../Components/Data/InvoiceCard';
import DataState from '../../Components/Data/DataSate';
import { invoiceService } from '../../Services/invoiceService';
import { useAuth } from '../../Hooks/useAuth';

const InvoicesScreen = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError('');
    const response = await invoiceService.getInvoices(user._id);
    if (response.success) {
      setInvoices(response.invoices);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Facturas</Text>
        <Text style={styles.subtitle}>Tus recibos de compra</Text>

        <DataState loading={loading} error={error} onRetry={loadInvoices} emptyText="No tienes facturas aún" />

        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice._id}
            invoice={invoice}
            onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: invoice._id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 80 },
  title: { ...TYPOGRAPHY.heading, fontSize: 28, color: COLORS.textPrimary },
  subtitle: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginBottom: 20 },
});

export default InvoicesScreen;