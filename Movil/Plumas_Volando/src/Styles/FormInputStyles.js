// src/Components/Common/FormInput.jsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC } from '../Constants/theme';

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
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(glowAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? COLORS.error : 'transparent', COLORS.primaryLight],
  });

  const iconColor = isFocused ? COLORS.primaryLight : error ? COLORS.error : COLORS.textSecondary;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, isFocused && styles.labelFocused, error && styles.labelError]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : styles.inputWrapperBlur,
          error && styles.inputWrapperError,
          { borderColor },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={isFocused ? COLORS.primaryLight : COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  labelFocused: {
    color: COLORS.primary,
  },
  labelError: {
    color: COLORS.error,
  },
  // Estado BLUR — NEOMORFISMO ELEVADO
  inputWrapperBlur: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    ...NEUROMORPHIC.topShadow,
  },
  // Estado FOCUSED — NEOMORFISMO HUNDIDO
  inputWrapperFocused: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    ...NEUROMORPHIC.inset,
  },
  inputWrapperError: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    ...NEUROMORPHIC.inset,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 14,
    letterSpacing: 0.2,
  },
  icon: {
    marginRight: 12,
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: 6,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default FormInput;