import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';
import { formatCurrency } from '../../Utils/formatters';

const ProductCard = ({ product, onAddToCart, onPress }) => {
  return (
    <View style={[styles.cardWrapper, NEUROMORPHIC.topShadow]}>
      <View style={[styles.cardContainer, NEUROMORPHIC.bottomShadow]}>
        <TouchableOpacity activeOpacity={0.8} style={styles.cardInner} onPress={() => onPress && onPress(product)}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
              style={styles.image}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.category}>{product.category || 'General'}</Text>
            <View style={styles.footer}>
              <Text style={styles.price}>{formatCurrency(product.price)}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => onAddToCart(product)}>
                <Ionicons name="add" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
  },
  cardContainer: {
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
  },
  cardInner: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: { height: 120, backgroundColor: COLORS.primaryLight },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  info: { padding: 12 },
  name: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  category: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;