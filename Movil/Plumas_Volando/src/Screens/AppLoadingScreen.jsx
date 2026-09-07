import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS, NEUROMORPHIC } from '../Constants/theme';
import { AppLoadingStyles as styles } from '../Styles/AppLoadingStyles';

const AppLoadingScreen = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { duration: 420, toValue: 1, useNativeDriver: true }),
      Animated.spring(scale, { bounciness: 8, speed: 10, toValue: 1, useNativeDriver: true }),
    ]).start();

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { duration: 900, toValue: 1.035, useNativeDriver: true }),
        Animated.timing(pulse, { duration: 900, toValue: 1, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, pulse, scale]);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <View style={[styles.brandOuter, NEUROMORPHIC.topShadow]}>
            <View style={[styles.brandInner, NEUROMORPHIC.bottomShadow]}>
              <Image source={require('../../assets/logo-plumas.png')} style={styles.logo} />
              <View pointerEvents="none" style={styles.brandHighlight} />
            </View>
          </View>
        </Animated.View>
        <Text style={styles.title}>Plumas Volando</Text>
        <Text style={styles.subtitle}>Frescura que llega hasta ti</Text>
      </Animated.View>
      <Animated.View style={[styles.loaderOuter, NEUROMORPHIC.topShadow, { opacity }]}>
        <View style={[styles.loaderInner, NEUROMORPHIC.bottomShadow]}>
          <ActivityIndicator color={COLORS.primary} size="small" />
          <Text style={styles.loaderText}>Preparando tu experiencia</Text>
        </View>
      </Animated.View>
      <Text style={styles.footer}>Plumas Volando</Text>
    </SafeAreaView>
  );
};

export default AppLoadingScreen;
