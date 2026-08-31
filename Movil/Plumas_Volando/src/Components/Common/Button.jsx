import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, View, Animated,
} from 'react-native';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'large',
  icon,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getButtonStyles = () => {
    if (disabled || loading) return styles.disabledButton;
    switch (variant) {
      case 'secondary': return styles.secondaryButton;
      case 'outline':   return styles.outlineButton;
      default:          return styles.primaryButton;
    }
  };

  const getTextStyles = () => {
    if (disabled || loading) return styles.disabledText;
    switch (variant) {
      case 'secondary': return styles.secondaryText;
      case 'outline':   return styles.outlineText;
      default:          return styles.primaryText;
    }
  };

  const getShadowStyles = () => {
    if (disabled || loading) return {};
    return NEUROMORPHIC.raised;
  };

  const getActivityColor = () => {
    if (variant === 'outline' || variant === 'secondary') return COLORS.primary;
    return COLORS.textLight;
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          styles[`size_${size}`],
          getButtonStyles(),
          getShadowStyles(),
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getActivityColor()} />
        ) : (
          <View style={styles.buttonContent}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, getTextStyles()]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  size_large: {
    minHeight: 56,
    paddingHorizontal: 24,
  },
  size_medium: {
    minHeight: 48,
    paddingHorizontal: 20,
  },
  size_small: {
    minHeight: 38,
    paddingHorizontal: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Primario — dorado con fondo sólido premium
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  // Secundario — dorado claro
  secondaryButton: {
    backgroundColor: COLORS.primaryLighter,
  },
  // Outline — borde dorado, fondo transparente neomórfico
  outlineButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  // Desactivado
  disabledButton: {
    backgroundColor: COLORS.shadowDark,
    opacity: 0.55,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  primaryText:   { color: COLORS.textLight },
  secondaryText: { color: COLORS.primaryDark },
  outlineText:   { color: COLORS.primary },
  disabledText:  { color: COLORS.textLight },
  iconContainer: { marginRight: 10 },
});

export default Button;