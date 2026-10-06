// src/Screens/Cart/CartScreen.jsx
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { useCart } from '../../Context/CartContext';
import { formatCurrency } from '../../Utils/formatters';
import Button from '../../Components/Common/Button';
import { orderService } from '../../Services/orderService';
import { useAuth } from '../../Hooks/useAuth';
import { useToast } from '../../Context/ToastContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const DEPARTAMENTOS_SV = [
  'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán',
  'La Libertad', 'La Paz', 'La Unión', 'Morazán',
  'San Miguel', 'San Salvador', 'San Vicente', 'Santa Ana',
  'Sonsonate', 'Usulután',
];

const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Efectivo', icon: 'cash-outline' },
  { value: 'card', label: 'Tarjeta', icon: 'card-outline' },
];

const CartScreen = ({ navigation }) => {
  const { cartItems, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const [form, setForm] = useState({
    contactName: `${user?.name || ''} ${user?.lastname || ''}`.trim(),
    contactPhone: user?.phone || '',
    departamento: '',
    municipio: '',
    direccion: '',
    referencia: '',
    paymentMethod: 'cash',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [formErrors]);

  const validateForm = () => {
    const errors = {};
    if (!form.contactName.trim()) errors.contactName = 'Requerido';
    if (!form.contactPhone.trim()) {
      errors.contactPhone = 'Requerido';
    } else if (!/^[0-9]{4}-[0-9]{4}$/.test(form.contactPhone.trim())) {
      errors.contactPhone = 'Formato: 0000-0000';
    }
    if (!form.departamento) errors.departamento = 'Selecciona un departamento';
    if (!form.municipio.trim()) errors.municipio = 'Requerido';
    if (!form.direccion.trim()) errors.direccion = 'Requerido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length > 4) {
      cleaned = cleaned.substring(0, 4) + '-' + cleaned.substring(4, 8);
    }
    updateField('contactPhone', cleaned);
  };

  const handleOpenCheckout = () => {
    if (cartItems.length === 0) return;
    setForm({
      contactName: `${user?.name || ''} ${user?.lastname || ''}`.trim(),
      contactPhone: user?.phone || '',
      departamento: '',
      municipio: '',
      direccion: '',
      referencia: '',
      paymentMethod: 'cash',
      notes: '',
    });
    setFormErrors({});
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    if (loading) return;
    setShowCheckout(false);
    setSuccessData(null);
  };

  const confirmOrder = async () => {
    if (!validateForm()) {
      showToast('Completa todos los campos obligatorios.', 'warning');
      return;
    }

    setLoading(true);

    const fullAddress = [
      form.direccion.trim(),
      form.municipio.trim(),
      form.departamento,
      form.referencia.trim() ? `Ref: ${form.referencia.trim()}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    const orderData = {
      items: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price,
        productName: item.name,
      })),
      total,
      subtotal: total,
      paymentMethod: form.paymentMethod,
      customerData: {
        _id: user?._id,
        name: form.contactName.trim(),
        lastname: user?.lastname || '',
        email: user?.email || '',
        address: fullAddress,
        phone: form.contactPhone.trim(),
        notes: form.notes.trim(),
      },
    };

    try {
      const response = await orderService.createOrder(orderData);
      if (response.success) {
        clearCart();
        setSuccessData({
          verificationCode: response.verificationCode || response.order?._id?.toString().slice(-8).toUpperCase(),
          orderId: response.order?._id,
          address: fullAddress,
          paymentMethod: form.paymentMethod,
          itemCount: cartItems.length,
          total,
        });
      } else {
        showToast(response.message || 'No se pudo procesar el pedido.', 'error');
      }
    } catch {
      showToast('No se pudo procesar el pedido.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setSuccessData(null);
    setShowCheckout(false);
    navigation.navigate('Orders');
  };

  // ─── CARRITO VACÍO ───────────────────────────────────────────────────────────

  if (cartItems.length === 0 && !successData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>¡Dale un vistazo a nuestros productos!</Text>
          <Button
            title="Ver productos"
            onPress={() => navigation.navigate('Products')}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ─── RENDER PRINCIPAL ─────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mi Carrito</Text>
          <View style={styles.badgeWrap}>
            <Text style={styles.badgeText}>{cartItems.length}</Text>
          </View>
        </View>

        {/* ITEMS */}
        {cartItems.map(item => (
          <View key={item._id} style={styles.itemCard}>
            <View style={styles.itemIconWrap}>
              <Ionicons name="egg-outline" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.price)} / unidad</Text>
            </View>
            <View style={styles.itemControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item._id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item._id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFromCart(item._id)}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* RESUMEN */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Envío</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success || '#22c55e' }]}>Gratis</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
          <Button
            title="Proceder al pago"
            onPress={handleOpenCheckout}
            style={{ marginTop: 20 }}
          />
        </View>

      </ScrollView>

      {/* ─── MODAL CHECKOUT ─────────────────────────────────────────────── */}
      <Modal
        visible={showCheckout}
        animationType="slide"
        transparent
        onRequestClose={handleCloseCheckout}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalSheet}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* HANDLE */}
            <View style={styles.sheetHandle} />

            {/* HEADER MODAL */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={handleCloseCheckout}
                disabled={loading}
              >
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>
                {successData ? '¡Pedido Realizado!' : 'Confirmar Pedido'}
              </Text>
              <View style={{ width: 36 }} />
            </View>

            {/* ── SUCCESS ── */}
            {successData ? (
              <ScrollView
                contentContainerStyle={styles.successScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.successIconWrap}>
                  <Ionicons name="checkmark-circle" size={72} color={COLORS.success || '#22c55e'} />
                </View>

                <Text style={styles.successTitle}>¡Compra exitosa!</Text>
                <Text style={styles.successSubtitle}>
                  Tu pedido fue procesado correctamente
                </Text>

                {/* CÓDIGO */}
                <View style={styles.codeCard}>
                  <Text style={styles.codeCardLabel}>Código de verificación</Text>
                  <Text style={styles.codeCardValue}>{successData.verificationCode}</Text>
                  <Text style={styles.codeCardHint}>
                    Presenta este código al recibir tu pedido
                  </Text>
                </View>

                {/* DETALLES */}
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText} numberOfLines={2}>
                      {successData.address}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name={successData.paymentMethod === 'cash' ? 'cash-outline' : 'card-outline'} size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>
                      {successData.paymentMethod === 'cash' ? 'Pago en efectivo' : 'Pago con tarjeta'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="cube-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.detailText}>
                      {successData.itemCount} {successData.itemCount === 1 ? 'producto' : 'productos'} · {formatCurrency(successData.total)}
                    </Text>
                  </View>
                </View>

                <Button
                  title="Ver mis pedidos"
                  onPress={handleFinish}
                  style={{ marginTop: 8, marginBottom: 24 }}
                />
              </ScrollView>
            ) : (

              /* ── FORMULARIO ── */
              <ScrollView
                contentContainerStyle={styles.formScroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >

                {/* RESUMEN RÁPIDO */}
                <View style={styles.quickSummary}>
                  <Ionicons name="cart-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.quickSummaryText}>
                    {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} · {formatCurrency(total)}
                  </Text>
                </View>

                {/* SECCIÓN: DATOS DE CONTACTO */}
                <SectionHeader icon="person-outline" title="Datos de contacto" />

                <FieldLabel label="Nombre del destinatario" required />
                <InputWrap error={formErrors.contactName}>
                  <Ionicons name="person-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={form.contactName}
                    onChangeText={v => updateField('contactName', v)}
                    placeholder="Nombre completo"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="words"
                  />
                </InputWrap>
                {formErrors.contactName && <ErrorText msg={formErrors.contactName} />}

                <FieldLabel label="Teléfono de contacto" required />
                <InputWrap error={formErrors.contactPhone}>
                  <Ionicons name="call-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={form.contactPhone}
                    onChangeText={handlePhoneChange}
                    placeholder="0000-0000"
                    placeholderTextColor={COLORS.textMuted}
                    keyboardType="phone-pad"
                    maxLength={9}
                  />
                </InputWrap>
                {formErrors.contactPhone && <ErrorText msg={formErrors.contactPhone} />}

                {/* SECCIÓN: DIRECCIÓN */}
                <SectionHeader icon="location-outline" title="Dirección de entrega" />

                <FieldLabel label="Departamento" required />
                <TouchableOpacity
                  style={[styles.inputWrap, formErrors.departamento && styles.inputWrapError]}
                  onPress={() => setShowDeptPicker(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="map-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <Text style={[styles.input, !form.departamento && { color: COLORS.textMuted }]}>
                    {form.departamento || 'Selecciona un departamento'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
                {formErrors.departamento && <ErrorText msg={formErrors.departamento} />}

                <FieldLabel label="Municipio / Ciudad" required />
                <InputWrap error={formErrors.municipio}>
                  <Ionicons name="business-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={form.municipio}
                    onChangeText={v => updateField('municipio', v)}
                    placeholder="Ej. Santa Tecla"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="words"
                  />
                </InputWrap>
                {formErrors.municipio && <ErrorText msg={formErrors.municipio} />}

                <FieldLabel label="Dirección exacta" required />
                <InputWrap error={formErrors.direccion}>
                  <Ionicons name="home-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={form.direccion}
                    onChangeText={v => updateField('direccion', v)}
                    placeholder="Calle, Avenida, Número de casa"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="sentences"
                  />
                </InputWrap>
                {formErrors.direccion && <ErrorText msg={formErrors.direccion} />}

                <FieldLabel label="Punto de referencia" />
                <InputWrap>
                  <Ionicons name="navigate-outline" size={18} color={COLORS.primary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={form.referencia}
                    onChangeText={v => updateField('referencia', v)}
                    placeholder="Ej. Frente al parque central"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="sentences"
                  />
                </InputWrap>

                {/* SECCIÓN: MÉTODO DE PAGO */}
                <SectionHeader icon="wallet-outline" title="Método de pago" />

                <View style={styles.paymentRow}>
                  {PAYMENT_OPTIONS.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.paymentOption,
                        form.paymentMethod === option.value && styles.paymentOptionActive,
                      ]}
                      onPress={() => updateField('paymentMethod', option.value)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={option.icon}
                        size={22}
                        color={form.paymentMethod === option.value ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text
                        style={[
                          styles.paymentLabel,
                          form.paymentMethod === option.value && styles.paymentLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      {form.paymentMethod === option.value && (
                        <View style={styles.paymentCheck}>
                          <Ionicons name="checkmark" size={12} color={COLORS.primary} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                {/* SECCIÓN: NOTAS */}
                <SectionHeader icon="chatbubble-ellipses-outline" title="Notas adicionales" optional />

                <InputWrap multiline>
                  <Ionicons name="create-outline" size={18} color={COLORS.primary} style={[styles.inputIcon, { alignSelf: 'flex-start', marginTop: 3 }]} />
                  <TextInput
                    style={[styles.input, styles.inputMultiline]}
                    value={form.notes}
                    onChangeText={v => updateField('notes', v)}
                    placeholder="Instrucciones para el repartidor..."
                    placeholderTextColor={COLORS.textMuted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    autoCapitalize="sentences"
                  />
                </InputWrap>

                {/* TOTAL + BOTÓN */}
                <View style={styles.confirmSection}>
                  <View style={styles.confirmTotalRow}>
                    <Text style={styles.confirmTotalLabel}>Total a pagar</Text>
                    <Text style={styles.confirmTotalValue}>{formatCurrency(total)}</Text>
                  </View>
                  <Button
                    title="Confirmar pedido"
                    onPress={confirmOrder}
                    loading={loading}
                    disabled={loading}
                    style={{ marginTop: 16 }}
                  />
                </View>

              </ScrollView>
            )}
          </KeyboardAvoidingView>
        </View>

        {/* ── PICKER DEPARTAMENTO ── */}
        <Modal
          visible={showDeptPicker}
          animationType="fade"
          transparent
          onRequestClose={() => setShowDeptPicker(false)}
        >
          <TouchableOpacity
            style={styles.pickerOverlay}
            activeOpacity={1}
            onPress={() => setShowDeptPicker(false)}
          >
            <View style={styles.pickerCard}>
              <Text style={styles.pickerTitle}>Selecciona un departamento</Text>
              <FlatList
                data={DEPARTAMENTOS_SV}
                keyExtractor={item => item}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      form.departamento === item && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      updateField('departamento', item);
                      setShowDeptPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        form.departamento === item && styles.pickerItemTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                    {form.departamento === item && (
                      <Ionicons name="checkmark" size={16} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

      </Modal>
    </SafeAreaView>
  );
};

// ─── SUB-COMPONENTES ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon, title, optional }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionIconWrap}>
      <Ionicons name={icon} size={15} color={COLORS.primary} />
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
    {optional && <Text style={styles.sectionOptional}>(opcional)</Text>}
  </View>
);

const FieldLabel = ({ label, required }) => (
  <Text style={styles.fieldLabel}>
    {label}
    {required && <Text style={{ color: COLORS.error }}> *</Text>}
  </Text>
);

const InputWrap = ({ children, error, multiline }) => (
  <View style={[styles.inputWrap, error && styles.inputWrapError, multiline && styles.inputWrapMulti]}>
    {children}
  </View>
);

const ErrorText = ({ msg }) => (
  <View style={styles.errorRow}>
    <Ionicons name="alert-circle-outline" size={12} color={COLORS.error} />
    <Text style={styles.errorText}>{msg}</Text>
  </View>
);

// ─── ESTILOS ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 26,
    color: COLORS.textPrimary,
  },
  badgeWrap: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // EMPTY
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  emptyTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginTop: 24,
  },
  emptyText: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },

  // ITEM CARD
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    ...NEUROMORPHIC.combinedShadow,
  },
  itemIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...NEUROMORPHIC.inset,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  qtyText: {
    width: 28,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    ...NEUROMORPHIC.combinedShadow,
  },

  // SUMMARY CARD
  summaryCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    ...NEUROMORPHIC.combinedShadow,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border || '#E8E9F0',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // MODAL SHEET
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.92,
    minHeight: SCREEN_HEIGHT * 0.5,
    ...NEUROMORPHIC.topShadow,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border || '#DDE1E9',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#EEF0F6',
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  sheetTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 17,
    color: COLORS.textPrimary,
  },

  // FORMULARIO CHECKOUT
  formScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  quickSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    ...NEUROMORPHIC.inset,
  },
  quickSummaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // SECCIÓN
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.combinedShadow,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textPrimary,
    flex: 1,
  },
  sectionOptional: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // CAMPOS
  fieldLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 4,
    ...NEUROMORPHIC.inset,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapError: {
    borderColor: COLORS.error,
  },
  inputWrapMulti: {
    alignItems: 'flex-start',
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 80,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
  },

  // MÉTODO DE PAGO
  paymentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    ...NEUROMORPHIC.combinedShadow,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
  },
  paymentLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  paymentLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  paymentCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },

  // CONFIRM SECTION
  confirmSection: {
    marginTop: 20,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    ...NEUROMORPHIC.combinedShadow,
  },
  confirmTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmTotalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  confirmTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },

  // SUCCESS
  successScroll: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successIconWrap: {
    marginVertical: 8,
  },
  successTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    marginBottom: 24,
    textAlign: 'center',
  },
  codeCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    ...NEUROMORPHIC.combinedShadow,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  codeCardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeCardValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  codeCardHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  detailCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    marginBottom: 20,
    ...NEUROMORPHIC.inset,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // DEPARTAMENTO PICKER
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerCard: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 20,
    maxHeight: SCREEN_HEIGHT * 0.6,
    ...NEUROMORPHIC.combinedShadow,
  },
  pickerTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  pickerItemActive: {
    backgroundColor: COLORS.background,
    ...NEUROMORPHIC.inset,
  },
  pickerItemText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  pickerItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default CartScreen;
