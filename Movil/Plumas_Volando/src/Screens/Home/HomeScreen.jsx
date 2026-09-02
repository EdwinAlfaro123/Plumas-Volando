import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
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
import { formatCurrency } from '../../Utils/formatters';
import { HomeStyles as styles } from '../../Styles/HomeStyle.js';
import FloatingCartButton from '../../Components/Navigation/FloatingCartButton';

const getUserId = (user) => user?._id || user?.id || user?.idCustomer || user?.customerId;
const getOrderTotal = (order) => Number(order?.totalPrice ?? order?.total ?? 0) || 0;
const getOrderState = (order) => String(order?.state ?? order?.status ?? '').toLowerCase();
const isPending = (order) => ['pendiente', 'pending'].includes(getOrderState(order));
const isCompleted = (order) => ['entregado', 'completed', 'completado'].includes(getOrderState(order));

const getMonthTotal = (orders) => {
  const now = new Date();
  return orders
    .filter((order) => {
      const date = new Date(order?.orderDate || order?.date || order?.createdAt);
      return isCompleted(order) && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((total, order) => total + getOrderTotal(order), 0);
};

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

const SummaryCard = ({ compact, icon, label, value, onPress }) => (
  <PressableNeumorphic onPress={onPress} style={[styles.summaryOuter, NEUROMORPHIC.topShadow]} accessibilityLabel={label}>
    <View style={[styles.summaryCard, NEUROMORPHIC.bottomShadow]}>
      <View style={styles.summaryLight} />
      <View style={[styles.summaryIconOuter, NEUROMORPHIC.topShadow]}>
        <View style={[styles.summaryIcon, NEUROMORPHIC.bottomShadow]}>
          <Ionicons color={COLORS.primary} name={icon} size={17} />
        </View>
      </View>
      <Text adjustsFontSizeToFit minimumFontScale={0.66} numberOfLines={1} style={[styles.summaryValue, compact && styles.summaryValueCompact]}>{value}</Text>
      <Text numberOfLines={2} style={styles.summaryLabel}>{label}</Text>
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

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const firstName = (user?.name || user?.nombre || 'Usuario').trim().split(' ')[0];

  const loadHome = useCallback(async () => {
    const customerId = getUserId(user);
    const requests = [api.get('/products?page=1&limit=3')];
    // La ruta del backend se monta en /orders y su subruta es /orders/customer/:id.
    if (customerId) requests.push(api.get(`/orders/orders/customer/${customerId}`));

    const results = await Promise.allSettled(requests);
    const productsResult = results[0];
    const ordersResult = results[1];

    if (productsResult?.status === 'fulfilled') {
      const data = productsResult.value.data;
      setProducts(Array.isArray(data) ? data.slice(0, 3) : (data?.products || []).slice(0, 3));
    }
    if (ordersResult?.status === 'fulfilled') {
      const data = ordersResult.value.data;
      setOrders(Array.isArray(data) ? data : (data?.orders || []));
    }
  }, [user]);

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

  const summary = useMemo(() => ({
    pending: orders.filter(isPending).length,
    spent: getMonthTotal(orders),
  }), [orders]);

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, isCompact && styles.contentCompact]}
        refreshControl={<RefreshControl colors={[COLORS.primary]} refreshing={refreshing} tintColor={COLORS.primary} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>Inicio</Text>
              <Text adjustsFontSizeToFit minimumFontScale={0.74} numberOfLines={1} style={[styles.greeting, isCompact && styles.greetingCompact]}>Hola, {firstName}</Text>
            </View>
            <FloatingCartButton navigation={navigation} />
          </View>

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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mi resumen</Text>
          </View>
          <View style={styles.summaryGrid}>
            <SummaryCard compact icon="time-outline" label="Pedidos pendientes" value={String(summary.pending)} onPress={() => navigation.navigate('Orders')} />
            <SummaryCard compact icon="wallet-outline" label="Gastado este mes" value={formatCurrency(summary.spent)} onPress={() => navigation.navigate('Invoices')} />
          </View>

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

          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Accesos rápidos</Text></View>
          <View style={styles.quickActions}>
            {[
              { icon: 'grid-outline', label: 'Productos', screen: 'Products' },
              { icon: 'receipt-outline', label: 'Pedidos', screen: 'Orders' },
              { icon: 'settings-outline', label: 'Perfil', screen: 'Settings' },
            ].map((action) => (
              <PressableNeumorphic key={action.screen} onPress={() => navigation.navigate(action.screen)} style={[styles.quickActionOuter, NEUROMORPHIC.topShadow]} accessibilityLabel={action.label}>
                <View style={[styles.quickAction, NEUROMORPHIC.bottomShadow]}>
                  <Ionicons color={COLORS.primary} name={action.icon} size={22} />
                  <Text style={styles.quickActionText}>{action.label}</Text>
                </View>
              </PressableNeumorphic>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;