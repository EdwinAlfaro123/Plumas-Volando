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
import { useTheme } from '../../Context/ThemeContext';
import OrderCard from '../../Components/Data/OrderCard';
import DataState from '../../Components/Data/DataSate';
import Button from '../../Components/Common/Button';
import { orderService } from '../../Services/orderService';
import { useAuth } from '../../Hooks/useAuth';
import { formatCurrency, formatDateTime } from '../../Utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

// ─── SUB-COMPONENTES ──────────────────────────────────────────────────────────

const ProductImage = ({ uri, colors }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  if (!uri || error) {
    return (
      <View style={[piStyles.placeholder, { backgroundColor: colors.background }]}>
        <Ionicons name="egg-outline" size={22} color={colors.primary} />
      </View>
    );
  }
  return (
    <>
      {loading && (
        <View style={[piStyles.placeholder, { position: 'absolute', zIndex: 1, backgroundColor: colors.background }]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <Image
        source={{ uri }}
        style={piStyles.image}
        resizeMode="cover"
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
      />
    </>
  );
};

const piStyles = StyleSheet.create({
  placeholder: { width: 60, height: 60, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  image:       { width: 60, height: 60, borderRadius: 14 },
});

const DetailSection = ({ icon, title, children, colors, neuro }) => (
  <View style={[dsStyles.section, { backgroundColor: colors.background }, neuro.combinedShadow]}>
    <View style={[dsStyles.header, { borderBottomColor: colors.border }]}>
      <View style={[dsStyles.icon, { backgroundColor: colors.background }, neuro.inset]}>
        <Ionicons name={icon} size={14} color={colors.primary} />
      </View>
      <Text style={[dsStyles.title, { color: colors.textSecondary }]}>{title}</Text>
    </View>
    <View style={dsStyles.body}>{children}</View>
  </View>
);

const dsStyles = StyleSheet.create({
  section: { marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
  header:  { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  icon:    { width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center' },
  title:   { ...TYPOGRAPHY.subheading, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 },
  body:    { padding: 14, gap: 4 },
});

// ─── PANTALLA ─────────────────────────────────────────────────────────────────

const OrdersScreen = ({ navigation }) => {
  const { colors, isDark, darkNeuro } = useTheme();
  const neuro = isDark ? darkNeuro : NEUROMORPHIC;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    const response = await orderService.getOrders(user._id);
    if (response.success) {
      const seen = new Set();
      setOrders((response.orders || []).filter(o => { if (seen.has(o._id)) return false; seen.add(o._id); return true; }));
    }
    else setError(response.message);
    setLoading(false);
  };

  const s = getStyles(colors, neuro);

  const renderContent = () => {
    if (loading) return <DataState loading={loading} />;
    if (error)   return <DataState error={error} onRetry={loadOrders} />;
    if (orders.length === 0) {
      return (
        <View style={s.emptyContainer}>
          <View style={s.emptyIconWrapper}>
            <Ionicons name="receipt-outline" size={56} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>No hay pedidos realizados</Text>
          <Text style={s.emptyText}>Aún no has registrado ningún pedido. ¡Explora nuestro catálogo y haz tu primera compra!</Text>
          <Button title="Ir a Productos" onPress={() => navigation.navigate('Products')} size="medium" style={s.emptyButton} />
        </View>
      );
    }
    return orders.map(order => (
      <OrderCard key={order._id} order={order} onPress={() => setSelectedOrder(order)} />
    ));
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={s.scrollContent}>
        <Text style={s.title}>Pedidos</Text>
        <Text style={s.subtitle}>Aquí encontrarás tus pedidos realizados</Text>
        {renderContent()}
      </ScrollView>

      <Modal visible={!!selectedOrder} animationType="slide" transparent onRequestClose={() => setSelectedOrder(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>

            <View style={s.sheetHandle} />

            <View style={s.sheetHeader}>
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedOrder(null)}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={s.sheetTitle}>Detalle del Pedido</Text>
              <View style={{ width: 36 }} />
            </View>

            {selectedOrder && (
              <ScrollView contentContainerStyle={s.detailScroll} showsVerticalScrollIndicator={false}>

                {/* ID + ESTADO */}
                <View style={s.idRow}>
                  <View style={s.idBadge}>
                    <Text style={s.idLabel}>Pedido</Text>
                    <Text style={s.idValue}>#{shortId(selectedOrder._id)}</Text>
                  </View>
                  {(() => {
                    const st = getStateInfo(selectedOrder);
                    return (
                      <View style={[s.stateBadge, { backgroundColor: st.bg }]}>
                        <Ionicons name={st.icon} size={14} color={st.color} />
                        <Text style={[s.stateText, { color: st.color }]}>{st.label}</Text>
                      </View>
                    );
                  })()}
                </View>

                {/* CÓDIGO */}
                {selectedOrder.verificationCode && (
                  <View style={s.codeCard}>
                    <Text style={s.codeCardLabel}>Código de verificación</Text>
                    <Text style={s.codeCardValue}>{selectedOrder.verificationCode}</Text>
                    <Text style={s.codeCardHint}>Presenta este código al recibir tu pedido</Text>
                  </View>
                )}

                {/* FECHA */}
                <DetailSection icon="calendar-outline" title="Fecha y hora" colors={colors} neuro={neuro}>
                  <Text style={s.detailValue}>{formatDateTime(selectedOrder.date || selectedOrder.orderDate || selectedOrder.createdAt)}</Text>
                </DetailSection>

                {/* CLIENTE */}
                <DetailSection icon="person-outline" title="Datos del cliente" colors={colors} neuro={neuro}>
                  {selectedOrder.customerName  && <Text style={s.detailValue}>{selectedOrder.customerName}</Text>}
                  {selectedOrder.customerEmail && <Text style={[s.detailValue, s.detailSub]}>{selectedOrder.customerEmail}</Text>}
                </DetailSection>

                {/* DIRECCIÓN */}
                {!!selectedOrder.location && (
                  <DetailSection icon="location-outline" title="Dirección de entrega" colors={colors} neuro={neuro}>
                    <Text style={s.detailValue}>{selectedOrder.location}</Text>
                  </DetailSection>
                )}

                {/* PAGO */}
                <DetailSection
                  icon={selectedOrder.paymentMethod === 'card' ? 'card-outline' : 'cash-outline'}
                  title="Método de pago"
                  colors={colors} neuro={neuro}
                >
                  <Text style={s.detailValue}>
                    {selectedOrder.paymentMethod === 'card' ? 'Tarjeta' :
                     selectedOrder.paymentMethod === 'cash' ? 'Efectivo' :
                     selectedOrder.paymentMethod || 'No especificado'}
                  </Text>
                </DetailSection>

                {/* PRODUCTOS */}
                <DetailSection icon="cube-outline" title="Productos" colors={colors} neuro={neuro}>
                  {(selectedOrder.products || []).map((item, index) => {
                    const product  = typeof item.productId === 'object' ? item.productId : null;
                    const name     = product?.name || product?.nombre || product?.productName || `Producto ${index + 1}`;
                    const imageUri = product?.imageUrl || product?.image || null;
                    const subtotal = item.subtotal ?? 0;
                    return (
                      <View key={index} style={[s.productRow, { borderBottomColor: colors.border }]}>
                        <View style={[s.productImageWrap, { backgroundColor: colors.background }, neuro.inset]}>
                          <ProductImage uri={imageUri} colors={colors} />
                        </View>
                        <View style={s.productInfo}>
                          <Text style={s.productName} numberOfLines={2}>{name}</Text>
                          <Text style={s.productQty}>Cantidad: {item.quantity}</Text>
                        </View>
                        <Text style={s.productSubtotal}>{formatCurrency(subtotal)}</Text>
                      </View>
                    );
                  })}
                </DetailSection>

                {/* TOTAL */}
                <View style={s.totalCard}>
                  <Text style={s.totalLabel}>Total pagado</Text>
                  <Text style={s.totalValue}>{formatCurrency(selectedOrder.totalPrice ?? selectedOrder.total ?? 0)}</Text>
                </View>

                {/* RESPUESTA EMPLEADO */}
                {!!selectedOrder.employeeComment && (
                  <View style={s.employeeCommentCard}>
                    <View style={s.employeeCommentHeader}>
                      <View style={s.employeeCommentIcon}>
                        <Ionicons name="chatbubble-ellipses" size={15} color={colors.primary} />
                      </View>
                      <Text style={s.employeeCommentTitle}>Respuesta del equipo</Text>
                    </View>
                    <Text style={s.employeeCommentText}>{selectedOrder.employeeComment}</Text>
                  </View>
                )}

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── ESTILOS DINÁMICOS ────────────────────────────────────────────────────────

const getStyles = (colors, neuro) => StyleSheet.create({
  container:    { flex: 1, backgroundColor: colors.background },
  scrollContent:{ padding: 20, paddingBottom: 80 },
  title:        { ...TYPOGRAPHY.heading, fontSize: 26, color: colors.textPrimary },
  subtitle:     { ...TYPOGRAPHY.caption, fontSize: 14, color: colors.textSecondary, marginBottom: 20, marginTop: 4 },

  emptyContainer:  { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, marginTop: 20 },
  emptyIconWrapper:{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 20, ...neuro.combinedShadow },
  emptyTitle:      { ...TYPOGRAPHY.heading, fontSize: 20, color: colors.textPrimary, textAlign: 'center', marginBottom: 10 },
  emptyText:       { ...TYPOGRAPHY.body, fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20, marginBottom: 20 },
  emptyButton:     { width: '80%', maxWidth: 250 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet:   { backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: SCREEN_HEIGHT * 0.92, minHeight: SCREEN_HEIGHT * 0.5, ...neuro.topShadow },
  sheetHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  closeBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', ...neuro.combinedShadow },
  sheetTitle:   { ...TYPOGRAPHY.subheading, fontSize: 17, color: colors.textPrimary },

  detailScroll: { padding: 20, paddingBottom: 40 },

  idRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  idBadge:  { backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, ...neuro.inset },
  idLabel:  { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  idValue:  { ...TYPOGRAPHY.subheading, fontSize: 18, color: colors.textPrimary, letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  stateBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  stateText:  { fontSize: 13, fontWeight: '700' },

  codeCard:      { backgroundColor: colors.background, borderRadius: 18, padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: colors.primary, ...neuro.combinedShadow },
  codeCardLabel: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  codeCardValue: { fontSize: 28, fontWeight: '900', color: colors.primary, letterSpacing: 6, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  codeCardHint:  { fontSize: 11, color: colors.textMuted, marginTop: 6, textAlign: 'center' },

  detailValue:  { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  detailSub:    { fontSize: 13, color: colors.textSecondary },

  productRow:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  productImageWrap:  { width: 60, height: 60, borderRadius: 14, overflow: 'hidden' },
  productInfo:       { flex: 1 },
  productName:       { fontSize: 14, fontWeight: '600', color: colors.textPrimary, lineHeight: 20 },
  productQty:        { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productSubtotal:   { fontSize: 14, fontWeight: '700', color: colors.primary },

  totalCard:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, borderRadius: 16, padding: 18, marginTop: 4, ...neuro.combinedShadow },
  totalLabel: { fontSize: 16, color: colors.textSecondary },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.primary },

  employeeCommentCard:   { backgroundColor: colors.background, borderRadius: 16, marginTop: 4, overflow: 'hidden', borderLeftWidth: 3, borderLeftColor: colors.primary, ...neuro.combinedShadow },
  employeeCommentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  employeeCommentIcon:   { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primaryLighter, justifyContent: 'center', alignItems: 'center' },
  employeeCommentTitle:  { fontSize: 12, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  employeeCommentText:   { fontSize: 14, color: colors.textPrimary, lineHeight: 20, paddingHorizontal: 14, paddingBottom: 14 },
});

export default OrdersScreen;
