import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, NEUROMORPHIC } from '../../Constants/theme';

const CustomAlert = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  type = 'info', // 'info', 'success', 'error', 'warning'
}) => {
  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'checkmark-circle-outline';
      case 'error':
        return 'close-circle-outline';
      case 'warning':
        return 'warning-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'warning':
        return COLORS.warning;
      default:
        return COLORS.info;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconWrapper}>
            <Ionicons name={getIconName()} size={48} color={getIconColor()} />
          </View>

          {title && (
            <Text style={styles.title}>{title}</Text>
          )}

          {message && (
            <Text style={styles.message}>{message}</Text>
          )}

          <View style={styles.buttonsContainer}>
            {onCancel && (
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={onCancel}
              >
                <Text style={styles.buttonCancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonConfirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: COLORS.background,
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    ...NEUROMORPHIC.outerShadow,
    ...NEUROMORPHIC.innerShadow,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...NEUROMORPHIC.combinedShadow,
  },
  title: {
    ...TYPOGRAPHY.heading,
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonConfirm: {
    backgroundColor: COLORS.primary,
    ...NEUROMORPHIC.outerShadow,
  },
  buttonCancel: {
    backgroundColor: COLORS.background,
    ...NEUROMORPHIC.combinedShadow,
  },
  buttonConfirmText: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textLight,
  },
  buttonCancelText: {
    ...TYPOGRAPHY.subheading,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});

export default CustomAlert;