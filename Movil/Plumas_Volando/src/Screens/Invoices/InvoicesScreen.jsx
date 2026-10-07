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

// â”€â”€â”€ SUB-COMPONENTE IMAGEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ProductImage = ({ uri }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  if (!uri || error) {
    return (
      <View style={[piStyles.placeholder, { backgroundColor: COLORS.background }]}>
        <Ionicons name="egg-outline" size={22} color={COLORS.primary} />
      </View>
    );
  }
  return (
    <>
      {loading && (
        <View style={[piStyles.placeholder, { position: 'absolute', zIndex: 1, backgroundColor: COLORS.background }]}>
          <ActivityIndicator size="small" color={COLORS.primary} />
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

// â”€â”€â”€ SUB-COMPONENTE SECCIÃ“N â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DetailSection = ({ icon, title, children }) => (
  <View style={[dsStyles.section, NEUROMORPHIC.combinedShadow, { backgroundColor: COLORS.background }]}>
    <View style={[dsStyles.header, { borderBottomColor: '#E8EAF0' }]}>
      <View style={[dsStyles.icon, NEUROMORPHIC.inset, { backgroundColor: COLORS.background }]}>
        <Ionicons name={icon} size={14} color={COLORS.primary} />
      </View>
      <Text style={[dsStyles.title, { color: COLORS.textSecondary }]}>{title}</Text>
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

// â”€â”€â”€ PANTALLA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const InvoicesScreen = ({ navigation }) => {
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
    if (response.success) {
      const seen = new Set();
      setInvoices((response.invoices || []).filter(i => { if (seen.has(i._id)) return false; seen.add(i._id); return true; }));
    }
    else setError(response.message);
    setLoading(false);
  };

  const s = getStyles();

  const renderContent = () => {
    if (loading) return <DataState loading={loading} />;
    if (error)   return <DataState error={error} onRetry={loadInvoices} />;
    if (invoices.length === 0) {
      return (
        <View style={s.emptyContainer}>
          <View style={s.emptyIconWrapper}>
            <Ionicons name="document-text-outline" size={56} color={COLORS.primary} />
          </View>
          <Text style={s.emptyTitle}>No hay facturas registradas</Text>
          <Text style={s.emptyText}>
            AÃºn no tienes facturas generadas. Realiza tu primera compra en nuestro catÃ¡logo para ver tus recibos aquÃ­.
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
      <StatusBar style="dark" />

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
                <Ionicons name="close" size={18} color={COLORS.textSecondary} />
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
                  <DetailSection icon="calendar-outline" title="Fecha y hora">
                    <Text style={s.detailValue}>{formatDateTime(selectedInvoice.date || selectedInvoice.createdAt)}</Text>
                  </DetailSection>

                  {/* CLIENTE */}
                  {(customerName || customerEmail) && (
                    <DetailSection icon="person-outline" title="Datos del cliente">
                      {customerName  && <Text style={s.detailValue}>{customerName}</Text>}
                      {customerEmail && <Text style={[s.detailValue, s.detailSub]}>{customerEmail}</Text>}
                    </DetailSection>
                  )}

                  {/* DIRECCIÃ“N */}
                  {!!location && (
                    <DetailSection icon="location-outline" title="DirecciÃ³n de entrega">
                      <Text style={s.detailValue}>{location}</Text>
                    </DetailSection>
                  )}

                  {/* PAGO */}
                  <DetailSection
                    icon={payMethod === 'card' ? 'card-outline' : 'cash-outline'}
                    title="MÃ©todo de pago"
                   
                  >
                    <Text style={s.detailValue}>
                      {payMethod === 'card' ? 'Tarjeta' : payMethod === 'cash' ? 'Efectivo' : payMethod || 'No especificado'}
                    </Text>
                  </DetailSection>

                  {/* PRODUCTOS */}
                  {products.length > 0 && (
                    <DetailSection icon="cube-outline" title={`Productos (${products.length})`}>
                      {products.map((item, index) => {
                        const prod     = typeof item.productId === 'object' ? item.productId : null;
                        const name     = prod?.name || prod?.nombre || prod?.productName || `Producto ${index + 1}`;
                        const imageUri = prod?.imageUrl || prod?.image || null;
                        const subtotal = item.subtotal ?? (item.quantity * (item.unitPrice ?? item.price ?? 0)) ?? 0;
                        return (
                          <View key={index} style={[s.productRow, { borderBottomColor: '#E8EAF0' }]}>
                            <View style={[s.productImageWrap, NEUROMORPHIC.inset, { backgroundColor: COLORS.background }]}>
                              <ProductImage uri={imageUri} />
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

// â”€â”€â”€ ESTILOS DINÃMICOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getStyles = () => StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  scrollContent:{ padding: 20, paddingBottom: 80 },
  title:        { ...TYPOGRAPHY.heading, fontSize: 26, color: COLORS.textPrimary },
  subtitle:     { ...TYPOGRAPHY.caption, fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, marginTop: 4 },

  emptyContainer:  { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, marginTop: 20 },
  emptyIconWrapper:{ width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginBottom: 20, ...NEUROMORPHIC.combinedShadow },
  emptyTitle:      { ...TYPOGRAPHY.heading, fontSize: 20, color: COLORS.textPrimary, textAlign: 'center', marginBottom: 10 },
  emptyText:       { ...TYPOGRAPHY.body, fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20, marginBottom: 20 },
  emptyButton:     { width: '80%', maxWidth: 250 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet:   { backgroundColor: COLORS.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: SCREEN_HEIGHT * 0.92, minHeight: SCREEN_HEIGHT * 0.5, ...NEUROMORPHIC.topShadow },
  sheetHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E8EAF0', alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  sheetHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8EAF0' },
  closeBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', ...NEUROMORPHIC.combinedShadow },
  sheetTitle:   { ...TYPOGRAPHY.subheading, fontSize: 17, color: COLORS.textPrimary },

  detailScroll: { padding: 20, paddingBottom: 40 },

  idRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  idBadge: { backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, ...NEUROMORPHIC.inset },
  idLabel: { fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  idValue: { ...TYPOGRAPHY.subheading, fontSize: 18, color: COLORS.textPrimary, letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#f0fdf4' },
  paidText:  { fontSize: 13, fontWeight: '700', color: '#22c55e' },

  detailValue: { fontSize: 15, color: COLORS.textPrimary, lineHeight: 22 },
  detailSub:   { fontSize: 13, color: COLORS.textSecondary },

  productRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, gap: 12 },
  productImageWrap: { width: 60, height: 60, borderRadius: 14, overflow: 'hidden' },
  productInfo:      { flex: 1 },
  productName:      { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, lineHeight: 20 },
  productQty:       { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  productSubtotal:  { fontSize: 14, fontWeight: '700', color: COLORS.primary },

  totalCard:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 16, padding: 18, marginTop: 4, ...NEUROMORPHIC.combinedShadow },
  totalLabel: { fontSize: 16, color: COLORS.textSecondary },
  totalValue: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
});

export default InvoicesScreen;

