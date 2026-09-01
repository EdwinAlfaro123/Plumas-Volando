// src/Styles/LoginStyles.js
import { StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../Constants/theme';

export const LoginStyles = StyleSheet.create({
  // ============================================
  // CONTENEDOR PRINCIPAL
  // ============================================
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ============================================
  // HEADER - LOGO Y TÍTULOS
  // ============================================
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
  },

  // --- LOGO CIRCULAR PURO CON NEOMORFISMO ---
  logoOuterWrapper: {
    borderRadius: 100,
    backgroundColor: COLORS.background,
    padding: 8,
    ...NEUROMORPHIC.topShadow,
  },
  
  logoInnerWrapper: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.bottomShadow,
  },
  
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    resizeMode: 'contain',
  },

  // --- TÍTULOS ---
  appName: {
    ...TYPOGRAPHY.heading,
    fontSize: 28,
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 4,
    letterSpacing: 1.2,
  },

  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // ============================================
  // FORMULARIO
  // ============================================
  form: {
    width: '100%',
    marginBottom: 6,
  },

  // ============================================
  // ENLACE - ¿OLVIDASTE TU CONTRASEÑA?
  // ============================================
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 14,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ============================================
  // ACCIONES
  // ============================================
  actions: {
    width: '100%',
  },

  // ============================================
  // BOTÓN DE LOGIN MEJORADO
  // ============================================
  loginButtonWrapper: {
    width: '100%',
    marginBottom: 4,
  },
  
  loginButtonOuter: {
    borderRadius: 18,
    backgroundColor: COLORS.background,
    ...NEUROMORPHIC.topShadow,
  },
  
  loginButtonInner: {
    borderRadius: 18,
    backgroundColor: COLORS.background,
    paddingVertical: 17,
    justifyContent: 'center',
    alignItems: 'center',
    ...NEUROMORPHIC.bottomShadow,
  },
  
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  
  loginButtonTextDisabled: {
    color: COLORS.textMuted,
  },

  // ============================================
  // ESTADO DE CARGA
  // ============================================
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginLeft: 10,
  },

  // ============================================
  // DIVIDER MEJORADO
  // ============================================
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.shadowDark,
    opacity: 0.4,
  },
  
  dividerBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
    ...NEUROMORPHIC.combinedShadow,
  },
  
  dividerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // ============================================
  // BOTÓN DE REGISTRO
  // ============================================
  registerButton: {
    marginTop: 2,
  },

  // ============================================
  // ERRORES GENERALES
  // ============================================
  errorContainer: {
    backgroundColor: COLORS.errorLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.error,
    ...NEUROMORPHIC.inset,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    fontWeight: '500',
  },
});