// src/Constants/theme.js
export const COLORS = {
  // Fondo principal — clave del neomorfismo
  background: '#EEF0F5',
  surface: '#EEF0F5',

  // Paleta dorada/marrón de Plumas Volando
  primary: '#8A5A00',
  primaryLight: '#C8962A',
  primaryLighter: '#F0D080',
  primaryDark: '#5C3A00',
  primaryGlow: '#E9C46A',

  // Sombras neomórficas (luz desde arriba-izquierda)
  shadowLight: '#FFFFFF',        // luz alta
  shadowDark: '#C8CAD6',         // sombra baja

  // Texto
  textPrimary: '#2D2D3F',
  textSecondary: '#7A7B8C',
  textLight: '#FFFFFF',
  textMuted: '#ABABBB',

  // Estados
  success: '#4CAF50',
  error: '#D64545',
  errorLight: '#FFE8E8',
  warning: '#FF9800',
  info: '#2196F3',

  // Alias para compatibilidad
  inputBackground: '#EEF0F5',
  cardBackground: '#EEF0F5',
  lightShadow: '#FFFFFF',
  darkShadow: '#C8CAD6',
};

export const NEUROMORPHIC = {
  // Wrapper principal (sombra clara arriba-izquierda)
  topShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4, // Android (limitado, solo sombra oscura)
  },
  // Wrapper secundario (sombra oscura abajo-derecha)
  bottomShadow: {
    shadowColor: '#D1D9E6', // Un gris azulado más acorde a UIverse
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  // Hundido — inputs activos/focused
  inset: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 0,
  },
  // Estilo antiguo por compatibilidad
  raised: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  outerShadow: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  innerShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  combinedShadow: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  pressedShadow: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const TYPOGRAPHY = {
  heading: { fontWeight: '700', letterSpacing: 0.5 },
  subheading: { fontWeight: '600', letterSpacing: 0.3 },
  body: { fontWeight: '400', letterSpacing: 0.2 },
  caption: { fontWeight: '300', letterSpacing: 0.5 },
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const RADIUS = {
  sm: 8, md: 14, lg: 20, xl: 28, full: 999,
};

export default { NEUROMORPHIC, TYPOGRAPHY, COLORS, SPACING, RADIUS };
