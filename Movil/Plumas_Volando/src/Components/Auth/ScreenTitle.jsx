import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';

const ScreenTitle = ({ title, accent, subtitle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}{' '}
        <Text style={styles.accent}>{accent}</Text>
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 24,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  accent: {
    color: COLORS.primary,
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
});

export default ScreenTitle;