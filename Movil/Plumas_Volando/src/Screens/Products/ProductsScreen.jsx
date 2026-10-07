import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import ProductCard from '../../Components/Data/ProductCard';
import DataState from '../../Components/Data/DataSate';
import FloatingCartButton from '../../Components/Navigation/FloatingCartButton';
import SearchBar from '../../Components/Common/SearchBar';
import FilterBottomSheet from '../../Components/Common/FilterBottomSheet';
import { productService } from '../../Services/productService';
import { useCart } from '../../Context/CartContext';

const ProductsScreen = ({ navigation }) => {
    const { addToCart } = useCart();
    
    // Estados de Datos
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados de Búsqueda y Filtros
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', sort: '' });
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Cargar Productos — muestra exactamente 10 por página
    const loadProducts = async (pageNumber = 1) => {
        setLoading(true);
        setError('');
        const response = await productService.getProducts({
            page: pageNumber,
            limit: 10,
            search: search,
            ...filters
        });

        if (response.success) {
            setProducts(response.products);
            setPage(response.currentPage ?? pageNumber);
            setTotalPages(response.totalPages ?? 1);
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

    // Efecto para Búsqueda en Tiempo Real (Debounce) y Filtros
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, filters]);

    // Recargar stock cada vez que la pantalla recibe el foco
    useFocusEffect(
        useCallback(() => {
            loadProducts(1);
        }, [search, filters])
    );

    const handleAddToCart = (product) => {
        addToCart(product);
        Alert.alert('Producto agregado', `${product.name} se añadió a tu carrito.`);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setShowFilterModal(false);
    };

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== null).length;

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <StatusBar style="dark" />
            
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.headerCopy}>
                        <Text numberOfLines={1} style={styles.title}>Productos frescos</Text>
                        <Text numberOfLines={1} style={styles.subtitle}>Elige lo que necesitas para tu hogar.</Text>
                    </View>
                    <FloatingCartButton navigation={navigation} />
                </View>

                {/* SEARCH BAR */}
                <SearchBar 
                    value={search} 
                    onChangeText={setSearch} 
                    placeholder="Buscar huevos, pollos..." 
                />

                {/* FILTER BUTTON */}
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowFilterModal(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="options-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.filterButtonText}>Filtros</Text>
                    {activeFiltersCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* LISTA DE PRODUCTOS */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item, index) => item._id || item.id || String(index)}
                    numColumns={2}
                    columnWrapperStyle={products.length > 1 ? styles.columnWrapper : undefined}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <DataState
                            emptyText="No se encontraron productos con estos criterios"
                            error={error}
                            loading={false}
                            onRetry={() => loadProducts(1)}
                        />
                    }
                    ListFooterComponent={
                        totalPages > 1 ? (
                            <View style={styles.pagination}>
                                <TouchableOpacity
                                    style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
                                    onPress={() => page > 1 && loadProducts(page - 1)}
                                    activeOpacity={0.8}
                                    disabled={page <= 1}
                                >
                                    <Ionicons name="chevron-back" size={18} color={page <= 1 ? COLORS.textMuted : COLORS.primary} />
                                </TouchableOpacity>
                                <View style={styles.pageIndicator}>
                                    <Text style={styles.pageText}>{page} / {totalPages}</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
                                    onPress={() => page < totalPages && loadProducts(page + 1)}
                                    activeOpacity={0.8}
                                    disabled={page >= totalPages}
                                >
                                    <Ionicons name="chevron-forward" size={18} color={page >= totalPages ? COLORS.textMuted : COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onAddToCart={handleAddToCart}
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        />
                    )}
                />
            )}

            {/* MODAL DE FILTROS */}
            <FilterBottomSheet
                visible={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleApplyFilters}
                initialFilters={filters}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: 20, paddingTop: 14, marginBottom: 10 },
    headerTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    headerCopy: { flex: 1, paddingRight: 14 },
    title: { ...TYPOGRAPHY.heading, color: COLORS.textPrimary, flex: 1, fontSize: 24, letterSpacing: -0.35, paddingRight: 12 },
    subtitle: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, fontSize: 13, marginTop: 5 },
    
    filterButton: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 20, marginBottom: 16, ...NEUROMORPHIC.flat,
        borderWidth: 1, borderColor: 'rgba(138,90,0,0.15)',
    },
    filterButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginLeft: 6 },
    badge: {
        backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 18, height: 18,
        alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 4,
    },
    badgeText: { color: COLORS.textLight, fontSize: 10, fontWeight: '800' },

    content: { paddingBottom: 20, paddingHorizontal: 20, paddingTop: 4 },
    columnWrapper: { justifyContent: 'space-between' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // PAGINACIÓN
    pagination: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 12, paddingVertical: 20, paddingBottom: 96,
    },
    pageBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center',
        ...NEUROMORPHIC.combinedShadow,
    },
    pageBtnDisabled: { opacity: 0.4 },
    pageIndicator: {
        backgroundColor: COLORS.background, borderRadius: 20,
        paddingHorizontal: 20, paddingVertical: 10,
        ...NEUROMORPHIC.inset,
    },
    pageText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
});

export default ProductsScreen;