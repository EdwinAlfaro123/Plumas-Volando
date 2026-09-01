// src/Constants/theme.js
export const COLORS = {
  background: '#EEF0F5',
  surface: '#EEF0F5',

  primary: '#8A5A00',
  primaryLight: '#C8962A',
  primaryLighter: '#F0D080',
  primaryDark: '#5C3A00',
  primaryGlow: '#E9C46A',

  shadowLight: '#FFFFFF',
  shadowDark: '#C8CAD6',

  textPrimary: '#2D2D3F',
  textSecondary: '#7A7B8C',
  textLight: '#FFFFFF',
  textMuted: '#ABABBB',

  success: '#4CAF50',
  error: '#D64545',
  errorLight: '#FFE8E8',
  warning: '#FF9800',
  info: '#2196F3',

  inputBackground: '#EEF0F5',
  cardBackground: '#EEF0F5',
  lightShadow: '#FFFFFF',
  darkShadow: '#C8CAD6',

  // ============================================
  // LOGIN
  // ============================================

  loginBackground: '#EEF0F5',
  loginSurface: '#EEF0F5',
  loginCream: '#F5F0DC',
  loginBrown: '#5C3A00',
  loginGold: '#C8962A',
  loginHighlight: '#FFFFFF',
  loginShadow: '#B9BBC6',
};

export const NEUROMORPHIC = {
  // Sombra superior-izquierda (luz)
  topShadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
  },
  
  // Sombra inferior-derecha (oscuridad)
  bottomShadow: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 10,
  },
  
  // EFECTO HUNDIDO (para inputs)
  inset: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 0,
  },
  
  // EFECTO PLANO (para badges)
  flat: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // EFECTO FLOTANTE (para el logo)
  floating: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
  },
  
  // EFECTO COMBINADO
  combinedShadow: {
    shadowColor: '#D1D9E6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  
  // EFECTO PRESIONADO
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