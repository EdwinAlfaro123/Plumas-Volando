import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';
import api from '../../Services/api';
import { formatCurrency, formatDate } from '../../Utils/formatters';
import { HomeStyles as styles } from '../../Styles/HomeStyle';
import FloatingCartButton from '../../Components/Navigation/FloatingCartButton';

// ─── COMPONENTES REUTILIZABLES ────────────────────────────────────────────────

const PressableNeumorphic = ({ children, onPress, style, accessibilityLabel }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.96, speed: 40, bounciness: 0, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, speed: 30, bounciness: 8, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        accessibilityLabel={accessibilityLabel}
        activeOpacity={1}
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const SummaryCard = ({ icon, label, value, onPress, accent }) => (
  <PressableNeumorphic onPress={onPress} style={[styles.summaryOuter, NEUROMORPHIC.topShadow]} accessibilityLabel={label}>
    <View style={[styles.summaryCard, NEUROMORPHIC.bottomShadow]}>
      <View style={styles.summaryLight} />
      <View style={[styles.summaryIconOuter, NEUROMORPHIC.topShadow]}>
        <View style={[styles.summaryIcon, NEUROMORPHIC.bottomShadow]}>
          <Ionicons color={accent || COLORS.primary} name={icon} size={17} />
        </View>
      </View>
      <View style={styles.summaryCopy}>
        <Text numberOfLines={1} style={styles.summaryLabel}>{label}</Text>
        <Text adjustsFontSizeToFit minimumFontScale={0.66} numberOfLines={1} style={[styles.summaryValue, { color: accent || COLORS.textPrimary }]}>{value}</Text>
      </View>
      <Ionicons color={COLORS.primaryDark} name="chevron-forward" size={20} />
    </View>
  </PressableNeumorphic>
);

const ProductRow = ({ product, isLast, onAdd, onOpen }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUri = product?.image || product?.imageUrl || product?.imageURL;
  const name = product?.name || product?.nombre || product?.productName || 'Producto Plumas';
  const price = Number(product?.price ?? product?.unitPrice ?? product?.precio ?? 0) || 0;
  const stock = Number(product?.quantity ?? product?.stock ?? 0);

  return (
    <PressableNeumorphic onPress={onOpen} style={[styles.productRow, NEUROMORPHIC.bottomShadow, isLast && styles.productRowLast]} accessibilityLabel={`Ver ${name}`}>
      <View style={[styles.productImageShell, NEUROMORPHIC.topShadow]}>
        {imageUri && !imageFailed ? (
          <Image source={{ uri: imageUri }} style={styles.productImage} onError={() => setImageFailed(true)} />
        ) : (
          <View style={styles.productInitial}>
            <Ionicons color={COLORS.primaryDark} name="nutrition-outline" size={25} />
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text numberOfLines={1} style={styles.productName}>{name}</Text>
        <Text style={styles.productMeta}>{formatCurrency(price)} · {stock > 0 ? `${stock} disponibles` : 'Consultar stock'}</Text>
      </View>
      <PressableNeumorphic onPress={onAdd} style={[styles.addOuter, NEUROMORPHIC.topShadow]} accessibilityLabel={`Añadir ${name} al carrito`}>
        <View style={[styles.addButton, NEUROMORPHIC.bottomShadow]}>
          <Ionicons color={COLORS.primaryDark} name="add" size={20} />
        </View>
      </PressableNeumorphic>
    </PressableNeumorphic>
  );
};

// ─── PANTALLA PRINCIPAL ───────────────────────────────────────────────────────

const STATE_LABELS = {
  Entregado: { label: 'Entregado', color: '#22c55e', icon: 'checkmark-circle' },
  Pendiente: { label: 'Pendiente', color: '#f59e0b', icon: 'time-outline' },
  Cancelado: { label: 'Cancelado', color: '#ef4444', icon: 'close-circle' },
  completed: { label: 'Completado', color: '#22c55e', icon: 'checkmark-circle' },
  pending:   { label: 'Pendiente', color: '#f59e0b', icon: 'time-outline' },
  cancelled: { label: 'Cancelado', color: '#ef4444', icon: 'close-circle' },
};

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ pending: 0, spent: 0, total: 0, invoices: 0 });
  const [latestOrder, setLatestOrder] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const firstName = (user?.name || user?.nombre || 'Usuario').trim().split(' ')[0];

  const loadHome = useCallback(async () => {
    const customerId = user?._id;

    const results = await Promise.allSettled([
      api.get('/products?page=1&limit=3'),
      api.get(`/orders/orders/customer/${customerId}`),
      api.get(`/bill/customer/${customerId}`),
    ]);

    // Productos
    if (results[0]?.status === 'fulfilled') {
      const data = results[0].value.data;
      setProducts(Array.isArray(data) ? data.slice(0, 3) : (data?.products || []).slice(0, 3));
    }

    // Pedidos → calcular resumen real
    if (results[1]?.status === 'fulfilled') {
      const raw = results[1].value.data;
      const orders = Array.isArray(raw) ? raw : (raw?.orders || []);

      const pendingCount = orders.filter(o => {
        const s = o.state || o.status || '';
        return s === 'Pendiente' || s === 'pending';
      }).length;

      const totalSpent = orders.reduce((acc, o) => {
        const amount = Number(o.totalPrice ?? o.total ?? 0);
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0);

      const sorted = [...orders].sort((a, b) => {
        const da = new Date(a.createdAt || a.date || 0);
        const db = new Date(b.createdAt || b.date || 0);
        return db - da;
      });

      setLatestOrder(sorted[0] || null);
      setSummary(prev => ({
        ...prev,
        pending: pendingCount,
        spent: totalSpent,
        total: orders.length,
      }));
    }

    // Facturas → conteo
    if (results[2]?.status === 'fulfilled') {
      const raw = results[2].value.data;
      const count = Array.isArray(raw) ? raw.length : (raw?.invoices?.length || 0);
      setSummary(prev => ({ ...prev, invoices: count }));
    }
  }, [user?._id]);

  useEffect(() => {
    loadHome();
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, speed: 11, bounciness: 5, useNativeDriver: true }),
    ]).start();
  }, [fade, loadHome, translateY]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHome();
    setRefreshing(false);
  }, [loadHome]);

  const latestState = latestOrder
    ? STATE_LABELS[latestOrder.state || latestOrder.status] || { label: latestOrder.state || 'Pendiente', color: '#f59e0b', icon: 'time-outline' }
    : null;

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isCompact && styles.contentCompact]}
        refreshControl={<RefreshControl colors={[COLORS.primary]} refreshing={refreshing} tintColor={COLORS.primary} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>

          {/* ── ENCABEZADO ── */}
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Inicio</Text>
              <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={1} style={[styles.greeting, isCompact && styles.greetingCompact]}>Hola, {firstName}</Text>
            </View>
            <FloatingCartButton navigation={navigation} />
          </View>

          {/* ── HERO ── */}
          <View style={[styles.hero, isCompact && styles.heroCompact, NEUROMORPHIC.bottomShadow]}>
            <View style={styles.heroLight} />
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroKicker}>PLUMAS VOLANDO</Text>
                <Text adjustsFontSizeToFit minimumFontScale={0.75} numberOfLines={1} style={[styles.heroTitle, isCompact && styles.heroTitleCompact]}>Tu granja, más cerca.</Text>
              </View>
              <View style={[styles.eggOuter, NEUROMORPHIC.topShadow]}>
                <View style={[styles.eggInner, NEUROMORPHIC.bottomShadow]}>
                  <Ionicons color={COLORS.primary} name="egg-outline" size={28} />
                </View>
              </View>
            </View>
            <Text style={styles.heroDescription}>Productos frescos y el seguimiento de tus compras en un solo lugar.</Text>
            <PressableNeumorphic onPress={() => navigation.navigate('Products')} style={[styles.heroAction, NEUROMORPHIC.topShadow]} accessibilityLabel="Explorar productos">
              <Text style={styles.heroActionText}>Explorar catálogo</Text>
              <Ionicons color={COLORS.primaryDark} name="arrow-forward" size={15} />
            </PressableNeumorphic>
          </View>

          {/* ── RESUMEN ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mi resumen</Text>
          </View>
          <View style={styles.summaryGrid}>
            <SummaryCard
              icon="time-outline"
              label="Pedidos pendientes"
              value={String(summary.pending)}
              accent={summary.pending > 0 ? '#f59e0b' : COLORS.primary}
              onPress={() => navigation.navigate('Orders')}
            />
            <SummaryCard
              icon="receipt-outline"
              label="Total de pedidos"
              value={String(summary.total)}
              onPress={() => navigation.navigate('Orders')}
            />
            <SummaryCard
              icon="wallet-outline"
              label="Total gastado"
              value={formatCurrency(summary.spent)}
              accent={COLORS.primary}
              onPress={() => navigation.navigate('Orders')}
            />
            <SummaryCard
              icon="document-text-outline"
              label="Facturas emitidas"
              value={String(summary.invoices)}
              onPress={() => navigation.navigate('Invoices')}
            />
          </View>

          {/* ── ÚLTIMO PEDIDO ── */}
          {latestOrder && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Último pedido</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                  <Text style={styles.sectionLink}>Ver todos</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Orders')}
                style={[styles.lastOrderCard, NEUROMORPHIC.topShadow]}
              >
                <View style={[styles.lastOrderCardInner, NEUROMORPHIC.bottomShadow]}>
                  <View style={styles.lastOrderLight} />

                  {/* Fila principal */}
                  <View style={styles.lastOrderTop}>
                    <View style={[styles.lastOrderIconOuter, NEUROMORPHIC.topShadow]}>
                      <View style={[styles.lastOrderIcon, NEUROMORPHIC.bottomShadow]}>
                        <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
                      </View>
                    </View>
                    <View style={styles.lastOrderInfo}>
                      <Text style={styles.lastOrderId}>
                        Pedido #{String(latestOrder._id).slice(-3).toUpperCase()}
                      </Text>
                      <Text style={styles.lastOrderDate}>
                        {formatDate(latestOrder.createdAt || latestOrder.date)}
                      </Text>
                    </View>
                    <Text style={styles.lastOrderTotal}>
                      {formatCurrency(latestOrder.totalPrice ?? latestOrder.total ?? 0)}
                    </Text>
                  </View>

                  {/* Estado */}
                  <View style={styles.lastOrderBottom}>
                    <View style={[styles.lastOrderBadge, { backgroundColor: latestState.color + '22' }]}>
                      <Ionicons name={latestState.icon} size={13} color={latestState.color} />
                      <Text style={[styles.lastOrderBadgeText, { color: latestState.color }]}>
                        {latestState.label}
                      </Text>
                    </View>
                    {latestOrder.verificationCode && (
                      <Text style={styles.lastOrderCode}>
                        Código: <Text style={styles.lastOrderCodeValue}>{latestOrder.verificationCode}</Text>
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* ── PRODUCTOS DESTACADOS ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos para ti</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}><Text style={styles.sectionLink}>Ver todos</Text></TouchableOpacity>
          </View>
          {products.length > 0 ? (
            <View style={[styles.productList, NEUROMORPHIC.topShadow]}>
              {products.map((product, index) => (
                <ProductRow
                  isLast={index === products.length - 1}
                  key={product?._id || product?.id || `${product?.name}-${index}`}
                  onAdd={() => addToCart(product)}
                  onOpen={() => navigation.navigate('Products')}
                  product={product}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, NEUROMORPHIC.topShadow]}>
              <Ionicons color={COLORS.textSecondary} name="leaf-outline" size={28} />
              <Text style={styles.emptyTitle}>Aún no hay productos destacados</Text>
              <Text style={styles.emptySubtitle}>Desliza para actualizar o visita el catálogo.</Text>
            </View>
          )}

          {/* ── ACCESOS RÁPIDOS ── */}
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Accesos rápidos</Text></View>
          <View style={styles.actionList}>
            {[
              { name: 'Products', icon: 'grid-outline',          title: 'Productos',   sub: 'Explora el catálogo disponible'       },
              { name: 'Orders',   icon: 'receipt-outline',       title: 'Mis pedidos', sub: 'Consulta el estado de tus compras'    },
              { name: 'Invoices', icon: 'document-text-outline', title: 'Mis facturas', sub: 'Ve tus recibos y comprobantes'       },
              { name: 'Settings', icon: 'person-outline',        title: 'Mi perfil',   sub: 'Información y configuración de cuenta' },
            ].map(item => (
              <TouchableOpacity
                key={item.name}
                accessibilityLabel={`Ir a ${item.title}`}
                activeOpacity={0.82}
                onPress={() => navigation.navigate(item.name)}
                style={[styles.primaryActionOuter, NEUROMORPHIC.topShadow]}
              >
                <View style={[styles.primaryAction, NEUROMORPHIC.bottomShadow]}>
                  <View style={[styles.primaryActionIconOuter, NEUROMORPHIC.topShadow]}>
                    <View style={[styles.primaryActionIcon, NEUROMORPHIC.bottomShadow]}>
                      <Ionicons color={COLORS.primary} name={item.icon} size={21} />
                    </View>
                  </View>
                  <View style={styles.primaryActionCopy}>
                    <Text style={styles.primaryActionTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.primaryActionSubtitle}>{item.sub}</Text>
                  </View>
                  <Ionicons color={COLORS.primaryDark} name="chevron-forward" size={20} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
