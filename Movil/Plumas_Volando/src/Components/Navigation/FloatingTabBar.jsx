import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../Constants/theme';

const TAB_CONFIG = {
  Home:     { filled: 'home',          outline: 'home-outline',          label: 'Inicio'    },
  Products: { filled: 'grid',          outline: 'grid-outline',          label: 'Productos' },
  Orders:   { filled: 'receipt',       outline: 'receipt-outline',       label: 'Pedidos'   },
  Invoices: { filled: 'document-text', outline: 'document-text-outline', label: 'Facturas'  },
  Settings: { filled: 'person',        outline: 'person-outline',        label: 'Perfil'    },
};

const SKIP = new Set(['Cart']);

const FloatingTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  const visible = state.routes.filter(r => !SKIP.has(r.name));

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 10) + 6 }]}>

      {/* Capa de sombra exterior oscura (bottom-right) */}
      <View style={styles.shadowDark}>

        {/* Capa de luz superior (top-left) + contenido */}
        <View style={styles.shadowLight}>

          {visible.map((route) => {
            const origIndex = state.routes.findIndex(r => r.key === route.key);
            const active = state.index === origIndex;
            const cfg = TAB_CONFIG[route.name];
            if (!cfg) return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!active && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tab}
                onPress={onPress}
                activeOpacity={0.75}
              >
                {/* Icono con efecto neumórfico activo */}
                <View style={[styles.iconOuter, active && styles.iconOuterActive]}>
                  <View style={[styles.iconInner, active && styles.iconInnerActive]}>
                    <Ionicons
                      name={active ? cfg.filled : cfg.outline}
                      size={21}
                      color={active ? COLORS.primary : COLORS.textSecondary}
                    />
                  </View>
                </View>

                {/* Etiqueta */}
                <Text style={[styles.label, active && styles.labelActive]}>
                  {cfg.label}
                </Text>

                {/* Indicador punto activo */}
                {active && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
  },

  // ── Sombra exterior oscura (capa de abajo) ───────────────────────────────
  shadowDark: {
    borderRadius: 30,
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 10,
  },

  // ── Sombra interior blanca (capa de arriba — efecto raised) ──────────────
  shadowLight: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },

  // ── Tab ──────────────────────────────────────────────────────────────────
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },

  // ── Icono inactive ────────────────────────────────────────────────────────
  iconOuter: {
    width: 44,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    width: 40,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Icono active — efecto inset (hundido) ─────────────────────────────────
  iconOuterActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#B8BAC8',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 0,
  },
  iconInnerActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -3, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },

  // ── Labels ───────────────────────────────────────────────────────────────
  label: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },

  // ── Punto indicador activo ────────────────────────────────────────────────
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
});

export default FloatingTabBar;
