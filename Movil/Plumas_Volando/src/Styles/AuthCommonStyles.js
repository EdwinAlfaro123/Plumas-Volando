import { StyleSheet } from 'react-native';
import {
  COLORS,
  TYPOGRAPHY,
  NEUROMORPHIC,
} from '../Constants/theme';

export const AuthCommonStyles = StyleSheet.create({

  // ============================================================
  // CONTENEDOR
  // ============================================================

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ============================================================
  // HEADER
  // ============================================================

  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  title: {
    ...TYPOGRAPHY.heading,

    fontSize: 24,

    color: COLORS.primary,

    marginTop: 14,
    marginBottom: 6,

    textAlign: 'center',

    fontWeight: '800',
  },

  subtitle: {
    ...TYPOGRAPHY.caption,

    fontSize: 13,

    color: COLORS.textSecondary,

    textAlign: 'center',

    paddingHorizontal: 16,

    lineHeight: 20,
  },

  // ============================================================
  // LOGO
  // ============================================================

  logoContainer: {
    width: 126,
    height: 126,

    borderRadius: 63,

    backgroundColor: COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    ...NEUROMORPHIC.floating,

    shadowColor: '#FFFFFF',

    shadowOffset: {
      width: -7,
      height: -7,
    },

    shadowOpacity: 0.95,

    shadowRadius: 14,

    elevation: 14,
  },

  logoImage: {
    width: 118,
    height: 118,

    resizeMode: 'contain',

    borderRadius: 59,
  },

  // ============================================================
  // BOTÓN ATRÁS
  // ============================================================

  backButton: {
    position: 'absolute',

    top: 0,
    left: 0,

    zIndex: 10,
  },

  backButtonInner: {
    width: 42,
    height: 42,

    borderRadius: 13,

    backgroundColor: COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    ...NEUROMORPHIC.flat,
  },

  // ============================================================
  // FORMULARIO
  // ============================================================

  form: {
    width: '100%',

    marginBottom: 8,
  },

  // ============================================================
  // ACCIONES
  // ============================================================

  actions: {
    width: '100%',
  },

  // ============================================================
  // LINKS
  // ============================================================

  link: {
    marginTop: 18,

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: 5,
  },

  linkText: {
    fontSize: 14,

    color: COLORS.primary,

    fontWeight: '700',

    textAlign: 'center',
  },

  // ============================================================
  // FOOTER
  // ============================================================

  footer: {
    marginTop: 25,

    alignItems: 'center',

    paddingHorizontal: 10,
  },

  footerIcon: {
    width: 34,
    height: 34,

    borderRadius: 17,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.background,

    marginBottom: 8,

    ...NEUROMORPHIC.flat,
  },

  footerText: {
    fontSize: 11.5,

    color: COLORS.textSecondary,

    textAlign: 'center',

    letterSpacing: 0.25,
  },

});