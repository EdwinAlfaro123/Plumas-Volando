import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC, TYPOGRAPHY } from '../../Constants/theme';
import { formatCurrency } from '../../Utils/formatters';

const ProductCard = ({ product, onAddToCart, onPress }) => {
    // Fallback para la imagen
    const imageUri = product.imageUrl || product.image || 'https://via.placeholder.com/150?text=Plumas+Volando';
    const category = product.TypeProduct || product.category || 'General';

    return (
        <TouchableOpacity 
            activeOpacity={0.85} 
            onPress={() => onPress && onPress(product)}
            style={styles.cardWrapper}
        >
            {/* Contenedor principal con sombra suave */}
            <View style={[styles.cardContainer, NEUROMORPHIC.combinedShadow]}>
                
                {/* Marco de imagen con efecto hundido (Inset) */}
                <View style={[styles.imageWrapper, NEUROMORPHIC.inset]}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {/* Información */}
                <View style={styles.info}>
                    {/* Categoría como "Pill" */}
                    <View style={[styles.categoryPill, NEUROMORPHIC.flat]}>
                        <Text style={styles.categoryText} numberOfLines={1}>{category}</Text>
                    </View>

                    {/* Nombre */}
                    <Text style={styles.name} numberOfLines={2}>
                        {product.name}
                    </Text>

                    {/* Precio y Botón */}
                    <View style={styles.footer}>
                        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
                        
                        {/* Botón Agregar (Flotante) */}
                        <TouchableOpacity 
                            style={[styles.addButton, NEUROMORPHIC.bottomShadow]} 
                            onPress={(e) => {
                                e?.stopPropagation?.(); // Evita que abra el detalle al dar click en el +
                                onAddToCart(product);
                            }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="add" size={22} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        width: '48%',
        marginBottom: 20,
    },
    cardContainer: {
        borderRadius: 24,
        backgroundColor: COLORS.cardBackground,
        padding: 10,
        overflow: 'hidden',
    },
    imageWrapper: {
        borderRadius: 18,
        backgroundColor: '#E8EAEF', // Un tono ligeramente más oscuro para el efecto hundido
        padding: 6,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 130,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        resizeMode: 'cover',
    },
    info: {
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: COLORS.background,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    name: {
        ...TYPOGRAPHY.subheading,
        fontSize: 14,
        color: COLORS.textPrimary,
        marginBottom: 10,
        minHeight: 36,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        ...TYPOGRAPHY.heading,
        fontSize: 18,
        color: COLORS.primary,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#5A3A08', // Sombra oscura para el botón primario
        shadowOffset: { width: 3, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
    },
});

export default ProductCard;