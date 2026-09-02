import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';

const FloatingTabBar = ({ state, descriptors, navigation }) => {
  const icons = {
    Home: 'home-outline',
    Products: 'grid-outline',
    Quotes: 'document-text-outline',
    Community: 'people-outline',
    Cart: 'cart-outline',
    Orders: 'receipt-outline',
    Settings: 'settings-outline',
  };

  const labels = {
    Home: 'Inicio',
    Products: 'Productos',
    Quotes: 'Cotizaciones',
    Community: 'Comunidad',
    Cart: 'Carrito',
    Orders: 'Pedidos',
    Settings: 'Ajustes',
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconName = icons[route.name] || 'ellipse-outline';
          const label = labels[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabItem, isFocused && styles.tabItemActive]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? iconName.replace('-outline', '') : iconName}
                size={24}
                color={isFocused ? COLORS.primary : COLORS.textSecondary}
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...NEUROMORPHIC.outerShadow,
    ...NEUROMORPHIC.innerShadow,
    elevation: 8,
    shadowColor: COLORS.darkShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: COLORS.primaryLight,
    ...NEUROMORPHIC.combinedShadow,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default FloatingTabBar;