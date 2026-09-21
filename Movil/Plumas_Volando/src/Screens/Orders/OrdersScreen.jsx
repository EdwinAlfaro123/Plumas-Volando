import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from "../../Constants/theme";
import OrderCard from "../../Components/Data/OrderCard";
import DataState from "../../Components/Data/DataSate";
import Button from "../../Components/Common/Button";
import { orderService } from "../../Services/orderService";
import { useAuth } from "../../Hooks/useAuth";

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    const response = await orderService.getOrders(user._id);
    if (response.success) {
      setOrders(response.orders);
    } else {
      setError(response.message);
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return <DataState loading={loading} />;
    }
    if (error) {
      return <DataState error={error} onRetry={loadOrders} />;
    }
    if (orders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons
              name="receipt-outline"
              size={60}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>No hay pedidos realizados</Text>
          <Text style={styles.emptyText}>
            Aún no has registrado ningún pedido. ¡Explora nuestro catálogo y
            haz tu primera compra!
          </Text>
          <Button
            title="Ir a Productos"
            onPress={() => navigation.navigate("Products")}
            size="medium"
            style={styles.emptyButton}
          />
        </View>
      );
    }

    return orders.map((order) => (
      <OrderCard key={order._id} order={order} />
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>Aquí encontrarás tus pedidos realizados</Text>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 80 },
  title: { ...TYPOGRAPHY.heading, fontSize: 28, color: COLORS.textPrimary },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    marginTop: 20,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    ...NEUROMORPHIC.outerShadow,
    ...NEUROMORPHIC.innerShadow,
  },
  emptyTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyButton: {
    width: "80%",
    maxWidth: 250,
  },
});

export default OrdersScreen;