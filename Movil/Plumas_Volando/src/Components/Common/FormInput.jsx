import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../Constants/theme';

const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  icon,
  ...props
}) => {

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const focusAnim = useRef(
    new Animated.Value(0)
  ).current;

  const handleFocus = () => {
    setIsFocused(true);

    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);

    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

  const iconColor = error
    ? COLORS.error
    : isFocused
      ? COLORS.primary
      : COLORS.textSecondary;

  return (
    <View style={styles.container}>

      {/* LABEL */}

      {label && (
        <Text
          style={[
            styles.label,
            isFocused && styles.labelFocused,
            error && styles.labelError,
          ]}
        >
          {label}
        </Text>
      )}

      {/* INPUT */}

      <Animated.View
        style={[
          styles.inputOuter,

          isFocused
            ? styles.inputOuterFocused
            : styles.inputOuterNormal,

          error && styles.inputOuterError,

          {
            transform: [
              {
                scale: focusAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.008],
                }),
              },
            ],
          },
        ]}
      >

        {/* Highlight neumórfico */}

        <View style={styles.lightEdge} />

        {/* Icon */}

        {icon && (
          <View
            style={[
              styles.iconContainer,
              isFocused && styles.iconContainerFocused,
            ]}
          >
            <Ionicons
              name={icon}
              size={19}
              color={iconColor}
            />
          </View>
        )}

        {/* Text input */}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={
            secureTextEntry && !showPassword
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          selectionColor={COLORS.primary}
          {...props}
        />

        {/* Password button */}

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() =>
              setShowPassword(!showPassword)
            }
            style={styles.eyeButton}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                showPassword
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={21}
              color={
                isFocused
                  ? COLORS.primary
                  : COLORS.textSecondary
              }
            />
          </TouchableOpacity>
        )}

      </Animated.View>

      {/* ERROR */}

      {error && (
        <View style={styles.errorRow}>
          <Ionicons
            name="alert-circle-outline"
            size={13}
            color={COLORS.error}
          />

          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    width: '100%',
    marginBottom: 15,
  },

  label: {
    marginLeft: 7,
    marginBottom: 7,

    fontSize: 12.5,

    fontWeight: '700',

    color: COLORS.textSecondary,

    letterSpacing: 0.25,
  },

  labelFocused: {
    color: COLORS.primary,
  },

  labelError: {
    color: COLORS.error,
  },

  // ==================================================
  // INPUT EXTERNO
  // ==================================================

  inputOuter: {
    position: 'relative',

    width: '100%',
    minHeight: 57,

    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 17,

    backgroundColor: COLORS.background,

    paddingHorizontal: 11,

    borderWidth: 1,
  },

  // Estado normal:
  // elemento ligeramente elevado

  inputOuterNormal: {
    borderColor: 'rgba(255,255,255,0.45)',

    shadowColor: '#B9BBC6',

    shadowOffset: {
      width: 5,
      height: 6,
    },

    shadowOpacity: 0.52,

    shadowRadius: 8,

    elevation: 5,
  },

  // Estado focused:
  // sensación de campo hundido

  inputOuterFocused: {
    borderColor: 'rgba(138,90,0,0.25)',

    shadowColor: '#B7BAC5',

    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.38,

    shadowRadius: 4,

    elevation: 2,
  },

  inputOuterError: {
    borderColor: COLORS.error,

    shadowColor: COLORS.error,

    shadowOpacity: 0.18,

    shadowRadius: 6,
  },

  // ==================================================
  // BORDE DE LUZ
  // ==================================================

  lightEdge: {
    position: 'absolute',

    top: 1,
    left: 10,
    right: 10,

    height: 1,

    borderRadius: 1,

    backgroundColor: 'rgba(255,255,255,0.75)',
  },

  // ==================================================
  // ICONO
  // ==================================================

  iconContainer: {
    width: 38,
    height: 38,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,

    backgroundColor: COLORS.background,

    shadowColor: '#C0C2CD',

    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.38,

    shadowRadius: 4,

    elevation: 2,
  },

  iconContainerFocused: {
    shadowColor: '#AEB0BA',

    shadowOffset: {
      width: 1,
      height: 1,
    },

    shadowOpacity: 0.25,

    shadowRadius: 3,

    elevation: 1,
  },

  // ==================================================
  // TEXTO
  // ==================================================

  input: {
    flex: 1,

    minHeight: 55,

    paddingVertical: 12,

    fontSize: 15,

    color: COLORS.textPrimary,

    fontWeight: '500',

    letterSpacing: 0.15,
  },

  // ==================================================
  // OJO
  // ==================================================

  eyeButton: {
    width: 38,
    height: 38,

    borderRadius: 13,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.background,

    marginLeft: 5,

    shadowColor: '#C0C2CD',

    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.35,

    shadowRadius: 4,

    elevation: 2,
  },

  // ==================================================
  // ERROR
  // ==================================================

  errorRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 5,
    marginLeft: 7,

    gap: 4,
  },

  errorText: {
    fontSize: 12,

    color: COLORS.error,

    fontWeight: '600',
  },
});

export default FormInput;