import React, { useEffect, useState, useCallback } from 'react';
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
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Estados de Búsqueda y Filtros
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', sort: '' });
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Cargar Productos
    const loadProducts = async (pageNumber = 1, resetList = false) => {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);
        
        setError('');
        const response = await productService.getProducts({
            page: pageNumber,
            limit: 10,
            search: search,
            ...filters
        });

        if (response.success) {
            setProducts((current) => resetList || pageNumber === 1 ? response.products : [...current, ...response.products]);
            setPage(response.currentPage);
            setTotalPages(response.totalPages);
        } else if (pageNumber === 1) {
            setError(response.message);
        }
        
        setLoading(false);
        setLoadingMore(false);
    };

    // Efecto para Búsqueda en Tiempo Real (Debounce) y Filtros
    useEffect(() => {
        const timer = setTimeout(() => {
            loadProducts(1, true);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, filters]);

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
            <FlatList
                data={products}
                keyExtractor={(item, index) => item._id || item.id || String(index)}
                numColumns={2}
                columnWrapperStyle={products.length > 1 ? styles.columnWrapper : undefined}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                onEndReached={() => !loadingMore && page < totalPages && loadProducts(page + 1)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <View style={styles.footer}><ActivityIndicator color={COLORS.primary} /></View> : null}
                ListEmptyComponent={
                    !loading ? (
                        <DataState 
                            emptyText="No se encontraron productos con estos criterios" 
                            error={error} 
                            loading={loading} 
                            onRetry={() => loadProducts(1, true)} 
                        />
                    ) : null
                }
                renderItem={({ item }) => (
                    <ProductCard 
                        product={item} 
                        onAddToCart={handleAddToCart} 
                        // [MODIFICADO] Navegar a la pantalla de detalle pasando el producto
                        onPress={() => navigation.navigate('ProductDetail', { product: item })} 
                    />
                )}
            />

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

    content: { paddingBottom: 96, paddingHorizontal: 20, paddingTop: 4 },
    columnWrapper: { justifyContent: 'space-between' },
    footer: { alignItems: 'center', paddingVertical: 22 },
});

export default ProductsScreen;