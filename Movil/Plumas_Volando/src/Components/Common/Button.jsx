import React, { useRef } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';

import { COLORS } from '../../Constants/theme';

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

  const scaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.965,
      useNativeDriver: true,
      speed: 35,
      bounciness: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const getButtonStyle = () => {

    if (disabled || loading) {
      return styles.disabledButton;
    }

    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;

      case 'outline':
        return styles.outlineButton;

      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {

    if (disabled || loading) {
      return styles.disabledText;
    }

    switch (variant) {
      case 'secondary':
        return styles.secondaryText;

      case 'outline':
        return styles.outlineText;

      default:
        return styles.primaryText;
    }
  };

  const getActivityColor = () => {

    if (
      variant === 'outline' ||
      variant === 'secondary'
    ) {
      return COLORS.primary;
    }

    return COLORS.textLight;
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        },
        style,
      ]}
    >

      <TouchableOpacity
        style={[
          styles.button,
          styles[`size_${size}`],
          getButtonStyle(),
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >

        {/* Highlight superior */}

        {!disabled && !loading && (
          <View style={styles.topHighlight} />
        )}

        {loading ? (

          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={getActivityColor()}
            />

            <Text
              style={[
                styles.text,
                getTextStyle(),
                styles.loadingText,
              ]}
            >
              Cargando...
            </Text>
          </View>

        ) : (

          <View style={styles.buttonContent}>

            {icon && (
              <View style={styles.iconContainer}>
                {icon}
              </View>
            )}

            <Text
              style={[
                styles.text,
                getTextStyle(),
              ]}
            >
              {title}
            </Text>

          </View>

        )}

      </TouchableOpacity>

    </Animated.View>
  );
};

const styles = StyleSheet.create({

  animatedContainer: {
    width: '100%',
  },

  // ==================================================
  // BASE
  // ==================================================

  button: {
    width: '100%',

    borderRadius: 17,

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
  },

  size_large: {
    minHeight: 57,
    paddingHorizontal: 24,
  },

  size_medium: {
    minHeight: 50,
    paddingHorizontal: 20,
  },

  size_small: {
    minHeight: 40,
    paddingHorizontal: 16,
  },

  // ==================================================
  // PRIMARY
  // ==================================================

  primaryButton: {
    backgroundColor: COLORS.primary,

    shadowColor: '#5A3A08',

    shadowOffset: {
      width: 5,
      height: 6,
    },

    shadowOpacity: 0.32,

    shadowRadius: 8,

    elevation: 7,
  },

  primaryText: {
    color: COLORS.textLight,
  },

  // ==================================================
  // SECONDARY
  // ==================================================

  secondaryButton: {
    backgroundColor: COLORS.primaryLighter,

    shadowColor: '#B39B64',

    shadowOffset: {
      width: 4,
      height: 5,
    },

    shadowOpacity: 0.35,

    shadowRadius: 7,

    elevation: 5,
  },

  secondaryText: {
    color: COLORS.primaryDark,
  },

  // ==================================================
  // OUTLINE / NEUMORPHIC
  // ==================================================

  outlineButton: {
    backgroundColor: COLORS.background,

    borderWidth: 1,

    borderColor: 'rgba(138,90,0,0.22)',

    shadowColor: '#B8BAC5',

    shadowOffset: {
      width: 5,
      height: 6,
    },

    shadowOpacity: 0.50,

    shadowRadius: 8,

    elevation: 5,
  },

  outlineText: {
    color: COLORS.primary,

    fontWeight: '800',
  },

  // ==================================================
  // DISABLED
  // ==================================================

  disabledButton: {
    backgroundColor: '#D1D2D9',

    opacity: 0.55,
  },

  disabledText: {
    color: '#777987',
  },

  // ==================================================
  // TEXTO
  // ==================================================

  text: {
    fontSize: 15.5,

    fontWeight: '700',

    letterSpacing: 0.4,
  },

  // ==================================================
  // CONTENIDO
  // ==================================================

  buttonContent: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  iconContainer: {
    marginRight: 9,
  },

  // ==================================================
  // LOADING
  // ==================================================

  loadingContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 9,
  },

  // ==================================================
  // LUZ SUPERIOR
  // ==================================================

  topHighlight: {
    position: 'absolute',

    top: 1,
    left: 14,
    right: 14,

    height: 1,

    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export default Button;