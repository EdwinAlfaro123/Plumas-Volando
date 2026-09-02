// src/Screens/Cart/CartScreen.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { useCart } from '../../Context/CartContext';
import { formatCurrency } from '../../Utils/formatters';
import Button from '../../Components/Common/Button';
import { orderService } from '../../Services/orderService';
import { useAuth } from '../../Hooks/useAuth';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const handleCheckoutPress = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const confirmOrder = async () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Por favor ingresa una dirección de entrega');
      return;
    }

    setLoading(true);
    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        productName: item.name
      })),
      total: total,
      subtotal: total,
      paymentMethod: 'cash',
      customerData: {
        _id: user?._id,
        name: user?.name || 'Cliente',
        lastname: user?.lastname || '',
        email: user?.email || 'correo@ejemplo.com',
        address: location
      }
    };

    try {
      const response = await orderService.createOrder(orderData);
      if (response.success) {
        // Generate a random 6-character code
        const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setSuccessData({ code: verificationCode, order: response.order });
        clearCart();
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setSuccessData(null);
    setShowCheckout(false);
    setLocation('');
    navigation.navigate('Orders');
  };

  if (cartItems.length === 0 && !successData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>No hay nada por aquí todavía</Text>
          <Text style={styles.emptyText}>¡Dale un vistazo a nuestros productos!</Text>
          <Button title="Comprar todos los productos" onPress={() => navigation.navigate('Products')} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Carrito</Text>
        
        {cartItems.map((item) => (
          <View key={item._id} style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item._id, item.quantity - 1)}>
                <Ionicons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item._id, item.quantity + 1)}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => removeFromCart(item._id)}>
                <Ionicons name="trash-outline" size={20} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Productos:</Text>
            <Text style={styles.summaryText}>{cartItems.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>{formatCurrency(total)}</Text>
          </View>
          <Button title="Continuar al Pago" onPress={handleCheckoutPress} style={{ marginTop: 16 }} />
        </View>
      </ScrollView>

      {/* Checkout Modal */}
      <Modal visible={showCheckout} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!successData ? (
              <>
                <Text style={styles.modalTitle}>Confirmar Pedido</Text>
                <Text style={styles.modalSubtitle}>Ingresa tu ubicación de entrega</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Calle Principal 123"
                    value={location}
                    onChangeText={setLocation}
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
                <View style={styles.modalActions}>
                  <Button title="Cancelar" onPress={() => setShowCheckout(false)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
                  <Button title="Pagar" onPress={confirmOrder} loading={loading} style={{ flex: 1, marginLeft: 8 }} />
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Ionicons name="checkmark-circle" size={64} color={COLORS.success || '#4ade80'} />
                <Text style={styles.modalTitle}>¡Pedido Exitoso!</Text>
                <Text style={styles.modalSubtitle}>Tu pedido ha sido procesado</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Código de Verificación:</Text>
                  <Text style={styles.codeValue}>{successData.code}</Text>
                </View>
                <Button title="Ver Mis Pedidos" onPress={handleFinish} style={{ width: '100%', marginTop: 24 }} />
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 80 },
  title: { ...TYPOGRAPHY.heading, fontSize: 28, color: COLORS.textPrimary, marginBottom: 20 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { ...TYPOGRAPHY.heading, fontSize: 20, color: COLORS.textPrimary, marginTop: 20 },
  emptyText: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center' },
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBackground,
    borderRadius: 16, padding: 16, marginBottom: 12, ...NEUROMORPHIC.combinedShadow,
  },
  itemInfo: { flex: 1 },
  itemName: { ...TYPOGRAPHY.subheading, fontSize: 16, color: COLORS.textPrimary },
  itemPrice: { fontSize: 14, color: COLORS.primary, marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.background,
    justifyContent: 'center', alignItems: 'center', ...NEUROMORPHIC.innerShadow,
  },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  deleteButton: { marginLeft: 12, padding: 4 },
  summaryContainer: {
    backgroundColor: COLORS.cardBackground, borderRadius: 20, padding: 20,
    marginTop: 20, ...NEUROMORPHIC.outerShadow, ...NEUROMORPHIC.innerShadow,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryText: { fontSize: 16, color: COLORS.textPrimary },
  totalText: { fontSize: 20, fontWeight: '700', color: COLORS.primary },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: COLORS.background, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 24, paddingBottom: 40, alignItems: 'center', ...NEUROMORPHIC.topShadow
  },
  modalTitle: { ...TYPOGRAPHY.heading, fontSize: 22, color: COLORS.textPrimary, marginBottom: 8 },
  modalSubtitle: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, textAlign: 'center' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: COLORS.inputBackground,
    borderRadius: 16, paddingHorizontal: 16, minHeight: 56, marginBottom: 24, ...NEUROMORPHIC.flat
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  modalActions: { flexDirection: 'row', width: '100%' },
  successContainer: { alignItems: 'center', width: '100%', paddingVertical: 10 },
  codeContainer: {
    backgroundColor: COLORS.primaryLighter || '#f0fdf4', padding: 16, borderRadius: 16,
    alignItems: 'center', width: '100%', marginTop: 12, ...NEUROMORPHIC.innerShadow
  },
  codeLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: 4 },
  codeValue: { ...TYPOGRAPHY.heading, fontSize: 24, color: COLORS.primary, letterSpacing: 2 }
});

export default CartScreen;