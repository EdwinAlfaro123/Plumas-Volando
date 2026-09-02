import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';
import OrderCard from '../../Components/Data/OrderCard';
import DataState from '../../Components/Data/DataSate';
import { orderService } from '../../Services/orderService';
import { useAuth } from '../../Hooks/useAuth';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    const response = await orderService.getOrders(user._id);
    if (response.success) {
      setOrders(response.orders);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>Aquí encontrarás tus pedidos realizados</Text>

        <DataState loading={loading} error={error} onRetry={loadOrders} emptyText="No has realizado pedidos aún" />

        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
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

export default OrdersScreen;