import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, FlatList, ActivityIndicator, Modal, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import ProductCard from '../../Components/Data/ProductCard';
import DataState from '../../Components/Data/DataSate';
import Button from '../../Components/Common/Button';
import { productService } from '../../Services/productService';
import { useCart } from '../../Context/CartContext';
import { formatCurrency } from '../../Utils/formatters';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts(1);
  }, []);

  const loadProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    
    setError('');
    const response = await productService.getProducts(pageNumber, 10);
    
    if (response.success) {
      if (pageNumber === 1) {
        setProducts(response.products);
      } else {
        setProducts(prev => [...prev, ...response.products]);
      }
      setTotalPages(response.totalPages);
      setPage(pageNumber);
    } else {
      if (pageNumber === 1) setError(response.message);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      loadProducts(page + 1);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Éxito', `${product.name} agregado al carrito`);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Productos</Text>
      <Text style={styles.subtitle}>Encuentra los mejores insumos</Text>
      {(loading || error || (!loading && products.length === 0)) && (
        <DataState loading={loading} error={error} onRetry={() => loadProducts(1)} emptyText="No hay productos disponibles" />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ProductCard product={item} onAddToCart={handleAddToCart} />}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 30, paddingBottom: 80 },
  header: { marginBottom: 20 },
  title: { ...TYPOGRAPHY.heading, fontSize: 28, color: COLORS.textPrimary },
  subtitle: { ...TYPOGRAPHY.caption, fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  columnWrapper: { justifyContent: 'space-between' },
  footer: { paddingVertical: 20, alignItems: 'center' }
});

export default ProductsScreen;