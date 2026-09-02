import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../Constants/theme';

const AppLogo = ({ size = 80, showShadow = true, animate = false }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -6, duration: 1600, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0,  duration: 1600, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [animate]);

  return (
    <Animated.View
      style={[
        styles.outerRing,
        {
            height: size + 20,
            width: size + 20,
          borderRadius: (size + 20) / 2,
        },
        animate && { transform: [{ translateY: floatAnim }] },
      ]}
    >
      <View
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
          showShadow && styles.shadow,
        ]}
      >
        <Image 
          source={require('../../../assets/logo-plumas.png')}
          style={{ width: size * 10, height: size * 1.2, resizeMode: 'contain' }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryLighter,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  shadow: {
    // Sombra neomórfica correcta: oscura abajo-derecha, clara arriba-izquierda
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default AppLogo;
