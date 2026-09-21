import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';
import { PurchaseLoadingStyles as styles } from '../../Styles/PurchaseLoadingStyles';

const PurchaseLoadingOverlay = ({ visible }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const dotOne = useRef(new Animated.Value(0.35)).current;
  const dotTwo = useRef(new Animated.Value(0.35)).current;
  const dotThree = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (!visible) return undefined;
    const iconAnimation = Animated.loop(Animated.sequence([
      Animated.timing(scale, { duration: 700, toValue: 1.08, useNativeDriver: true }),
      Animated.timing(scale, { duration: 700, toValue: 1, useNativeDriver: true }),
    ]));
    const dotAnimation = Animated.loop(Animated.sequence([
      Animated.timing(dotOne, { duration: 230, toValue: 1, useNativeDriver: true }),
      Animated.timing(dotTwo, { duration: 230, toValue: 1, useNativeDriver: true }),
      Animated.timing(dotThree, { duration: 230, toValue: 1, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(dotOne, { duration: 230, toValue: 0.35, useNativeDriver: true }),
        Animated.timing(dotTwo, { duration: 230, toValue: 0.35, useNativeDriver: true }),
        Animated.timing(dotThree, { duration: 230, toValue: 0.35, useNativeDriver: true }),
      ]),
    ]));
    iconAnimation.start();
    dotAnimation.start();
    return () => {
      iconAnimation.stop();
      dotAnimation.stop();
    };
  }, [dotOne, dotThree, dotTwo, scale, visible]);

  return (
    <Modal animationType="fade" statusBarTranslucent transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.panel, NEUROMORPHIC.bottomShadow]}>
          <View pointerEvents="none" style={styles.panelHighlight} />
          <Animated.View style={{ transform: [{ scale }] }}>
            <View style={[styles.iconOuter, NEUROMORPHIC.topShadow]}>
              <View style={[styles.iconInner, NEUROMORPHIC.bottomShadow]}>
                <Ionicons color={COLORS.primary} name="bag-check-outline" size={36} />
              </View>
            </View>
          </Animated.View>
          <Text style={styles.title}>Procesando tu compra</Text>
          <Text style={styles.subtitle}>Estamos confirmando tus productos y preparando tu pedido.</Text>
          <View style={styles.dots}>
            <Animated.View style={[styles.dot, { opacity: dotOne }]} />
            <Animated.View style={[styles.dot, { opacity: dotTwo }]} />
            <Animated.View style={[styles.dot, { opacity: dotThree }]} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PurchaseLoadingOverlay;