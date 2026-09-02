import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../Constants/theme';

export const FloatingCartButtonStyles = StyleSheet.create({
  touchTarget: {
    minHeight: 48,
    minWidth: 48,
  },
  outer: {
    backgroundColor: COLORS.background,
    borderRadius: 19,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 19,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    minHeight: 20,
    minWidth: 20,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -4,
    top: -5,
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: COLORS.shadowDark,
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
    }),
  },
  badgeText: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '800',
  },
});

export default FloatingCartButtonStyles;