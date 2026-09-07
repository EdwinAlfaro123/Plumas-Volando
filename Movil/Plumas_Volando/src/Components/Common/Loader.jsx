import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { COLORS, NEUROMORPHIC } from '../../Constants/theme';
import { AppLoadingStyles as styles } from '../../Styles/AppLoadingStyles';

const Loader = ({ color = COLORS.primary, fullScreen = false, label = 'Cargando...', size = 'small' }) => {
  const content = (
    <View style={[styles.loaderOuter, NEUROMORPHIC.topShadow]}>
      <View style={[styles.loaderInner, NEUROMORPHIC.bottomShadow]}>
        <ActivityIndicator color={color} size={size} />
        <Text style={styles.loaderText}>{label}</Text>
      </View>
    </View>
  );

  return fullScreen ? <View style={styles.screen}>{content}</View> : content;
};

export default Loader;
