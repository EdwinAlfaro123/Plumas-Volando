import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';
import ProductCard from '../../Components/Data/ProductCard';
import DataState from '../../Components/Data/DataSate';
import FloatingCartButton from '../../Components/Navigation/FloatingCartButton';
import { productService } from '../../Services/productService';
import { useCart } from '../../Context/CartContext';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => { loadProducts(1); }, []);

  const loadProducts = async (pageNumber = 1) => {
    pageNumber === 1 ? setLoading(true) : setLoadingMore(true);
    setError('');
    const response = await productService.getProducts(pageNumber, 10);
    if (response.success) {
      setProducts((current) => pageNumber === 1 ? response.products : [...current, ...response.products]);
      setPage(response.currentPage);
      setTotalPages(response.totalPages);
    } else if (pageNumber === 1) setError(response.message);
    setLoading(false);
    setLoadingMore(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Producto agregado', `${product.name} se añadió a tu carrito.`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        columnWrapperStyle={products.length ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.content}
        data={products}
        keyExtractor={(item, index) => item._id || item.id || String(index)}
        ListFooterComponent={loadingMore ? <View style={styles.footer}><ActivityIndicator color={COLORS.primary} /></View> : null}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerCopy}>
                <Text numberOfLines={1} style={styles.title}>Productos frescos</Text>
                <Text numberOfLines={1} style={styles.subtitle}>Elige lo que necesitas para tu hogar.</Text>
              </View>
              <FloatingCartButton navigation={navigation} />
            </View>
            {(loading || error || (!loading && products.length === 0)) && (
              <DataState emptyText="No hay productos disponibles" error={error} loading={loading} onRetry={() => loadProducts(1)} />
            )}
          </View>
        )}
        numColumns={2}
        onEndReached={() => !loadingMore && page < totalPages && loadProducts(page + 1)}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => <ProductCard onAddToCart={handleAddToCart} product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 96, paddingHorizontal: 20, paddingTop: 14 },
  header: { marginBottom: 22 },
  headerTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerCopy: { flex: 1, paddingRight: 14 },
  title: { ...TYPOGRAPHY.heading, color: COLORS.textPrimary, flex: 1, fontSize: 24, letterSpacing: -0.35, paddingRight: 12 },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 13, marginTop: 5 },
  columnWrapper: { justifyContent: 'space-between' },
  footer: { alignItems: 'center', paddingVertical: 22 },
});

export default ProductsScreen;