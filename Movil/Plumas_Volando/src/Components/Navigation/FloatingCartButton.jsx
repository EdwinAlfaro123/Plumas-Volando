import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../Context/CartContext';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';
import { FloatingCartButtonStyles as styles } from '../../Styles/FloatingCartButtonStyles';

const FloatingCartButton = ({ navigation }) => {
  const { cartItems = [] } = useCart();
  const scale = useRef(new Animated.Value(1)).current;
  const quantity = cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  const label = quantity > 99 ? '99+' : String(quantity);

  const animate = (toValue) => {
    Animated.spring(scale, { toValue, speed: 36, bounciness: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.touchTarget, { transform: [{ scale }] }]}>
      <TouchableOpacity
        accessibilityLabel={`Abrir carrito${quantity ? `, ${quantity} productos` : ''}`}
        activeOpacity={1}
        onPress={() => navigation.navigate('Cart')}
        onPressIn={() => animate(0.92)}
        onPressOut={() => animate(1)}
        style={[styles.outer, NEUROMORPHIC.topShadow]}
      >
        <View style={[styles.button, NEUROMORPHIC.bottomShadow]}>
          <Ionicons color={COLORS.primaryDark} name="cart-outline" size={23} />
          {quantity > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{label}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingCartButton;
