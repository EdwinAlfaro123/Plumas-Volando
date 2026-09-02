import { StyleSheet } from 'react-native';

import { COLORS } from '../Constants/theme';

export const LoginStyles = StyleSheet.create({

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

  heroContainer: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },

  heroImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroImageStyle: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(63, 42, 20, 0.20)',
  },


  // ==================================================
  // LOGO
  // ==================================================

  logoOuter: {
    width: 166,
    height: 166,

    borderRadius: 83,

    backgroundColor: COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#5C3A00',

    shadowOffset: {
      width: 9,
      height: 10,
    },

    shadowOpacity: 0.25,
    shadowRadius: 15,

    elevation: 12,
  },

  logoHighlight: {
    position: 'absolute',

    top: 5,
    left: 5,

    width: 156,
    height: 156,

    borderRadius: 78,

    borderTopWidth: 3,
    borderLeftWidth: 3,

    borderColor: 'rgba(255,255,255,0.85)',
  },

  logoInner: {
    width: 142,
    height: 142,

    borderRadius: 71,

    backgroundColor: '#F5F0DC',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#C8CAD6',

    shadowOffset: {
      width: 4,
      height: 5,
    },

    shadowOpacity: 0.45,
    shadowRadius: 7,

    elevation: 5,

    overflow: 'hidden',
  },

  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },


  // ==================================================
  // PANEL
  // ==================================================

  contentPanel: {
    marginTop: -22,

    backgroundColor: COLORS.background,

    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,

    paddingHorizontal: 25,
    paddingTop: 28,
    paddingBottom: 30,

    minHeight: 500,

    shadowColor: '#B5B7C2',

    shadowOffset: {
      width: 0,
      height: -4,
    },

    shadowOpacity: 0.18,
    shadowRadius: 12,

    elevation: 8,
  },


  // ==================================================
  // HEADER
  // ==================================================

  header: {
    alignItems: 'center',
    marginBottom: 25,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: '800',

    color: COLORS.primaryDark,

    letterSpacing: 0.2,

    marginBottom: 5,
  },

  welcomeSubtitle: {
    fontSize: 13.5,

    color: COLORS.textSecondary,

    letterSpacing: 0.25,

    textAlign: 'center',
  },


  // ==================================================
  // FORMULARIO
  // ==================================================

  form: {
    width: '100%',
  },

  forgotPassword: {
    alignSelf: 'flex-end',

    marginTop: -2,
    marginBottom: 16,

    paddingVertical: 5,
    paddingHorizontal: 5,
  },

  forgotPasswordText: {
    fontSize: 13.5,

    color: COLORS.primary,

    fontWeight: '700',

    letterSpacing: 0.2,
  },


  // ==================================================
  // ACCIONES
  // ==================================================

  actions: {
    width: '100%',
  },


  // ==================================================
  // BOTÓN LOGIN
  // ==================================================

  loginButtonWrapper: {
    width: '100%',
    minHeight: 55,

    borderRadius: 18,

    backgroundColor: COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#B7BAC6',

    shadowOffset: {
      width: 6,
      height: 7,
    },

    shadowOpacity: 0.60,
    shadowRadius: 10,

    elevation: 8,

    overflow: 'hidden',
  },

  buttonHighlight: {
    position: 'absolute',

    top: 0,
    left: 0,

    width: '100%',
    height: 2,

    backgroundColor: 'rgba(255,255,255,0.85)',
  },

  loginButtonContent: {
    width: '100%',
    minHeight: 55,

    paddingHorizontal: 20,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 18,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.25)',
  },

  loginButtonText: {
    fontSize: 16,

    color: COLORS.primary,

    fontWeight: '800',

    letterSpacing: 0.5,
  },

  buttonIcon: {
    width: 32,
    height: 32,

    borderRadius: 16,

    marginLeft: 12,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.background,

    shadowColor: '#B8BAC5',

    shadowOffset: {
      width: 2,
      height: 3,
    },

    shadowOpacity: 0.5,
    shadowRadius: 4,

    elevation: 3,
  },

  loginButtonDisabled: {
    opacity: 0.65,
  },


  // ==================================================
  // LOADING
  // ==================================================

  loadingContainer: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginLeft: 10,

    fontSize: 15,

    color: COLORS.primary,

    fontWeight: '700',
  },


  // ==================================================
  // DIVISOR
  // ==================================================

  dividerContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    marginVertical: 19,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: COLORS.shadowDark,

    opacity: 0.45,
  },

  dividerBadge: {
    width: 30,
    height: 30,

    borderRadius: 15,

    marginHorizontal: 12,

    backgroundColor: COLORS.background,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#B9BBC5',

    shadowOffset: {
      width: 2,
      height: 3,
    },

    shadowOpacity: 0.40,
    shadowRadius: 4,

    elevation: 3,
  },

  dividerText: {
    fontSize: 12,

    color: COLORS.textSecondary,

    fontWeight: '700',
  },

  registerButton: {
    width: '100%',
  },


  // ==================================================
  // FOOTER
  // ==================================================

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

    shadowColor: '#B9BBC5',

    shadowOffset: {
      width: 2,
      height: 3,
    },

    shadowOpacity: 0.35,
    shadowRadius: 4,

    elevation: 2,
  },

  footerText: {
    fontSize: 11.5,

    color: COLORS.textSecondary,

    textAlign: 'center',

    letterSpacing: 0.25,
  },

});