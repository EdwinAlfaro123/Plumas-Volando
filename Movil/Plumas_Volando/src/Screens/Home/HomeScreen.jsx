import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../Context/AuthContext';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import api from '../../Services/api';
import { formatCurrency } from '../../Utils/formatters';

const AnimatedCard = ({ title, subtitle, icon, color, onPress, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }).start();
    Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, delay, useNativeDriver: true }).start();
  }, []);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <Animated.View style={[styles.cardWrapperWrapper, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.cardWrapper, NEUROMORPHIC.topShadow]}>
          <View style={[styles.card, NEUROMORPHIC.bottomShadow]}>
            <View style={[styles.cardIconWrapper, NEUROMORPHIC.topShadow]}>
              <View style={[styles.cardIcon, NEUROMORPHIC.bottomShadow]}>
                <Ionicons name={icon} size={28} color={color} />
              </View>
            </View>
            <Text style={[styles.cardTitle, color === COLORS.error && { color: COLORS.error }]}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const res = await api.get('/products');
      // If the backend is paginated, res.data.products might be available
      const items = res.data.products || res.data;
      if (Array.isArray(items)) {
        setFeaturedProducts(items.slice(0, 3));
      }
    } catch (e) {
      console.log('Error loading featured', e);
    }
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>¡Hola, {user?.name || 'Usuario'}!</Text>
            <Text style={styles.dateText}>Bienvenido a Plumas Volando 🌿</Text>
          </View>
          <View style={[styles.logoWrapperOuter, NEUROMORPHIC.topShadow]}>
            <View style={[styles.logoWrapper, NEUROMORPHIC.bottomShadow]}>
              <Ionicons name="egg-outline" size={24} color={COLORS.primary} />
            </View>
          </View>
        </Animated.View>

        {featuredProducts.length > 0 && (
          <Animated.View style={{ opacity: fadeAnim, marginBottom: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Destacados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Products')}>
                <Text style={styles.seeAll}>Ver todo</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContainer}>
              {featuredProducts.map((prod) => (
                <TouchableOpacity key={prod._id} activeOpacity={0.8} style={styles.carouselItemWrapper} onPress={() => navigation.navigate('Products')}>
                  <View style={[styles.carouselItem, NEUROMORPHIC.topShadow]}>
                    <View style={[styles.carouselInner, NEUROMORPHIC.bottomShadow]}>
                      <Image source={{ uri: prod.imageUrl || 'https://via.placeholder.com/150' }} style={styles.carouselImage} />
                      <View style={styles.carouselInfo}>
                        <Text style={styles.carouselName} numberOfLines={1}>{prod.name}</Text>
                        <Text style={styles.carouselPrice}>{formatCurrency(prod.price)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Servicios</Text>
        <View style={styles.cardGrid}>
          <AnimatedCard title="Productos" subtitle="Explora el catálogo" icon="basket-outline" color={COLORS.primary} onPress={() => navigation.navigate('Products')} delay={100} />
          <AnimatedCard title="Carrito" subtitle="Tus compras" icon="cart-outline" color={COLORS.primary} onPress={() => navigation.navigate('Cart')} delay={200} />
          <AnimatedCard title="Pedidos" subtitle="Historial de compras" icon="receipt-outline" color={COLORS.primary} onPress={() => navigation.navigate('Orders')} delay={300} />
          <AnimatedCard title="Facturas" subtitle="Tus recibos" icon="document-text-outline" color={COLORS.primary} onPress={() => navigation.navigate('Invoices')} delay={400} />
          <AnimatedCard title="Ajustes" subtitle="Tu perfil" icon="settings-outline" color={COLORS.primary} onPress={() => navigation.navigate('Settings')} delay={500} />
          <AnimatedCard title="Salir" subtitle="Cerrar sesión" icon="log-out-outline" color={COLORS.error} onPress={logout} delay={600} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingTop: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft: { flex: 1 },
  welcomeText: { ...TYPOGRAPHY.heading, fontSize: 24, color: COLORS.textPrimary, marginBottom: 4 },
  dateText: { ...TYPOGRAPHY.body, fontSize: 14, color: COLORS.textSecondary },
  logoWrapperOuter: { borderRadius: 24, backgroundColor: COLORS.background },
  logoWrapper: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...TYPOGRAPHY.heading, fontSize: 18, color: COLORS.textPrimary },
  seeAll: { ...TYPOGRAPHY.subheading, fontSize: 14, color: COLORS.primary },
  carouselContainer: { paddingVertical: 10, paddingRight: 20 },
  carouselItemWrapper: { marginRight: 16, width: 140 },
  carouselItem: { borderRadius: 16, backgroundColor: COLORS.background },
  carouselInner: { borderRadius: 16, overflow: 'hidden', backgroundColor: COLORS.background },
  carouselImage: { width: '100%', height: 100, backgroundColor: COLORS.primaryLighter },
  carouselInfo: { padding: 10 },
  carouselName: { ...TYPOGRAPHY.subheading, fontSize: 14, color: COLORS.textPrimary, marginBottom: 4 },
  carouselPrice: { ...TYPOGRAPHY.heading, fontSize: 14, color: COLORS.primary },
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardWrapperWrapper: { width: '47%', marginBottom: 16 },
  cardWrapper: { borderRadius: 20, backgroundColor: COLORS.background },
  card: { borderRadius: 20, backgroundColor: COLORS.background, padding: 16, alignItems: 'center' },
  cardIconWrapper: { borderRadius: 24, backgroundColor: COLORS.background, marginBottom: 12 },
  cardIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { ...TYPOGRAPHY.subheading, fontSize: 15, color: COLORS.textPrimary, marginBottom: 4 },
  cardSubtitle: { ...TYPOGRAPHY.caption, fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' },
});

export default HomeScreen;