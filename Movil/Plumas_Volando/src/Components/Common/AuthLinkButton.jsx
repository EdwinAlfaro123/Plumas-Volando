import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';

const AuthLinkButton = ({ title, onPress, muted = false }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={[styles.text, muted && styles.muted]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  text: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  muted: {
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});

export default AuthLinkButton;