import { StyleSheet } from 'react-native';

import {
  COLORS,
  NEUROMORPHIC,
} from '../Constants/theme';

export const RecoveryPasswordStyles = StyleSheet.create({

  // ==================================================
  // PANTALLA
  // ==================================================

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },


  // ==================================================
  // HERO
  // ==================================================

  hero: {
    height: 275,
    width: '100%',
    overflow: 'hidden',
  },

  heroBackground: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(52, 35, 20, 0.28)',
  },


  // ==================================================
  // BOTÓN ATRÁS
  // ==================================================

  backButton: {
    position: 'absolute',

    top: 20,
    left: 20,

    zIndex: 5,
  },

  backButtonInner: {
    width: 45,
    height: 45,

    borderRadius: 15,

    backgroundColor:
      COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#5B4024',

    shadowOffset: {
      width: 4,
      height: 5,
    },

    shadowOpacity: 0.38,
    shadowRadius: 7,

    elevation: 7,
  },


  // ==================================================
  // LOGO
  // ==================================================

  logoOuter: {
    width: 155,
    height: 155,

    borderRadius: 78,

    backgroundColor:
      COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#4A3017',

    shadowOffset: {
      width: 8,
      height: 9,
    },

    shadowOpacity: 0.35,
    shadowRadius: 13,

    elevation: 12,
  },

  logoHighlight: {
    position: 'absolute',

    top: 5,
    left: 5,

    width: 145,
    height: 145,

    borderRadius: 73,

    borderTopWidth: 3,
    borderLeftWidth: 3,

    borderColor:
      'rgba(255,255,255,0.85)',
  },

  logoInner: {
    width: 135,
    height: 135,

    borderRadius: 68,

    backgroundColor: '#F5F0DC',

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',

    shadowColor: '#C1C2C9',

    shadowOffset: {
      width: 3,
      height: 4,
    },

    shadowOpacity: 0.35,
    shadowRadius: 6,

    elevation: 4,
  },

  logoImage: {
    width: 126,
    height: 126,
  },


  // ==================================================
  // PANEL
  // ==================================================

  panel: {
    marginTop: -20,

    backgroundColor:
      COLORS.background,

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingHorizontal: 25,
    paddingTop: 27,
    paddingBottom: 28,

    minHeight: 480,

    shadowColor: '#B7B9C4',

    shadowOffset: {
      width: 0,
      height: -4,
    },

    shadowOpacity: 0.20,
    shadowRadius: 12,

    elevation: 8,
  },


  // ==================================================
  // HEADER
  // ==================================================

  header: {
    alignItems: 'center',

    marginBottom: 20,
  },

  stepBadge: {
    width: 43,
    height: 43,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      COLORS.background,

    marginBottom: 10,

    shadowColor: '#B9BBC6',

    shadowOffset: {
      width: 3,
      height: 4,
    },

    shadowOpacity: 0.45,
    shadowRadius: 6,

    elevation: 4,
  },

  title: {
    fontSize: 23,

    color:
      COLORS.primaryDark,

    fontWeight: '800',

    textAlign: 'center',

    letterSpacing: 0.2,

    marginBottom: 5,
  },

  subtitle: {
    fontSize: 13,

    color:
      COLORS.textSecondary,

    textAlign: 'center',

    lineHeight: 19,

    paddingHorizontal: 15,
  },


  // ==================================================
  // PASOS
  // ==================================================

  stepsContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 23,
  },

  stepDot: {
    width: 29,
    height: 29,

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  stepActive: {
    backgroundColor:
      COLORS.primary,

    shadowColor: '#B5B7C0',

    shadowOffset: {
      width: 2,
      height: 3,
    },

    shadowOpacity: 0.35,

    shadowRadius: 4,

    elevation: 3,
  },

  stepCompleted: {
    backgroundColor:
      COLORS.primaryLight,
  },

  stepInactive: {
    backgroundColor:
      COLORS.background,

    borderWidth: 1,

    borderColor:
      COLORS.shadowDark,
  },

  stepNumber: {
    fontSize: 13,

    fontWeight: '800',

    color:
      COLORS.textLight,
  },

  stepNumberInactive: {
    color:
      COLORS.textSecondary,
  },

  stepLine: {
    width: 38,
    height: 2,

    backgroundColor:
      COLORS.shadowDark,

    marginHorizontal: 5,

    opacity: 0.5,
  },

  stepLineActive: {
    backgroundColor:
      COLORS.primaryLight,

    opacity: 1,
  },


  // ==================================================
  // FORMULARIO
  // ==================================================

  form: {
    width: '100%',

    marginBottom: 24,
  },


  // ==================================================
  // ACCIONES
  // ==================================================

  actions: {
    width: '100%',
  },


  // ==================================================
  // LINK LOGIN
  // ==================================================

  loginLink: {
    marginTop: 18,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: 5,
  },

  loginLinkText: {
    fontSize: 13.5,

    color:
      COLORS.primaryLight,

    fontWeight: '600',

    marginLeft: 5,
  },


  // ==================================================
  // FOOTER
  // ==================================================

  footer: {
    alignItems: 'center',

    marginTop: 23,

    paddingHorizontal: 10,
  },

  footerIcon: {
    width: 31,
    height: 31,

    borderRadius: 16,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      COLORS.background,

    marginBottom: 6,

    shadowColor: '#B9BBC5',

    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.3,

    shadowRadius: 4,

    elevation: 2,
  },

  footerText: {
    fontSize: 11,

    color:
      COLORS.textSecondary,

    textAlign: 'center',
  },

});