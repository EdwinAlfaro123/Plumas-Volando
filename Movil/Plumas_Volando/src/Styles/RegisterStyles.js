import { StyleSheet } from 'react-native';

import {
  COLORS,
} from '../Constants/theme';

export const RegisterStyles = StyleSheet.create({

  // ==================================================
  // PANTALLA
  // ==================================================

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
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
    height: 260,
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
    width: 150,
    height: 150,

    borderRadius: 75,

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

    width: 140,
    height: 140,

    borderRadius: 70,

    borderTopWidth: 3,
    borderLeftWidth: 3,

    borderColor:
      'rgba(255,255,255,0.85)',
  },

  logoInner: {
    width: 130,
    height: 130,

    borderRadius: 65,

    backgroundColor:
      '#F5F0DC',

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
    width: 122,
    height: 122,
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

    paddingHorizontal: 24,
    paddingTop: 27,
    paddingBottom: 30,

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

    marginBottom: 24,
  },

  titleIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      COLORS.background,

    marginBottom: 9,

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

    marginBottom: 5,

    letterSpacing: 0.2,
  },

  subtitle: {
    fontSize: 13,

    color:
      COLORS.textSecondary,

    textAlign: 'center',

    lineHeight: 19,
  },


  // ==================================================
  // SECCIONES
  // ==================================================

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: 13,

    marginTop: 3,
  },

  sectionIcon: {
    width: 30,
    height: 30,

    borderRadius: 10,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor:
      COLORS.background,

    marginRight: 9,

    shadowColor: '#BABCC6',

    shadowOffset: {
      width: 2,
      height: 2,
    },

    shadowOpacity: 0.35,

    shadowRadius: 4,

    elevation: 2,
  },

  sectionTitle: {
    fontSize: 14,

    color:
      COLORS.primaryDark,

    fontWeight: '800',

    letterSpacing: 0.25,
  },


  // ==================================================
  // FORMULARIO
  // ==================================================

  form: {
    width: '100%',
  },


  // ==================================================
  // ACCIONES
  // ==================================================

  actions: {
    width: '100%',

    marginTop: 8,
  },


  // ==================================================
  // LOGIN
  // ==================================================

  loginLink: {
    marginTop: 19,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    paddingVertical: 5,
  },

  loginText: {
    fontSize: 13.5,

    color:
      COLORS.textSecondary,
  },

  loginHighlight: {
    fontSize: 13.5,

    color:
      COLORS.primary,

    fontWeight: '800',
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