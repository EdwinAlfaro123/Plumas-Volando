import {
  StyleSheet,
} from 'react-native';

import {
  COLORS,
} from '../Constants/theme';


export const RecoveryPasswordStyles =
  StyleSheet.create({


    // ==================================================
    // CONTENEDOR
    // ==================================================

    screenContainer: {
      flex: 1,

      width: '100%',

      justifyContent: 'center',

      paddingTop: 15,
      paddingBottom: 15,
    },


    // ==================================================
    // BOTÓN VOLVER SUPERIOR
    // ==================================================

    backButton: {
      width: 44,
      height: 44,

      borderRadius: 15,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        COLORS.background,

      marginBottom: 10,

      shadowColor:
        COLORS.shadowDark,

      shadowOffset: {
        width: 4,
        height: 5,
      },

      shadowOpacity: 0.5,
      shadowRadius: 7,

      elevation: 6,
    },


    // ==================================================
    // LOGO
    // ==================================================

    logoContainer: {
      alignItems: 'center',

      marginBottom: 18,
    },


    // ==================================================
    // TARJETA NEUMÓRFICA
    // ==================================================

    card: {
      width: '100%',

      backgroundColor:
        COLORS.background,

      borderRadius: 30,

      paddingHorizontal: 22,
      paddingTop: 28,
      paddingBottom: 25,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.65)',

      shadowColor:
        '#B5B7C2',

      shadowOffset: {
        width: 8,
        height: 10,
      },

      shadowOpacity: 0.52,

      shadowRadius: 14,

      elevation: 10,
    },


    // ==================================================
    // HEADER
    // ==================================================

    header: {
      width: '100%',

      alignItems: 'center',

      marginBottom: 26,
    },


    titleRow: {
      flexDirection: 'row',

      justifyContent: 'center',
      alignItems: 'center',

      marginBottom: 12,
    },


    title: {
      fontSize: 24,

      lineHeight: 25,

      fontWeight: '800',

      color:
        COLORS.textPrimary,

      textAlign: 'center',

      letterSpacing: 0.1,
    },


    titleIcon: {
      width: 40,
      height: 40,

      marginLeft: 10,

      borderRadius: 14,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.55)',

      shadowColor:
        COLORS.shadowDark,

      shadowOffset: {
        width: 3,
        height: 4,
      },

      shadowOpacity: 0.45,

      shadowRadius: 6,

      elevation: 4,
    },


    subtitle: {
      maxWidth: 290,

      paddingHorizontal: 8,

      fontSize: 13,

      lineHeight: 19,

      fontWeight: '500',

      color:
        COLORS.textSecondary,

      textAlign: 'center',
    },


    // ==================================================
    // FORM
    // ==================================================

    form: {
      width: '100%',

      marginBottom: 18,
    },


    fieldLabel: {
      marginLeft: 5,
      marginBottom: 12,

      fontSize: 12.5,

      fontWeight: '700',

      color:
        COLORS.textSecondary,

      letterSpacing: 0.2,
    },


    // ==================================================
    // CÓDIGO DE 6 CARACTERES
    // ==================================================

    codeSection: {
      width: '100%',

      marginBottom: 26,
    },


    codeContainer: {
      width: '100%',

      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems: 'center',
    },


    codeInputOuter: {
      position: 'relative',

      width: 43,
      height: 54,

      borderRadius: 15,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.5)',

      shadowColor:
        '#B9BBC6',

      shadowOffset: {
        width: 4,
        height: 5,
      },

      shadowOpacity: 0.55,

      shadowRadius: 6,

      elevation: 5,

      overflow: 'hidden',
    },


    codeInputFilled: {
      borderColor:
        'rgba(138,90,0,0.32)',

      shadowColor:
        '#AEB0BA',

      shadowOffset: {
        width: 2,
        height: 2,
      },

      shadowOpacity: 0.35,

      shadowRadius: 4,

      elevation: 2,
    },


    codeInputError: {
      borderColor:
        COLORS.error,
    },


    codeInputHighlight: {
      position: 'absolute',

      top: 1,
      left: 5,
      right: 5,

      height: 1,

      borderRadius: 2,

      backgroundColor:
        'rgba(255,255,255,0.8)',
    },


    codeInput: {
      width: '100%',
      height: '100%',

      padding: 0,

      textAlign: 'center',

      fontSize: 18,

      fontWeight: '800',

      color:
        COLORS.textPrimary,

      textTransform:
        'lowercase',
    },


    // ==================================================
    // ERROR
    // ==================================================

    errorRow: {
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      marginTop: 11,

      paddingHorizontal: 4,
    },


    errorText: {
      marginLeft: 5,

      flexShrink: 1,

      fontSize: 12,

      lineHeight: 16,

      fontWeight: '600',

      color:
        COLORS.error,

      textAlign: 'center',
    },


    // ==================================================
    // REENVIAR
    // ==================================================

    resendContainer: {
      alignItems: 'center',

      marginTop: 20,
    },


    resendQuestion: {
      fontSize: 12,

      color:
        COLORS.textSecondary,

      fontWeight: '500',

      marginBottom: 3,
    },


    resendLink: {
      fontSize: 12.5,

      color:
        COLORS.primary,

      fontWeight: '800',

      textDecorationLine:
        'underline',
    },


    // ==================================================
    // AYUDA DE CONTRASEÑA
    // ==================================================

    passwordHint: {
      marginTop: -4,
      marginLeft: 7,

      fontSize: 11.5,

      lineHeight: 16,

      color:
        COLORS.textSecondary,

      fontWeight: '500',
    },


    // ==================================================
    // ACCIONES
    // ==================================================

    actions: {
      width: '100%',

      alignItems: 'center',
    },


    // ==================================================
    // VOLVER AL LOGIN
    // ==================================================

    loginButton: {
      minHeight: 42,

      marginTop: 17,

      paddingHorizontal: 17,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 15,

      backgroundColor:
        COLORS.background,

      borderWidth: 1,

      borderColor:
        'rgba(255,255,255,0.55)',

      shadowColor:
        '#B9BBC6',

      shadowOffset: {
        width: 3,
        height: 4,
      },

      shadowOpacity: 0.4,

      shadowRadius: 5,

      elevation: 4,
    },


    loginButtonText: {
      marginLeft: 6,

      fontSize: 12.5,

      fontWeight: '700',

      color:
        COLORS.primaryDark,
    },

  });