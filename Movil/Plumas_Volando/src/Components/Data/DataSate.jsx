import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY } from '../../Constants/theme';
import Button from '../Common/Button';

const DataState = ({
  loading = false,
  error = '',
  emptyText = 'No hay datos disponibles',
  onRetry,
}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={[styles.text, styles.errorText]}>{error}</Text>
        {onRetry && (
          <Button
            title="Reintentar"
            onPress={onRetry}
            variant="outline"
            size="small"
            style={styles.retryButton}
          />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="cube-outline" size={48} color={COLORS.textSecondary} />
      <Text style={styles.text}>{emptyText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 200,
  },
  text: {
    ...TYPOGRAPHY.body,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    color: COLORS.error,
  },
  retryButton: {
    marginTop: 16,
    maxWidth: 200,
  },
});

export default DataState;