import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';
import { formatCurrency } from '../../Utils/formatters';
import { useCart } from '../../Context/CartContext';
import Button from '../../Components/Common/Button';

const ProductDetailScreen = ({ navigation, route }) => {
    const { product } = route.params;
    const { addToCart } = useCart();
    const [imageFailed, setImageFailed] = useState(false);

    const imageUri = product.imageUrl || product.image;
    const category = product.TypeProduct || product.category || 'General';
    const stock = product.quantity || 0;

    const handleAddToCart = () => {
        if (stock <= 0) {
            Alert.alert('Sin stock', 'Lo sentimos, este producto no está disponible actualmente.');
            return;
        }
        addToCart(product);
        Alert.alert('¡Agregado!', `${product.name} se añadió a tu carrito.`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar style="dark" />
            
            {/* HEADER FLOTANTE */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity 
                    style={[styles.backButton, NEUROMORPHIC.flat]} 
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* IMAGEN PRINCIPAL */}
                <View style={[styles.imageContainer, NEUROMORPHIC.inset]}>
                    {imageUri && !imageFailed ? (
                        <Image 
                            source={{ uri: imageUri }} 
                            style={styles.image} 
                            resizeMode="cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="leaf-outline" size={60} color={COLORS.primaryLight} />
                        </View>
                    )}
                </View>

                {/* PANEL DE INFORMACIÓN */}
                <View style={[styles.infoPanel, NEUROMORPHIC.topShadow]}>
                    <View style={styles.infoHeader}>
                        <View style={styles.titleBlock}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <View style={[styles.categoryBadge, NEUROMORPHIC.flat]}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </View>
                        </View>
                        <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                    </View>

                    {/* STOCK Y RATING */}
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Ionicons name="cube-outline" size={16} color={COLORS.primary} />
                            <Text style={styles.metaText}>
                                {stock > 0 ? `${stock} disponibles` : 'Agotado'}
                            </Text>
                        </View>
                        {product.review > 0 && (
                            <View style={styles.metaItem}>
                                <Ionicons name="star" size={16} color={COLORS.primaryLight} />
                                <Text style={styles.metaText}>{product.review.toFixed(1)}</Text>
                            </View>
                        )}
                    </View>

                    {/* DESCRIPCIÓN */}
                    <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionTitle}>Descripción</Text>
                        <Text style={styles.descriptionText}>
                            {product.description || 'No hay descripción disponible para este producto.'}
                        </Text>
                    </View>
                </View>
                
                {/* Espacio para que el botón inferior no tape el contenido */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* BOTÓN DE ACCIÓN INFERIOR (STICKY) */}
            <View style={styles.footerAction}>
                <Button 
                    title={stock > 0 ? "Agregar al Carrito" : "No Disponible"} 
                    onPress={handleAddToCart} 
                    disabled={stock <= 0}
                    icon={<Ionicons name="cart-outline" size={20} color={COLORS.textLight} />}
                    size="large"
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    imageContainer: {
        width: '100%',
        height: 380,
        backgroundColor: '#E8EAEF',
        padding: 15,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#F0F2F5',
    },
    infoPanel: {
        backgroundColor: COLORS.background,
        marginTop: -20, // Superposición sutil
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingTop: 30,
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    titleBlock: {
        flex: 1,
        paddingRight: 16,
    },
    productName: {
        ...TYPOGRAPHY.heading,
        fontSize: 24,
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: COLORS.background,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
    },
    productPrice: {
        ...TYPOGRAPHY.heading,
        fontSize: 28,
        color: COLORS.primary,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    descriptionBox: {
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: 18,
        ...NEUROMORPHIC.inset,
    },
    descriptionTitle: {
        ...TYPOGRAPHY.subheading,
        fontSize: 16,
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    descriptionText: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    footerAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 24,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.03)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default ProductDetailScreen;