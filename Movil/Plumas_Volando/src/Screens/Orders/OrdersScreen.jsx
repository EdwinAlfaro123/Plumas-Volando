import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import OrderCard from '../../Components/Data/OrderCard';
import DataState from '../../Components/Data/DataSate';
import Button from '../../Components/Common/Button';
import { orderService } from '../../Services/orderService';
import { useAuth } from '../../Hooks/useAuth';
import { formatCurrency, formatDateTime } from '../../Utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── CONFIG DE ESTADO ─────────────────────────────────────────────────────────

const STATE_CONFIG = {
  Entregado:  { color: '#22c55e', bg: '#f0fdf4', icon: 'checkmark-circle',  label: 'Entregado'  },
  Pendiente:  { color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline',       label: 'Pendiente'  },
  Cancelado:  { color: '#ef4444', bg: '#fef2f2', icon: 'close-circle',       label: 'Cancelado'  },
  completed:  { color: '#22c55e', bg: '#f0fdf4', icon: 'checkmark-circle',   label: 'Completado' },
  pending:    { color: '#f59e0b', bg: '#fffbeb', icon: 'time-outline',        label: 'Pendiente'  },
  cancelled:  { color: '#ef4444', bg: '#fef2f2', icon: 'close-circle',        label: 'Cancelado'  },
};

const getStateInfo = (order) => {
  const key = order.state || order.status || 'Pendiente';
  return STATE_CONFIG[key] || { color: COLORS.textSecondary, bg: '#f5f5f5', icon: 'ellipse-outline', label: key };
};

const shortId = (id) => id ? String(id).slice(-4).toUpperCase() : '---';

// ─── PANTALLA ─────────────────────────────────────────────────────────────────

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  const renderContent = () => {
    if (loading) return <DataState loading={loading} />;
    if (error) return <DataState error={error} onRetry={loadOrders} />;
    if (orders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons name="receipt-outline" size={56} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>No hay pedidos realizados</Text>
          <Text style={styles.emptyText}>
            Aún no has registrado ningún pedido. ¡Explora nuestro catálogo y
            haz tu primera compra!
          </Text>
          <Button
            title="Ir a Productos"
            onPress={() => navigation.navigate('Products')}
            size="medium"
            style={styles.emptyButton}
          />
        </View>
      );
    }

    return orders.map(order => (
      <OrderCard
        key={order._id}
        order={order}
        onPress={() => setSelectedOrder(order)}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>Aquí encontrarás tus pedidos realizados</Text>
        {renderContent()}
      </ScrollView>

      {/* ─── MODAL DETALLE ─────────────────────────────────────────────── */}
      <Modal
        visible={!!selectedOrder}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>

            {/* HANDLE */}
            <View style={styles.sheetHandle} />

            {/* HEADER */}
            <View style={styles.sheetHeader}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedOrder(null)}
              >
                <Ionicons name="close" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Detalle del Pedido</Text>
              <View style={{ width: 36 }} />
            </View>

            {selectedOrder && (
              <ScrollView
                contentContainerStyle={styles.detailScroll}
                showsVerticalScrollIndicator={false}
              >
                {/* ── ID + ESTADO ── */}
                <View style={styles.idRow}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idLabel}>Pedido</Text>
                    <Text style={styles.idValue}>#{shortId(selectedOrder._id)}</Text>
                  </View>

                  {(() => {
                    const s = getStateInfo(selectedOrder);
                    return (
                      <View style={[styles.stateBadge, { backgroundColor: s.bg }]}>
                        <Ionicons name={s.icon} size={14} color={s.color} />
                        <Text style={[styles.stateText, { color: s.color }]}>{s.label}</Text>
                      </View>
                    );
                  })()}
                </View>

                {/* ── CÓDIGO DE VERIFICACIÓN ── */}
                {selectedOrder.verificationCode && (
                  <View style={styles.codeCard}>
                    <Text style={styles.codeCardLabel}>Código de verificación</Text>
                    <Text style={styles.codeCardValue}>{selectedOrder.verificationCode}</Text>
                    <Text style={styles.codeCardHint}>Presenta este código al recibir tu pedido</Text>
                  </View>
                )}

                {/* ── FECHA ── */}
                <DetailSection icon="calendar-outline" title="Fecha y hora">
                  <Text style={styles.detailValue}>
                    {formatDateTime(selectedOrder.date || selectedOrder.orderDate || selectedOrder.createdAt)}
                  </Text>
                </DetailSection>

                {/* ── CLIENTE ── */}
                <DetailSection icon="person-outline" title="Datos del cliente">
                  {selectedOrder.customerName ? (
                    <Text style={styles.detailValue}>{selectedOrder.customerName}</Text>
                  ) : null}
                  {selectedOrder.customerEmail ? (
                    <Text style={[styles.detailValue, styles.detailSub]}>{selectedOrder.customerEmail}</Text>
                  ) : null}
                </DetailSection>

                {/* ── DIRECCIÓN ── */}
                {selectedOrder.location ? (
                  <DetailSection icon="location-outline" title="Dirección de entrega">
                    <Text style={styles.detailValue}>{selectedOrder.location}</Text>
                  </DetailSection>
                ) : null}

                {/* ── MÉTODO DE PAGO ── */}
                <DetailSection
                  icon={selectedOrder.paymentMethod === 'card' ? 'card-outline' : 'cash-outline'}
                  title="Método de pago"
                >
                  <Text style={styles.detailValue}>
                    {selectedOrder.paymentMethod === 'card' ? 'Tarjeta' :
                     selectedOrder.paymentMethod === 'cash' ? 'Efectivo' :
                     selectedOrder.paymentMethod || 'No especificado'}
                  </Text>
                </DetailSection>

                {/* ── PRODUCTOS ── */}
                <DetailSection icon="cube-outline" title="Productos">
                  {(selectedOrder.products || []).map((item, index) => {
                    const product = typeof item.productId === 'object' ? item.productId : null;
                    const name = product?.name || product?.nombre || product?.productName || `Producto ${index + 1}`;
                    const imageUri = product?.imageUrl || product?.image || null;
                    const subtotal = item.subtotal ?? 0;

                    return (
                      <View key={index} style={styles.productRow}>
                        {/* IMAGEN */}
                        <View style={styles.productImageWrap}>
                          <ProductImage uri={imageUri} />
                        </View>

                        {/* DATOS */}
                        <View style={styles.productInfo}>
                          <Text style={styles.productName} numberOfLines={2}>{name}</Text>
                          <Text style={styles.productQty}>
                            Cantidad: {item.quantity}
                          </Text>
                        </View>

                        {/* SUBTOTAL */}
                        <Text style={styles.productSubtotal}>
                          {formatCurrency(subtotal)}
                        </Text>
                      </View>
                    );
                  })}
                </DetailSection>

                {/* ── TOTAL ── */}
                <View style={styles.totalCard}>
                  <Text style={styles.totalLabel}>Total pagado</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(selectedOrder.totalPrice ?? selectedOrder.total ?? 0)}
                  </Text>
                </View>

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── SUB-COMPONENTE IMAGEN PRODUCTO ──────────────────────────────────────────

const ProductImage = ({ uri }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  if (!uri || error) {
    return (
      <View style={styles.productImagePlaceholder}>
        <Ionicons name="egg-outline" size={22} color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      {loading && (
        <View style={[styles.productImagePlaceholder, { position: 'absolute', zIndex: 1 }]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      )}
      <Image
        source={{ uri }}
        style={styles.productImage}
        resizeMode="cover"
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
      />
    </>
  );
};

// ─── SUB-COMPONENTE SECCIÓN ───────────────────────────────────────────────────

const DetailSection = ({ icon, title, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={14} color={COLORS.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

// ─── ESTILOS ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 26,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    marginTop: 4,
  },

  // EMPTY
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...NEUROMORPHIC.combinedShadow,
  },
  emptyTitle: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyButton: {
    width: '80%',
    maxWidth: 250,
  },

  // MODAL
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
  closeBtn: {
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

  // DETALLE SCROLL
  detailScroll: {
    padding: 20,
    paddingBottom: 40,
  },

  // ID + ESTADO
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  idBadge: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...NEUROMORPHIC.inset,
  },
  idLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  idValue: {
    ...TYPOGRAPHY.subheading,
    fontSize: 18,
    color: COLORS.textPrimary,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // CÓDIGO
  codeCard: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...NEUROMORPHIC.combinedShadow,
  },
  codeCardLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  codeCardValue: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  codeCardHint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    textAlign: 'center',
  },

  // SECCIÓN
  section: {
    marginBottom: 16,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
    ...NEUROMORPHIC.combinedShadow,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#EEF0F6',
  },
  sectionIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.inset,
  },
  sectionTitle: {
    ...TYPOGRAPHY.subheading,
    fontSize: 13,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    padding: 14,
    gap: 4,
  },
  detailValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  detailSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },

  // PRODUCTO
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || '#EEF0F6',
    gap: 12,
  },
  productImageWrap: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
    ...NEUROMORPHIC.inset,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  productQty: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  productSubtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // TOTAL
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    ...NEUROMORPHIC.combinedShadow,
  },
  totalLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default OrdersScreen;
