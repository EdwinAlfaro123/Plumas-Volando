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
import InvoiceCard from '../../Components/Data/InvoiceCard';
import DataState from '../../Components/Data/DataSate';
import Button from '../../Components/Common/Button';
import { invoiceService } from '../../Services/invoiceService';
import { useAuth } from '../../Hooks/useAuth';
import { formatCurrency, formatDateTime } from '../../Utils/formatters';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const shortInvoiceId = (invoice) => {
  const raw = invoice?.invoiceNumber || invoice?._id || '';
  return String(raw).slice(-4).toUpperCase();
};

// ─── SUB-COMPONENTE IMAGEN ────────────────────────────────────────────────────

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

// ─── SUB-COMPONENTE SECCIÓN ───────────────────────────────────────────────────

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

const InvoicesScreen = ({ navigation }) => {
  const { colors, isDark, darkNeuro } = useTheme();
  const neuro = isDark ? darkNeuro : NEUROMORPHIC;

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { user } = useAuth();

  useEffect(() => { loadInvoices(); }, []);

  const loadInvoices = async () => {
    setLoading(true);
    setError('');
    const response = await invoiceService.getInvoices(user._id);
    if (response.success) setInvoices(response.invoices);
    else setError(response.message);
    setLoading(false);
  };

  const s = getStyles(colors, neuro);

  const renderContent = () => {
    if (loading) return <DataState loading={loading} />;
    if (error)   return <DataState error={error} onRetry={loadInvoices} />;
    if (invoices.length === 0) {
      return (
        <View style={s.emptyContainer}>
          <View style={s.emptyIconWrapper}>
            <Ionicons name="document-text-outline" size={56} color={colors.primary} />
          </View>
          <Text style={s.emptyTitle}>No hay facturas registradas</Text>
          <Text style={s.emptyText}>
            Aún no tienes facturas generadas. Realiza tu primera compra en nuestro catálogo para ver tus recibos aquí.
          </Text>
          <Button title="Ir a Productos" onPress={() => navigation.navigate('Products')} size="medium" style={s.emptyButton} />
        </View>
      );
    }
    return invoices.map(invoice => (
      <InvoiceCard key={invoice._id} invoice={invoice} onPress={() => setSelectedInvoice(invoice)} />
    ));
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Facturas</Text>
        <Text style={s.subtitle}>Tus recibos de compra</Text>
        {renderContent()}
      </ScrollView>

      <Modal visible={!!selectedInvoice} animationType="slide" transparent onRequestClose={() => setSelectedInvoice(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>

            <View style={s.sheetHandle} />

            <View style={s.sheetHeader}>
              <TouchableOpacity style={s.closeBtn} onPress={() => setSelectedInvoice(null)}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              <Text style={s.sheetTitle}>Detalle de Factura</Text>
              <View style={{ width: 36 }} />
            </View>

            {selectedInvoice && (() => {
              const order        = selectedInvoice.OrderId ?? {};
              const products     = order.products ?? [];
              const payMethod    = selectedInvoice.paymentMethod || order.paymentMethod;
              const total        = order.totalPrice ?? order.total ?? 0;
              const customerName  = order.customerName;
              const customerEmail = order.customerEmail;
              const location      = order.location;
              return (
                <ScrollView contentContainerStyle={s.detailScroll} showsVerticalScrollIndicator={false}>

                  {/* ID + PAGADO */}
                  <View style={s.idRow}>
                    <View style={s.idBadge}>
                      <Text style={s.idLabel}>Factura</Text>
                      <Text style={s.idValue}>#{shortInvoiceId(selectedInvoice)}</Text>
                    </View>
                    <View style={s.paidBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                      <Text style={s.paidText}>Pagado</Text>
                    </View>
                  </View>

                  {/* FECHA */}
                  <DetailSection icon="calendar-outline" title="Fecha y hora" colors={colors} neuro={neuro}>
                    <Text style={s.detailValue}>{formatDateTime(selectedInvoice.date || selectedInvoice.createdAt)}</Text>
                  </DetailSection>

                  {/* CLIENTE */}
                  {(customerName || customerEmail) && (
                    <DetailSection icon="person-outline" title="Datos del cliente" colors={colors} neuro={neuro}>
                      {customerName  && <Text style={s.detailValue}>{customerName}</Text>}
                      {customerEmail && <Text style={[s.detailValue, s.detailSub]}>{customerEmail}</Text>}
                    </DetailSection>
                  )}

                  {/* DIRECCIÓN */}
                  {!!location && (
                    <DetailSection icon="location-outline" title="Dirección de entrega" colors={colors} neuro={neuro}>
                      <Text style={s.detailValue}>{location}</Text>
                    </DetailSection>
                  )}

                  {/* PAGO */}
                  <DetailSection
                    icon={payMethod === 'card' ? 'card-outline' : 'cash-outline'}
                    title="Método de pago"
                    colors={colors} neuro={neuro}
                  >
                    <Text style={s.detailValue}>
                      {payMethod === 'card' ? 'Tarjeta' : payMethod === 'cash' ? 'Efectivo' : payMethod || 'No especificado'}
                    </Text>
                  </DetailSection>

                  {/* PRODUCTOS */}
                  {products.length > 0 && (
                    <DetailSection icon="cube-outline" title={`Productos (${products.length})`} colors={colors} neuro={neuro}>
                      {products.map((item, index) => {
                        const prod     = typeof item.productId === 'object' ? item.productId : null;
                        const name     = prod?.name || prod?.nombre || prod?.productName || `Producto ${index + 1}`;
                        const imageUri = prod?.imageUrl || prod?.image || null;
                        const subtotal = item.subtotal ?? (item.quantity * (item.unitPrice ?? item.price ?? 0)) ?? 0;
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
                  )}

                  {/* TOTAL */}
                  <View style={s.totalCard}>
                    <Text style={s.totalLabel}>Total facturado</Text>
                    <Text style={s.totalValue}>{formatCurrency(total)}</Text>
                  </View>

                </ScrollView>
              );
            })()}
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
  subtitle:     { ...TYPOGRAPHY.caption, fontSize: 13, color: colors.textSecondary, marginBottom: 20, marginTop: 4 },

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

  idRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  idBadge: { backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, ...neuro.inset },
  idLabel: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  idValue: { ...TYPOGRAPHY.subheading, fontSize: 18, color: colors.textPrimary, letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f0fdf4' },
  paidText:  { fontSize: 13, fontWeight: '700', color: '#22c55e' },

  detailValue: { fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  detailSub:   { fontSize: 13, color: colors.textSecondary },

  productRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  productImageWrap: { width: 60, height: 60, borderRadius: 14, overflow: 'hidden' },
  productInfo:      { flex: 1 },
  productName:      { fontSize: 14, fontWeight: '600', color: colors.textPrimary, lineHeight: 20 },
  productQty:       { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  productSubtotal:  { fontSize: 14, fontWeight: '700', color: colors.primary },

  totalCard:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, borderRadius: 16, padding: 18, marginTop: 4, ...neuro.combinedShadow },
  totalLabel: { fontSize: 16, color: colors.textSecondary },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
});

export default InvoicesScreen;
