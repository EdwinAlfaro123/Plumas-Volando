import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import { HomeStyles as styles } from '../../Styles/HomeStyle';
import FloatingCartButton from '../../Components/Navigation/FloatingCartButton';

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
      <View style={styles.summaryCopy}>
        <Text numberOfLines={1} style={styles.summaryLabel}>{label}</Text>
        <Text adjustsFontSizeToFit minimumFontScale={0.66} numberOfLines={1} style={[styles.summaryValue, compact && styles.summaryValueCompact]}>{value}</Text>
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

const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ pending: 0, spent: 0 });
  const [summaryError, setSummaryError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const firstName = (user?.name || user?.nombre || 'Usuario').trim().split(' ')[0];

  const loadHome = useCallback(async () => {
    setSummaryError('');
    const results = await Promise.allSettled([
      api.get('/products?page=1&limit=3'),
      api.get('/home-summary'),
    ]);
    const productsResult = results[0];
    const ordersResult = results[1];

    if (productsResult?.status === 'fulfilled') {
      const data = productsResult.value.data;
      setProducts(Array.isArray(data) ? data.slice(0, 3) : (data?.products || []).slice(0, 3));
    }
    if (ordersResult?.status === 'fulfilled') {
      const data = ordersResult.value.data?.summary || {};
      setSummary({
        pending: Number(data.pendingOrders) || 0,
        spent: Number(data.monthlySpent) || 0,
      });
    } else {
      // Conserva los valores seguros por defecto cuando no haya datos o falle la consulta.
      setSummary({ pending: 0, spent: 0 });
      setSummaryError('No pudimos actualizar tu resumen. Desliza para reintentar.');
    }
  }, []);

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
            <SummaryCard compact icon="wallet-outline" label="Gastado este mes" value={formatCurrency(summary.spent)} onPress={() => navigation.navigate('Orders')} />
          </View>
          {!!summaryError && <Text style={styles.summaryError}>{summaryError}</Text>}

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
          <View style={styles.actionList}>
            <TouchableOpacity
              accessibilityLabel="Ir a productos"
              activeOpacity={0.82}
              onPress={() => navigation.navigate('Products')}
              style={[styles.primaryActionOuter, NEUROMORPHIC.topShadow]}
            >
              <View style={[styles.primaryAction, NEUROMORPHIC.bottomShadow]}>
                <View style={[styles.primaryActionIconOuter, NEUROMORPHIC.topShadow]}>
                  <View style={[styles.primaryActionIcon, NEUROMORPHIC.bottomShadow]}>
                    <Ionicons color={COLORS.primary} name="grid-outline" size={21} />
                  </View>
                </View>
                <View style={styles.primaryActionCopy}>
                  <Text style={styles.primaryActionTitle}>Productos</Text>
                  <Text numberOfLines={1} style={styles.primaryActionSubtitle}>Explora el catálogo disponible</Text>
                </View>
                <Ionicons color={COLORS.primaryDark} name="chevron-forward" size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityLabel="Ir a pedidos"
              activeOpacity={0.82}
              onPress={() => navigation.navigate('Orders')}
              style={[styles.primaryActionOuter, NEUROMORPHIC.topShadow]}
            >
              <View style={[styles.primaryAction, NEUROMORPHIC.bottomShadow]}>
                <View style={[styles.primaryActionIconOuter, NEUROMORPHIC.topShadow]}>
                  <View style={[styles.primaryActionIcon, NEUROMORPHIC.bottomShadow]}>
                    <Ionicons color={COLORS.primary} name="receipt-outline" size={21} />
                  </View>
                </View>
                <View style={styles.primaryActionCopy}>
                  <Text style={styles.primaryActionTitle}>Mis pedidos</Text>
                  <Text numberOfLines={1} style={styles.primaryActionSubtitle}>Consulta el estado de tus compras</Text>
                </View>
                <Ionicons color={COLORS.primaryDark} name="chevron-forward" size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
